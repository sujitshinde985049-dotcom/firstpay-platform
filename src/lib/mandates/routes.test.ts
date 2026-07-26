import { describe, expect, it } from "vitest";
import { mandateRoutes } from "./routes";

describe("mandate routes", () => {
  it("links the Create Mandate action to the protected creation page", () => {
    expect(mandateRoutes.create).toBe("/dashboard/mandates/new");
  });
});
