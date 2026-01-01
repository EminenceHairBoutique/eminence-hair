/* eslint-env node */
import Stripe from "stripe";
import { supabaseServer } from "../lib/supabaseServer.js";
import { generateOrderNumber } from "../lib/orderNumber.js";
import { sendOrderConfirmationEmail } from "../lib/email.js";

export const config = {
  api: {
    bodyParser: false, // ❗ REQUIRED for Stripe signature verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function getRawBody(req) {
  // Local dev (express.raw) provides a Buffer on req.body
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);

  // Vercel/Node fallback: read the request stream
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await getRawBody(req),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ EVENT VERIFIED — SAFE TO TRUST
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Prevent duplicate inserts (Stripe retries webhooks)
        const { data: existing } = await supabaseServer
          .from("orders")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (existing) {
          console.log("ℹ️ Order already exists for session", session.id);
          break;
        }

        const orderNumber = await generateOrderNumber(supabaseServer);

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        const order = {
          order_number: orderNumber,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          email: session.customer_details?.email,
          customer_name: session.customer_details?.name || null,
          amount_total: session.amount_total,
          currency: session.currency,

          // ✅ FIXED: real purchased items
          items: lineItems.data,

          consent: session.metadata || {},
          status: "paid",
        };

        const { error } = await supabaseServer
          .from("orders")
          .insert(order);

        if (error) {
          console.error("❌ Failed to save order:", error);
          throw error;
        }

        console.log("✅ Order saved:", orderNumber);

        // Send confirmation email
        try {
          console.log("📧 Attempting to send confirmation email to:", session.customer_details?.email);

          await sendOrderConfirmationEmail({
            to: session.customer_details?.email,
            orderNumber,
            amount: session.amount_total,
          });

          console.log("📧 Email send call completed");
        } catch (err) {
          console.error("❌ Email send failed:", err);
        }

        break;
      }

      case "payment_intent.succeeded": {
        const intent = event.data.object;
        console.log("💰 PaymentIntent succeeded:", intent.id);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}
