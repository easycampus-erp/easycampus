import { ProfileSettingsForm } from "@/components/auth/profile-settings-form";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

export default async function FacultyProfilePage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Profile Settings" />;
  const { supabase, user } = await requireFacultyContext();
  const { data: profile } = await supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).single();
  return <ProfileSettingsForm email={user.email ?? ""} fullName={profile?.full_name ?? ""} phone={profile?.phone ?? ""} avatarUrl={profile?.avatar_url ?? ""} />;
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
