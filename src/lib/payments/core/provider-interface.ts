import type {
  NormalisedWebhookEvent,
  ProviderCapability,
  ProviderConfiguration,
  ProviderRequest,
  ProviderResponse,
} from "./types";
export interface PaymentProviderAdapter {
  readonly config: ProviderConfiguration;
  readonly capabilities: ReadonlySet<ProviderCapability>;
  authenticate(): Promise<void>;
  createCustomer(r: ProviderRequest): Promise<ProviderResponse>;
  createMandate(r: ProviderRequest): Promise<ProviderResponse>;
  authoriseMandate(r: ProviderRequest): Promise<ProviderResponse>;
  getMandateStatus(r: ProviderRequest): Promise<ProviderResponse>;
  pauseMandate(r: ProviderRequest): Promise<ProviderResponse>;
  resumeMandate(r: ProviderRequest): Promise<ProviderResponse>;
  cancelMandate(r: ProviderRequest): Promise<ProviderResponse>;
  initiateRecurringDebit(r: ProviderRequest): Promise<ProviderResponse>;
  initiateOneTimePayment(r: ProviderRequest): Promise<ProviderResponse>;
  getPaymentStatus(r: ProviderRequest): Promise<ProviderResponse>;
  refund(r: ProviderRequest): Promise<ProviderResponse>;
  getSettlements(r: ProviderRequest): Promise<ProviderResponse>;
  verifyWebhook(rawBody: string, headers: Headers): Promise<boolean>;
  normaliseWebhook(
    rawBody: string,
    headers: Headers,
  ): Promise<NormalisedWebhookEvent>;
  healthCheck(): Promise<ProviderResponse>;
}
