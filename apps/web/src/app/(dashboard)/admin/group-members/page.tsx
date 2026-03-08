import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function AdminGroupMembersPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Mentor Group Members" />;

  const { supabase, institutionId } = await requireAdminContext();
  const [{ data: groups }, { data: students }, { data: members }] = await Promise.all([
    supabase.from("mentor_groups").select("id, group_name").eq("institution_id", institutionId).order("group_name", { ascending: true }),
    supabase.from("students").select("id, enrollment_no, profiles(full_name)").eq("institution_id", institutionId).order("enrollment_no", { ascending: true }),
    supabase.from("mentor_group_members").select("id, mentor_group_id, student_id, mentor_groups(group_name), students(enrollment_no, profiles(full_name))")
  ]);

  return (
    <AdminEntityManager
      title="Mentor Group Members"
      description="Add and remove students from mentor cohorts."
      endpoint="/api/admin/group-members"
      fields={[
        {
          name: "mentorGroupId",
          label: "Mentor Group",
          type: "select",
          options: (groups ?? []).map((group) => ({ label: group.group_name, value: group.id }))
        },
        {
          name: "studentId",
          label: "Student",
          type: "select",
          options: (students ?? []).map((student) => {
            const profile = firstRelationItem(student.profiles);
            return { label: `${profile?.full_name ?? "Student"} (${student.enrollment_no})`, value: student.id };
          })
        }
      ]}
      items={(members ?? []).map((member) => {
        const group = firstRelationItem(member.mentor_groups);
        const student = firstRelationItem(member.students as { enrollment_no?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] } | any[] | null);
        const profile = firstRelationItem(student?.profiles);
        return {
          id: member.id,
          title: profile?.full_name ?? "Student",
          subtitle: `${student?.enrollment_no ?? "N/A"} | ${group?.group_name ?? "Group"}`,
          values: {
            mentorGroupId: member.mentor_group_id,
            studentId: member.student_id
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
