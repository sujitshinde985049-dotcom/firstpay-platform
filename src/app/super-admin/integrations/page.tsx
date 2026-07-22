import {
  BadgeIndianRupee,
  Banknote,
  BarChart3,
  Mail,
  Smartphone,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Integration architecture"
      description="Provider-neutral configuration placeholders; no real payment processing is enabled."
      cards={[
        {
          title: "UPI AutoPay",
          description:
            "Mandate provider adapter boundary and public configuration.",
          icon: BadgeIndianRupee,
          status: "Placeholder",
        },
        {
          title: "e-NACH",
          description: "Bank mandate adapter boundary and lifecycle mapping.",
          icon: Banknote,
          status: "Placeholder",
        },
        {
          title: "Banks",
          description: "Settlement and verification adapter contracts.",
          icon: Banknote,
          status: "Placeholder",
        },
        {
          title: "SMS & WhatsApp",
          description: "Future communication-provider adapters.",
          icon: Smartphone,
          status: "Placeholder",
        },
        {
          title: "Email",
          description:
            "SMTP and transactional provider configuration reference.",
          icon: Mail,
          status: "Prepared",
        },
        {
          title: "Google analytics",
          description:
            "GA and Tag Manager identifiers stored without executable secrets.",
          icon: BarChart3,
          status: "Prepared",
        },
      ]}
    />
  );
}
