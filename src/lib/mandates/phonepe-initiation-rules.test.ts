import { describe, expect, it } from "vitest";
import {
  buildPhonePeMandatePayload,
  extractPhonePeAuthorizationUrl,
  firstDatabaseWriteError,
  phonePeMandateMetadata,
  type PhonePeMandateInput,
} from "./phonepe-initiation-rules";

const mandate: PhonePeMandateInput = {
  id: "00000000-0000-4000-8000-000000000001",
  organisationId: "00000000-0000-4000-8000-000000000002",
  customerId: "00000000-0000-4000-8000-000000000003",
  reference: "emi",
  amount: 500,
  frequency: "monthly",
  startsAt: "2026-08-01T00:00:00.000Z",
  endsAt: "2027-08-01T00:00:00.000Z",
  metadata: {},
};

describe("PhonePe mandate initiation rules", () => {
  it("builds the PhonePe subscription request in minor currency units", () => {
    expect(
      buildPhonePeMandatePayload(
        mandate,
        `https://firstpay.example/phonepe/return/${mandate.id}`,
      ),
    ).toMatchObject({
      merchantSubscriptionId: mandate.id,
      merchantUserId: mandate.customerId,
      subscriptionName: "emi",
      amount: 50_000,
      currency: "INR",
      frequency: "MONTHLY",
      duration: 365,
      callbackUrl: `https://firstpay.example/phonepe/return/${mandate.id}`,
    });
  });

  it("extracts a trusted authorization URL from the provider response", () => {
    expect(
      extractPhonePeAuthorizationUrl({
        data: {
          redirectUrl: "https://mercury.phonepe.com/authorize/subscription",
        },
      }),
    ).toBe("https://mercury.phonepe.com/authorize/subscription");
  });

  it("rejects an untrusted provider redirect", () => {
    expect(
      extractPhonePeAuthorizationUrl({
        data: { redirectUrl: "https://attacker.example/authorize" },
      }),
    ).toBeNull();
  });

  it("records PhonePe provider intent before the external request starts", () => {
    expect(
      phonePeMandateMetadata({ source: "dashboard" }, "initialising"),
    ).toEqual({
      source: "dashboard",
      provider: "phonepe",
      provider_status: "initialising",
    });
  });

  it("preserves the authorization URL in mandate metadata", () => {
    expect(
      phonePeMandateMetadata(
        {},
        "pending_authorisation",
        "https://mercury.phonepe.com/authorize/subscription",
      ),
    ).toMatchObject({
      provider: "phonepe",
      provider_status: "pending_authorisation",
      authorization_url: "https://mercury.phonepe.com/authorize/subscription",
    });
  });

  it("detects a failed Supabase persistence result", () => {
    const databaseError = { code: "23503" };
    expect(
      firstDatabaseWriteError([
        { error: null },
        { error: databaseError },
        { error: null },
      ]),
    ).toBe(databaseError);
    expect(firstDatabaseWriteError([{ error: null }])).toBeNull();
  });
});
