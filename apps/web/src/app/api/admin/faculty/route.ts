import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const facultySchema = z.object({
  departmentId: z.string().uuid(),
  employeeCode: z.string().min(2),
  designation: z.string().optional().default("")
});

const facultyUpdateSchema = facultySchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = facultySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid faculty payload." }, { status: 400 });

    const { data, error } = await supabase.from("faculty").insert({
      institution_id: institutionId,
      department_id: parsed.data.departmentId,
      employee_code: parsed.data.employeeCode,
      designation: parsed.data.designation || null
    }).select("id").single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "faculty", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Faculty created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = facultyUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid faculty update payload." }, { status: 400 });

    const { error } = await supabase
      .from("faculty")
      .update({
        department_id: parsed.data.departmentId,
        employee_code: parsed.data.employeeCode,
        designation: parsed.data.designation || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "faculty", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Faculty updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });

    const { error } = await supabase.from("faculty").delete().eq("id", payload.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "faculty", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Faculty deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
