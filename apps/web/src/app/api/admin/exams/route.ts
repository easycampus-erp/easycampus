import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminContext } from "@/lib/server-role";

const examSchema = z.object({
  courseId: z.string().uuid(),
  semesterNo: z.string().min(1),
  name: z.string().min(2),
  examType: z.enum(["internal", "external", "practical", "assignment"]),
  maxMarks: z.string().min(1),
  examDate: z.string().optional().default("")
});

const examUpdateSchema = examSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId } = await requireAdminContext();
    const parsed = examSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid exam payload." }, { status: 400 });
    const { error } = await supabase.from("exams").insert({
      institution_id: institutionId,
      course_id: parsed.data.courseId,
      semester_no: Number(parsed.data.semesterNo),
      name: parsed.data.name,
      exam_type: parsed.data.examType,
      max_marks: Number(parsed.data.maxMarks),
      exam_date: parsed.data.examDate || null
    });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Exam created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId } = await requireAdminContext();
    const parsed = examUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid exam update payload." }, { status: 400 });
    const { error } = await supabase
      .from("exams")
      .update({
        course_id: parsed.data.courseId,
        semester_no: Number(parsed.data.semesterNo),
        name: parsed.data.name,
        exam_type: parsed.data.examType,
        max_marks: Number(parsed.data.maxMarks),
        exam_date: parsed.data.examDate || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Exam updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId } = await requireAdminContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("exams").delete().eq("id", payload.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Exam deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
