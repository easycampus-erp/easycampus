import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminScheduledReportsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Scheduled Reports" />;

  const { supabase, institutionId } = await requireAdminContext();
  const { data: reports } = await supabase.from("scheduled_reports").select("id, report_type, format, schedule_label, active, next_run_at").eq("institution_id", institutionId).order("created_at", { ascending: false });

  return (
    <AdminEntityManager
      title="Scheduled Reports"
      description="Configure recurring report jobs and track the next planned run for each report type."
      endpoint="/api/admin/scheduled-reports"
      fields={[
        { name: "reportType", label: "Report Type", type: "select", options: ["attendance", "grade-sheet", "transcript"].map((item) => ({ label: item, value: item })) },
        { name: "format", label: "Format", type: "select", options: ["csv", "pdf"].map((item) => ({ label: item, value: item })) },
        { name: "scheduleLabel", label: "Schedule Label" },
        { name: "active", label: "Active", type: "select", options: [{ label: "true", value: "true" }, { label: "false", value: "false" }] },
        { name: "nextRunAt", label: "Next Run At" }
      ]}
      items={(reports ?? []).map((item) => ({
        id: item.id,
        title: `${item.report_type} (${item.format})`,
        subtitle: `${item.schedule_label} | Active ${item.active ? "true" : "false"}`,
        values: {
          reportType: item.report_type,
          format: item.format,
          scheduleLabel: item.schedule_label,
          active: item.active ? "true" : "false",
          nextRunAt: item.next_run_at ?? ""
        }
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}

