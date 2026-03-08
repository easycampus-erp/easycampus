import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireMentorContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function MentorGroupsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Mentor Groups" />;

  const { supabase, institutionId, mentorId, departmentId } = await requireMentorContext();
  const [{ data: departments }, { data: courses }, { data: groups }] = await Promise.all([
    supabase.from("departments").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("courses").select("id, name, code").eq("institution_id", institutionId).order("name", { ascending: true }),
    supabase.from("mentor_groups").select("id, department_id, course_id, group_name, academic_year, section, courses(code)").eq("institution_id", institutionId).eq("mentor_id", mentorId).order("group_name", { ascending: true })
  ]);

  return (
    <AdminEntityManager
      title="Mentor Group Management"
      description="Create and maintain the cohorts you are directly mentoring."
      endpoint="/api/mentor/groups"
      fields={[
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          options: (departments ?? [])
            .filter((department) => department.id === departmentId)
            .map((department) => ({ label: `${department.name} (${department.code})`, value: department.id }))
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
        const course = firstRelationItem(group.courses);
        return {
          id: group.id,
          title: group.group_name,
          subtitle: `${course?.code ?? "Course"} | ${group.academic_year}`,
          values: {
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
