import { NextResponse } from "next/server";
import { z } from "zod";
import { requireMentorContext } from "@/lib/server-role";

const payloadSchema = z.object({
  mentorGroupId: z.string().uuid(),
  studentId: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, mentorId } = await requireMentorContext();
    const parsed = payloadSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });

    const { data: group } = await supabase.from("mentor_groups").select("id").eq("id", parsed.data.mentorGroupId).eq("institution_id", institutionId).eq("mentor_id", mentorId).single();
    if (!group) return NextResponse.json({ success: false, error: "Mentor group not found." }, { status: 404 });

    const { error } = await supabase.from("mentor_group_members").insert({ mentor_group_id: parsed.data.mentorGroupId, student_id: parsed.data.studentId });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Student added to your mentor group." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase } = await requireMentorContext();
    const parsed = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
    const { error } = await supabase.from("mentor_group_members").delete().eq("id", parsed.data.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Student removed from mentor group." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
