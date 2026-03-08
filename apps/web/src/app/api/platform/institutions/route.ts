import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { canAccessPlatform } from "@/lib/platform-access";
import { writeAuditLog } from "@/lib/audit";
import { logServerEvent } from "@/lib/logging";

const createSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  institutionType: z.string().min(2),
  timezone: z.string().min(2).default("Asia/Kolkata"),
  ownerName: z.string().min(2).optional().or(z.literal("")),
  ownerEmail: z.string().email().optional().or(z.literal(""))
});

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["active", "paused", "trial", "suspended", "archived"]),
  reason: z.string().optional().default("")
});

async function requirePlatformUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email || !canAccessPlatform(user.email)) {
    throw new Error("Unauthorized.");
  }

  return user;
}

export async function POST(request: Request) {
  try {
    const user = await requirePlatformUser();
    const payload = createSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ success: false, error: "Invalid institution payload." }, { status: 400 });
    }

    const adminSupabase = createAdminSupabaseClient();
    const { data, error } = await adminSupabase
      .from("institutions")
      .insert({
        name: payload.data.name,
        code: payload.data.code,
        institution_type: payload.data.institutionType,
        timezone: payload.data.timezone,
        status: "trial"
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await Promise.all([
      adminSupabase.from("attendance_rules").insert({ institution_id: data.id }),
      adminSupabase.from("grading_rules").insert({ institution_id: data.id }),
      adminSupabase.from("institution_settings").insert({ institution_id: data.id })
    ]);

    if (payload.data.ownerEmail) {
      await adminSupabase.from("user_invites").insert({
        institution_id: data.id,
        email: payload.data.ownerEmail,
        full_name: payload.data.ownerName || payload.data.ownerEmail,
        role: "admin",
        invited_by: user.id
      });
    }

    await writeAuditLog(adminSupabase, {
      institutionId: data.id,
      actorProfileId: user.id,
      action: "create",
      entityType: "institution",
      entityId: data.id,
      metadata: { source: "platform", bootstrapOwnerEmail: payload.data.ownerEmail || null }
    });

    logServerEvent("platform.tenant_provisioned", {
      institutionId: data.id,
      code: payload.data.code,
      ownerEmail: payload.data.ownerEmail || null
    });

    return NextResponse.json({ success: true, message: "Institution provisioned in trial mode." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requirePlatformUser();
    const payload = updateSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ success: false, error: "Invalid institution update payload." }, { status: 400 });
    }

    const adminSupabase = createAdminSupabaseClient();
    const { count: membershipCount } = await adminSupabase
      .from("memberships")
      .select("id", { count: "exact", head: true })
      .eq("institution_id", payload.data.id);

    if (payload.data.status === "archived" && (membershipCount ?? 0) > 0) {
      return NextResponse.json({ success: false, error: "Archive is blocked while tenant memberships still exist. Suspend first and migrate users safely." }, { status: 400 });
    }

    if ((payload.data.status === "paused" || payload.data.status === "suspended") && !payload.data.reason.trim()) {
      return NextResponse.json({ success: false, error: "A reason is required when pausing or suspending a tenant." }, { status: 400 });
    }

    const { error } = await adminSupabase.from("institutions").update({ status: payload.data.status }).eq("id", payload.data.id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(adminSupabase, {
      institutionId: payload.data.id,
      actorProfileId: user.id,
      action: "update_status",
      entityType: "institution",
      entityId: payload.data.id,
      metadata: { status: payload.data.status, reason: payload.data.reason || null, source: "platform" }
    });

    return NextResponse.json({ success: true, message: "Institution status updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unauthorized." }, { status: 403 });
  }
}
