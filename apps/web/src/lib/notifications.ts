import { writeAuditLog } from "@/lib/audit";
import { logServerEvent } from "@/lib/logging";

type SupabaseLike = any;

export async function deliverPendingNotifications(params: {
  supabase: SupabaseLike;
  institutionId?: string;
  actorProfileId?: string | null;
}) {
  const now = new Date().toISOString();
  let query = params.supabase
    .from("notifications")
    .select("id, institution_id, title, body, recipient_role, recipient_profile_id")
    .is("delivered_at", null)
    .limit(50);

  if (params.institutionId) {
    query = query.eq("institution_id", params.institutionId);
  }

  query = query.or(`scheduled_for.is.null,scheduled_for.lte.${now}`);

  const { data: notifications, error: notificationsError } = await query;
  if (notificationsError) {
    throw new Error(notificationsError.message);
  }

  const expoMessages: Array<{ to: string; title: string; body: string }> = [];

  for (const notification of notifications ?? []) {
    let tokenQuery = params.supabase.from("device_push_tokens").select("id, token").eq("institution_id", notification.institution_id);

    if (notification.recipient_profile_id) {
      tokenQuery = tokenQuery.eq("profile_id", notification.recipient_profile_id);
    } else if (notification.recipient_role) {
      const { data: memberships } = await params.supabase
        .from("memberships")
        .select("profile_id")
        .eq("institution_id", notification.institution_id)
        .eq("role", notification.recipient_role);

      const profileIds = (memberships ?? []).map((item: { profile_id: string }) => item.profile_id);
      if (profileIds.length === 0) {
        continue;
      }
      tokenQuery = tokenQuery.in("profile_id", profileIds);
    }

    const { data: tokens } = await tokenQuery.eq("active", true);
    (tokens ?? []).forEach((token: { token: string }) => {
      expoMessages.push({
        to: token.token,
        title: notification.title,
        body: notification.body
      });
    });
  }

  if (expoMessages.length > 0) {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expoMessages)
    }).catch(() => undefined);
  }

  const notificationIds = (notifications ?? []).map((item: { id: string }) => item.id);
  if (notificationIds.length > 0) {
    await params.supabase.from("notifications").update({ delivered_at: now }).in("id", notificationIds);

    const groupedByInstitution = new Map<string, number>();
    (notifications ?? []).forEach((notification: { institution_id: string }) => {
      groupedByInstitution.set(notification.institution_id, (groupedByInstitution.get(notification.institution_id) ?? 0) + 1);
    });

    for (const [institutionId, deliveredCount] of groupedByInstitution.entries()) {
      await writeAuditLog(params.supabase, {
        institutionId,
        actorProfileId: params.actorProfileId ?? null,
        action: "deliver",
        entityType: "notifications",
        metadata: { deliveredCount }
      });
    }
  }

  logServerEvent("notifications.delivery.completed", {
    institutionId: params.institutionId ?? "all",
    notifications: notificationIds.length,
    pushMessages: expoMessages.length
  });

  return {
    notifications: notificationIds.length,
    pushMessages: expoMessages.length
  };
}
