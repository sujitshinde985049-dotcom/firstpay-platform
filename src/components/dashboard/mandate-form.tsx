import { SubmitButton } from "@/components/admin/submit-button";
import { createMandateAction } from "@/lib/dashboard/actions";

type CustomerOption = {
  id: string;
  company: string;
  contact_name: string;
};

export function MandateForm({
  customers,
  enabledTypes,
}: {
  customers: CustomerOption[];
  enabledTypes: Array<"upi_autopay" | "e_nach">;
}) {
  const field =
    "mt-1 w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900";

  if (!customers.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Add an active customer before creating a mandate.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
      <form action={createMandateAction} className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium md:col-span-2">
          Customer
          <select name="customer_id" required className={field}>
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.company} — {customer.contact_name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Reference
          <input
            name="reference"
            required
            minLength={2}
            maxLength={160}
            autoComplete="off"
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Mandate type
          <select name="type" required className={field}>
            {enabledTypes.includes("upi_autopay") ? (
              <option value="upi_autopay">UPI AutoPay</option>
            ) : null}
            {enabledTypes.includes("e_nach") ? (
              <option value="e_nach">e-NACH</option>
            ) : null}
          </select>
        </label>
        <label className="text-sm font-medium">
          Frequency
          <select name="frequency" required className={field}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="daily">Daily</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Amount (INR)
          <input
            name="amount"
            required
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Start date
          <input name="starts_at" type="date" className={field} />
        </label>
        <label className="text-sm font-medium">
          End date
          <input name="ends_at" type="date" className={field} />
        </label>
        <div className="md:col-span-2">
          <SubmitButton pending="Creating mandate…">
            Create mandate
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
