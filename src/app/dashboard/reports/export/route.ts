import { NextRequest, NextResponse } from "next/server";
import { requireOrganisation } from "@/lib/organisations/current";
import { createClient } from "@/lib/supabase/server";
const tables = {
  customers: "customers",
  payments: "payments",
  settlements: "settlements",
  leads: "leads",
  mandates: "mandates",
  collections: "payments",
  users: "organisation_members",
} as const;
export async function GET(request: NextRequest) {
  const org = await requireOrganisation();
  const type = request.nextUrl.searchParams.get("type") as keyof typeof tables;
  const table = tables[type];
  if (!table)
    return NextResponse.json({ error: "Unsupported report" }, { status: 400 });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("organisation_id", org.id)
    .limit(10000);
  if (error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  const rows = (data ?? []) as Record<string, unknown>[];
  const keys = Array.from(new Set(rows.flatMap(Object.keys))).filter(
    (k) => !k.includes("secret") && !k.includes("hash"),
  );
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => esc(r[k])).join(",")),
  ].join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="firstpay-${type}.csv"`,
      "cache-control": "no-store",
    },
  });
}
