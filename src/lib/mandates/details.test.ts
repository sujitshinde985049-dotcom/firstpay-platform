import { describe, expect, it } from "vitest";
import {
  canViewMandateDetails,
  formatOptionalAmount,
  formatOptionalDate,
  getPendingMandateAction,
  mandateDetailsSelect,
  optionalText,
  unavailable,
} from "./details";

describe("mandate detail access", () => {
  it("denies a mandate belonging to another organisation", () => {
    expect(
      canViewMandateDetails({
        hasViewPermission: true,
        currentOrganisationId: "organisation-a",
        mandateOrganisationId: "organisation-b",
      }),
    ).toBe(false);
  });

  it("requires mandates.view within the current organisation", () => {
    expect(
      canViewMandateDetails({
        hasViewPermission: false,
        currentOrganisationId: "organisation-a",
        mandateOrganisationId: "organisation-a",
      }),
    ).toBe(false);
  });
});

describe("minimal pending mandate details", () => {
  it("loads the customer id without an ambiguous embedded relation", () => {
    expect(mandateDetailsSelect).toContain("customer_id");
    expect(mandateDetailsSelect).not.toContain("customer:customers");
  });

  it("renders incomplete optional values without throwing", () => {
    expect(optionalText(null)).toBe(unavailable);
    expect(formatOptionalAmount(null)).toBe(unavailable);
    expect(formatOptionalDate(null)).toBe(unavailable);
  });

  it("renders a missing provider reference as unavailable", () => {
    expect(optionalText(undefined)).toBe("Not available");
  });
});

describe("pending PhonePe mandate action", () => {
  it("renders only a persisted, trusted PhonePe authorization URL", () => {
    expect(
      getPendingMandateAction({
        mandateStatus: "pending",
        providerKey: "phonepe",
        metadata: {
          authorization_url: "https://mercury.phonepe.com/authorize/123",
        },
      }),
    ).toEqual({
      label: "Continue to PhonePe",
      href: "https://mercury.phonepe.com/authorize/123",
    });
  });

  it("does not expose an untrusted authorization URL", () => {
    expect(
      getPendingMandateAction({
        mandateStatus: "pending",
        providerKey: "phonepe",
        metadata: { authorization_url: "https://example.com/redirect" },
      }),
    ).toBeNull();
  });

  it("does not require an authorization URL for a pending mandate", () => {
    expect(
      getPendingMandateAction({
        mandateStatus: "pending",
        providerKey: "phonepe",
        metadata: {},
      }),
    ).toBeNull();
  });
});
