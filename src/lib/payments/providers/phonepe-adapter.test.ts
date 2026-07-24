import { beforeEach, describe, expect, it, vi } from "vitest";
import { PhonePeAdapter } from "./phonepe-adapter";

const environment = {
  PHONEPE_ENV: "UAT",
  PHONEPE_CLIENT_ID: "test-client-id",
  PHONEPE_CLIENT_SECRET: "test-client-secret",
  PHONEPE_CLIENT_VERSION: "1",
  PHONEPE_TEST_MID: "TEST-MID",
  PHONEPE_BASE_URL: "https://phonepe.test/apis/pg-sandbox/",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const request = {
  organisationId: "00000000-0000-4000-8000-000000000001",
  idempotencyKey: "phonepe-subscription-idempotency-key",
  environment: "sandbox" as const,
  operation: "create_mandate",
  payload: {
    merchantSubscriptionId: "subscription-1",
    merchantUserId: "user-1",
    subscriptionName: "FirstPay plan",
    amount: 10_000,
    currency: "INR" as const,
    frequency: "MONTHLY" as const,
    duration: 12,
    callbackUrl: "https://merchant.test/phonepe/callback",
  },
};

describe("PhonePeAdapter", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("uses the V2 OAuth client credentials contract and caches the token", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        jsonResponse({ access_token: "oauth-token", expires_in: 3600 }),
      );
    const adapter = new PhonePeAdapter("sandbox", environment, fetcher);

    await adapter.authenticate();
    await adapter.authenticate();

    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, options] = fetcher.mock.calls[0]!;
    expect(url).toBe("https://phonepe.test/apis/pg-sandbox/v1/oauth/token");
    expect(options?.method).toBe("POST");
    expect(options?.headers).toEqual({
      "content-type": "application/x-www-form-urlencoded",
    });
    const body = options?.body as URLSearchParams;
    expect(body.get("client_id")).toBe("test-client-id");
    expect(body.get("client_secret")).toBe("test-client-secret");
    expect(body.get("client_version")).toBe("1");
    expect(body.get("grant_type")).toBe("client_credentials");
  });

  it("refreshes an OAuth token that is at or near expiry", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({ access_token: "expiring-token", expires_in: 1 }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ access_token: "fresh-token", expires_in: 3600 }),
      );
    const adapter = new PhonePeAdapter("sandbox", environment, fetcher);

    await adapter.authenticate();
    await adapter.authenticate();

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("creates a V3 subscription with O-Bearer and the configured test MID", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({ access_token: "oauth-token", expires_in: 3600 }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          code: "SUCCESS",
          data: {
            subscriptionId: "phonepe-subscription-id",
            state: "PENDING",
          },
        }),
      );
    const adapter = new PhonePeAdapter("sandbox", environment, fetcher);

    const result = await adapter.createMandate(request);

    expect(result).toMatchObject({
      ok: true,
      provider: "phonepe",
      reference: "phonepe-subscription-id",
      status: "pending_authorisation",
    });
    const [url, options] = fetcher.mock.calls[1]!;
    expect(url).toBe(
      "https://phonepe.test/apis/pg-sandbox/v3/recurring/subscription/create",
    );
    expect(options?.headers).toMatchObject({
      authorization: "O-Bearer oauth-token",
      "x-merchant-id": "TEST-MID",
      "x-idempotency-key": request.idempotencyKey,
    });
    expect(JSON.parse(options?.body as string)).toMatchObject({
      merchantId: "TEST-MID",
      merchantSubscriptionId: "subscription-1",
      amount: 10_000,
    });
  });

  it("rejects an invalid subscription before making a network call", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const adapter = new PhonePeAdapter("sandbox", environment, fetcher);

    const result = await adapter.createMandate({
      ...request,
      payload: { ...request.payload, amount: 0 },
    });

    expect(result.ok).toBe(false);
    expect(result.safeMessage).toBe(
      "PhonePe subscription request validation failed.",
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
});
