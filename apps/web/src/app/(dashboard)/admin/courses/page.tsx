import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminCoursesPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Courses" />;
  }

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: departments }, { data: courses }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name"),
    supabase
      .from("courses")
      .select("id, name, code, duration_semesters, total_credits, department_id, departments(name)")
      .eq("institution_id", institutionId)
      .order("name")
  ]);

  return (
    <AdminEntityManager
      title="Course Management"
      description="Manage academic programs and their credit structure."
      endpoint="/api/admin/courses"
      fields={[
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          options: (departments ?? []).map((item) => ({ label: `${item.name} (${item.code})`, value: item.id }))
        },
        { name: "name", label: "Course name" },
        { name: "code", label: "Course code" },
        { name: "durationSemesters", label: "Duration (semesters)", type: "number" },
        { name: "totalCredits", label: "Total credits", type: "number" }
      ]}
      items={(courses ?? []).map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: `${item.code} · ${((item as any).departments && !Array.isArray((item as any).departments) ? (item as any).departments.name : "No department") as string}`,
        values: {
          departmentId: item.department_id,
          name: item.name,
          code: item.code,
          durationSemesters: String(item.duration_semesters),
          totalCredits: String(item.total_credits)
        }
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
