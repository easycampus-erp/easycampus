import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { requireAdminContext } from "@/lib/server-role";

const notificationSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(2),
  audience: z.string().min(2),
  recipientRole: z.enum(["admin", "faculty", "mentor", "student"]).optional().or(z.literal("")),
  recipientProfileId: z.string().uuid().optional().or(z.literal("")),
  scheduledFor: z.string().optional().default("")
});

const notificationUpdateSchema = notificationSchema.extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = notificationSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid notification payload." }, { status: 400 });
    const { error } = await supabase.from("notifications").insert({
      institution_id: institutionId,
      title: parsed.data.title,
      body: parsed.data.body,
      audience: parsed.data.audience,
      recipient_role: parsed.data.recipientRole || null,
      recipient_profile_id: parsed.data.recipientProfileId || null,
      scheduled_for: parsed.data.scheduledFor || null,
      created_by: user.id
    });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "create", entityType: "notification", metadata: { audience: parsed.data.audience, recipientRole: parsed.data.recipientRole || null } });
    return NextResponse.json({ success: true, message: "Notification created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const parsed = notificationUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid notification update payload." }, { status: 400 });
    const { error } = await supabase
      .from("notifications")
      .update({
        title: parsed.data.title,
        body: parsed.data.body,
        audience: parsed.data.audience,
        recipient_role: parsed.data.recipientRole || null,
        recipient_profile_id: parsed.data.recipientProfileId || null,
        scheduled_for: parsed.data.scheduledFor || null
      })
      .eq("id", parsed.data.id)
      .eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "update", entityType: "notification", entityId: parsed.data.id });
    return NextResponse.json({ success: true, message: "Notification updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { supabase, institutionId, user } = await requireAdminContext();
    const payload = z.object({ id: z.string().uuid() }).safeParse(await request.json());
    if (!payload.success) return NextResponse.json({ success: false, error: "Invalid delete payload." }, { status: 400 });
    const { error } = await supabase.from("notifications").delete().eq("id", payload.data.id).eq("institution_id", institutionId);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    await writeAuditLog(supabase, { institutionId, actorProfileId: user.id, action: "delete", entityType: "notification", entityId: payload.data.id });
    return NextResponse.json({ success: true, message: "Notification deleted." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
