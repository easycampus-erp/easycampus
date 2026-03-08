import { NextResponse } from "next/server";
import { z } from "zod";
import { requireMentorContext } from "@/lib/server-role";

const mentorGroupSchema = z.object({
  departmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  groupName: z.string().min(2),
  academicYear: z.string().min(2),
  section: z.string().optional().default("")
});

const mentorGroupUpdateSchema = mentorGroupSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, mentorId } = await requireMentorContext();
    const parsed = mentorGroupSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid mentor group payload." }, { status: 400 });
    const { error } = await supabase.from("mentor_groups").insert({
      institution_id: institutionId,
      mentor_id: mentorId,
      department_id: parsed.data.departmentId,
      course_id: parsed.data.courseId,
      group_name: parsed.data.groupName,
      academic_year: parsed.data.academicYear,
      section: parsed.data.section || null
    });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Mentor group created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, mentorId } = await requireMentorContext();
    const parsed = mentorGroupUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid mentor group update payload." }, { status: 400 });
    const { error } = await supabase
      .from("mentor_groups")
      .update({
        department_id: parsed.data.departmentId,
        course_id: parsed.data.courseId,
        group_name: parsed.data.groupName,
        academic_year: parsed.data.academicYear,
        section: parsed.data.section || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId)
      .eq("mentor_id", mentorId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Mentor group updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, mentorId } = await requireMentorContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("mentor_groups").delete().eq("id", payload.data.id).eq("institution_id", institutionId).eq("mentor_id", mentorId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Mentor group deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
