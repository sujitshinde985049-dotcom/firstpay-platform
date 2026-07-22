import {
  Activity,
  Database,
  HardDrive,
  ServerCog,
  TriangleAlert,
  Webhook,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="System health"
      description="Operational signals without exposing credentials or sensitive payloads."
      cards={[
        {
          title: "Database",
          description:
            "Connectivity, query availability, and migration status placeholder.",
          icon: Database,
          status: "Operational",
        },
        {
          title: "Storage",
          description:
            "Bucket availability, usage, and validated object operations.",
          icon: HardDrive,
          status: "Operational",
        },
        {
          title: "API",
          description:
            "Latency, request volume, and error-rate adapter placeholder.",
          icon: Activity,
          status: "Monitoring",
        },
        {
          title: "Background jobs",
          description: "Scheduled notification and publication job status.",
          icon: ServerCog,
          status: "Prepared",
        },
        {
          title: "Webhook failures",
          description:
            "Failed delivery count, retry state, and masked response summary.",
          icon: Webhook,
          status: "Monitoring",
        },
        {
          title: "Recent errors",
          description:
            "Sanitised system events ordered by severity and occurrence.",
          icon: TriangleAlert,
          status: "Monitoring",
        },
      ]}
    />
  );
}
