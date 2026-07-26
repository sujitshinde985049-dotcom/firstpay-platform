import "server-only";
import { ConfigurationError } from "@/lib/payments/core/errors";
import { idempotencyKey, requestHash } from "@/lib/payments/core/idempotency";
import type {
  ProviderEnvironment,
  ProviderResponse,
} from "@/lib/payments/core/types";
import { PhonePeAdapter } from "@/lib/payments/providers/phonepe-adapter";
import { decryptProviderSecret } from "@/lib/security/provider-secrets";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerEvent } from "@/lib/observability/logger";
import {
  buildPhonePeMandatePayload,
  extractPhonePeAuthorizationUrl,
  firstDatabaseWriteError,
  phonePeMandateMetadata,
  type PhonePeMandateInput,
} from "./phonepe-initiation-rules";
import { phonePeReturnUrl } from "./phonepe-routes";

type PhonePeStoredConfiguration = {
  environment: "sandbox" | "production";
  client_id: string;
  client_secret_encrypted: string;
  client_version: string;
  merchant_id: string;
  oauth_url: string;
  subscription_url: string;
};

const settingKey = "provider.phonepe";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isStoredConfiguration(
  value: unknown,
): value is PhonePeStoredConfiguration {
  if (!isRecord(value)) return false;
  return (
    (value.environment === "sandbox" || value.environment === "production") &&
    typeof value.client_id === "string" &&
    typeof value.client_secret_encrypted === "string" &&
    typeof value.client_version === "string" &&
    typeof value.merchant_id === "string" &&
    typeof value.oauth_url === "string" &&
    typeof value.subscription_url === "string"
  );
}

function safeFailure(error: unknown) {
  if (
    error instanceof Error &&
    /^PhonePe .+ failed \(HTTP \d{3}\)\.$/.test(error.message)
  ) {
    return error.message;
  }
  return error instanceof ConfigurationError
    ? "PhonePe configuration is unavailable."
    : "PhonePe provider request could not be completed.";
}

async function loadPhonePeConfiguration() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("platform_settings")
    .select("value")
    .eq("key", settingKey)
    .maybeSingle();
  if (error) throw new Error("Unable to load PhonePe configuration.");

  if (isStoredConfiguration(data?.value)) {
    const value = data.value;
    return {
      environment: value.environment as ProviderEnvironment,
      env: {
        PHONEPE_ENV: value.environment === "sandbox" ? "UAT" : "PRODUCTION",
        PHONEPE_CLIENT_ID: value.client_id,
        PHONEPE_CLIENT_SECRET: decryptProviderSecret(
          value.client_secret_encrypted,
        ),
        PHONEPE_CLIENT_VERSION: value.client_version,
        PHONEPE_TEST_MID: value.merchant_id,
        PHONEPE_OAUTH_URL: value.oauth_url,
        PHONEPE_SUBSCRIPTION_URL: value.subscription_url,
      },
    };
  }
  if (data) {
    throw new ConfigurationError(
      "phonepe",
      "Stored PhonePe configuration is incomplete.",
    );
  }

  const environment: ProviderEnvironment =
    process.env.PHONEPE_ENV?.toUpperCase() === "PRODUCTION"
      ? "production"
      : "sandbox";
  return { environment, env: process.env };
}

export async function initiatePhonePeMandate(mandate: PhonePeMandateInput) {
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (error) {
    logUnhandledInitiationFailure(mandate, "admin_client", error);
    throw error;
  }

  const { data: provider, error: providerError } = await admin
    .from("payment_providers")
    .select("id")
    .eq("key", "phonepe")
    .maybeSingle();
  if (providerError || !provider) {
    const error = new Error("PhonePe provider is not registered.", {
      cause: providerError ?? undefined,
    });
    logUnhandledInitiationFailure(mandate, "provider_lookup", error);
    throw error;
  }

  const key = idempotencyKey([
    mandate.organisationId,
    mandate.id,
    "phonepe",
    "create",
  ]);
  const payloadForHash = {
    mandateId: mandate.id,
    customerId: mandate.customerId,
    amount: mandate.amount,
    frequency: mandate.frequency,
  };
  const { data: request, error: requestError } = await admin
    .from("provider_requests")
    .insert({
      organisation_id: mandate.organisationId,
      provider_id: provider.id,
      environment: "sandbox",
      operation: "mandate.create",
      idempotency_key: key,
      request_hash: requestHash(payloadForHash),
      safe_metadata: {
        mandate_id: mandate.id,
        mandate_type: "upi_autopay",
      },
    })
    .select("id")
    .single();
  if (requestError) {
    const error = new Error("Unable to record the PhonePe provider request.", {
      cause: requestError,
    });
    logUnhandledInitiationFailure(mandate, "provider_request_insert", error);
    throw error;
  }

  let environment: ProviderEnvironment = "sandbox";
  try {
    const configuration = await loadPhonePeConfiguration();
    environment = configuration.environment;
    await admin
      .from("provider_requests")
      .update({ environment })
      .eq("id", request.id);

    const callbackUrl = phonePeReturnUrl(process.env, mandate.id);
    const adapter = new PhonePeAdapter(environment, configuration.env);
    const response = await adapter.createMandate({
      organisationId: mandate.organisationId,
      idempotencyKey: key,
      environment,
      operation: "mandate.create",
      payload: buildPhonePeMandatePayload(mandate, callbackUrl),
    });
    const authorizationUrl = extractPhonePeAuthorizationUrl(response.data);
    await persistProviderResult({
      mandate,
      providerId: provider.id,
      requestId: request.id,
      environment,
      response,
      authorizationUrl,
    });

    return {
      ok: response.ok,
      authorizationUrl,
      safeMessage: response.safeMessage,
    };
  } catch (error) {
    const message = safeFailure(error);
    await persistProviderFailure({
      mandate,
      providerId: provider.id,
      requestId: request.id,
      environment,
      message,
      error,
    });
    return { ok: false, authorizationUrl: null, safeMessage: message };
  }
}

async function persistProviderResult({
  mandate,
  providerId,
  requestId,
  environment,
  response,
  authorizationUrl,
}: {
  mandate: PhonePeMandateInput;
  providerId: string;
  requestId: string;
  environment: ProviderEnvironment;
  response: ProviderResponse;
  authorizationUrl: string | null;
}) {
  const admin = createAdminClient();
  const status =
    response.status ?? (response.ok ? "pending_authorisation" : "failed");
  const metadata = phonePeMandateMetadata(
    mandate.metadata,
    status,
    authorizationUrl,
  );

  const results = await Promise.all([
    admin
      .from("provider_requests")
      .update({
        status: response.ok ? "completed" : "failed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", requestId),
    admin.from("provider_responses").insert({
      request_id: requestId,
      provider_reference: response.reference ?? null,
      status,
      safe_metadata: {
        has_authorization_url: Boolean(authorizationUrl),
      },
    }),
    admin.from("mandate_attempts").insert({
      organisation_id: mandate.organisationId,
      mandate_id: mandate.id,
      provider_id: providerId,
      environment,
      attempt_number: 1,
      provider_reference: response.reference ?? null,
      routing_reason: ["PhonePe UPI AutoPay configuration"],
      status,
      safe_failure_message: response.ok
        ? null
        : (response.safeMessage ?? "PhonePe subscription creation failed."),
    }),
    admin
      .from("mandates")
      .update({
        status: response.ok ? "pending" : "failed",
        metadata,
      })
      .eq("id", mandate.id)
      .eq("organisation_id", mandate.organisationId),
  ]);
  assertDatabaseWrites(results, "PhonePe provider result");
}

async function persistProviderFailure({
  mandate,
  providerId,
  requestId,
  environment,
  message,
  error,
}: {
  mandate: PhonePeMandateInput;
  providerId: string;
  requestId: string;
  environment: ProviderEnvironment;
  message: string;
  error: unknown;
}) {
  const admin = createAdminClient();
  logServerEvent("error", "phonepe.mandate_create.failed", {
    organisationId: mandate.organisationId,
    mandateId: mandate.id,
    environment,
    category:
      error instanceof ConfigurationError ? "configuration" : "provider",
  });

  const results = await Promise.all([
    admin
      .from("provider_requests")
      .update({ status: "failed", completed_at: new Date().toISOString() })
      .eq("id", requestId),
    admin.from("provider_errors").insert({
      organisation_id: mandate.organisationId,
      provider_id: providerId,
      request_id: requestId,
      category:
        error instanceof ConfigurationError ? "configuration" : "provider",
      code:
        error instanceof ConfigurationError
          ? "PHONEPE_CONFIGURATION"
          : "PHONEPE_REQUEST_FAILED",
      safe_message: message,
      retryable: false,
    }),
    admin.from("mandate_attempts").insert({
      organisation_id: mandate.organisationId,
      mandate_id: mandate.id,
      provider_id: providerId,
      environment,
      attempt_number: 1,
      routing_reason: ["PhonePe UPI AutoPay configuration"],
      status: "failed",
      safe_failure_message: message,
    }),
    admin
      .from("mandates")
      .update({
        status: "failed",
        metadata: phonePeMandateMetadata(mandate.metadata, "failed"),
      })
      .eq("id", mandate.id)
      .eq("organisation_id", mandate.organisationId),
  ]);
  assertDatabaseWrites(results, "PhonePe provider failure");
}

function assertDatabaseWrites(
  results: Array<{ error: unknown } | null | undefined>,
  operation: string,
) {
  const error = firstDatabaseWriteError(results);
  if (error) {
    throw new Error(`${operation} could not be persisted.`, { cause: error });
  }
}

function logUnhandledInitiationFailure(
  mandate: PhonePeMandateInput,
  stage: string,
  error: unknown,
) {
  logServerEvent("error", "phonepe.mandate_create.unhandled", {
    organisationId: mandate.organisationId,
    mandateId: mandate.id,
    stage,
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error ? error.message : "Unknown initiation error.",
    stack: error instanceof Error ? error.stack : undefined,
  });
}
