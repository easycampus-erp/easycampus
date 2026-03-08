import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const announcementSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(2),
  audience: z.string().min(2)
});

const announcementUpdateSchema = announcementSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = announcementSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid announcement payload." }, { status: 400 });
    const { data, error } = await supabase.from("announcements").insert({ institution_id: institutionId, ...parsed.data }).select("id").single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "announcement", entityId: data?.id ?? null });
    return NextResponse.json({ success: true, message: "Announcement published." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = announcementUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid announcement update payload." }, { status: 400 });
    const { error } = await supabase.from("announcements").update(parsed.data).eq("id", parsed.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "announcement", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Announcement updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("announcements").delete().eq("id", payload.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "announcement", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Announcement deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
