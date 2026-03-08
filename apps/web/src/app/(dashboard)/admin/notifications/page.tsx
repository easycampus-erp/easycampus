import { AdminEntityManager } from "@/components/admin/admin-entity-manager";
import { hasPublicSupabaseEnv } from "@/lib/env";
import { requireAdminContext } from "@/lib/server-role";

export default async function AdminNotificationsPage() {
  if (!hasPublicSupabaseEnv()) return <Fallback title="Notifications" />;

  const { supabase, institutionId } = await requireAdminContext();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, audience, recipient_role, recipient_profile_id, scheduled_for")
    .eq("institution_id", institutionId)
    .order("created_at", { ascending: false });

  return (
    <AdminEntityManager
      title="Notifications"
      description="Send broadcast, role-based, or user-specific notifications across the campus workspace."
      endpoint="/api/admin/notifications"
      fields={[
        { name: "title", label: "Title" },
        { name: "body", label: "Body" },
        {
          name: "audience",
          label: "Audience",
          type: "select",
          options: [
            { label: "All", value: "all" },
            { label: "Role", value: "role" },
            { label: "Direct", value: "direct" }
          ]
        },
        {
          name: "recipientRole",
          label: "Recipient Role",
          type: "select",
          options: ["admin", "faculty", "mentor", "student"].map((role) => ({ label: role, value: role }))
        },
        { name: "recipientProfileId", label: "Recipient Profile ID" },
        { name: "scheduledFor", label: "Scheduled For" }
      ]}
      items={(notifications ?? []).map((notification) => ({
        id: notification.id,
        title: notification.title,
        subtitle: `${notification.audience}${notification.recipient_role ? ` | ${notification.recipient_role}` : ""}`,
        values: {
          title: notification.title,
          body: notification.body,
          audience: notification.audience,
          recipientRole: notification.recipient_role ?? "",
          recipientProfileId: notification.recipient_profile_id ?? "",
          scheduledFor: notification.scheduled_for ?? ""
        }
      }))}
    />
  );
}

function Fallback({ title }: { title: string }) {
  return <div className="glass rounded-[32px] p-6 text-mist">{title} becomes interactive after Supabase env vars are configured.</div>;
}
