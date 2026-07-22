import { Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/admin/pagination";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { getClients } from "@/lib/admin/data";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const status = params.status ?? "all";
  const page = Math.max(1, Number(params.page ?? 1));
  const data = await getClients(search, status, page);
  return (
    <div>
      <PageHeader
        title="Client management"
        description="Create, search, filter, operate, and export every FirstPay tenant."
        actions={
          <>
            <a
              href={`/super-admin/clients/export?q=${encodeURIComponent(search)}&status=${status}`}
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold dark:bg-slate-950"
            >
              <Download className="size-4" /> Export CSV
            </a>
            <Link
              href="/super-admin/clients/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="size-4" /> Create client
            </Link>
          </>
        }
      />
      <form className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_180px_auto] dark:bg-slate-950">
        <label className="relative">
          <Search className="absolute top-3 left-3 size-4 text-slate-400" />
          <span className="sr-only">Search clients</span>
          <input
            name="q"
            defaultValue={search}
            placeholder="Search company or slug"
            className="w-full rounded-lg border bg-slate-50 py-2.5 pr-3 pl-10 text-sm dark:bg-slate-900"
          />
        </label>
        <select
          name="status"
          defaultValue={status}
          aria-label="Filter by status"
          className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="archived">Archived</option>
        </select>
        <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          Apply
        </button>
      </form>
      <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-slate-950">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900">
            <tr>
              <th className="px-5 py-4">Client</th>
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Users</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.clients.map((client) => {
              const plan = Array.isArray(client.subscription_plan)
                ? client.subscription_plan[0]
                : client.subscription_plan;
              const memberCount = Array.isArray(client.members)
                ? Number(client.members[0]?.count ?? 0)
                : 0;
              return (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/60"
                >
                  <td className="px-5 py-4">
                    <strong className="block font-medium">{client.name}</strong>
                    <span className="text-xs text-slate-500">
                      {client.slug}
                    </span>
                  </td>
                  <td className="px-5 py-4">{plan?.name ?? "Unassigned"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge value={client.status} />
                  </td>
                  <td className="px-5 py-4">{memberCount}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/super-admin/clients/${client.id}`}
                      className="font-semibold text-blue-700 dark:text-blue-400"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!data.clients.length ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No clients match these filters.
          </p>
        ) : null}
      </div>
      <Pagination
        page={page}
        pages={data.pages}
        basePath="/super-admin/clients"
        query={{ q: search, status }}
      />
    </div>
  );
}
