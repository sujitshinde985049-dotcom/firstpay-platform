import { describe, expect, it } from "vitest";
import { getSuperAdminNavigation } from "./super-admin-navigation";

describe("Super Admin navigation", () => {
  it("includes the Feature Flags route for Platform Super Admin users", () => {
    const items = getSuperAdminNavigation(true);

    expect(items).toContainEqual({
      href: "/super-admin/feature-flags",
      label: "Feature flags",
    });
    expect(
      items.filter((item) => item.href === "/super-admin/feature-flags"),
    ).toHaveLength(1);
  });

  it("does not expose Super Admin navigation to other users", () => {
    expect(getSuperAdminNavigation(false)).toEqual([]);
  });
});
