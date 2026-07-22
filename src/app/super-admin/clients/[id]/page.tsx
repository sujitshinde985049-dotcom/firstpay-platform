import { notFound } from "next/navigation";
import { Activity, Database, KeyRound, Users } from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  deleteClientAction,
  createClientAdminAction,
  inviteClientAdminAction,
  removeClientAdminAction,
  resetPasswordAction,
  setClientStatusAction,
  updateClientAction,
} from "@/lib/admin/actions";
import { getClient } from "@/lib/admin/data";

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getClient(id);
  if (!data) notFound();
  const apiRequests = data.usage.reduce(
    (sum, item) => sum + Number(item.request_count),
    0,
  );
  const branding = (data.client.branding ?? {}) as {
    primary_color?: string;
    logo_url?: string;
  };
  return (
    <div>
      <PageHeader
        eyebrow="Client profile"
        title={data.client.name}
        description={`Tenant ID ${data.client.id}`}
        actions={<StatusBadge value={data.client.status} />}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Plan"
          value={data.client.subscription_plan?.name ?? "Unassigned"}
          detail="Current subscription"
          icon={KeyRound}
        />
        <MetricCard
          label="Users"
          value={data.members.length}
          detail="Organisation members"
          icon={Users}
        />
        <MetricCard
          label="API usage"
          value={apiRequests.toLocaleString()}
          detail="Latest 30 usage records"
          icon={Activity}
        />
        <MetricCard
          label="Feature overrides"
          value={data.flags.length}
          detail="Client-specific flags"
          icon={Database}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="font-semibold">
            Company information, plan and branding
          </h2>
          <form
            action={updateClientAction}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <input type="hidden" name="id" value={id} />
            <Field
              name="name"
              label="Company name"
              defaultValue={data.client.name}
            />
            <Field name="slug" label="Slug" defaultValue={data.client.slug} />
            <label className="text-sm font-semibold">
              Plan
              <select
                name="subscription_plan_id"
                defaultValue={data.client.subscription_plan_id ?? ""}
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              >
                <option value="">Unassigned</option>
                {data.plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Status
              <select
                name="status"
                defaultValue={data.client.status}
                className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <Field
              name="trial_ends_at"
              label="Trial ends"
              type="datetime-local"
              defaultValue={data.client.trial_ends_at?.slice(0, 16) ?? ""}
            />
            <Field
              name="primary_color"
              label="Brand colour"
              defaultValue={branding.primary_color ?? "#155eef"}
            />
            <Field
              name="logo_url"
              label="Logo URL"
              defaultValue={branding.logo_url ?? ""}
            />
            <div className="sm:col-span-2">
              <SubmitButton>Save client</SubmitButton>
            </div>
          </form>
        </section>
        <section className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
          <h2 className="font-semibold">Client Admin</h2>
          <form
            action={inviteClientAdminAction}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="organisation_id" value={id} />
            <input
              name="email"
              type="email"
              required
              placeholder="admin@company.com"
              className="min-w-0 flex-1 rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
            />
            <SubmitButton pending="Inviting…">Invite admin</SubmitButton>
          </form>
          <details className="mt-4 rounded-xl border p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Create Client Admin directly
            </summary>
            <form
              action={createClientAdminAction}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <input type="hidden" name="organisation_id" value={id} />
              <input
                name="full_name"
                required
                placeholder="Full name"
                className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Work email"
                className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
              />
              <input
                name="temporary_password"
                type="password"
                minLength={12}
                required
                placeholder="Temporary password (12+ chars)"
                className="rounded-lg border bg-slate-50 px-3 py-2.5 text-sm sm:col-span-2 dark:bg-slate-900"
              />
              <div className="sm:col-span-2">
                <SubmitButton pending="Creating…">
                  Create Client Admin
                </SubmitButton>
              </div>
            </form>
          </details>
          <div className="mt-5 divide-y">
            {data.members.map((member) => {
              const profile = Array.isArray(member.profile)
                ? member.profile[0]
                : member.profile;
              return (
                <div key={member.id} className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span>
                      <strong className="block text-sm">
                        {profile?.full_name ?? "Invited user"}
                      </strong>
                      <small className="text-slate-500">{member.status}</small>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <form action={removeClientAdminAction}>
                        <input
                          type="hidden"
                          name="member_id"
                          value={member.id}
                        />
                        <input
                          type="hidden"
                          name="organisation_id"
                          value={id}
                        />
                        <button className="text-xs font-semibold text-red-600">
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <form
            action={resetPasswordAction}
            className="mt-5 flex gap-3 border-t pt-5"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="Admin email for reset"
              className="min-w-0 flex-1 rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900"
            />
            <SubmitButton tone="secondary" pending="Creating…">
              Reset password
            </SubmitButton>
          </form>
        </section>
      </div>
      <section className="mt-6 rounded-2xl border bg-white p-6 dark:bg-slate-950">
        <h2 className="font-semibold">Recent activity and audit logs</h2>
        <div className="mt-4 divide-y">
          {data.audits.length ? (
            data.audits.slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span>
                  <strong className="block">{event.action}</strong>
                  <small className="text-slate-500">
                    {new Date(event.created_at).toLocaleString()}
                  </small>
                </span>
                <StatusBadge value={event.severity} />
              </div>
            ))
          ) : (
            <p className="py-8 text-sm text-slate-500">
              No client audit events yet.
            </p>
          )}
        </div>
      </section>
      <section className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <form action={setClientStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="status"
            value={data.client.status === "suspended" ? "active" : "suspended"}
          />
          <SubmitButton tone="secondary">
            {data.client.status === "suspended"
              ? "Activate client"
              : "Suspend client"}
          </SubmitButton>
        </form>
        <form action={deleteClientAction}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton tone="danger" pending="Deleting…">
            Soft delete client
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
function Field({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required={name === "name" || name === "slug"}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2.5 font-normal dark:bg-slate-900"
      />
    </label>
  );
}
