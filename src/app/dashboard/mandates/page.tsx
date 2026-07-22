import { ModulePage } from "@/components/dashboard/module-page";
import { getRows } from "@/lib/dashboard/data";
export default async function Page() {
  return (
    <ModulePage
      title="Mandates"
      description="Monitor UPI AutoPay and e-NACH mandates, frequency, amount, and history."
      rows={await getRows("mandates")}
      valueLabel="Amount"
    />
  );
}
