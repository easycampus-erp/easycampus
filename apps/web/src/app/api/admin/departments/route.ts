import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const departmentSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2)
});

const departmentUpdateSchema = departmentSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const payload = await request.json();
    const parsed = departmentSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid department payload." }, { status: 400 });
    }

    const { data, error } = await supabase.from("departments").insert({
      institution_id: institutionId,
      name: parsed.data.name,
      code: parsed.data.code
    }).select("id").single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "department", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Department created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const payload = await request.json();
    const parsed = departmentUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid department update payload." }, { status: 400 });
    }

    const { error } = await supabase
      .from("departments")
      .update({ name: parsed.data.name, code: parsed.data.code })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "department", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Department updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Department id is required." }, { status: 400 });
    }

    const { error } = await supabase.from("departments").delete().eq("id", id).eq("institution_id", institutionId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "department", entityId: id });
    return NextResponse.json({ success: true, message: "Department deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
