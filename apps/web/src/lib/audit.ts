import { logServerEvent } from "@/lib/logging";

export async function writeAuditLog(
  supabase: any,
  payload: {
    institutionId: string;
    actorProfileId?: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await supabase.from("audit_logs").insert({
    institution_id: payload.institutionId,
    actor_profile_id: payload.actorProfileId ?? null,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId ?? null,
    metadata: payload.metadata ?? {}
  });

  if (error) {
    console.error("Failed to write audit log:", error.message);
    logServerEvent("audit.write_failed", {
      institutionId: payload.institutionId,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId ?? null,
      error: error.message
    });
    return;
  }

  logServerEvent("audit.written", {
    institutionId: payload.institutionId,
    actorProfileId: payload.actorProfileId ?? null,
    action: payload.action,
    entityType: payload.entityType,
    entityId: payload.entityId ?? null
  });
}
