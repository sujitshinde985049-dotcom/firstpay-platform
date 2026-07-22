import { ModulePage } from "@/components/dashboard/module-page";
import { getRows } from "@/lib/dashboard/data";
export default async function Page() {
  return (
    <ModulePage
      title="Settlements"
      description="Track settlement summaries, history, reports, and bank references."
      rows={await getRows("settlements")}
      exportHref="/dashboard/reports/export?type=settlements"
      valueLabel="Net amount"
    />
  );
}
