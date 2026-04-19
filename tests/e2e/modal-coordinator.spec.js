/**
 * tests/e2e/modal-coordinator.spec.js
 * Validates modal coordination: cookie banner appears first,
 * no simultaneous modals, suppression on sensitive routes.
 */
import { test, expect } from "@playwright/test";

test.describe("Modal Coordinator", () => {
  test("cookie banner appears on first visit (no stored consent)", async ({ page }) => {
    // Clear all storage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload to trigger fresh first-visit flow
    await page.reload();

    // Cookie banner should appear
    await expect(page.locator("text=We use cookies")).toBeVisible({ timeout: 5000 });
  });

  test("no modals appear on checkout page", async ({ page }) => {
    // Navigate to a page first to get a valid origin before clearing storage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto("/checkout");

    // Wait a moment
    await page.waitForTimeout(2000);

    // Cookie banner should NOT appear on suppressed path
    await expect(page.locator("text=We use cookies")).not.toBeVisible();
  });

  test("cookie banner and discount modal do not appear simultaneously", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    // Cookie banner appears first
    await expect(page.locator("text=We use cookies")).toBeVisible({ timeout: 5000 });

    // While cookie banner is showing, discount modal should NOT be visible
    await expect(page.locator("[aria-labelledby='discount-modal-title']")).not.toBeVisible();
  });
});
