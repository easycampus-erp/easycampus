import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireMentorContext } from "@/lib/server-role";

function firstRelationItem<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

export default async function MentorRiskPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Risk Dashboard" />;

  const { supabase, institutionId, mentorId } = await requireMentorContext();
  const { data: groups } = await supabase.from("mentor_groups").select("id").eq("institution_id", institutionId).eq("mentor_id", mentorId);
  const groupIds = (groups ?? []).map((group) => group.id);

  const [{ data: members }, { data: meetings }] = await Promise.all([
    groupIds.length
      ? supabase.from("mentor_group_members").select("student_id, students(enrollment_no, profiles(full_name))").in("mentor_group_id", groupIds)
      : Promise.resolve({ data: [] as Array<{ student_id: string; students: unknown }> }),
    supabase.from("mentor_meetings").select("student_id, risk_level, follow_up_date").eq("institution_id", institutionId).eq("mentor_id", mentorId)
  ]);

  const rows = new Map<string, { name: string; meta: string; risk: string; followUp: string }>();
  for (const member of members ?? []) {
    const student = firstRelationItem(member.students as { enrollment_no?: string | null; profiles?: { full_name?: string | null } | { full_name?: string | null }[] } | any[] | null);
    const profile = firstRelationItem(student?.profiles);
    rows.set(member.student_id, {
      name: profile?.full_name ?? "Student",
      meta: student?.enrollment_no ?? "N/A",
      risk: "low",
      followUp: "Not scheduled"
    });
  }

  for (const meeting of meetings ?? []) {
    const current = rows.get(meeting.student_id);
    if (current) {
      current.risk = meeting.risk_level;
      current.followUp = (meeting as { follow_up_date?: string | null }).follow_up_date ?? "Not scheduled";
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Student Risk Dashboard</h1>
        <p className="mt-2 text-mist">Quickly review risk level and follow-up commitments across your assigned mentor students.</p>
      </div>
      <div className="grid gap-4">
        {Array.from(rows.values()).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No mentor-group members found yet.</div>
        ) : (
          Array.from(rows.values()).map((row) => (
            <article key={`${row.meta}-${row.followUp}`} className="glass rounded-[32px] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-ink">{row.name}</h2>
                  <p className="mt-1 text-sm text-mist">{row.meta}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">Risk: {row.risk}</span>
              </div>
              <p className="mt-3 text-sm text-mist">Follow-up: {row.followUp}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
