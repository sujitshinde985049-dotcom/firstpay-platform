import { describe, expect, it } from "vitest";
import { canViewMandateDetails, getPendingMandateAction } from "./details";

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
      label: "Open PhonePe authorization",
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
});
