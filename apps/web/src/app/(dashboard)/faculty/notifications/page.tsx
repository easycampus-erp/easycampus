import { NotificationsInbox } from "@/components/notifications/notifications-inbox";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireFacultyContext } from "@/lib/server-role";

export default async function FacultyNotificationsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Notifications" />;
  const { supabase, institutionId, user } = await requireFacultyContext();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, audience, recipient_role, created_at, read_at, scheduled_for, delivered_at")
    .eq("institution_id", institutionId)
    .or(`audience.eq.all,recipient_role.eq.faculty,recipient_profile_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  return (
    <NotificationsInbox
      title="Faculty Notifications"
      description="Broadcasts, scheduled notices, and targeted alerts from administration."
      items={(notifications ?? []).map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        audience: item.audience,
        recipientRole: item.recipient_role,
        createdAt: item.created_at,
        readAt: item.read_at,
        scheduledFor: item.scheduled_for,
        deliveredAt: item.delivered_at
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
