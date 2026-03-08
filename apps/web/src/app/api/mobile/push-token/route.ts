import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  token: z.string().min(10),
  platform: z.string().optional().default("expo")
});

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { data: membership } = await supabase.from("memberships").select("institution_id").eq("profile_id", user.id).single();
    if (!membership) {
      return NextResponse.json({ success: false, error: "Membership not found." }, { status: 404 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid push token payload." }, { status: 400 });
    }

    const { error } = await supabase.from("device_push_tokens").upsert(
      {
        institution_id: membership.institution_id,
        profile_id: user.id,
        token: parsed.data.token,
        platform: parsed.data.platform,
        active: true,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: "token" }
    );

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, {
      institutionId: membership.institution_id,
      actorProfileId: user.id,
      action: "register",
      entityType: "device_push_token",
      entityId: parsed.data.token
    });

    return NextResponse.json({ success: true, message: "Push token registered." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to register push token." }, { status: 400 });
  }
}
