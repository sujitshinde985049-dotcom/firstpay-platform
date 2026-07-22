import { requireSuperAdmin } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  await requireSuperAdmin();
  const url = new URL(request.url);
  const search = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status") ?? "all";
  const supabase = await createClient();
  let query = supabase
    .from("organisations")
    .select(
      "id,name,slug,status,created_at,trial_ends_at,subscription_plan:subscription_plans(name)",
    )
    .is("deleted_at", null);
  if (search) query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const { data } = await query.order("created_at", { ascending: false });
  const escape = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = [
    ["ID", "Company", "Slug", "Status", "Plan", "Created", "Trial ends"],
    ...(data ?? []).map((client) => {
      const plan = Array.isArray(client.subscription_plan)
        ? client.subscription_plan[0]
        : client.subscription_plan;
      return [
        client.id,
        client.name,
        client.slug,
        client.status,
        plan?.name ?? "",
        client.created_at,
        client.trial_ends_at ?? "",
      ];
    }),
  ];
  return new Response(rows.map((row) => row.map(escape).join(",")).join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="firstpay-clients-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
