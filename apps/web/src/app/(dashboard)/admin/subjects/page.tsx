import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminSubjectsPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Subjects" />;
  }

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: departments }, { data: courses }, { data: subjects }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name"),
    supabase.from("courses").select("id, name, code").eq("institution_id", institutionId).order("name"),
    supabase
      .from("subjects")
      .select("id, name, code, semester_no, credits, subject_type, department_id, course_id")
      .eq("institution_id", institutionId)
      .order("name")
  ]);

  return (
    <AdminEntityManager
      title="Subject Management"
      description="Manage subjects, semester mapping, and credit allocation."
      endpoint="/api/admin/subjects"
      fields={[
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          options: (departments ?? []).map((item) => ({ label: `${item.name} (${item.code})`, value: item.id }))
        },
        {
          name: "courseId",
          label: "Course",
          type: "select",
          options: (courses ?? []).map((item) => ({ label: `${item.name} (${item.code})`, value: item.id }))
        },
        { name: "name", label: "Subject name" },
        { name: "code", label: "Subject code" },
        { name: "semesterNo", label: "Semester", type: "number" },
        { name: "credits", label: "Credits", type: "number" },
        {
          name: "subjectType",
          label: "Type",
          type: "select",
          options: [
            { label: "Theory", value: "theory" },
            { label: "Lab", value: "lab" },
            { label: "Elective", value: "elective" }
          ]
        }
      ]}
      items={(subjects ?? []).map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: `${item.code} · Semester ${item.semester_no}`,
        values: {
          departmentId: item.department_id,
          courseId: item.course_id,
          name: item.name,
          code: item.code,
          semesterNo: String(item.semester_no),
          credits: String(item.credits),
          subjectType: item.subject_type
        }
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
