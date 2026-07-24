import { describe, expect, it } from "vitest";
import { ProviderRegistry } from "./provider-registry";
import { selectProvider } from "./provider-router";
import { requestHash, idempotencyKey } from "./idempotency";
import { CircuitBreaker } from "./circuit-breaker";
import { MockProvider } from "../mocks/mock-provider";
import { ConfiguredPlaceholderAdapter } from "../providers/adapters";
import { verifyDocumentedWebhook } from "../webhooks/gateway";
import { createHmac } from "node:crypto";
describe("provider orchestration", () => {
  it("registers, enables, and validates capabilities", () => {
    const r = new ProviderRegistry();
    r.register(new MockProvider(), true);
    expect(r.supports("mock", "upi_autopay")).toBe(true);
    r.disable("mock");
    expect(r.supports("mock", "upi_autopay")).toBe(false);
  });
  it("routes by health, capability, default and priority", () => {
    const r = new ProviderRegistry();
    r.register(new MockProvider(), true);
    const d = selectProvider(
      r,
      [
        {
          provider: "mock",
          priority: 1,
          environment: "sandbox",
          healthy: true,
          default: true,
        },
      ],
      "recurring_debit",
      "sandbox",
    );
    expect(d.provider).toBe("mock");
    expect(d.automatic).toBe(true);
  });
  it("rejects unavailable manual selection", () => {
    const r = new ProviderRegistry();
    r.register(new MockProvider(), false);
    expect(() =>
      selectProvider(
        r,
        [
          {
            provider: "mock",
            priority: 1,
            environment: "sandbox",
            healthy: true,
            default: true,
          },
        ],
        "refund",
        "sandbox",
        "mock",
      ),
    ).toThrow();
  });
  it("creates deterministic idempotency hashes", () => {
    expect(requestHash({ a: 1 })).toBe(requestHash({ a: 1 }));
    expect(idempotencyKey(["org", "debit", "1"])).toHaveLength(64);
  });
  it("opens and resets the circuit breaker", () => {
    const c = new CircuitBreaker(2, 10);
    c.failure(0);
    c.failure(0);
    expect(c.canRequest(5)).toBe(false);
    expect(c.canRequest(11)).toBe(true);
  });
  it("keeps sandbox and production configuration separate", () => {
    const a = new ConfiguredPlaceholderAdapter(
      "razorpay",
      "RAZORPAY",
      "sandbox",
      {},
    );
    expect(a.config.environment).toBe("sandbox");
    expect(a.config.productionApproved).toBe(false);
  });
  it("runs deterministic mock success and failure", async () => {
    const m = new MockProvider();
    const base = {
      organisationId: "o",
      idempotencyKey: "abc123456789",
      environment: "sandbox" as const,
      operation: "pay",
    };
    expect(
      (
        await m.initiateRecurringDebit({
          ...base,
          payload: { scenario: "payment_success" },
        })
      ).ok,
    ).toBe(true);
    expect(
      (
        await m.initiateRecurringDebit({
          ...base,
          payload: { scenario: "payment_failure" },
        })
      ).ok,
    ).toBe(false);
  });
  it("rejects invalid webhook signatures", () =>
    expect(
      verifyDocumentedWebhook("razorpay", "{}", new Headers(), "secret"),
    ).toBe(false));
  it("verifies documented Razorpay signature", () => {
    const raw = "{}";
    const sig = createHmac("sha256", "secret").update(raw).digest("hex");
    expect(
      verifyDocumentedWebhook(
        "razorpay",
        raw,
        new Headers({ "x-razorpay-signature": sig }),
        "secret",
      ),
    ).toBe(true);
  });
  it("rejects undocumented production webhook contracts", () =>
    expect(
      verifyDocumentedWebhook("jio-pg", "{}", new Headers(), "secret"),
    ).toBe(false));
});
