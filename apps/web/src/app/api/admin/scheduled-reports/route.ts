import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminContext } from "@/lib/server-role";
import { writeAuditLog } from "@/lib/audit";

const schema = z.object({
  reportType: z.string().min(2),
  format: z.enum(["csv", "pdf"]),
  scheduleLabel: z.string().min(2),
  active: z.string().optional().default("true"),
  nextRunAt: z.string().optional().default("")
});

const updateSchema = schema.extend({ id: z.string().uuid() });

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid scheduled report payload." }, { status: 400 });
    const { data, error } = await supabase
      .from("scheduled_reports")
      .insert({
        institution_id: institutionId,
        report_type: parsed.data.reportType,
        format: parsed.data.format,
        schedule_label: parsed.data.scheduleLabel,
        active: parsed.data.active !== "false",
        next_run_at: parsed.data.nextRunAt || null,
        created_by: user.id
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "scheduled_report", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Scheduled report created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid scheduled report update payload." }, { status: 400 });
    const { error } = await supabase
      .from("scheduled_reports")
      .update({
        report_type: parsed.data.reportType,
        format: parsed.data.format,
        schedule_label: parsed.data.scheduleLabel,
        active: parsed.data.active !== "false",
        next_run_at: parsed.data.nextRunAt || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "scheduled_report", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Scheduled report updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("scheduled_reports").delete().eq("id", parsed.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "scheduled_report", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Scheduled report deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
