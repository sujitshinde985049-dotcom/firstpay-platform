export type PaymentProvider =
  "razorpay" | "phonepe" | "cashfree" | "jio-pg" | "sabpaisa" | "mock";
export type ProviderEnvironment = "sandbox" | "production";
export type ProviderCapability =
  | "upi_autopay"
  | "e_nach"
  | "recurring_debit"
  | "one_time_payment"
  | "refund"
  | "settlement"
  | "mandate_pause"
  | "mandate_resume"
  | "mandate_cancel"
  | "webhook"
  | "sandbox";
export type MandateMethod = "upi_autopay" | "e_nach";
export type MandateStatus =
  | "created"
  | "pending_authorisation"
  | "active"
  | "paused"
  | "failed"
  | "rejected"
  | "cancelled"
  | "expired"
  | "completed";
export type PaymentStatus =
  | "created"
  | "scheduled"
  | "processing"
  | "authorised"
  | "successful"
  | "pending"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";
export type SettlementStatus =
  "created" | "processing" | "settled" | "failed" | "reconciled";
export type ProviderRequest<T = unknown> = {
  organisationId: string;
  idempotencyKey: string;
  environment: ProviderEnvironment;
  operation: string;
  payload: T;
};
export type ProviderResponse<T = unknown> = {
  ok: boolean;
  provider: PaymentProvider;
  reference?: string;
  status?: MandateStatus | PaymentStatus | SettlementStatus;
  data?: T;
  safeMessage?: string;
};
export type ProviderError = {
  provider: PaymentProvider;
  code: string;
  category:
    | "configuration"
    | "authentication"
    | "validation"
    | "provider"
    | "timeout"
    | "security";
  retryable: boolean;
  safeMessage: string;
};
export type NormalisedWebhookEvent = {
  provider: PaymentProvider;
  eventId: string;
  eventType: string;
  occurredAt: string;
  environment: ProviderEnvironment;
  providerReference?: string;
  status?: MandateStatus | PaymentStatus | SettlementStatus;
  safeMetadata: Record<string, unknown>;
};
export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableCategories: ProviderError["category"][];
  allowCrossProviderDebitRetry: false;
};
export type RoutingDecision = {
  provider: PaymentProvider;
  environment: ProviderEnvironment;
  reason: string[];
  automatic: boolean;
  fallback?: PaymentProvider;
};
export type ProviderConfiguration = {
  provider: PaymentProvider;
  environment: ProviderEnvironment;
  baseUrl?: string;
  publicIdentifier?: string;
  secretReference?: string;
  webhookSecretReference?: string;
  productionApproved: boolean;
};
