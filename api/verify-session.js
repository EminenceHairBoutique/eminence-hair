/* eslint-env node */
/**
 * POST /api/verify-session
 *
 * Verifies a Stripe Checkout session server-side and returns a sanitized
 * subset of the session data. The Success page must call this before clearing
 * the cart or firing purchase-tracking pixels.
 *
 * Body: { sessionId: string }
 * Returns:
 *   200 { ok: true, status: "paid"|"unpaid"|"no_payment_required", isPreorder: bool, amount: number }
 *   400 { ok: false, error: "missing_session_id" }
 *   402 { ok: false, error: "payment_not_completed", status: string }
 *   404 { ok: false, error: "session_not_found" }
 *   500 { ok: false, error: string }
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8") || "{}";
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const body = await readJson(req);
  if (!body) {
    res.status(400).json({ ok: false, error: "invalid_json" });
    return;
  }

  const { sessionId } = body;

  if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    res.status(400).json({ ok: false, error: "missing_session_id" });
    return;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is not set");
    res.status(500).json({ ok: false, error: "server_misconfigured" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      // Minimal expansion — we only need payment_status and a few metadata fields.
      expand: [],
    });

    const paymentStatus = session.payment_status; // "paid" | "unpaid" | "no_payment_required"
    const sessionStatus = session.status;          // "complete" | "expired" | "open"

    // A verified paid session must be "complete" AND have payment_status "paid"
    // (or "no_payment_required" for free orders / 100%-off coupons).
    const isVerified =
      sessionStatus === "complete" &&
      (paymentStatus === "paid" || paymentStatus === "no_payment_required");

    if (!isVerified) {
      res.status(402).json({
        ok: false,
        error: "payment_not_completed",
        status: paymentStatus,
        sessionStatus,
      });
      return;
    }

    res.status(200).json({
      ok: true,
      status: paymentStatus,
      sessionStatus,
      isPreorder: session.metadata?.preorder === "true",
      leadTimeDays: session.metadata?.lead_time_days
        ? Number(session.metadata.lead_time_days)
        : 0,
      amount: session.amount_total,
    });
  } catch (err) {
    // Stripe throws a StripeInvalidRequestError for unknown IDs.
    if (err?.type === "StripeInvalidRequestError" || err?.statusCode === 404) {
      res.status(404).json({ ok: false, error: "session_not_found" });
      return;
    }
    console.error("verify-session error:", err?.message || err);
    res.status(500).json({ ok: false, error: err?.message || "verification_failed" });
  }
}
