import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  phonePeReturnPath,
  phonePeReturnUrl,
  resolveApplicationOrigin,
} from "./phonepe-routes";

const mandateId = "00000000-0000-4000-8000-000000000001";

describe("PhonePe production routes", () => {
  it("generates the public production return URL", () => {
    expect(
      phonePeReturnUrl(
        { NEXT_PUBLIC_APP_URL: "https://pay.firstpay.example" },
        mandateId,
      ),
    ).toBe(`https://pay.firstpay.example/phonepe/return/${mandateId}`);
  });

  it("uses the Vercel production host instead of a production localhost URL", () => {
    expect(
      resolveApplicationOrigin({
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        VERCEL_PROJECT_PRODUCTION_URL: "firstpay.vercel.app",
      }),
    ).toBe("https://firstpay.vercel.app");
  });

  it("keeps the return route outside the protected dashboard namespace", () => {
    expect(phonePeReturnPath(mandateId)).toBe(`/phonepe/return/${mandateId}`);
  });

  it("has a deployed App Router handler for the generated return route", () => {
    const routeFile = fileURLToPath(
      new URL("../../app/phonepe/return/[mandateId]/route.ts", import.meta.url),
    );
    expect(existsSync(routeFile)).toBe(true);
  });
});
