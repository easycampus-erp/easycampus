import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const studentSchema = z.object({
  departmentId: z.string().uuid(),
  courseId: z.string().uuid(),
  enrollmentNo: z.string().min(2),
  admissionYear: z.string().min(1),
  currentSemester: z.string().min(1),
  section: z.string().optional().default(""),
  guardianName: z.string().optional().default(""),
  guardianPhone: z.string().optional().default("")
});

const studentUpdateSchema = studentSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = studentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid student payload." }, { status: 400 });
    }

    const { data, error } = await supabase.from("students").insert({
      institution_id: institutionId,
      department_id: parsed.data.departmentId,
      course_id: parsed.data.courseId,
      enrollment_no: parsed.data.enrollmentNo,
      admission_year: Number(parsed.data.admissionYear),
      current_semester: Number(parsed.data.currentSemester),
      section: parsed.data.section || null,
      guardian_name: parsed.data.guardianName || null,
      guardian_phone: parsed.data.guardianPhone || null
    }).select("id").single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "student", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Student created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = studentUpdateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid student update payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("students")
      .update({
        department_id: parsed.data.departmentId,
        course_id: parsed.data.courseId,
        enrollment_no: parsed.data.enrollmentNo,
        admission_year: Number(parsed.data.admissionYear),
        current_semester: Number(parsed.data.currentSemester),
        section: parsed.data.section || null,
        guardian_name: parsed.data.guardianName || null,
        guardian_phone: parsed.data.guardianPhone || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "student", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Student updated." });
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

    const { error } = await supabase.from("students").delete().eq("id", payload.data.id).eq("institution_id", institutionId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "student", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Student deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
