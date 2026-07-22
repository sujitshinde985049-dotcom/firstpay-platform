import {
  deleteCustomerAction,
  saveCustomerAction,
} from "@/lib/dashboard/actions";
type Customer = {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  status: string;
  tags: string[];
  notes: string | null;
};
export function CustomerForm({ customer }: { customer?: Customer }) {
  const field =
    "mt-1 w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900";
  return (
    <div className="rounded-2xl border bg-white p-6 dark:bg-slate-950">
      <form action={saveCustomerAction} className="grid gap-5 md:grid-cols-2">
        {customer ? (
          <input type="hidden" name="id" value={customer.id} />
        ) : null}
        <label className="text-sm font-medium">
          Company
          <input
            required
            name="company"
            defaultValue={customer?.company}
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Contact
          <input
            required
            name="contact_name"
            defaultValue={customer?.contact_name}
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Email
          <input
            required
            type="email"
            name="email"
            defaultValue={customer?.email}
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Phone
          <input
            name="phone"
            defaultValue={customer?.phone ?? ""}
            className={field}
          />
        </label>
        <label className="text-sm font-medium">
          Status
          <select
            name="status"
            defaultValue={customer?.status ?? "active"}
            className={field}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Tags
          <input
            name="tags"
            defaultValue={customer?.tags.join(", ")}
            placeholder="enterprise, priority"
            className={field}
          />
        </label>
        <label className="text-sm font-medium md:col-span-2">
          Notes
          <textarea
            name="notes"
            defaultValue={customer?.notes ?? ""}
            rows={5}
            className={field}
          />
        </label>
        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white">
            {customer ? "Save changes" : "Create customer"}
          </button>
        </div>
      </form>
      {customer ? (
        <form action={deleteCustomerAction} className="mt-4">
          <input type="hidden" name="id" value={customer.id} />
          <button className="text-sm font-semibold text-red-700">
            Soft delete customer
          </button>
        </form>
      ) : null}
    </div>
  );
}
