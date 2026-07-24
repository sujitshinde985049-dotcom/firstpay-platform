import { PlaceholderAdapter } from "../providers/base-placeholder-adapter";
import type {
  NormalisedWebhookEvent,
  ProviderCapability,
  ProviderRequest,
  ProviderResponse,
} from "../core/types";
export type MockScenario =
  | "mandate_success"
  | "mandate_rejection"
  | "mandate_pending"
  | "payment_success"
  | "payment_failure"
  | "timeout"
  | "delayed_webhook"
  | "duplicate_webhook"
  | "settlement_success"
  | "reconciliation_mismatch";
export class MockProvider extends PlaceholderAdapter {
  readonly config = {
    provider: "mock" as const,
    environment: "sandbox" as const,
    baseUrl: "internal://mock",
    secretReference: "mock-only",
    productionApproved: false,
  };
  readonly capabilities = new Set<ProviderCapability>([
    "upi_autopay",
    "e_nach",
    "recurring_debit",
    "one_time_payment",
    "refund",
    "settlement",
    "mandate_pause",
    "mandate_resume",
    "mandate_cancel",
    "webhook",
    "sandbox",
  ]);
  private result(r: ProviderRequest): ProviderResponse {
    const s =
      (r.payload as { scenario?: MockScenario })?.scenario ?? "payment_success";
    if (s === "timeout") throw new Error("MOCK_TIMEOUT");
    const failed = s.includes("failure") || s.includes("rejection");
    return {
      ok: !failed,
      provider: "mock",
      reference: `mock_${r.idempotencyKey.slice(0, 12)}`,
      status: s.includes("mandate")
        ? s === "mandate_success"
          ? "active"
          : s === "mandate_pending"
            ? "pending_authorisation"
            : "rejected"
        : s === "settlement_success"
          ? "settled"
          : failed
            ? "failed"
            : "successful",
      safeMessage: `MOCK ONLY: ${s}`,
    };
  }
  async createCustomer(r: ProviderRequest) {
    return this.result(r);
  }
  async createMandate(r: ProviderRequest) {
    return this.result(r);
  }
  async authoriseMandate(r: ProviderRequest) {
    return this.result(r);
  }
  async getMandateStatus(r: ProviderRequest) {
    return this.result(r);
  }
  async pauseMandate(r: ProviderRequest) {
    return this.result(r);
  }
  async resumeMandate(r: ProviderRequest) {
    return this.result(r);
  }
  async cancelMandate(r: ProviderRequest) {
    return this.result(r);
  }
  async initiateRecurringDebit(r: ProviderRequest) {
    return this.result(r);
  }
  async initiateOneTimePayment(r: ProviderRequest) {
    return this.result(r);
  }
  async getPaymentStatus(r: ProviderRequest) {
    return this.result(r);
  }
  async refund(r: ProviderRequest) {
    return this.result(r);
  }
  async getSettlements(r: ProviderRequest) {
    return this.result(r);
  }
  async verifyWebhook(_r: string, h: Headers) {
    return h.get("x-firstpay-mock-signature") === "mock-test-only";
  }
  async normaliseWebhook(raw: string): Promise<NormalisedWebhookEvent> {
    const x = JSON.parse(raw) as { id: string; type: string };
    return {
      provider: "mock",
      eventId: x.id,
      eventType: x.type,
      occurredAt: new Date(0).toISOString(),
      environment: "sandbox",
      safeMetadata: { mock: true },
    };
  }
  async healthCheck() {
    return { ok: true, provider: "mock" as const, safeMessage: "MOCK ONLY" };
  }
}
