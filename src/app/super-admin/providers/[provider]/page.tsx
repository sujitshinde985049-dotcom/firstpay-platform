import { notFound } from "next/navigation";
import { SettingsPanel } from "@/components/dashboard/settings-panel";
const names: Record<string, string> = {
  razorpay: "Razorpay",
  phonepe: "PhonePe PG",
  cashfree: "Cashfree",
  "jio-pg": "Jio PG",
  sabpaisa: "SabPaisa",
};
export default async function Page({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  const name = names[provider];
  if (!name) notFound();
  return (
    <SettingsPanel
      title={`${name} configuration`}
      description="Configuration metadata only. Secrets are external references and never displayed."
      sections={[
        {
          title: "Environment",
          body: "Sandbox and production credentials, references, records, and webhook secrets remain strictly separated.",
          href:
            provider === "phonepe"
              ? "/super-admin/providers/phonepe/environment"
              : undefined,
        },
        {
          title: "Capabilities",
          body: "Enable only capabilities verified in official documentation and tested in the provider sandbox.",
        },
        {
          title: "Organisation assignments",
          body: "Assign provider priority, default, backup, methods, and client-specific restrictions.",
        },
        {
          title: "Production gate",
          body: "Live mode requires encryption availability, sandbox evidence, health checks, and explicit Super Admin approval.",
        },
      ]}
    />
  );
}
