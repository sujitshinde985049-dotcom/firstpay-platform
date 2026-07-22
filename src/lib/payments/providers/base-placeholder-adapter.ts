/* eslint-disable @typescript-eslint/no-unused-vars -- interface placeholders intentionally reject before using provider payloads */
import type { PaymentProviderAdapter } from "../core/provider-interface";
import type {
  NormalisedWebhookEvent,
  ProviderCapability,
  ProviderConfiguration,
  ProviderRequest,
  ProviderResponse,
} from "../core/types";
import { ConfigurationError } from "../core/errors";
export abstract class PlaceholderAdapter implements PaymentProviderAdapter {
  abstract readonly config: ProviderConfiguration;
  abstract readonly capabilities: ReadonlySet<ProviderCapability>;
  protected blocked(): never {
    throw new ConfigurationError(
      this.config.provider,
      "Provider operation is blocked until official API documentation, required configuration, sandbox credentials, and sandbox verification are complete.",
    );
  }
  async authenticate() {
    this.assertConfigured();
  }
  protected assertConfigured() {
    if (!this.config.baseUrl || !this.config.secretReference)
      throw new ConfigurationError(
        this.config.provider,
        "Required provider configuration is missing.",
      );
    if (
      this.config.environment === "production" &&
      !this.config.productionApproved
    )
      throw new ConfigurationError(
        this.config.provider,
        "Production activation requires Super Admin approval and verified credential encryption.",
      );
  }
  async createCustomer(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async createMandate(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async authoriseMandate(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async getMandateStatus(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async pauseMandate(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async resumeMandate(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async cancelMandate(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async initiateRecurringDebit(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async initiateOneTimePayment(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async getPaymentStatus(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async refund(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async getSettlements(_r: ProviderRequest): Promise<ProviderResponse> {
    return this.blocked();
  }
  async verifyWebhook(_raw: string, _headers: Headers) {
    return false;
  }
  async normaliseWebhook(
    _raw: string,
    _headers: Headers,
  ): Promise<NormalisedWebhookEvent> {
    return this.blocked();
  }
  async healthCheck(): Promise<ProviderResponse> {
    try {
      this.assertConfigured();
      return {
        ok: true,
        provider: this.config.provider,
        safeMessage:
          "Configuration present; provider connectivity not sandbox-tested.",
      };
    } catch {
      return {
        ok: false,
        provider: this.config.provider,
        safeMessage: "Provider is misconfigured.",
      };
    }
  }
}
