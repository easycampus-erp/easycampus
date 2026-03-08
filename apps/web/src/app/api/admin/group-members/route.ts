import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminContext } from "@/lib/server-role";
import { writeAuditLog } from "@/lib/audit";

const memberSchema = z.object({
  mentorGroupId: z.string().uuid(),
  studentId: z.string().uuid()
});

const memberDeleteSchema = z.object({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = memberSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid mentor group member payload." }, { status: 400 });
    const { data, error } = await supabase
      .from("mentor_group_members")
      .insert({ mentor_group_id: parsed.data.mentorGroupId, student_id: parsed.data.studentId })
      .select("id")
      .single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, {
      institutionId,
      actorProfileId: user.id,
      action: "create",
      entityType: "mentor_group_member",
      entityId: data?.id ?? null,
      metadata: parsed.data
    });
    return NextResponse.json({ success: true, message: "Student added to mentor group." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = memberDeleteSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("mentor_group_members").delete().eq("id", parsed.data.id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, {
      institutionId,
      actorProfileId: user.id,
      action: "delete",
      entityType: "mentor_group_member",
      entityId: parsed.data.id
    });
    return NextResponse.json({ success: true, message: "Mentor group member removed." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

