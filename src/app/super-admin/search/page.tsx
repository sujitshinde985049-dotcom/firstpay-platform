import { Search } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
export default function Page() {
  return (
    <div>
      <PageHeader
        title="Global search"
        description="Search CMS content, clients, users, leads, and operational records."
      />
      <form className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <label className="relative block">
          <Search className="absolute top-3.5 left-3.5 size-5 text-slate-400" />
          <span className="sr-only">Search platform</span>
          <input
            name="q"
            placeholder="Search by name, slug, email, reference, or content"
            className="w-full rounded-xl border bg-slate-50 py-3 pr-4 pl-11 dark:bg-slate-900"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Search scopes">
          {["All", "CMS", "Clients", "Users", "Leads"].map((x) => (
            <button
              key={x}
              type="button"
              className="rounded-full border px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              {x}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
