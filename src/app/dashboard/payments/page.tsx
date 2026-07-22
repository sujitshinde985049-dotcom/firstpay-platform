import { ModulePage } from "@/components/dashboard/module-page";
import { getRows } from "@/lib/dashboard/data";
export default async function Page() {
  return (
    <ModulePage
      title="Payments"
      description="Review successful, pending, failed, refund, and retry workflows."
      rows={await getRows("payments")}
      exportHref="/dashboard/reports/export?type=payments"
      valueLabel="Amount"
    />
  );
}
