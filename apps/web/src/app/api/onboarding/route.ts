import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";

const schema = z.object({
  step: z.enum(["profile", "welcome", "role_setup", "complete"]),
  value: z.boolean().optional().default(true)
});

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const role = getUserRole(user);
    if (!role) {
      return NextResponse.json({ success: false, error: "Role not configured." }, { status: 400 });
    }

    const { data: membership } = await supabase.from("memberships").select("institution_id").eq("profile_id", user.id).eq("role", role).single();
    if (!membership) {
      return NextResponse.json({ success: false, error: "Membership not found." }, { status: 404 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid onboarding payload." }, { status: 400 });
    }

    const { data: current } = await supabase
      .from("onboarding_progress")
      .select("checklist")
      .eq("institution_id", membership.institution_id)
      .eq("profile_id", user.id)
      .eq("role", role)
      .single();

    const checklist = { profile: false, welcome: false, role_setup: false, ...(current?.checklist as Record<string, boolean> | null) };
    if (parsed.data.step === "complete") {
      checklist.profile = true;
      checklist.welcome = true;
      checklist.role_setup = true;
    } else {
      checklist[parsed.data.step] = parsed.data.value;
    }

    const completed = checklist.profile && checklist.welcome && checklist.role_setup;

    const { error } = await supabase.from("onboarding_progress").upsert(
      {
        institution_id: membership.institution_id,
        profile_id: user.id,
        role,
        checklist,
        completed_at: completed ? new Date().toISOString() : null
      },
      { onConflict: "institution_id,profile_id,role" }
    );

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    await writeAuditLog(supabase, {
      institutionId: membership.institution_id,
      actorProfileId: user.id,
      action: completed ? "complete" : "update",
      entityType: "onboarding_progress",
      entityId: user.id,
      metadata: { step: parsed.data.step }
    });

    return NextResponse.json({ success: true, message: completed ? "Onboarding completed." : "Onboarding updated." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to update onboarding." }, { status: 400 });
  }
}
