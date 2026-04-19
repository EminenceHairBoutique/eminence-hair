/**
 * tests/e2e/favicon.spec.js
 * Validates the favicon is served correctly and is not the placeholder.
 */
import { test, expect } from "@playwright/test";

test.describe("Favicon", () => {
  test("favicon is not the placeholder", async ({ request }) => {
    const res = await request.get("/favicon.ico");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/image/);
    const body = await res.body();
    expect(body.length).toBeGreaterThan(200);
  });

  test("web manifest is accessible and has correct theme_color", async ({ request }) => {
    const response = await request.get("/site.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toBe("Eminence Hair Boutique");
    expect(manifest.short_name).toBe("Eminence");
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toBe("#1B1B1B");
  });

  test("PWA icons are accessible", async ({ request }) => {
    const icon192 = await request.get("/assets/favicon-192.png");
    expect(icon192.status()).toBe(200);

    const icon512 = await request.get("/assets/favicon-512.png");
    expect(icon512.status()).toBe(200);
  });

  test("favicon_placeholder.png does not exist", async ({ request }) => {
    const response = await request.get("/assets/favicon_placeholder.png");
    expect(response.status()).toBe(404);
  });
});
