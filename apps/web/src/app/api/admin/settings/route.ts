import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminContext } from "@/lib/server-role";
import { writeAuditLog } from "@/lib/audit";

const settingsSchema = z.object({
  supportEmail: z.string().optional().default(""),
  supportPhone: z.string().optional().default(""),
  reportFooter: z.string().optional().default(""),
  minimumPercentage: z.string().min(1),
  lateWeight: z.string().min(1),
  alertThreshold: z.string().min(1),
  passingMarks: z.string().min(1),
  gradeScale: z.string().min(2)
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = settingsSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid settings payload." }, { status: 400 });

    const parsedGradeScale = JSON.parse(parsed.data.gradeScale);

    const [settingsResult, attendanceResult, gradingResult] = await Promise.all([
      supabase.from("institution_settings").upsert({
        institution_id: institutionId,
        support_email: parsed.data.supportEmail || null,
        support_phone: parsed.data.supportPhone || null,
        report_footer: parsed.data.reportFooter || null
      }, { onConflict: "institution_id" }),
      supabase.from("attendance_rules").upsert({
        institution_id: institutionId,
        minimum_percentage: Number(parsed.data.minimumPercentage),
        late_weight: Number(parsed.data.lateWeight),
        alert_threshold: Number(parsed.data.alertThreshold)
      }, { onConflict: "institution_id" }),
      supabase.from("grading_rules").upsert({
        institution_id: institutionId,
        passing_marks: Number(parsed.data.passingMarks),
        grade_scale: parsedGradeScale
      }, { onConflict: "institution_id" })
    ]);

    const error = settingsResult.error ?? attendanceResult.error ?? gradingResult.error;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    await writeAuditLog(supabase, {
      institutionId,
      actorProfileId: user.id,
      action: "upsert",
      entityType: "institution_settings",
      metadata: { updated: true }
    });

    return NextResponse.json({ success: true, message: "Institution settings saved." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to save settings." }, { status: 400 });
  }
}

