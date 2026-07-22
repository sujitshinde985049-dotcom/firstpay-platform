import { Flag } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { saveFeatureFlagAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

const featureKeys = [
  "upi_autopay",
  "e_nach",
  "reports",
  "api",
  "webhooks",
  "multiple_users",
  "priority_support",
  "cms",
  "media_manager",
  "blog",
  "analytics",
];

export default async function FeatureFlagsPage() {
  const supabase = await createClient();
  const [{ data: flags }, { data: clients }] = await Promise.all([
    supabase
      .from("feature_flags")
      .select("id,key,enabled,organisation_id,organisation:organisations(name)")
      .order("key"),
    supabase
      .from("organisations")
      .select("id,name")
      .is("deleted_at", null)
      .order("name"),
  ]);
  return (
    <div>
      <PageHeader
        title="Feature flags"
        description="Control platform defaults and client-level capability overrides."
      />
      <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 font-semibold">
          <Flag className="size-5 text-blue-700" /> Platform defaults
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {featureKeys.map((key) => {
            const flag = flags?.find(
              (item) => item.key === key && !item.organisation_id,
            );
            return (
              <form
                key={key}
                action={saveFeatureFlagAction}
                className="flex items-center justify-between rounded-xl border bg-slate-50 p-4 dark:bg-slate-900"
              >
                <input type="hidden" name="key" value={key} />
                <input
                  type="hidden"
                  name="enabled"
                  value={flag?.enabled ? "false" : "true"}
                />
                <span className="text-sm font-medium capitalize">
                  {key.replaceAll("_", " ")}
                </span>
                <button
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${flag?.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600 dark:bg-slate-800"}`}
                >
                  {flag?.enabled ? "Enabled" : "Disabled"}
                </button>
              </form>
            );
          })}
        </div>
      </section>
      <section className="mt-6 rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="font-semibold">Client overrides</h2>
        <form
          action={saveFeatureFlagAction}
          className="mt-5 grid gap-3 sm:grid-cols-4"
        >
          <select
            name="organisation_id"
            required
            className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
          >
            <option value="">Select client</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          <select
            name="key"
            className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
          >
            {featureKeys.map((key) => (
              <option key={key} value={key}>
                {key.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <select
            name="enabled"
            className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
          >
            <option value="true">Enable</option>
            <option value="false">Disable</option>
          </select>
          <button className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
            Save override
          </button>
        </form>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b text-xs text-slate-500 uppercase">
              <tr>
                <th className="py-3">Client</th>
                <th>Feature</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {flags
                ?.filter((flag) => flag.organisation_id)
                .map((flag) => {
                  const org = Array.isArray(flag.organisation)
                    ? flag.organisation[0]
                    : flag.organisation;
                  return (
                    <tr key={flag.id}>
                      <td className="py-3">{org?.name}</td>
                      <td className="capitalize">
                        {flag.key.replaceAll("_", " ")}
                      </td>
                      <td>{flag.enabled ? "Enabled" : "Disabled"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
