import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
export function SettingsPanel({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: Array<{
    title: string;
    body: string;
    action?: ReactNode;
    href?: string;
  }>;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((s) => {
          const content = (
            <>
              <h2 className="font-semibold text-slate-950 dark:text-white">
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{s.body}</p>
              {s.action ? <div className="mt-5">{s.action}</div> : null}
            </>
          );
          return s.href ? (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-slate-950"
            >
              {content}
            </Link>
          ) : (
            <section
              key={s.title}
              className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-950"
            >
              {content}
            </section>
          );
        })}
      </div>
    </div>
  );
}
