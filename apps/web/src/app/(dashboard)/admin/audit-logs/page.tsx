import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminAuditLogsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Audit Logs" />;
  const { supabase, institutionId } = await requireAdminContext();
  const { data: logs } = await supabase.from("audit_logs").select("id, action, entity_type, entity_id, created_at, actor_profile_id").eq("institution_id", institutionId).order("created_at", { ascending: false }).limit(100);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Audit Logs</h1>
        <p className="mt-2 text-mist">Operational mutations are recorded here for admin review and QA tracing.</p>
      </div>
      <div className="grid gap-4">
        {(logs ?? []).length === 0 ? (
          <div className="glass rounded-[32px] p-6 text-mist">No audit logs recorded yet.</div>
        ) : (
          (logs ?? []).map((log) => (
            <article key={log.id} className="glass rounded-[32px] p-6">
              <h2 className="text-xl font-semibold text-ink">{log.action} {log.entity_type}</h2>
              <p className="mt-2 text-sm text-mist">Entity {log.entity_id ?? "N/A"} | Actor {log.actor_profile_id ?? "system"} | {new Date(log.created_at).toLocaleString()}</p>
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
