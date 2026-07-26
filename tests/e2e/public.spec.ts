import { expect, test } from "@playwright/test";
test("homepage and mobile navigation load", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/FirstPay/);
  const menuButton = page.getByRole("button", { name: "Open navigation" });
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await expect(menuButton).toBeVisible();
    await menuButton.click();
  }
  await expect(page.getByRole("navigation").first()).toBeVisible();
});
test("login and legal pages load", async ({ page }) => {
  for (const path of [
    "/login",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/legal-policies",
  ]) {
    await page.goto(path);
    await expect(page.locator("main, section").first()).toBeVisible();
  }
});
test("unauthenticated dashboard redirects", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
test("mandate creation route is protected", async ({ page }) => {
  await page.goto("/dashboard/mandates/new");
  await expect(page).toHaveURL(/\/login/);
});
test("direct mandate details route is protected", async ({ page }) => {
  await page.goto("/dashboard/mandates/00000000-0000-4000-8000-000000000000");
  await expect(page).toHaveURL(/\/login/);
});
test("PhonePe public return route exists and continues to protected details", async ({
  page,
}) => {
  await page.goto("/phonepe/return/00000000-0000-4000-8000-000000000000");
  await expect(page).toHaveURL(
    /\/login\?next=%2Fdashboard%2Fmandates%2F00000000-0000-4000-8000-000000000000/,
  );
});
test("invalid Razorpay webhook signature is rejected", async ({ request }) => {
  const response = await request.post("/api/webhooks/razorpay", {
    data: { event: "test" },
  });
  expect([401, 503]).toContain(response.status());
});
