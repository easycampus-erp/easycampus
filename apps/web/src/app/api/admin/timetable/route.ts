import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const timetableSchema = z.object({
  courseId: z.string().uuid(),
  subjectId: z.string().uuid(),
  facultyId: z.string().uuid().optional().or(z.literal("")),
  semesterNo: z.string().min(1),
  section: z.string().optional().default(""),
  dayOfWeek: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  roomCode: z.string().optional().default("")
});

const timetableUpdateSchema = timetableSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = timetableSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid timetable payload." }, { status: 400 });
    }

    const { data, error } = await supabase.from("timetable_entries").insert({
      institution_id: institutionId,
      course_id: parsed.data.courseId,
      subject_id: parsed.data.subjectId,
      faculty_id: parsed.data.facultyId || null,
      semester_no: Number(parsed.data.semesterNo),
      section: parsed.data.section || null,
      day_of_week: Number(parsed.data.dayOfWeek),
      start_time: parsed.data.startTime,
      end_time: parsed.data.endTime,
      room_code: parsed.data.roomCode || null
    }).select("id").single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "timetable_entry", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Timetable entry created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = timetableUpdateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid timetable update payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("timetable_entries")
      .update({
        course_id: parsed.data.courseId,
        subject_id: parsed.data.subjectId,
        faculty_id: parsed.data.facultyId || null,
        semester_no: Number(parsed.data.semesterNo),
        section: parsed.data.section || null,
        day_of_week: Number(parsed.data.dayOfWeek),
        start_time: parsed.data.startTime,
        end_time: parsed.data.endTime,
        room_code: parsed.data.roomCode || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "timetable_entry", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Timetable entry updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    }

    const { error } = await supabase.from("timetable_entries").delete().eq("id", payload.data.id).eq("institution_id", institutionId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "timetable_entry", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Timetable entry deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
