import type { ReactNode } from "react";
import { PageHeader } from "@/components/admin/page-header";
export function SettingsPanel({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: Array<{ title: string; body: string; action?: ReactNode }>;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950"
          >
            <h2 className="font-semibold text-slate-950 dark:text-white">
              {s.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{s.body}</p>
            {s.action ? <div className="mt-5">{s.action}</div> : null}
          </section>
        ))}
      </div>
    </div>
  );
}
