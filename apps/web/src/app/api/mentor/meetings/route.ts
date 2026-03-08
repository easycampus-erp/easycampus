import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireMentorContext } from "@/lib/server-role";

const meetingSchema = z.object({
  studentId: z.string().uuid(),
  meetingDate: z.string().min(1),
  riskLevel: z.string().min(2),
  notes: z.string().min(2),
  interventionPlan: z.string().optional().default(""),
  followUpDate: z.string().optional().default(""),
  outcomeNotes: z.string().optional().default(""),
  followUpCompletedAt: z.string().optional().default("")
});

const meetingUpdateSchema = meetingSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, mentorId, user } = await requireMentorContext();
    const parsed = meetingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid meeting payload." }, { status: 400 });
    const { data, error } = await supabase.from("mentor_meetings").insert({
      institution_id: institutionId,
      mentor_id: mentorId,
      student_id: parsed.data.studentId,
      meeting_date: parsed.data.meetingDate,
      notes: parsed.data.notes,
      risk_level: parsed.data.riskLevel,
      intervention_plan: parsed.data.interventionPlan || null,
      follow_up_date: parsed.data.followUpDate || null,
      outcome_notes: parsed.data.outcomeNotes || null,
      follow_up_completed_at: parsed.data.followUpCompletedAt || null
    }).select("id").single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "mentor_meeting", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Meeting logged." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, mentorId, user } = await requireMentorContext();
    const parsed = meetingUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid meeting update payload." }, { status: 400 });
    const { error } = await supabase
      .from("mentor_meetings")
      .update({
        student_id: parsed.data.studentId,
        meeting_date: parsed.data.meetingDate,
        notes: parsed.data.notes,
        risk_level: parsed.data.riskLevel,
        intervention_plan: parsed.data.interventionPlan || null,
        follow_up_date: parsed.data.followUpDate || null,
        outcome_notes: parsed.data.outcomeNotes || null,
        follow_up_completed_at: parsed.data.followUpCompletedAt || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId)
      .eq("mentor_id", mentorId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "mentor_meeting", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Meeting updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, mentorId, user } = await requireMentorContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("mentor_meetings").delete().eq("id", payload.data.id).eq("institution_id", institutionId).eq("mentor_id", mentorId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "mentor_meeting", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Meeting deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
