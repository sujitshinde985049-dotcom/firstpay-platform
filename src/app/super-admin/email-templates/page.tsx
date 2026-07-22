import {
  Bell,
  KeyRound,
  Mail,
  MessageSquare,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { OperationsPage } from "@/components/admin/operations-page";
export default function Page() {
  return (
    <OperationsPage
      title="Email templates"
      description="Versioned, variable-aware communication templates with preview and audit controls."
      cards={[
        {
          title: "Welcome & activation",
          description: "Welcome and client activation lifecycle messages.",
          icon: UserPlus,
        },
        {
          title: "Invitations",
          description: "Time-limited team invitation templates.",
          icon: Mail,
        },
        {
          title: "Password reset",
          description: "Security-focused password recovery content.",
          icon: KeyRound,
        },
        {
          title: "Leads & demos",
          description: "Internal lead notification and demo request templates.",
          icon: Bell,
        },
        {
          title: "Support & announcements",
          description:
            "Ticket updates, newsletters, and scheduled announcements.",
          icon: MessageSquare,
        },
        {
          title: "Suspension",
          description: "Controlled service-status communication.",
          icon: ShieldAlert,
        },
      ]}
    />
  );
}
