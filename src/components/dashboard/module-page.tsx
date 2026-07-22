import { Download, Plus, Search } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export type ModuleRow = {
  id: string;
  primary: string;
  secondary: string;
  status: string;
  value: string;
  date: string;
};
export function ModulePage({
  title,
  description,
  rows,
  valueLabel = "Value",
  createLabel,
  createHref,
  exportHref,
}: {
  title: string;
  description: string;
  rows: ModuleRow[];
  valueLabel?: string;
  createLabel?: string;
  createHref?: string;
  exportHref?: string;
}) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            {exportHref ? (
              <a
                href={exportHref}
                className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold dark:bg-slate-950"
              >
                <Download className="size-4" />
                Export CSV
              </a>
            ) : null}
            {createLabel && createHref ? (
              <Link
                href={createHref}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus className="size-4" />
                {createLabel}
              </Link>
            ) : createLabel ? (
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
                <Plus className="size-4" />
                {createLabel}
              </button>
            ) : null}
          </>
        }
      />
      <form className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_180px_auto] dark:bg-slate-950">
        <label className="relative">
          <Search className="absolute top-3 left-3 size-4 text-slate-400" />
          <span className="sr-only">Search</span>
          <input
            name="q"
            placeholder={`Search ${title.toLowerCase()}`}
            className="w-full rounded-lg border bg-slate-50 py-2.5 pr-3 pl-10 text-sm dark:bg-slate-900"
          />
        </label>
        <select
          name="status"
          aria-label="Status filter"
          className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        <button className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
          Apply
        </button>
      </form>
      <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-slate-950">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900">
            <tr>
              <th className="px-5 py-4">Record</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">{valueLabel}</th>
              <th className="px-5 py-4">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-5 py-4">
                  <strong className="block">{row.primary}</strong>
                  <span className="text-xs text-slate-500">
                    {row.secondary}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge value={row.status} />
                </td>
                <td className="px-5 py-4 font-medium">{row.value}</td>
                <td className="px-5 py-4 text-slate-500">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No records found. Your tenant-scoped data will appear here.
          </p>
        ) : null}
      </div>
    </div>
  );
}
