"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { recordAuditEvent } from "@/lib/admin/audit";
import { requireSuperAdmin } from "@/lib/auth/permissions";
import { encryptProviderSecret } from "@/lib/security/provider-secrets";
import { createClient } from "@/lib/supabase/server";
import { resolvePhonePeWebhookSecret } from "./webhook-policy";

const settingKey = "provider.phonepe";

const formSchema = z.object({
  environment: z.enum(["sandbox", "production"]),
  clientId: z.string().trim().min(1, "Client ID is required.").max(255),
  clientSecret: z.string().max(4096),
  clientVersion: z
    .string()
    .trim()
    .min(1, "Client Version is required.")
    .max(50),
  merchantId: z.string().trim().min(1, "Merchant ID is required.").max(255),
  oauthUrl: z.url("Enter a valid HTTPS OAuth URL."),
  subscriptionUrl: z.url("Enter a valid HTTPS Subscription URL."),
  webhookSecret: z.string().max(4096),
});

export type PhonePeConfigurationState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "");

export async function savePhonePeConfiguration(
  _previousState: PhonePeConfigurationState,
  formData: FormData,
): Promise<PhonePeConfigurationState> {
  await requireSuperAdmin();
  const parsed = formSchema.safeParse({
    environment: text(formData, "environment"),
    clientId: text(formData, "client_id"),
    clientSecret: text(formData, "client_secret"),
    clientVersion: text(formData, "client_version"),
    merchantId: text(formData, "merchant_id"),
    oauthUrl: text(formData, "oauth_url"),
    subscriptionUrl: text(formData, "subscription_url"),
    webhookSecret: text(formData, "webhook_secret"),
  });
  if (!parsed.success)
    return {
      status: "error",
      message: "Review the highlighted configuration fields.",
      errors: parsed.error.flatten().fieldErrors,
    };

  const values = parsed.data;
  if (
    new URL(values.oauthUrl).protocol !== "https:" ||
    new URL(values.subscriptionUrl).protocol !== "https:"
  )
    return {
      status: "error",
      message: "Provider URLs must use HTTPS.",
    };

  const supabase = await createClient();
  const { data: existing, error: loadError } = await supabase
    .from("platform_settings")
    .select("value")
    .eq("key", settingKey)
    .maybeSingle();
  if (loadError)
    return {
      status: "error",
      message: "Unable to load the existing PhonePe configuration.",
    };

  const current =
    existing?.value && typeof existing.value === "object"
      ? (existing.value as Record<string, unknown>)
      : {};
  const clientSecretEncrypted = values.clientSecret
    ? encryptProviderSecret(values.clientSecret)
    : current.client_secret_encrypted;
  if (typeof clientSecretEncrypted !== "string")
    return {
      status: "error",
      message: "Client Secret is required.",
      errors: { clientSecret: ["Client Secret is required."] },
    };
  const webhookDecision = resolvePhonePeWebhookSecret({
    environment: values.environment,
    submittedSecret: values.webhookSecret,
    existingEncryptedSecret: current.webhook_secret_encrypted,
    encrypt: encryptProviderSecret,
  });
  if (!webhookDecision.ok)
    return {
      status: "error",
      message: webhookDecision.message,
      errors: { webhookSecret: [webhookDecision.message] },
    };

  const { error } = await supabase.from("platform_settings").upsert(
    {
      key: settingKey,
      is_public: false,
      value: {
        environment: values.environment,
        client_id: values.clientId,
        client_secret_encrypted: clientSecretEncrypted,
        client_version: values.clientVersion,
        merchant_id: values.merchantId,
        oauth_url: values.oauthUrl,
        subscription_url: values.subscriptionUrl,
        ...(webhookDecision.encryptedSecret
          ? {
              webhook_secret_encrypted: webhookDecision.encryptedSecret,
            }
          : {}),
        webhook_verification_configured: webhookDecision.configured,
        updated_at: new Date().toISOString(),
      },
    },
    { onConflict: "key" },
  );
  if (error)
    return {
      status: "error",
      message: "Unable to save the PhonePe configuration.",
    };

  await recordAuditEvent({
    action: "provider.phonepe.configuration.updated",
    entityType: "platform_settings",
    severity: values.environment === "production" ? "warning" : "info",
    metadata: {
      provider: "phonepe",
      environment: values.environment,
      clientSecretRotated: Boolean(values.clientSecret),
      webhookSecretRotated: Boolean(values.webhookSecret),
    },
  });
  revalidatePath("/super-admin/providers/phonepe");
  revalidatePath("/super-admin/providers/phonepe/environment");
  return {
    status: "success",
    message: "PhonePe configuration saved securely.",
  };
}
