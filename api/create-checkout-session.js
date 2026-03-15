/* eslint-env node */
import Stripe from "stripe";
import { products } from "../src/data/products.js";
import { applyCustomPricing } from "../src/utils/pricing.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// userId is only used as metadata — never for pricing or privilege decisions.
// Validate UUID format to reject malformed values before passing to Stripe.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  return await createHandler(req, res);
}

export async function createHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, userId, customerEmail, referralCode } = req.body || {};

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    // userId is only used as client_reference_id metadata for order history —
    // it is never used for pricing or privilege decisions. Validate UUID format
    // to reject obviously malformed values before passing to Stripe.
    if (userId && !UUID_RE.test(String(userId))) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Server-side enforcement: reject mixed preorder + domestic checkout.
    const hasPreorder = items.some((i) => Boolean(i.isPreorder));
    const hasDomestic = items.some((i) => !i.isPreorder);
    if (hasPreorder && hasDomestic) {
      return res.status(400).json({
        error:
          "Mixed cart: pre-order and domestic items cannot be checked out together. " +
          "Please checkout each group separately.",
      });
    }

    const origin =
      req.headers.origin ||
      `https://${req.headers["x-forwarded-host"] || req.headers.host}`;

    const line_items = items.map((item) => {
      // Accept either an id or a slug. Quantity is required.
      if ((!item?.id && !item?.slug) || !item.quantity) {
        throw new Error("Missing item fields");
      }

      const product = products.find((p) => p.id === item.id || p.slug === item.slug);
      if (!product) {
        throw new Error(`Unknown product: ${item.id || item.slug}`);
      }

      // Variant selections (null => server applies safe defaults)
      const length = Number(item.length ?? (product.lengths?.length ? Math.min(...product.lengths) : 0));
      const density = Number(item.density ?? (product.densities?.length ? Math.min(...product.densities) : 0));
      const lace = item.lace ?? "Transparent Lace";

      // Compute base price on the server.
      // - Wigs: priced by (length, density, lace)
      // - Bundles: priced by (length)
      let basePrice = 0;
      if (typeof product.price === "function") {
        if (product.type === "bundle") {
          basePrice = Number(product.price(length) || 0);
        } else {
          basePrice = Number(product.price(length, density, lace) || 0);
        }
      } else {
        basePrice = Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0);
      }

      // Custom pricing only applies to wigs.
      const finalPrice =
        product.type === "wig"
          ? Number(
              applyCustomPricing({
                basePrice,
                density,
                isCustom: Boolean(item.isCustom),
                customNotes: String(item.customNotes ?? ""),
                baseColor: String(product.color ?? ""),
                customColorTier: item.customColorTier ?? null,
              }).price || basePrice
            )
          : basePrice;

      const unitAmount = Math.round(Number(finalPrice) * 100);
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

    // Aggregate preorder metadata for the session.
    const isPreorderSession = hasPreorder;
    const preorderLeadDays = isPreorderSession
      ? Math.max(...items.map((i) => Number(i.leadTimeDays || 0)))
      : 0;
    const qualityTiers = isPreorderSession
      ? [...new Set(items.map((i) => i.qualityTier).filter(Boolean))].join(",")
      : "";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,

      // Allows standard Stripe promotion codes (optional but recommended).
      allow_promotion_codes: true,

      // Supabase user mapping for loyalty + order history.
      client_reference_id: userId ? String(userId) : undefined,
      customer_email: customerEmail ? String(customerEmail) : undefined,

      metadata: {
        source: "eminence_checkout",
        user_id: userId ? String(userId) : "",
        customer_email: customerEmail ? String(customerEmail) : "",
        referral_code: referralCode ? String(referralCode).slice(0, 40) : "",
        // Preorder-specific metadata
        preorder: isPreorderSession ? "true" : "false",
        ships_from: isPreorderSession ? "Factory" : "Domestic",
        lead_time_days: isPreorderSession ? String(preorderLeadDays) : "0",
        quality_tier: qualityTiers.slice(0, 100),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Stripe error" });
  }
}
