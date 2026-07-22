import { createClient } from "@/lib/supabase/server";
import { requireOrganisation } from "@/lib/organisations/current";

export async function getRows(
  table:
    | "customers"
    | "mandates"
    | "payments"
    | "settlements"
    | "leads"
    | "webhook_deliveries",
) {
  const organisation = await requireOrganisation();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("organisation_id", organisation.id)
    .order("created_at", { ascending: false })
    .limit(25);
  if (error) throw new Error(`Unable to load ${table}.`, { cause: error });
  return (data ?? []).map((item: Record<string, unknown>) => ({
    id: String(item.id),
    primary: String(
      item.company ??
        item.company_name ??
        item.reference ??
        item.event_type ??
        "Record",
    ),
    secondary: String(
      item.email ?? item.contact_name ?? item.type ?? item.source ?? "FirstPay",
    ),
    status: String(item.status ?? "active"),
    value: item.amount
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(Number(item.amount))
      : String(item.phone ?? item.priority ?? "—"),
    date: new Date(
      String(item.updated_at ?? item.created_at),
    ).toLocaleDateString("en-IN"),
  }));
}

export async function getDashboardData() {
  const organisation = await requireOrganisation();
  const supabase = await createClient();
  const [customers, mandates, payments, settlements, activity, api, webhooks] =
    await Promise.all([
      supabase
        .from("customers")
        .select("id,status", { count: "exact" })
        .eq("organisation_id", organisation.id)
        .is("deleted_at", null),
      supabase
        .from("mandates")
        .select("id,status,created_at", { count: "exact" })
        .eq("organisation_id", organisation.id),
      supabase
        .from("payments")
        .select("id,status,amount,created_at")
        .eq("organisation_id", organisation.id)
        .gte("created_at", new Date(Date.now() - 180 * 86400000).toISOString()),
      supabase
        .from("settlements")
        .select("id,status,amount,created_at")
        .eq("organisation_id", organisation.id),
      supabase
        .from("audit_events")
        .select("id,action,severity,created_at")
        .eq("organisation_id", organisation.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("api_usage_daily")
        .select("usage_date,request_count,error_count")
        .eq("organisation_id", organisation.id)
        .order("usage_date", { ascending: false })
        .limit(6),
      supabase
        .from("webhook_deliveries")
        .select("id,event_type,status,created_at")
        .eq("organisation_id", organisation.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);
  const pays = payments.data ?? [];
  const successful = pays.filter((p) => p.status === "success");
  const failed = pays.filter((p) => p.status === "failed");
  return {
    organisation,
    metrics: {
      collection: successful.reduce((s, p) => s + Number(p.amount), 0),
      customers: customers.count ?? 0,
      mandates: (mandates.data ?? []).filter((m) => m.status === "active")
        .length,
      successful: successful.length,
      failed: failed.length,
      settlements: (settlements.data ?? [])
        .filter((s) => s.status === "settled")
        .reduce((n, s) => n + Number(s.amount), 0),
      pending: pays
        .filter((p) => p.status === "pending")
        .reduce((s, p) => s + Number(p.amount), 0),
    },
    charts: Array.from({ length: 6 }, (_, i) => ({
      label: new Date(2026, i + 1, 1).toLocaleDateString("en-IN", {
        month: "short",
      }),
      value: pays
        .filter((p) => new Date(p.created_at).getMonth() === i + 1)
        .reduce((s, p) => s + Number(p.amount), 0),
    })),
    activity: activity.data ?? [],
    api: api.data ?? [],
    webhooks: webhooks.data ?? [],
  };
}
