export const missingWebhookConfigurationMessage =
  "Webhook verification is not configured. Incoming PhonePe webhooks will remain disabled until official webhook authentication details are provided.";

export type WebhookSecretDecision =
  | {
      ok: true;
      configured: boolean;
      encryptedSecret?: string;
    }
  | {
      ok: false;
      message: string;
    };

export function resolvePhonePeWebhookSecret({
  environment,
  submittedSecret,
  existingEncryptedSecret,
  encrypt,
}: {
  environment: "sandbox" | "production";
  submittedSecret: string;
  existingEncryptedSecret: unknown;
  encrypt: (secret: string) => string;
}): WebhookSecretDecision {
  if (submittedSecret)
    return {
      ok: true,
      configured: true,
      encryptedSecret: encrypt(submittedSecret),
    };

  if (
    typeof existingEncryptedSecret === "string" &&
    existingEncryptedSecret.length > 0
  )
    return {
      ok: true,
      configured: true,
      encryptedSecret: existingEncryptedSecret,
    };

  if (environment === "production")
    return {
      ok: false,
      message:
        "Production PhonePe webhook activation requires official webhook authentication details.",
    };

  return { ok: true, configured: false };
}
