import { SettingsPanel } from "@/components/dashboard/settings-panel";
export default function Page() {
  return (
    <SettingsPanel
      title="Organisation profile"
      description="Manage verified company identity and customer-facing branding."
      sections={[
        {
          title: "Company details",
          body: "Legal name, registered address, GST, CIN, support email, and operational contacts.",
        },
        {
          title: "Brand identity",
          body: "Upload a company logo and configure approved brand colours for customer communications.",
        },
        {
          title: "Compliance profile",
          body: "Legal identifiers are stored in the organisation legal profile and protected by tenant RLS.",
        },
      ]}
    />
  );
}
