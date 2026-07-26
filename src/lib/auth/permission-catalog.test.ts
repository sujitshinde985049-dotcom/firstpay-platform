import { describe, expect, it } from "vitest";
import {
  mandatePermissionCodes,
  missingMandatePermissionCodes,
} from "./permission-catalog";
import { canCreateMandate } from "../features/rules";

describe("mandate permissions", () => {
  it("lists every mandate permission required by the Permissions UI", () => {
    expect(mandatePermissionCodes).toEqual([
      "mandates.view",
      "mandates.manage",
      "mandates.create",
      "mandates.update",
      "mandates.cancel",
    ]);
    expect(missingMandatePermissionCodes([...mandatePermissionCodes])).toEqual(
      [],
    );
  });

  it("allows a Client Admin with mandates.create to create mandates", () => {
    expect(
      canCreateMandate({
        hasCreatePermission: true,
        upiAutoPayEnabled: true,
        eNachEnabled: false,
      }),
    ).toBe(true);
  });

  it("denies an ordinary read-only user without mandates.create", () => {
    expect(
      canCreateMandate({
        hasCreatePermission: false,
        upiAutoPayEnabled: true,
        eNachEnabled: true,
      }),
    ).toBe(false);
  });
});
