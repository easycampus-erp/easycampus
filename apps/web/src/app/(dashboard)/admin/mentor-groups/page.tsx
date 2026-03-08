import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminMentorGroupsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Mentor Groups" />;

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: departments }, { data: courses }, { data: mentors }, { data: groups }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("courses").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("mentors").select("id, employee_code").eq("institution_id", institutionId).order("employee_code", { ascending: true }),
    supabase.from("mentor_groups").select("id, mentor_id, department_id, course_id, group_name, academic_year, section, mentors(employee_code), courses(code)").eq("institution_id", institutionId).order("group_name", { ascending: true })
  ]);

  return (
    <AdminEntityManager
      title="Mentor Groups"
      description="Create cohort-based mentor groups and map them to academic structures."
      endpoint="/api/admin/mentor-groups"
      fields={[
        {
          name: "mentorId",
          label: "Mentor",
          type: "select",
          options: (mentors ?? []).map((mentor) => ({ label: mentor.employee_code, value: mentor.id }))
        },
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          options: (departments ?? []).map((department) => ({ label: `${department.name} (${department.code})`, value: department.id }))
        },
        {
          name: "courseId",
          label: "Course",
          type: "select",
          options: (courses ?? []).map((course) => ({ label: `${course.name} (${course.code})`, value: course.id }))
        },
        { name: "groupName", label: "Group Name" },
        { name: "academicYear", label: "Academic Year" },
        { name: "section", label: "Section" }
      ]}
      items={(groups ?? []).map((group) => {
        const mentor = firstRelationItem(group.mentors);
        const course = firstRelationItem(group.courses);
        return {
          id: group.id,
          title: group.group_name,
          subtitle: `${mentor?.employee_code ?? "Mentor"} | ${course?.code ?? "Course"} | ${group.academic_year}`,
          values: {
            mentorId: group.mentor_id,
            departmentId: group.department_id,
            courseId: group.course_id,
            groupName: group.group_name,
            academicYear: group.academic_year,
            section: group.section ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
