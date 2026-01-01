/* eslint-env node */
import Stripe from "stripe";
import { products } from "../src/data/products.js";
import { applyCustomPricing } from "../src/utils/pricing.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  return await createHandler(req, res);
}

export async function createHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    const origin =
      req.headers.origin ||
      `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

    const line_items = items.map((item) => {
      if (!item?.id || !item.quantity) {
        throw new Error("Missing item fields");
      }

      const product = products.find((p) => p.id === item.id || p.slug === item.slug);
      if (!product) {
        throw new Error(`Unknown product: ${item.id}`);
      }

      const length = Number(item.length ?? Math.min(...(product.lengths || [0])));
      const density = Number(item.density ?? Math.min(...(product.densities || [0])));
      const lace = item.lace ?? "Transparent Lace";

      const basePrice =
        typeof product.price === "function" && length && density
          ? Number(product.price(length, density, lace) || 0)
          : Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0);

      const computed = applyCustomPricing({
        basePrice,
        density,
        isCustom: Boolean(item.isCustom),
        customNotes: String(item.customNotes ?? ""),
      });

      const unitAmount = Math.round(Number(computed.price || basePrice) * 100);
      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for ${product.id}`);
      }

      const imgPath = item.image || product.images?.[0] || null;
      const image = imgPath
        ? String(imgPath).startsWith("http")
          ? imgPath
          : `${origin}${imgPath}`
        : null;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || product.displayName || product.name,
            images: image ? [image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: Number(item.quantity),
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        source: "eminence_checkout",
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
