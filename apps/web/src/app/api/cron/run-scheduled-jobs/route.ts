import { NextResponse } from "next/server";
import { deliverPendingNotifications } from "@/lib/notifications";
import { logServerEvent } from "@/lib/logging";
import { computeNextRunAt } from "@/lib/report-jobs";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { generateAndStoreReport } from "@/lib/report-jobs";

function isAuthorized(request: Request) {
  const expected = process.env.CRON_SECRET ?? "";
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const now = new Date().toISOString();

    const { data: dueReports } = await supabase
      .from("scheduled_reports")
      .select("id, institution_id, report_type, format, schedule_label")
      .eq("active", true)
      .lte("next_run_at", now);

    const generated: string[] = [];
    for (const report of dueReports ?? []) {
      const artifact = await generateAndStoreReport({
        supabase,
        institutionId: report.institution_id,
        type: report.report_type,
        format: report.format
      });

      generated.push(artifact.path);

      await supabase
        .from("scheduled_reports")
        .update({
          last_generated_at: now,
          next_run_at: computeNextRunAt(report.schedule_label, new Date(now))
        })
        .eq("id", report.id);
    }

    const notificationResult = await deliverPendingNotifications({
      supabase
    });

    logServerEvent("cron.run.completed", {
      generatedReports: generated.length,
      pendingNotifications: notificationResult.notifications
    });

    return NextResponse.json({
      success: true,
      data: {
        generatedReports: generated.length,
        pendingNotifications: notificationResult.notifications
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to run scheduled jobs." }, { status: 500 });
  }
}
