import { Activity, Clock3, ShieldAlert, Webhook } from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Provider health"
      description="Safe health telemetry controls routing eligibility."
      cards={[
        {
          title: "Availability",
          description:
            "Healthy, degraded, unavailable, disabled, and misconfigured states.",
          icon: Activity,
        },
        {
          title: "Latency & failures",
          description:
            "Last success/failure, latency, and rolling failure rate.",
          icon: Clock3,
        },
        {
          title: "Configuration",
          description:
            "Authentication and configuration errors without secret disclosure.",
          icon: ShieldAlert,
        },
        {
          title: "Webhook delay",
          description: "Delivery delay and verified-event processing health.",
          icon: Webhook,
        },
      ]}
    />
  );
}
