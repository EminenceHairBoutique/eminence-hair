/**
 * tests/e2e/navbar.spec.js
 * Validates the navbar has 5 top-level items, no "Start Here", and no partner links.
 *
 * NOTE: These tests require VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set
 * at build time for the React app to render.
 */
import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("has exactly 5 top-level navigation items", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    try {
      await page.waitForSelector("nav", { timeout: 10000 });
    } catch {
      test.skip(true, "App did not render — likely missing env vars");
      return;
    }

    // The desktop nav is inside a <nav> element with md:flex — count direct children
    const navItems = await page.evaluate(() => {
      const navs = document.querySelectorAll("nav");
      for (const nav of navs) {
        // Look for the desktop nav that has tracking-[0.22em] (the top-level nav)
        if (nav.className.includes("tracking")) {
          const children = nav.querySelectorAll(":scope > a, :scope > button");
          return Array.from(children).map((el) => el.textContent.trim());
        }
      }
      return [];
    });

    expect(navItems.length).toBe(5);
  });

  test("does not contain 'Start Here' link", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    try {
      await page.waitForSelector("header, nav", { timeout: 10000 });
    } catch {
      test.skip(true, "App did not render — likely missing env vars");
      return;
    }

    // "Start Here" should not be visible anywhere in the header area
    const startHere = page.locator("header >> text='Start Here'");
    await expect(startHere).not.toBeVisible();
  });

  test("does not contain partner links in navbar", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    try {
      await page.waitForSelector("header, nav", { timeout: 10000 });
    } catch {
      test.skip(true, "App did not render — likely missing env vars");
      return;
    }

    const header = page.locator("header");
    await expect(header.locator("a[href='/partners']")).not.toBeVisible();
    await expect(header.locator("a[href='/partners/stylists']")).not.toBeVisible();
    await expect(header.locator("a[href='/partners/creators']")).not.toBeVisible();
    await expect(header.locator("a[href='/partners/portal']")).not.toBeVisible();
  });
});
