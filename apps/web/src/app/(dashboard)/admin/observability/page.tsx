import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminObservabilityPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Observability" />;
  const { supabase, institutionId } = await requireAdminContext();

  const [auditCount, notificationCount, scheduledReportCount, materialCount, recentLogs] = await Promise.all([
    supabase.from("audit_logs").select("id", { count: "exact", head: true }).eq("institution_id", institutionId),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("institution_id", institutionId),
    supabase.from("scheduled_reports").select("id", { count: "exact", head: true }).eq("institution_id", institutionId),
    supabase.from("course_materials").select("id", { count: "exact", head: true }).eq("institution_id", institutionId),
    supabase.from("audit_logs").select("id, action, entity_type, created_at").eq("institution_id", institutionId).order("created_at", { ascending: false }).limit(8)
  ]);

  const cards = [
    { label: "Audit Events", value: String(auditCount.count ?? 0), helper: "Recorded audit mutations" },
    { label: "Notifications", value: String(notificationCount.count ?? 0), helper: "Scheduled and delivered notification records" },
    { label: "Scheduled Reports", value: String(scheduledReportCount.count ?? 0), helper: "Configured report schedules" },
    { label: "Course Files", value: String(materialCount.count ?? 0), helper: "Uploaded faculty materials" },
    { label: "Webhook", value: process.env.OBSERVABILITY_WEBHOOK_URL ? "Connected" : "Disabled", helper: "External observability shipping status" }
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Observability</h1>
        <p className="mt-2 text-mist">A quick operations overview for QA, deployment validation, and admin monitoring.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="glass rounded-[32px] p-5">
            <p className="text-sm text-mist">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-ink">{card.value}</p>
            <p className="mt-1 text-sm text-mist">{card.helper}</p>
          </article>
        ))}
      </div>
      <div className="glass rounded-[32px] p-6">
        <h2 className="text-xl font-semibold text-ink">Recent Audit Events</h2>
        <div className="mt-4 grid gap-3">
          {(recentLogs.data ?? []).map((entry) => (
            <article key={entry.id} className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">{entry.action} {entry.entity_type}</p>
              <p className="mt-1 text-sm text-mist">{new Date(entry.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
