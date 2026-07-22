import { Clock3, LockKeyhole, RefreshCcw, Webhook } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Provider webhooks"
      description="Verified, replay-protected provider event status."
      cards={[
        {
          title: "Endpoints",
          description:
            "Provider-specific routes with production-blocking verification contracts.",
          icon: Webhook,
        },
        {
          title: "Signature status",
          description:
            "Invalid or undocumented signatures are rejected before status processing.",
          icon: LockKeyhole,
        },
        {
          title: "Replay prevention",
          description:
            "Unique provider event identifiers and idempotent persistence.",
          icon: RefreshCcw,
        },
        {
          title: "Delivery health",
          description: "Safe metadata, processing state, and webhook delay.",
          icon: Clock3,
        },
      ]}
    />
  );
}
