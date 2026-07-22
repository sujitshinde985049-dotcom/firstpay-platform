import { ModulePage } from "@/components/dashboard/module-page";
import { getRows } from "@/lib/dashboard/data";
export default async function Page() {
  return (
    <ModulePage
      title="Lead pipeline"
      description="CRM pipeline with status, source, owner, priority, and notes."
      rows={await getRows("leads")}
      createLabel="Add lead"
      exportHref="/dashboard/reports/export?type=leads"
      valueLabel="Priority"
    />
  );
}
