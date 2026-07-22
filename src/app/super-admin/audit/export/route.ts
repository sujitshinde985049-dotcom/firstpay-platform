import { requireSuperAdmin } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  await requireSuperAdmin();
  const params = new URL(request.url).searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("audit_events")
    .select(
      "id,created_at,action,entity_type,entity_id,severity,actor_id,organisation_id,metadata",
    )
    .order("created_at", { ascending: false });
  if (params.get("action"))
    query = query.ilike("action", `%${params.get("action")}%`);
  if (params.get("organisation"))
    query = query.eq("organisation_id", params.get("organisation"));
  if (params.get("severity") && params.get("severity") !== "all")
    query = query.eq("severity", params.get("severity"));
  if (params.get("from")) query = query.gte("created_at", params.get("from"));
  const { data } = await query;
  const escape = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = [
    [
      "ID",
      "Created",
      "Action",
      "Entity type",
      "Entity ID",
      "Severity",
      "Actor ID",
      "Organisation ID",
      "Metadata",
    ],
    ...(data ?? []).map((event) => [
      event.id,
      event.created_at,
      event.action,
      event.entity_type,
      event.entity_id,
      event.severity,
      event.actor_id,
      event.organisation_id,
      JSON.stringify(event.metadata),
    ]),
  ];
  return new Response(rows.map((row) => row.map(escape).join(",")).join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="firstpay-audit-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
