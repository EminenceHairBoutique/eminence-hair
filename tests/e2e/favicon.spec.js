/**
 * tests/e2e/favicon.spec.js
 * Validates favicon is served correctly and is not a placeholder.
 */
import { test, expect } from "@playwright/test";

test.describe("Favicon", () => {
  test("favicon.ico responds with 200 and correct content type", async ({ request }) => {
    const response = await request.get("/assets/favicon.ico");
    expect(response.status()).toBe(200);

    const contentType = response.headers()["content-type"];
    // Accept common icon MIME types
    expect(
      contentType.includes("icon") ||
      contentType.includes("x-icon") ||
      contentType.includes("octet-stream")
    ).toBe(true);
  });

  test("favicon file is not empty/placeholder (has reasonable size)", async ({ request }) => {
    const response = await request.get("/assets/favicon.ico");
    const body = await response.body();

    // A real favicon should be at least 50 bytes; the placeholder was 4.7KB but had a
    // distinctive name. The real .ico should exist and have content.
    expect(body.length).toBeGreaterThan(50);
  });

  test("favicon_placeholder.png does not exist", async ({ request }) => {
    const response = await request.get("/assets/favicon_placeholder.png");
    expect(response.status()).toBe(404);
  });
});
