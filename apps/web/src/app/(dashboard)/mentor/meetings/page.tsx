import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireMentorContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function MentorMeetingsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Mentor Meetings" />;

  const { supabase, institutionId, mentorId } = await requireMentorContext();
  const { data: mentorGroups } = await supabase.from("mentor_groups").select("id").eq("institution_id", institutionId).eq("mentor_id", mentorId);
  const mentorGroupIds = (mentorGroups ?? []).map((group) => group.id);

  const [{ data: students }, { data: meetings }] = await Promise.all([
    mentorGroupIds.length === 0
      ? Promise.resolve({ data: [] as Array<{ student_id: string; students: unknown }> })
      : supabase.from("mentor_group_members").select("student_id, students(enrollment_no, profiles(full_name))").in("mentor_group_id", mentorGroupIds),
    supabase
      .from("mentor_meetings")
      .select("id, student_id, meeting_date, notes, risk_level, intervention_plan, follow_up_date, outcome_notes, follow_up_completed_at, students(enrollment_no, profiles(full_name))")
      .eq("institution_id", institutionId)
      .eq("mentor_id", mentorId)
      .order("meeting_date", { ascending: false })
  ]);

  const studentOptions = (students ?? []).map((entry) => {
    const student = firstRelationItem(entry.students as { enrollment_no?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] } | any[] | null);
    const profile = firstRelationItem(student?.profiles);
    return {
      label: `${profile?.full_name ?? "Student"} (${student?.enrollment_no ?? "N/A"})`,
      value: entry.student_id
    };
  });

  return (
    <AdminEntityManager
      title="Mentor Meetings and Interventions"
      description="Log mentoring conversations, track risk levels, and capture intervention plans with follow-up dates."
      endpoint="/api/mentor/meetings"
      fields={[
        { name: "studentId", label: "Student", type: "select", options: studentOptions },
        { name: "meetingDate", label: "Meeting Date" },
        {
          name: "riskLevel",
          label: "Risk Level",
          type: "select",
          options: ["low", "medium", "high", "critical"].map((item) => ({ label: item, value: item }))
        },
        { name: "notes", label: "Meeting Notes" },
        { name: "interventionPlan", label: "Intervention Plan" },
        { name: "followUpDate", label: "Follow-up Date" },
        { name: "outcomeNotes", label: "Outcome Notes" },
        { name: "followUpCompletedAt", label: "Follow-up Completed At" }
      ]}
      items={(meetings ?? []).map((meeting) => {
        const student = firstRelationItem(meeting.students as { enrollment_no?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] } | any[] | null);
        const profile = firstRelationItem(student?.profiles);
        return {
          id: meeting.id,
          title: `${profile?.full_name ?? "Student"} (${student?.enrollment_no ?? "N/A"})`,
          subtitle: `${meeting.meeting_date} | Risk ${meeting.risk_level}`,
          values: {
            studentId: meeting.student_id,
            meetingDate: meeting.meeting_date,
            riskLevel: meeting.risk_level,
            notes: meeting.notes,
            interventionPlan: (meeting as { intervention_plan?: string | null }).intervention_plan ?? "",
            followUpDate: (meeting as { follow_up_date?: string | null }).follow_up_date ?? "",
            outcomeNotes: (meeting as { outcome_notes?: string | null }).outcome_notes ?? "",
            followUpCompletedAt: (meeting as { follow_up_completed_at?: string | null }).follow_up_completed_at ?? ""
          }
        };
      })}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
