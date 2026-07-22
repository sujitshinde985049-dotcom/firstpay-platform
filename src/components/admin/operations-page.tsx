import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
export function OperationsPage({
  title,
  description,
  cards,
}: {
  title: string;
  description: string;
  cards: Array<{
    title: string;
    description: string;
    icon: LucideIcon;
    status?: string;
  }>;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <section
            key={c.title}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950"
          >
            <div className="flex items-start justify-between">
              <c.icon className="size-5 text-blue-700" />
              {c.status ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950">
                  {c.status}
                </span>
              ) : null}
            </div>
            <h2 className="mt-5 font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {c.description}
            </p>
            <button className="mt-5 rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Manage
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
