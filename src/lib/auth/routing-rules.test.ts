import { describe, expect, it } from "vitest";
import {
  resolveDashboardDestination,
  resolvePostLoginDestination,
} from "./routing-rules";

describe("authenticated routing", () => {
  it("redirects a Super Admin login to the platform portal", () => {
    expect(
      resolvePostLoginDestination({
        isSuperAdmin: true,
        organisationCount: 0,
      }),
    ).toBe("/super-admin");
  });

  it("bypasses the client dashboard for a Super Admin", () => {
    expect(
      resolveDashboardDestination({
        isSuperAdmin: true,
        organisationCount: 0,
      }),
    ).toBe("/super-admin");
  });

  it("redirects a normal single-organisation user to the dashboard", () => {
    expect(
      resolvePostLoginDestination({
        isSuperAdmin: false,
        organisationCount: 1,
      }),
    ).toBe("/dashboard");
  });

  it("redirects a user without an organisation to the empty state", () => {
    expect(
      resolvePostLoginDestination({
        isSuperAdmin: false,
        organisationCount: 0,
      }),
    ).toBe("/dashboard/no-organisation");
  });

  it("redirects a multi-organisation user to the organisation switcher", () => {
    expect(
      resolvePostLoginDestination({
        isSuperAdmin: false,
        organisationCount: 2,
      }),
    ).toBe("/dashboard/select-organisation");
  });
});
