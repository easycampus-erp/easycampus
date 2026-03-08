import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireFacultyContext } from "@/lib/server-role";

const markSchema = z.object({
  examId: z.string().uuid(),
  subjectId: z.string().uuid(),
  studentId: z.string().uuid(),
  marksObtained: z.string().min(1),
  grade: z.string().optional().default(""),
  remarks: z.string().optional().default("")
});

const markUpdateSchema = markSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, facultyId, user } = await requireFacultyContext();
    const parsed = markSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid marks payload." }, { status: 400 });
    }

    const { error } = await supabase.from("marks").upsert(
      {
        institution_id: institutionId,
        exam_id: parsed.data.examId,
        subject_id: parsed.data.subjectId,
        student_id: parsed.data.studentId,
        faculty_id: facultyId,
        marks_obtained: Number(parsed.data.marksObtained),
        grade: parsed.data.grade || null,
        remarks: parsed.data.remarks || null
      },
      { onConflict: "exam_id,student_id,subject_id" }
    );

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, {
      institutionId,
      actorProfileId: user.id,
      action: "upsert",
      entityType: "marks",
      metadata: { examId: parsed.data.examId, subjectId: parsed.data.subjectId, studentId: parsed.data.studentId }
    });
    return NextResponse.json({ success: true, message: "Marks saved." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, facultyId, user } = await requireFacultyContext();
    const parsed = markUpdateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid marks update payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("marks")
      .update({
        exam_id: parsed.data.examId,
        subject_id: parsed.data.subjectId,
        student_id: parsed.data.studentId,
        marks_obtained: Number(parsed.data.marksObtained),
        grade: parsed.data.grade || null,
        remarks: parsed.data.remarks || null,
        faculty_id: facultyId
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "marks", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Marks updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, facultyId, user } = await requireFacultyContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("marks")
      .delete()
      .eq("id", payload.data.id)
      .eq("institution_id", institutionId)
      .eq("faculty_id", facultyId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "marks", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Marks deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
