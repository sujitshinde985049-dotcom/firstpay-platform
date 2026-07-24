import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import { PhonePeConfigurationForm } from "./configuration-form";

const settingKey = "provider.phonepe";

export default async function PhonePeEnvironmentPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", settingKey)
    .maybeSingle();
  if (error) throw new Error("Unable to load PhonePe configuration.");

  const value =
    data?.value && typeof data.value === "object"
      ? (data.value as Record<string, unknown>)
      : {};
  const stringValue = (key: string) =>
    typeof value[key] === "string" ? value[key] : "";
  const environment =
    value.environment === "production" ? "production" : "sandbox";

  return (
    <div>
      <Link
        href="/super-admin/providers/phonepe"
        className="mb-4 inline-flex text-sm font-semibold text-blue-700 hover:underline"
      >
        ← PhonePe provider
      </Link>
      <PageHeader
        title="PhonePe environment configuration"
        description="Manage OAuth, merchant, subscription, and webhook configuration for PhonePe PG."
      />
      <PhonePeConfigurationForm
        configuration={{
          environment,
          clientId: stringValue("client_id"),
          clientVersion: stringValue("client_version"),
          merchantId: stringValue("merchant_id"),
          oauthUrl: stringValue("oauth_url"),
          subscriptionUrl: stringValue("subscription_url"),
          hasClientSecret:
            typeof value.client_secret_encrypted === "string" &&
            value.client_secret_encrypted.length > 0,
          hasWebhookSecret:
            typeof value.webhook_secret_encrypted === "string" &&
            value.webhook_secret_encrypted.length > 0,
        }}
      />
    </div>
  );
}
