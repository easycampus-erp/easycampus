import { NextResponse } from "next/server";
import { z } from "zod";
import { requireFacultyContext } from "@/lib/server-role";

const attendanceSchema = z.object({
  subjectId: z.string().uuid(),
  sessionType: z.enum(["lecture", "lab"]),
  sessionDate: z.string().min(1),
  section: z.string().optional().default(""),
  startTime: z.string().optional().default(""),
  endTime: z.string().optional().default(""),
  records: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(["present", "absent", "late", "excused"])
    })
  )
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, facultyId } = await requireFacultyContext();
    const parsed = attendanceSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid attendance payload." }, { status: 400 });
    }

    if (parsed.data.records.length === 0) {
      return NextResponse.json({ success: false, error: "At least one student record is required." }, { status: 400 });
    }

    const { data: session, error: sessionError } = await supabase
      .from("attendance_sessions")
      .insert({
        institution_id: institutionId,
        subject_id: parsed.data.subjectId,
        faculty_id: facultyId,
        session_type: parsed.data.sessionType,
        session_date: parsed.data.sessionDate,
        section: parsed.data.section || null,
        start_time: parsed.data.startTime || null,
        end_time: parsed.data.endTime || null
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: sessionError?.message ?? "Unable to create attendance session." }, { status: 500 });
    }

    const { error: recordsError } = await supabase.from("attendance_records").upsert(
      parsed.data.records.map((record) => ({
        attendance_session_id: session.id,
        student_id: record.studentId,
        status: record.status
      })),
      { onConflict: "attendance_session_id,student_id" }
    );

    if (recordsError) {
      return NextResponse.json({ success: false, error: recordsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Attendance session saved." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

const attendanceUpdateSchema = z.object({
  sessionId: z.string().uuid(),
  records: z.array(
    z.object({
      studentId: z.string().uuid(),
      status: z.enum(["present", "absent", "late", "excused"])
    })
  )
});

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, facultyId } = await requireFacultyContext();
    const parsed = attendanceUpdateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid attendance update payload." }, { status: 400 });
    }

    const { data: session } = await supabase
      .from("attendance_sessions")
      .select("id")
      .eq("id", parsed.data.sessionId)
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId)
      .single();

    if (!session) {
      return NextResponse.json({ success: false, error: "Attendance session not found." }, { status: 404 });
    }

    const { error } = await supabase.from("attendance_records").upsert(
      parsed.data.records.map((record) => ({
        attendance_session_id: parsed.data.sessionId,
        student_id: record.studentId,
        status: record.status
      })),
      { onConflict: "attendance_session_id,student_id" }
    );

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Attendance corrections saved." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
