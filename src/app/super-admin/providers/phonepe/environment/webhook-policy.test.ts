import { describe, expect, it, vi } from "vitest";
import { resolvePhonePeWebhookSecret } from "./webhook-policy";

describe("PhonePe webhook configuration policy", () => {
  it("allows Sandbox configuration without a webhook secret", () => {
    const encrypt = vi.fn<(secret: string) => string>();

    expect(
      resolvePhonePeWebhookSecret({
        environment: "sandbox",
        submittedSecret: "",
        existingEncryptedSecret: undefined,
        encrypt,
      }),
    ).toEqual({ ok: true, configured: false });
    expect(encrypt).not.toHaveBeenCalled();
  });

  it("blocks Production webhook activation without a webhook secret", () => {
    const result = resolvePhonePeWebhookSecret({
      environment: "production",
      submittedSecret: "",
      existingEncryptedSecret: undefined,
      encrypt: vi.fn(),
    });

    expect(result).toEqual({
      ok: false,
      message:
        "Production PhonePe webhook activation requires official webhook authentication details.",
    });
  });

  it("preserves an existing encrypted secret when the input is blank", () => {
    const encrypt = vi.fn<(secret: string) => string>();

    expect(
      resolvePhonePeWebhookSecret({
        environment: "sandbox",
        submittedSecret: "",
        existingEncryptedSecret: "v1:existing-encrypted-secret",
        encrypt,
      }),
    ).toEqual({
      ok: true,
      configured: true,
      encryptedSecret: "v1:existing-encrypted-secret",
    });
    expect(encrypt).not.toHaveBeenCalled();
  });
});
