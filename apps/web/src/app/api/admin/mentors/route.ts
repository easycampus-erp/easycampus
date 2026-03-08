import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminContext } from "@/lib/server-role";

const mentorSchema = z.object({
  departmentId: z.string().uuid(),
  employeeCode: z.string().min(2),
  designation: z.string().optional().default(""),
  capacity: z.string().optional().default("30")
});

const mentorUpdateSchema = mentorSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId } = await requireAdminContext();
    const parsed = mentorSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid mentor payload." }, { status: 400 });

    const { error } = await supabase.from("mentors").insert({
      institution_id: institutionId,
      department_id: parsed.data.departmentId,
      employee_code: parsed.data.employeeCode,
      designation: parsed.data.designation || null,
      capacity: Number(parsed.data.capacity || 30)
    });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Mentor created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId } = await requireAdminContext();
    const parsed = mentorUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid mentor update payload." }, { status: 400 });

    const { error } = await supabase
      .from("mentors")
      .update({
        department_id: parsed.data.departmentId,
        employee_code: parsed.data.employeeCode,
        designation: parsed.data.designation || null,
        capacity: Number(parsed.data.capacity || 30)
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Mentor updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId } = await requireAdminContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });

    const { error } = await supabase.from("mentors").delete().eq("id", payload.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: "Mentor deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
