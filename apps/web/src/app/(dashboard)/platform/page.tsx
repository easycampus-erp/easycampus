import { PlatformManager } from "@/components/platform/platform-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { canAccessPlatform } from "@/lib/platform-access";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function PlatformPage() {
  if (!hasPublicSupabaseEnv()) {
    return <Fallback title="Platform Super Admin" />;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email || !canAccessPlatform(user.email)) {
    throw new Error("Super-admin access is not enabled for this account.");
  }

  const adminSupabase = createAdminSupabaseClient();
  const [{ data: institutions }, { count: requestDemoCount }, { data: recentAudits }] = await Promise.all([
    adminSupabase.from("institutions").select("id, name, code, institution_type, status, created_at").order("created_at", { ascending: false }),
    adminSupabase.from("request_demo_leads").select("id", { count: "exact", head: true }),
    adminSupabase.from("audit_logs").select("id, institution_id, action, entity_type, created_at, institutions(name)").order("created_at", { ascending: false }).limit(12)
  ]);

  return <PlatformManager institutions={(institutions ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    institutionType: item.institution_type,
    status: item.status ?? "active",
    createdAt: item.created_at
  }))} requestDemoCount={requestDemoCount ?? 0} recentAudits={(recentAudits ?? []).map((audit) => ({
    id: audit.id,
    institutionName: (Array.isArray(audit.institutions) ? audit.institutions[0] : audit.institutions)?.name ?? "Institution",
    action: audit.action,
    entityType: audit.entity_type,
    createdAt: audit.created_at
  }))} />;
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
