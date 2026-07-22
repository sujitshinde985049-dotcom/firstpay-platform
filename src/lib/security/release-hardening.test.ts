import { afterEach, describe, expect, it, vi } from "vitest";
import { safeInternalRedirect } from "../auth/safe-redirect";
import { parsePublicEnvironment, parseServerEnvironment } from "../env";
import { redact } from "../observability/logger";
import { UnconfiguredRateLimitAdapter } from "./rate-limit";
describe("release hardening", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("allows only internal redirects", () => {
    expect(safeInternalRedirect("/dashboard?tab=1")).toBe("/dashboard?tab=1");
    expect(safeInternalRedirect("https://evil.example")).toBe("/dashboard");
    expect(safeInternalRedirect("//evil.example")).toBe("/dashboard");
  });
  it("validates required public environment", () => {
    expect(() => parsePublicEnvironment({})).toThrow(/configuration/);
    expect(
      parsePublicEnvironment({
        NEXT_PUBLIC_APP_URL: "https://firstpay.example",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "public",
      }).NEXT_PUBLIC_APP_URL,
    ).toBe("https://firstpay.example");
  });
  it("rejects missing production service role", () => {
    expect(() => parseServerEnvironment({ NODE_ENV: "production" })).toThrow(
      /production/,
    );
  });
  it("fails closed without distributed rate limiting in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(
      (await new UnconfiguredRateLimitAdapter().check("login", "key", 5, 60))
        .allowed,
    ).toBe(false);
  });
  it("redacts sensitive structured log fields", () => {
    expect(
      redact({ password: "x", nested: { token: "y", safe: "ok" } }),
    ).toEqual({
      password: "[REDACTED]",
      nested: { token: "[REDACTED]", safe: "ok" },
    });
  });
});
