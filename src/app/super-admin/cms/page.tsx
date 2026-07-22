import { FilePenLine, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveCmsEntryAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

const entryTypes = [
  "homepage",
  "hero",
  "statistic",
  "footer",
  "navigation",
  "faq",
  "testimonial",
  "partner",
  "client_logo",
  "blog",
  "legal",
  "seo",
];

export default async function CmsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const type = (await searchParams).type ?? "all";
  const supabase = await createClient();
  let query = supabase
    .from("cms_entries")
    .select("*")
    .is("deleted_at", null)
    .order("entry_type")
    .order("sort_order");
  if (type !== "all") query = query.eq("entry_type", type);
  const { data: entries } = await query;
  return (
    <div>
      <PageHeader
        title="Content management"
        description="Manage homepage sections, navigation, FAQs, testimonials, partners, client logos, blog, legal content, and SEO."
      />
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="flex items-center gap-2 font-semibold">
            <Plus className="size-5 text-blue-700" /> New content entry
          </h2>
          <form action={saveCmsEntryAction} className="mt-5 grid gap-4">
            <label className="text-sm font-semibold">
              Content type
              <select
                name="entry_type"
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              >
                {entryTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Field name="title" label="Title" />
            <Field name="slug" label="Slug" />
            <label className="text-sm font-semibold">
              Body
              <textarea
                name="body"
                rows={5}
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              />
            </label>
            <label className="text-sm font-semibold">
              SEO / metadata
              <textarea
                name="metadata"
                rows={3}
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              />
            </label>
            <label className="text-sm font-semibold">
              Status
              <select
                name="status"
                defaultValue="draft"
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              >
                <option>draft</option>
                <option>published</option>
                <option>archived</option>
              </select>
            </label>
            <Field name="sort_order" label="Sort order" type="number" />
            <SubmitButton>Create entry</SubmitButton>
          </form>
        </section>
        <section>
          <form className="mb-4 flex gap-3">
            <select
              name="type"
              defaultValue={type}
              className="rounded-lg border bg-white px-3 py-2.5 text-sm dark:bg-slate-950"
            >
              <option value="all">All content</option>
              {entryTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
              Filter
            </button>
          </form>
          <div className="space-y-4">
            {entries?.map((entry) => {
              const content = (entry.content ?? {}) as {
                body?: string;
                metadata?: string;
              };
              return (
                <details
                  key={entry.id}
                  className="rounded-2xl border bg-white p-5 dark:bg-slate-950"
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3">
                        <FilePenLine className="size-5 text-blue-700" />
                        <span>
                          <strong className="block">{entry.title}</strong>
                          <small className="text-slate-500">
                            {entry.entry_type} / {entry.slug}
                          </small>
                        </span>
                      </span>
                      <StatusBadge value={entry.status} />
                    </div>
                  </summary>
                  <form
                    action={saveCmsEntryAction}
                    className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2"
                  >
                    <input type="hidden" name="id" value={entry.id} />
                    <input
                      type="hidden"
                      name="entry_type"
                      value={entry.entry_type}
                    />
                    <Field name="title" label="Title" value={entry.title} />
                    <Field name="slug" label="Slug" value={entry.slug} />
                    <label className="text-sm font-semibold sm:col-span-2">
                      Body
                      <textarea
                        name="body"
                        rows={5}
                        defaultValue={content.body}
                        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
                      />
                    </label>
                    <label className="text-sm font-semibold sm:col-span-2">
                      SEO / metadata
                      <textarea
                        name="metadata"
                        rows={3}
                        defaultValue={content.metadata}
                        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
                      />
                    </label>
                    <label className="text-sm font-semibold">
                      Status
                      <select
                        name="status"
                        defaultValue={entry.status}
                        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
                      >
                        <option>draft</option>
                        <option>published</option>
                        <option>archived</option>
                      </select>
                    </label>
                    <Field
                      name="sort_order"
                      label="Sort order"
                      type="number"
                      value={entry.sort_order}
                    />
                    <div className="sm:col-span-2">
                      <SubmitButton>Update entry</SubmitButton>
                    </div>
                  </form>
                </details>
              );
            })}
          </div>
          {!entries?.length ? (
            <p className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">
              No CMS entries match this filter.
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
function Field({
  name,
  label,
  type = "text",
  value,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required
        defaultValue={value}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
      />
    </label>
  );
}
