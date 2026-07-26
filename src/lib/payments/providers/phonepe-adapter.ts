import { z } from "zod";
import { ConfigurationError } from "../core/errors";
import type { PaymentProviderAdapter } from "../core/provider-interface";
import type {
  NormalisedWebhookEvent,
  ProviderCapability,
  ProviderConfiguration,
  ProviderEnvironment,
  ProviderRequest,
  ProviderResponse,
} from "../core/types";
import { logServerEvent } from "../../observability/logger";

const oauthPath = "v1/oauth/token";
const subscriptionCreatePath = "v3/recurring/subscription/create";
const tokenRefreshSkewMs = 30_000;

const configurationSchema = z
  .object({
    PHONEPE_ENV: z
      .enum(["UAT", "PRODUCTION", "uat", "production"])
      .transform((value) => value.toUpperCase() as "UAT" | "PRODUCTION"),
    PHONEPE_CLIENT_ID: z.string().min(1),
    PHONEPE_CLIENT_SECRET: z.string().min(1),
    PHONEPE_CLIENT_VERSION: z.string().min(1),
    PHONEPE_TEST_MID: z.string().min(1),
    PHONEPE_BASE_URL: z.url().optional(),
    PHONEPE_OAUTH_URL: z.url().optional(),
    PHONEPE_SUBSCRIPTION_URL: z.url().optional(),
  })
  .refine(
    (value) =>
      Boolean(value.PHONEPE_BASE_URL) ||
      Boolean(value.PHONEPE_OAUTH_URL && value.PHONEPE_SUBSCRIPTION_URL),
    {
      message:
        "PhonePe requires a base URL or separate OAuth and Subscription URLs.",
    },
  );

export const phonePeSubscriptionCreateSchema = z.object({
  merchantSubscriptionId: z.string().min(1).max(63),
  merchantUserId: z.string().min(1).max(63),
  subscriptionName: z.string().min(1).max(100),
  amount: z.number().int().positive(),
  currency: z.literal("INR").default("INR"),
  frequency: z.enum([
    "DAILY",
    "WEEKLY",
    "FORTNIGHTLY",
    "MONTHLY",
    "BIMONTHLY",
    "QUARTERLY",
    "HALFYEARLY",
    "YEARLY",
    "ON_DEMAND",
  ]),
  duration: z.number().int().positive(),
  callbackUrl: z.url(),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional(),
});

const oauthResponseSchema = z
  .object({
    access_token: z.string().min(1),
    expires_at: z.number().positive().optional(),
    expires_in: z.number().positive().optional(),
  })
  .refine((value) => value.expires_at || value.expires_in, {
    message: "OAuth response must include token expiry.",
  });

const subscriptionResponseSchema = z
  .object({
    success: z.boolean().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
    data: z
      .object({
        subscriptionId: z.string().min(1).optional(),
        merchantSubscriptionId: z.string().min(1).optional(),
        state: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

type PhonePeConfiguration = z.infer<typeof configurationSchema>;
type Fetch = typeof fetch;

type CachedToken = {
  accessToken: string;
  expiresAtMs: number;
};

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    throw new Error("PhonePe returned a non-JSON response.");
  }
};

const endpoint = (baseUrl: string, path: string) =>
  new URL(path, `${baseUrl.replace(/\/+$/, "")}/`).toString();

export class PhonePeAdapter implements PaymentProviderAdapter {
  readonly capabilities = new Set<ProviderCapability>([
    "upi_autopay",
    "sandbox",
  ]);
  readonly config: ProviderConfiguration;

  private readonly settings: PhonePeConfiguration;
  private readonly fetcher: Fetch;
  private cachedToken?: CachedToken;
  private tokenRequest?: Promise<CachedToken>;

  constructor(
    environment: ProviderEnvironment,
    env: Record<string, string | undefined> = process.env,
    fetcher: Fetch = fetch,
  ) {
    const parsed = configurationSchema.safeParse(env);
    if (!parsed.success)
      throw new ConfigurationError(
        "phonepe",
        "PhonePe configuration is missing or invalid.",
      );

    this.settings = parsed.data;
    this.fetcher = fetcher;
    const configuredEnvironment: ProviderEnvironment =
      parsed.data.PHONEPE_ENV === "UAT" ? "sandbox" : "production";
    if (configuredEnvironment !== environment)
      throw new ConfigurationError(
        "phonepe",
        "PhonePe environment does not match the provider environment.",
      );

    this.config = {
      provider: "phonepe" as const,
      environment: configuredEnvironment,
      baseUrl:
        parsed.data.PHONEPE_BASE_URL ?? parsed.data.PHONEPE_SUBSCRIPTION_URL,
      publicIdentifier: parsed.data.PHONEPE_CLIENT_ID,
      secretReference: "PHONEPE_CLIENT_SECRET",
      productionApproved: false,
    };
  }

  private async requestToken(): Promise<CachedToken> {
    const body = new URLSearchParams({
      client_id: this.settings.PHONEPE_CLIENT_ID,
      client_secret: this.settings.PHONEPE_CLIENT_SECRET,
      client_version: this.settings.PHONEPE_CLIENT_VERSION,
      grant_type: "client_credentials",
    });
    logServerEvent("info", "phonepe.oauth.requested", {
      environment: this.config.environment,
    });

    const response = await this.fetcher(
      this.settings.PHONEPE_OAUTH_URL ??
        endpoint(this.settings.PHONEPE_BASE_URL!, oauthPath),
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    const raw = await readJson(response);
    if (!response.ok) {
      logServerEvent("warn", "phonepe.oauth.failed", {
        environment: this.config.environment,
        statusCode: response.status,
      });
      throw new Error("PhonePe authentication failed.");
    }

    const parsed = oauthResponseSchema.safeParse(raw);
    if (!parsed.success)
      throw new Error("PhonePe returned an invalid OAuth response.");

    const now = Date.now();
    const expiryValue = parsed.data.expires_at;
    const expiresAtMs = expiryValue
      ? expiryValue > 10_000_000_000
        ? expiryValue
        : expiryValue * 1000
      : now + (parsed.data.expires_in ?? 0) * 1000;

    logServerEvent("info", "phonepe.oauth.succeeded", {
      environment: this.config.environment,
      expiresAt: new Date(expiresAtMs).toISOString(),
    });
    return { accessToken: parsed.data.access_token, expiresAtMs };
  }

  private async accessToken(): Promise<string> {
    const now = Date.now();
    if (
      this.cachedToken &&
      this.cachedToken.expiresAtMs - tokenRefreshSkewMs > now
    )
      return this.cachedToken.accessToken;

    this.tokenRequest ??= this.requestToken();
    try {
      this.cachedToken = await this.tokenRequest;
      return this.cachedToken.accessToken;
    } finally {
      this.tokenRequest = undefined;
    }
  }

  async authenticate() {
    await this.accessToken();
  }

  async createMandate(request: ProviderRequest): Promise<ProviderResponse> {
    if (request.environment !== this.config.environment)
      throw new ConfigurationError(
        "phonepe",
        "Request environment does not match PhonePe configuration.",
      );

    const payload = phonePeSubscriptionCreateSchema.safeParse(request.payload);
    if (!payload.success)
      return {
        ok: false,
        provider: "phonepe",
        status: "failed",
        safeMessage: "PhonePe subscription request validation failed.",
      };

    const accessToken = await this.accessToken();
    logServerEvent("info", "phonepe.subscription_create.requested", {
      organisationId: request.organisationId,
      idempotencyKey: request.idempotencyKey,
      environment: this.config.environment,
      merchantSubscriptionId: payload.data.merchantSubscriptionId,
    });
    const response = await this.fetcher(
      this.settings.PHONEPE_SUBSCRIPTION_URL ??
        endpoint(this.settings.PHONEPE_BASE_URL!, subscriptionCreatePath),
      {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `O-Bearer ${accessToken}`,
          "content-type": "application/json",
          "x-merchant-id": this.settings.PHONEPE_TEST_MID,
          "x-idempotency-key": request.idempotencyKey,
        },
        body: JSON.stringify({
          merchantId: this.settings.PHONEPE_TEST_MID,
          ...payload.data,
        }),
      },
    );
    const raw = await readJson(response);
    const parsed = subscriptionResponseSchema.safeParse(raw);
    if (!parsed.success)
      throw new Error("PhonePe returned an invalid subscription response.");

    const accepted =
      response.ok &&
      parsed.data.success !== false &&
      parsed.data.code !== "FAILURE";
    const reference =
      parsed.data.data?.subscriptionId ??
      parsed.data.data?.merchantSubscriptionId ??
      payload.data.merchantSubscriptionId;

    logServerEvent(
      accepted ? "info" : "warn",
      accepted
        ? "phonepe.subscription_create.succeeded"
        : "phonepe.subscription_create.failed",
      {
        organisationId: request.organisationId,
        environment: this.config.environment,
        statusCode: response.status,
        providerCode: parsed.data.code,
        reference,
      },
    );
    return {
      ok: accepted,
      provider: "phonepe",
      reference,
      status: accepted ? "pending_authorisation" : "failed",
      data: parsed.data,
      safeMessage: accepted
        ? "PhonePe subscription created."
        : "PhonePe subscription creation failed.",
    };
  }

  private unsupported(operation: string): never {
    throw new ConfigurationError(
      "phonepe",
      `PhonePe operation "${operation}" is not enabled by the Standard Checkout Autopay adapter.`,
    );
  }

  async createCustomer(): Promise<ProviderResponse> {
    return this.unsupported("createCustomer");
  }

  async authoriseMandate(): Promise<ProviderResponse> {
    return this.unsupported("authoriseMandate");
  }

  async getMandateStatus(): Promise<ProviderResponse> {
    return this.unsupported("getMandateStatus");
  }

  async pauseMandate(): Promise<ProviderResponse> {
    return this.unsupported("pauseMandate");
  }

  async resumeMandate(): Promise<ProviderResponse> {
    return this.unsupported("resumeMandate");
  }

  async cancelMandate(): Promise<ProviderResponse> {
    return this.unsupported("cancelMandate");
  }

  async initiateRecurringDebit(): Promise<ProviderResponse> {
    return this.unsupported("initiateRecurringDebit");
  }

  async initiateOneTimePayment(): Promise<ProviderResponse> {
    return this.unsupported("initiateOneTimePayment");
  }

  async getPaymentStatus(): Promise<ProviderResponse> {
    return this.unsupported("getPaymentStatus");
  }

  async refund(): Promise<ProviderResponse> {
    return this.unsupported("refund");
  }

  async getSettlements(): Promise<ProviderResponse> {
    return this.unsupported("getSettlements");
  }

  async verifyWebhook() {
    return false;
  }

  async normaliseWebhook(): Promise<NormalisedWebhookEvent> {
    return this.unsupported("normaliseWebhook");
  }

  async healthCheck(): Promise<ProviderResponse> {
    try {
      await this.authenticate();
      return {
        ok: true,
        provider: "phonepe",
        safeMessage: "PhonePe authentication succeeded.",
      };
    } catch {
      return {
        ok: false,
        provider: "phonepe",
        safeMessage: "PhonePe authentication failed.",
      };
    }
  }
}
