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
test("invalid Razorpay webhook signature is rejected", async ({ request }) => {
  const response = await request.post("/api/webhooks/razorpay", {
    data: { event: "test" },
  });
  expect([401, 503]).toContain(response.status());
});
