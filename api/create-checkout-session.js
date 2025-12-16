/* eslint-env node */
/* global process */
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    const line_items = items.map((item) => {
      if (
        !item.name ||
        !item.price ||
        !item.quantity ||
        !item.id ||
        !item.cartKey
      ) {
        throw new Error("Invalid cart item shape");
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
            metadata: {
              product_id: item.id,
              slug: item.slug,
              length: item.length,
              density: item.density,
              lace: item.lace,
              color: item.color || "",
              cartKey: item.cartKey,
            },
          },
        },
      };
    });

    const origin =
      req.headers.origin ||
      `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items,

      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout`,

      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },

      automatic_tax: { enabled: true },

      metadata: {
        order_source: "eminence_web",
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return res.status(500).json({ error: "Checkout session failed" });
  }
}
