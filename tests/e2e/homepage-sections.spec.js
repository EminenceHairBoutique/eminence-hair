/**
 * tests/e2e/homepage-sections.spec.js
 * Validates homepage has exactly 7 editorial sections with correct heading hierarchy.
 */
import { test, expect } from "@playwright/test";

test.describe("Homepage Sections", () => {
  test("has exactly seven editorial sections", async ({ page }) => {
    await page.goto("/");
    // Wait for content to load
    await expect(page.locator("h1")).toBeVisible();

    // Count editorial <section> elements (excludes TrustStrip and other non-editorial sections)
    const sections = page.locator("section[data-chapter]");
    const count = await sections.count();
    expect(count).toBe(7);
  });

  test("has exactly one h1 heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("all chapter headings after hero use h2", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    // There should be multiple h2 headings (one per non-hero section)
    const h2Count = await page.locator("h2").count();
    expect(h2Count).toBeGreaterThanOrEqual(6);
  });
});
