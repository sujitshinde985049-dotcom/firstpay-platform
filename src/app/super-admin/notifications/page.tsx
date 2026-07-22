import {
  Clock3,
  Mail,
  MessageCircleMore,
  MonitorSmartphone,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Notification engine"
      description="Schedule prioritised communications across present and future channels."
      cards={[
        {
          title: "Email",
          description:
            "Template-driven queued email delivery with retry state.",
          icon: Mail,
          status: "Ready",
        },
        {
          title: "In-app",
          description: "Platform and tenant notification centre delivery.",
          icon: MonitorSmartphone,
          status: "Ready",
        },
        {
          title: "SMS",
          description:
            "Provider-neutral adapter placeholder with masked configuration.",
          icon: MessageCircleMore,
          status: "Placeholder",
        },
        {
          title: "WhatsApp",
          description: "Future approved-template adapter placeholder.",
          icon: MessageCircleMore,
          status: "Placeholder",
        },
        {
          title: "Scheduler",
          description:
            "Priority, scheduled time, attempts, failure detail, and cancellation.",
          icon: Clock3,
          status: "Ready",
        },
      ]}
    />
  );
}
