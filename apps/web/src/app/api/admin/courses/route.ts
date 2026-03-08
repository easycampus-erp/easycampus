import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const courseSchema = z.object({
  departmentId: z.string().uuid(),
  name: z.string().min(2),
  code: z.string().min(2),
  durationSemesters: z.string().min(1),
  totalCredits: z.string().min(1)
});

const courseUpdateSchema = courseSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = courseSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid course payload." }, { status: 400 });
    }

    const { data, error } = await supabase.from("courses").insert({
      institution_id: institutionId,
      department_id: parsed.data.departmentId,
      name: parsed.data.name,
      code: parsed.data.code,
      duration_semesters: Number(parsed.data.durationSemesters),
      total_credits: Number(parsed.data.totalCredits)
    }).select("id").single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "course", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Course created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = courseUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid course update payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("courses")
      .update({
        department_id: parsed.data.departmentId,
        name: parsed.data.name,
        code: parsed.data.code,
        duration_semesters: Number(parsed.data.durationSemesters),
        total_credits: Number(parsed.data.totalCredits)
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "course", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Course updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const { id } = await request.json();
    const { error } = await supabase.from("courses").delete().eq("id", id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "course", entityId: id });
    return NextResponse.json({ success: true, message: "Course deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
