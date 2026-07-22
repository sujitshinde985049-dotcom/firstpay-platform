import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { createClientAction } from "@/lib/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function NewClientPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("subscription_plans")
    .select("id,name")
    .eq("is_active", true)
    .order("sort_order");
  return (
    <div>
      <PageHeader
        title="Create client"
        description="Provision an organisation, assign its plan, and optionally invite the first Client Admin."
      />
      <form
        action={createClientAction}
        className="grid max-w-4xl gap-6 rounded-2xl border bg-white p-6 sm:grid-cols-2 sm:p-8 dark:bg-slate-950"
      >
        <Field label="Company name" name="name" required />
        <Field
          label="URL slug"
          name="slug"
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          required
        />
        <label className="text-sm font-semibold">
          Plan
          <select
            name="subscription_plan_id"
            className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-3 font-normal dark:bg-slate-900"
          >
            <option value="">No plan</option>
            {plans?.map((plan) => (
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
            defaultValue="active"
            className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-3 font-normal dark:bg-slate-900"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <Field label="Trial ends" name="trial_ends_at" type="datetime-local" />
        <Field label="Client Admin email" name="admin_email" type="email" />
        <div className="sm:col-span-2">
          <SubmitButton pending="Creating client…">Create client</SubmitButton>
        </div>
      </form>
    </div>
  );
}
function Field({
  label,
  name,
  type = "text",
  required = false,
  pattern,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  pattern?: string;
}) {
  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        pattern={pattern}
        className="mt-2 w-full rounded-lg border bg-slate-50 px-3 py-3 font-normal dark:bg-slate-900"
      />
    </label>
  );
}
