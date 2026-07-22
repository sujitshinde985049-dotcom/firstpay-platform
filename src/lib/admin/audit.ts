import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/auth/permissions";

export async function recordAuditEvent(input: {
  action: string;
  entityType: string;
  entityId?: string;
  organisationId?: string;
  severity?: "info" | "warning" | "critical";
  metadata?: Record<string, unknown>;
}) {
  const user = await requireSuperAdmin();
  const requestHeaders = await headers();
  const supabase = await createClient();
  const forwardedFor = requestHeaders
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  await supabase.from("audit_events").insert({
    actor_id: user.id,
    action: input.action,
    entity_type: input.entityType,
    entity_id: input.entityId,
    organisation_id: input.organisationId,
    severity: input.severity ?? "info",
    ip_address: forwardedFor || null,
    user_agent: requestHeaders.get("user-agent"),
    metadata: input.metadata ?? {},
  });
}
