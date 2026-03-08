import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireMentorContext } from "@/lib/server-role";

export default async function MentorOutcomesPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Outcome Analytics" />;

  const { supabase, institutionId, mentorId } = await requireMentorContext();
  const { data: meetings } = await supabase
    .from("mentor_meetings")
    .select("risk_level, follow_up_date, follow_up_completed_at, outcome_notes")
    .eq("institution_id", institutionId)
    .eq("mentor_id", mentorId);

  const total = meetings?.length ?? 0;
  const completed = meetings?.filter((item) => Boolean((item as { follow_up_completed_at?: string | null }).follow_up_completed_at)).length ?? 0;
  const pending = meetings?.filter((item) => !(item as { follow_up_completed_at?: string | null }).follow_up_completed_at && (item as { follow_up_date?: string | null }).follow_up_date).length ?? 0;
  const highRisk = meetings?.filter((item) => item.risk_level === "high" || item.risk_level === "critical").length ?? 0;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Mentor Outcome Analytics</h1>
        <p className="mt-2 text-mist">Review follow-up completion, pending interventions, and high-risk conversation volume.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Meetings Logged", value: String(total), helper: "Total mentoring interactions" },
          { label: "Follow-ups Completed", value: String(completed), helper: "Outcome cycle completed" },
          { label: "Pending Follow-ups", value: String(pending), helper: "Still awaiting mentor action" },
          { label: "High Risk Cases", value: String(highRisk), helper: "High or critical risk records" }
        ].map((card) => (
          <article key={card.label} className="glass rounded-[32px] p-5">
            <p className="text-sm text-mist">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{card.value}</p>
            <p className="mt-1 text-sm text-mist">{card.helper}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-4">
        {(meetings ?? []).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No mentor outcome records found yet.</div>
        ) : (
          (meetings ?? []).map((meeting, index) => (
            <article key={`${meeting.risk_level}-${index}`} className="glass rounded-[32px] p-6">
              <h2 className="text-xl font-semibold text-ink">Risk {meeting.risk_level}</h2>
              <p className="mt-2 text-sm text-mist">Follow-up date: {(meeting as { follow_up_date?: string | null }).follow_up_date ?? "Not set"}</p>
              <p className="mt-2 text-sm text-mist">Completed: {(meeting as { follow_up_completed_at?: string | null }).follow_up_completed_at ?? "Pending"}</p>
              <p className="mt-2 text-sm text-mist">Outcome: {(meeting as { outcome_notes?: string | null }).outcome_notes ?? "No outcome notes recorded"}</p>
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
