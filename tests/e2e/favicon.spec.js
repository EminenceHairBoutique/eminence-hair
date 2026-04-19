/**
 * tests/e2e/favicon.spec.js
 * Validates the favicon is served correctly and is not the placeholder.
 */
import { test, expect } from "@playwright/test";

test.describe("Favicon", () => {
  test("serves favicon.ico with correct content type", async ({ request }) => {
    const response = await request.get("/assets/favicon.ico");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    // Accept common favicon content types
    expect(
      contentType.includes("image/x-icon") ||
      contentType.includes("image/vnd.microsoft.icon") ||
      contentType.includes("image/ico") ||
      contentType.includes("image/png") ||
      contentType.includes("application/octet-stream")
    ).toBeTruthy();
  });

  test("favicon is not the placeholder (has reasonable file size)", async ({ request }) => {
    const response = await request.get("/assets/favicon.ico");
    const body = await response.body();
    // A real favicon should be at least 100 bytes; a placeholder or empty file would be very small
    expect(body.length).toBeGreaterThan(100);
  });

  test("web manifest is accessible", async ({ request }) => {
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
});
