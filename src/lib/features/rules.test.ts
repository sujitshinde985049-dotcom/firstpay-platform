import { describe, expect, it } from "vitest";
import { canCreateMandate, isFeatureEnabled } from "./rules";

const organisationId = "00000000-0000-4000-8000-000000000001";

describe("feature flag rules", () => {
  it("enables UPI AutoPay from the platform default", () => {
    expect(
      isFeatureEnabled(
        [{ key: "upi_autopay", enabled: true, organisation_id: null }],
        "upi_autopay",
        organisationId,
      ),
    ).toBe(true);
  });

  it("applies an organisation override before the platform default", () => {
    expect(
      isFeatureEnabled(
        [
          { key: "upi_autopay", enabled: true, organisation_id: null },
          {
            key: "upi_autopay",
            enabled: false,
            organisation_id: organisationId,
          },
        ],
        "upi_autopay",
        organisationId,
      ),
    ).toBe(false);
  });

  it("shows Create Mandate when UPI AutoPay and permission are enabled", () => {
    expect(
      canCreateMandate({
        canManageMandates: true,
        upiAutoPayEnabled: true,
        eNachEnabled: false,
      }),
    ).toBe(true);
  });

  it("keeps Create Mandate hidden without mandates.manage", () => {
    expect(
      canCreateMandate({
        canManageMandates: false,
        upiAutoPayEnabled: true,
        eNachEnabled: true,
      }),
    ).toBe(false);
  });
});
