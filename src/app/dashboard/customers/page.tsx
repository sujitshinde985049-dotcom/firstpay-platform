import { ModulePage } from "@/components/dashboard/module-page";
import { getRows } from "@/lib/dashboard/data";
export default async function Page() {
  return (
    <ModulePage
      title="Customers"
      description="Manage customer companies, contacts, tags, status, and notes."
      rows={await getRows("customers")}
      createLabel="Add customer"
      createHref="/dashboard/customers/new"
      exportHref="/dashboard/reports/export?type=customers"
      valueLabel="Phone"
    />
  );
}
