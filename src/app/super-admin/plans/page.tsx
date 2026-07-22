import { Check, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { savePlanAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

type Limits = {
  users?: number;
  storage_gb?: number;
  api_requests?: number;
  webhooks?: number;
  reports?: number;
  priority_support?: boolean;
};

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("sort_order");
  return (
    <div>
      <PageHeader
        title="Subscription plans"
        description="Manage commercial tiers and feature limits across Starter, Growth, Business, Enterprise, and Custom."
      />
      <div className="grid gap-5 xl:grid-cols-2">
        {plans?.map((plan) => (
          <PlanForm key={plan.id} plan={plan} />
        ))}
      </div>
      <section className="mt-6 rounded-2xl border border-dashed bg-white p-6 dark:bg-slate-950">
        <h2 className="flex items-center gap-2 font-semibold">
          <Plus className="size-5" /> Create plan
        </h2>
        <PlanForm />
      </section>
    </div>
  );
}

function PlanForm({
  plan,
}: {
  plan?: {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    price_monthly: number;
    price_yearly: number;
    limits: unknown;
    is_active: boolean;
  };
}) {
  const limits = (plan?.limits ?? {}) as Limits;
  return (
    <form
      action={savePlanAction}
      className="rounded-2xl border bg-white p-6 dark:bg-slate-950"
    >
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Plan name" value={plan?.name} />
        <Field name="slug" label="Slug" value={plan?.slug ?? undefined} />
        <label className="text-sm font-semibold sm:col-span-2">
          Description
          <textarea
            name="description"
            defaultValue={plan?.description ?? ""}
            rows={2}
            className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-2 font-normal dark:bg-slate-900"
          />
        </label>
        <Field
          name="price_monthly"
          label="Monthly price (INR)"
          type="number"
          value={plan?.price_monthly}
        />
        <Field
          name="price_yearly"
          label="Yearly price (INR)"
          type="number"
          value={plan?.price_yearly}
        />
        <Field name="users" label="Users" type="number" value={limits.users} />
        <Field
          name="storage_gb"
          label="Storage (GB)"
          type="number"
          value={limits.storage_gb}
        />
        <Field
          name="api_requests"
          label="API requests"
          type="number"
          value={limits.api_requests}
        />
        <Field
          name="webhooks"
          label="Webhooks"
          type="number"
          value={limits.webhooks}
        />
        <Field
          name="reports"
          label="Reports"
          type="number"
          value={limits.reports}
        />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="priority_support"
            defaultChecked={limits.priority_support}
          />
          <Check className="size-4 text-emerald-600" /> Priority support
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={plan?.is_active ?? true}
          />{" "}
          Active plan
        </label>
      </div>
      <div className="mt-5">
        <SubmitButton>{plan ? "Update plan" : "Create plan"}</SubmitButton>
      </div>
    </form>
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
