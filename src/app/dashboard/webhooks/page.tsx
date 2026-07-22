import { ModulePage } from "@/components/dashboard/module-page";
import { getRows } from "@/lib/dashboard/data";
export default async function Page() {
  return (
    <ModulePage
      title="Webhooks"
      description="Inspect delivery history, status, safe log summaries, filters, and retries."
      rows={await getRows("webhook_deliveries")}
      createLabel="Add endpoint"
      valueLabel="Attempt"
    />
  );
}
