/**
 * tests/e2e/cron-auth.spec.js
 * Validates that the cron endpoint requires proper authorization.
 */
import { test, expect } from "@playwright/test";

test.describe("Cron Auth", () => {
  test("POST to cron endpoint without auth header returns 401", async ({ request }) => {
    const response = await request.post("/api/cron/post-purchase-emails", {
      headers: {},
    });
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  test("POST to cron endpoint with wrong token returns 401", async ({ request }) => {
    const response = await request.post("/api/cron/post-purchase-emails", {
      headers: {
        Authorization: "Bearer wrong-token-12345",
      },
    });
    expect(response.status()).toBe(401);
  });
});
