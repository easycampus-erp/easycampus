import { hasPublicSupabaseEnv } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { OnboardingChecklist } from "@/components/auth/onboarding-checklist";

export default async function OnboardingPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Onboarding" />;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const role = getUserRole(user);
  if (!role) {
    throw new Error("Role not configured.");
  }

  const { data: progress } = await supabase.from("onboarding_progress").select("checklist, completed_at").eq("profile_id", user.id).eq("role", role).single();
  const { data: profile } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).single();

  return (
    <OnboardingChecklist
      role={role}
      email={user.email ?? ""}
      profileReady={Boolean(profile?.full_name)}
      checklist={(progress?.checklist as Record<string, boolean> | null) ?? { profile: false, welcome: false, role_setup: false }}
      completed={Boolean(progress?.completed_at)}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
