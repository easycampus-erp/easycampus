import { ResourceLibrary } from "@/components/faculty/resource-library";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

export default async function FacultyResourcesLibraryPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Resource Library" />;

  const { supabase, institutionId, facultyId } = await requireFacultyContext();
  const [{ data: materials }, { data: assignments }] = await Promise.all([
    supabase
      .from("course_materials")
      .select("id, title, description, material_type, file_path, file_url, subjects(name, code)")
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId)
      .order("created_at", { ascending: false }),
    supabase
      .from("assignments")
      .select("id, title, description, file_path, file_url, subjects(name, code), due_date")
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId)
      .order("created_at", { ascending: false })
  ]);

  return (
    <ResourceLibrary
      items={[
        ...(materials ?? []).map((item) => {
          const subject = Array.isArray(item.subjects) ? item.subjects[0] : item.subjects;
          return {
            id: item.id,
            title: item.title,
            description: item.description ?? "",
            materialType: item.material_type as "material" | "report" | "assignment",
            filePath: item.file_path,
            fileUrl: item.file_url ?? "#",
            subtitle: `${subject?.name ?? "Subject"} (${subject?.code ?? "SUB"}) | ${item.material_type}`
          };
        }),
        ...(assignments ?? []).map((item) => {
          const subject = Array.isArray(item.subjects) ? item.subjects[0] : item.subjects;
          return {
            id: item.id,
            title: item.title,
            description: item.description ?? "",
            materialType: "assignment" as const,
            filePath: item.file_path ?? "",
            fileUrl: item.file_url ?? "#",
            subtitle: `${subject?.name ?? "Subject"} (${subject?.code ?? "SUB"}) | Due ${item.due_date ?? "TBA"}`
          };
        })
      ]}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
