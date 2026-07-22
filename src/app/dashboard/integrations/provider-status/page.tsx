import {
  Activity,
  CheckCircle2,
  FlaskConical,
  LockKeyhole,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Provider status"
      description="Organisation-scoped readiness with no secret values."
      cards={[
        {
          title: "Environment",
          description:
            "Sandbox and live records are separated and clearly labelled.",
          icon: FlaskConical,
        },
        {
          title: "Credentials",
          description:
            "Shows missing, configured, rotated, or revoked status only.",
          icon: LockKeyhole,
        },
        {
          title: "Webhook",
          description:
            "Signature configuration and recent verified delivery state.",
          icon: Activity,
        },
        {
          title: "Application",
          description: "Provider application and approval timeline.",
          icon: CheckCircle2,
        },
      ]}
    />
  );
}
