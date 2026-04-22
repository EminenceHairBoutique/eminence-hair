/**
 * tests/e2e/navbar.spec.js
 * Validates navigation structure: 5 top-level items, no "Start Here",
 * partner links only in footer.
 */
import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("has five top-level navigation items on desktop", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header nav")).toBeVisible();

    // Desktop nav items: Shop, Collections, Atelier, About Us, Journal
    const navItems = page.locator("header nav > button, header nav > a");
    const count = await navItems.count();
    expect(count).toBe(5);
  });

  test("does not have 'Start Here' in top nav", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header nav");
    await expect(nav.locator("text=Start Here")).not.toBeVisible();
  });

  test("partner links are in footer under For Professionals", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer.locator("text=For Professionals")).toBeVisible();
    await expect(footer.locator("text=Partner Program")).toBeVisible();
    await expect(footer.locator("text=Stylist Program")).toBeVisible();
    await expect(footer.locator("text=Creator Program")).toBeVisible();
    await expect(footer.locator("text=Partner Portal")).toBeVisible();
  });

  test("partner links are not in the top navigation", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");

    // These items should only appear in footer, not header
    await expect(header.locator("a:text-is('Partner Program')")).not.toBeVisible();
    await expect(header.locator("a:text-is('Stylist Program')")).not.toBeVisible();
    await expect(header.locator("a:text-is('Creator Program')")).not.toBeVisible();
  });
});
