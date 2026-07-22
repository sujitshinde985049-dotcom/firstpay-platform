import { SettingsPanel } from "@/components/dashboard/settings-panel";
export default function Page() {
  return (
    <SettingsPanel
      title="Workspace settings"
      description="Configure your FirstPay tenant securely."
      sections={[
        {
          title: "General",
          body: "Workspace locale, timezone, payment defaults, and company preferences.",
        },
        {
          title: "Security",
          body: "Session policy, password controls, credential rotation, and audit retention.",
        },
        {
          title: "Notifications",
          body: "Choose recipients and delivery channels for operational and risk events.",
        },
        {
          title: "Integrations",
          body: "Configure approved accounting, CRM, analytics, and messaging integrations.",
        },
        {
          title: "Branding",
          body: "Control customer-facing logo, palette, and communication identity.",
        },
      ]}
    />
  );
}
