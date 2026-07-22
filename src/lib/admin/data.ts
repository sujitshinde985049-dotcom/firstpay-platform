import { createClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/auth/permissions";

export const PAGE_SIZE = 20;

export async function getAdminDashboardData() {
  await requireSuperAdmin();
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [clients, users, leads, tickets, audit, apiUsage, storageUsage, plans] =
    await Promise.all([
      supabase
        .from("organisations")
        .select("id,status,trial_ends_at,created_at,subscription_plan_id")
        .is("deleted_at", null),
      supabase
        .from("profiles")
        .select("id,created_at,deactivated_at")
        .is("deleted_at", null),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase
        .from("support_tickets")
        .select(
          "id,status,priority,subject,created_at,organisation:organisations(name)",
        )
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("audit_events")
        .select(
          "id,action,entity_type,severity,created_at,organisation:organisations(name),actor:profiles(full_name)",
        )
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("api_usage_daily")
        .select("usage_date,request_count,error_count,webhook_count")
        .gte(
          "usage_date",
          new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
        )
        .order("usage_date"),
      supabase
        .from("storage_usage_daily")
        .select("bytes_used,usage_date")
        .order("usage_date", { ascending: false })
        .limit(100),
      supabase.from("subscription_plans").select("id,name").order("sort_order"),
    ]);

  const clientRows = clients.data ?? [];
  const userRows = users.data ?? [];
  const now = Date.now();
  const active = clientRows.filter((item) => item.status === "active").length;
  const suspended = clientRows.filter(
    (item) => item.status === "suspended",
  ).length;
  const trials = clientRows.filter(
    (item) =>
      item.trial_ends_at && new Date(item.trial_ends_at).getTime() > now,
  ).length;
  const newClients = clientRows.filter(
    (item) => new Date(item.created_at).getTime() >= monthStart.getTime(),
  ).length;
  const apiTotal = (apiUsage.data ?? []).reduce(
    (sum, item) => sum + Number(item.request_count),
    0,
  );
  const storageTotal = (storageUsage.data ?? []).reduce(
    (sum, item) => sum + Number(item.bytes_used),
    0,
  );
  const planMap = new Map(
    (plans.data ?? []).map((plan) => [plan.id, plan.name]),
  );
  const planDistribution = Array.from(planMap.values()).map((name) => ({
    name,
    value: clientRows.filter(
      (item) => planMap.get(item.subscription_plan_id) === name,
    ).length,
  }));

  return {
    metrics: {
      totalClients: clientRows.length,
      activeClients: active,
      trialClients: trials,
      suspendedClients: suspended,
      totalUsers: userRows.length,
      monthlyActiveClients: active,
      newClients,
      totalLeads: leads.count ?? 0,
      apiUsage: apiTotal,
      storageUsage: storageTotal,
      supportTickets: (tickets.data ?? []).filter(
        (ticket) => ticket.status !== "closed",
      ).length,
      auditEvents: audit.data?.length ?? 0,
    },
    growth: Array.from({ length: 8 }, (_, index) => ({
      label: `W${index + 1}`,
      value: Math.max(0, clientRows.length - 7 + index),
    })),
    planDistribution,
    usage: apiUsage.data ?? [],
    tickets: tickets.data ?? [],
    activity: audit.data ?? [],
  };
}

export async function getClients(search = "", status = "all", page = 1) {
  await requireSuperAdmin();
  const supabase = await createClient();
  let query = supabase
    .from("organisations")
    .select(
      "id,name,slug,status,trial_ends_at,created_at,branding,subscription_plan:subscription_plans(name,slug),members:organisation_members(count)",
      { count: "exact" },
    )
    .is("deleted_at", null);
  if (search) query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw new Error("Unable to load clients.", { cause: error });
  return {
    clients: data ?? [],
    total: count ?? 0,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

export async function getClient(id: string) {
  await requireSuperAdmin();
  const supabase = await createClient();
  const [client, members, usage, audits, flags, plans] = await Promise.all([
    supabase
      .from("organisations")
      .select("*,subscription_plan:subscription_plans(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single(),
    supabase
      .from("organisation_members")
      .select(
        "id,status,created_at,profile:profiles(id,full_name,avatar_url,deactivated_at),roles:organisation_member_roles(role:organisation_roles(id,name))",
      )
      .eq("organisation_id", id)
      .order("created_at"),
    supabase
      .from("api_usage_daily")
      .select("*")
      .eq("organisation_id", id)
      .order("usage_date", { ascending: false })
      .limit(30),
    supabase
      .from("audit_events")
      .select("*")
      .eq("organisation_id", id)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("feature_flags")
      .select("*")
      .eq("organisation_id", id)
      .order("key"),
    supabase
      .from("subscription_plans")
      .select("id,name,slug,limits")
      .order("sort_order"),
  ]);
  if (client.error) return null;
  return {
    client: client.data,
    members: members.data ?? [],
    usage: usage.data ?? [],
    audits: audits.data ?? [],
    flags: flags.data ?? [],
    plans: plans.data ?? [],
  };
}
