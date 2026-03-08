import { NextResponse } from "next/server";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const adminSignupSchema = z.object({
  institutionName: z.string().min(2),
  institutionCode: z.string().min(2),
  institutionType: z.string().min(2),
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional().default("")
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = adminSignupSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Please complete all required admin signup fields." }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();

  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .insert({
      name: parsed.data.institutionName,
      code: parsed.data.institutionCode,
      institution_type: parsed.data.institutionType
    })
    .select("id")
    .single();

  if (institutionError || !institution) {
    return NextResponse.json({ success: false, error: institutionError?.message ?? "Unable to create institution." }, { status: 500 });
  }

  const { data: createdUser, error: userError } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName
    },
    app_metadata: {
      role: "admin",
      institution_id: institution.id
    }
  });

  if (userError || !createdUser.user) {
    await supabase.from("institutions").delete().eq("id", institution.id);
    return NextResponse.json({ success: false, error: userError?.message ?? "Unable to create admin user." }, { status: 500 });
  }

  const userId = createdUser.user.id;

  await supabase.from("profiles").upsert({
    id: userId,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone
  });

  await supabase.from("memberships").upsert({
    institution_id: institution.id,
    profile_id: userId,
    role: "admin"
  });

  await supabase.from("onboarding_progress").upsert({
    institution_id: institution.id,
    profile_id: userId,
    role: "admin"
  });

  await Promise.all([
    supabase.from("attendance_rules").insert({ institution_id: institution.id }),
    supabase.from("grading_rules").insert({ institution_id: institution.id }),
    supabase.from("institution_settings").insert({ institution_id: institution.id })
  ]);

  await writeAuditLog(supabase, {
    institutionId: institution.id,
    actorProfileId: userId,
    action: "create",
    entityType: "institution_admin_signup",
    entityId: userId,
    metadata: { email: parsed.data.email }
  });

  return NextResponse.json({
    success: true,
    message: "Admin account created successfully. You can now sign in.",
    data: {
      institutionId: institution.id
    }
  });
}
