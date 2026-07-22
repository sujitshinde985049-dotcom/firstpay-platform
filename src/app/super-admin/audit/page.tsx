import { Download, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string;
    organisation?: string;
    severity?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("audit_events")
    .select(
      "id,action,entity_type,severity,created_at,metadata,actor:profiles(full_name),organisation:organisations(name)",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (params.action) query = query.ilike("action", `%${params.action}%`);
  if (params.organisation)
    query = query.eq("organisation_id", params.organisation);
  if (params.severity && params.severity !== "all")
    query = query.eq("severity", params.severity);
  if (params.from) query = query.gte("created_at", params.from);
  if (params.to) query = query.lte("created_at", `${params.to}T23:59:59.999Z`);
  const [{ data: events }, { data: organisations }] = await Promise.all([
    query,
    supabase
      .from("organisations")
      .select("id,name")
      .is("deleted_at", null)
      .order("name"),
  ]);
  const exportParams = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] =>
      Boolean(entry[1]),
    ),
  ).toString();
  return (
    <div>
      <PageHeader
        title="Platform audit logs"
        description="Investigate user actions, organisation changes, security events, and administrative operations."
        actions={
          <a
            href={`/super-admin/audit/export?${exportParams}`}
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold dark:bg-slate-950"
          >
            <Download className="size-4" /> Export CSV
          </a>
        }
      />
      <form className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-5 dark:bg-slate-950">
        <label className="relative">
          <Search className="absolute top-3 left-3 size-4 text-slate-400" />
          <input
            name="action"
            defaultValue={params.action}
            placeholder="Action"
            className="w-full rounded-lg border bg-slate-50 py-2.5 pr-3 pl-10 text-sm dark:bg-slate-900"
          />
        </label>
        <select
          name="organisation"
          defaultValue={params.organisation}
          className="rounded-lg border bg-slate-50 px-3 text-sm dark:bg-slate-900"
        >
          <option value="">All organisations</option>
          {organisations?.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
        <select
          name="severity"
          defaultValue={params.severity ?? "all"}
          className="rounded-lg border bg-slate-50 px-3 text-sm dark:bg-slate-900"
        >
          <option value="all">All severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <input
          name="from"
          type="date"
          defaultValue={params.from}
          aria-label="From date"
          className="rounded-lg border bg-slate-50 px-3 text-sm dark:bg-slate-900"
        />
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          Filter
        </button>
      </form>
      <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-slate-950">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900">
            <tr>
              <th className="px-5 py-4">Time</th>
              <th>Action</th>
              <th>User</th>
              <th>Organisation</th>
              <th>Entity</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events?.map((event) => {
              const actor = Array.isArray(event.actor)
                ? event.actor[0]
                : event.actor;
              const org = Array.isArray(event.organisation)
                ? event.organisation[0]
                : event.organisation;
              return (
                <tr key={event.id}>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(event.created_at).toLocaleString()}
                  </td>
                  <td className="font-medium">{event.action}</td>
                  <td>{actor?.full_name ?? "System"}</td>
                  <td>{org?.name ?? "Platform"}</td>
                  <td>{event.entity_type}</td>
                  <td>
                    <StatusBadge value={event.severity} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
