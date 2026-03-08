import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const subjectSchema = z.object({
  departmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  name: z.string().min(2),
  code: z.string().min(2),
  semesterNo: z.string().min(1),
  credits: z.string().min(1),
  subjectType: z.string().min(2)
});

const subjectUpdateSchema = subjectSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = subjectSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid subject payload." }, { status: 400 });
    }

    const { data, error } = await supabase.from("subjects").insert({
      institution_id: institutionId,
      department_id: parsed.data.departmentId,
      course_id: parsed.data.courseId,
      name: parsed.data.name,
      code: parsed.data.code,
      semester_no: Number(parsed.data.semesterNo),
      credits: Number(parsed.data.credits),
      subject_type: parsed.data.subjectType
    }).select("id").single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "subject", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Subject created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = subjectUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid subject update payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("subjects")
      .update({
        department_id: parsed.data.departmentId,
        course_id: parsed.data.courseId,
        name: parsed.data.name,
        code: parsed.data.code,
        semester_no: Number(parsed.data.semesterNo),
        credits: Number(parsed.data.credits),
        subject_type: parsed.data.subjectType
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "subject", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Subject updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const { id } = await request.json();
    const { error } = await supabase.from("subjects").delete().eq("id", id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "subject", entityId: id });
    return NextResponse.json({ success: true, message: "Subject deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
