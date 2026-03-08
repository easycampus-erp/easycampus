import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminStudentsPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Students" />;
  }

  const { supabase, institutionId } = await requireAdminContext();

  const [{ data: departments }, { data: courses }, { data: students }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("courses").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase
      .from("students")
      .select("id, department_id, course_id, enrollment_no, admission_year, current_semester, section, guardian_name, guardian_phone, departments(name, code), courses(name, code)")
      .eq("institution_id", institutionId)
      .order("enrollment_no", { ascending: true })
  ]);

  return (
    <AdminEntityManager
      title="Student Management"
      description="Create and maintain student master records before or after invite-based onboarding."
      endpoint="/api/admin/students"
      fields={[
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          options: (departments ?? []).map((department) => ({
            label: `${department.name} (${department.code})`,
            value: department.id
          }))
        },
        {
          name: "courseId",
          label: "Course",
          type: "select",
          options: (courses ?? []).map((course) => ({
            label: `${course.name} (${course.code})`,
            value: course.id
          }))
        },
        { name: "enrollmentNo", label: "Enrollment No" },
        { name: "admissionYear", label: "Admission Year", type: "number" },
        { name: "currentSemester", label: "Current Semester", type: "number" },
        { name: "section", label: "Section" },
        { name: "guardianName", label: "Guardian Name" },
        { name: "guardianPhone", label: "Guardian Phone" }
      ]}
      items={(students ?? []).map((student) => {
        const department = firstRelationItem(student.departments);
        const course = firstRelationItem(student.courses);
        return {
          id: student.id,
          title: student.enrollment_no,
          subtitle: `${department?.code ?? "Department"} | ${course?.code ?? "Course"} | Semester ${student.current_semester}`,
          values: {
            departmentId: student.department_id,
            courseId: student.course_id,
            enrollmentNo: student.enrollment_no,
            admissionYear: String(student.admission_year),
            currentSemester: String(student.current_semester),
            section: student.section ?? "",
            guardianName: student.guardian_name ?? "",
            guardianPhone: student.guardian_phone ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
