import { Megaphone } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import { saveAnnouncementAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const [{ data: announcements }, { data: clients }] = await Promise.all([
    supabase
      .from("announcements")
      .select("*,organisation:organisations(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("organisations")
      .select("id,name")
      .is("deleted_at", null)
      .order("name"),
  ]);
  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Schedule, publish, prioritize, and expire platform or client communications."
      />
      <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 font-semibold">
          <Megaphone className="size-5 text-blue-700" /> Create announcement
        </h2>
        <form
          action={saveAnnouncementAction}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <Field name="title" label="Title" />
          <label className="text-sm font-semibold">
            Priority
            <select
              name="priority"
              defaultValue="normal"
              className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
            >
              <option>low</option>
              <option>normal</option>
              <option>high</option>
              <option>critical</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Audience
            <select
              name="audience"
              defaultValue="all"
              className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
            >
              <option value="all">All users</option>
              <option value="platform">Platform users</option>
              <option value="organisation">Specific client</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Client
            <select
              name="organisation_id"
              className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
            >
              <option value="">None</option>
              {clients?.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Message
            <textarea
              name="body"
              required
              rows={4}
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
              <option>scheduled</option>
              <option>published</option>
              <option>expired</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field name="publish_at" label="Publish at" type="datetime-local" />
            <Field name="expire_at" label="Expire at" type="datetime-local" />
          </div>
          <div className="sm:col-span-2">
            <SubmitButton>Create announcement</SubmitButton>
          </div>
        </form>
      </section>
      <section className="mt-6 overflow-hidden rounded-2xl border bg-white dark:bg-slate-950">
        <div className="divide-y">
          {announcements?.map((item) => {
            const org = Array.isArray(item.organisation)
              ? item.organisation[0]
              : item.organisation;
            return (
              <article
                key={item.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{item.title}</h2>
                    <StatusBadge value={item.status} />
                    <StatusBadge value={item.priority} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {org?.name ?? item.audience} ·{" "}
                    {item.publish_at
                      ? new Date(item.publish_at).toLocaleString()
                      : "Not scheduled"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        {!announcements?.length ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No announcements created.
          </p>
        ) : null}
      </section>
    </div>
  );
}
function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required={type === "text"}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
      />
    </label>
  );
}
