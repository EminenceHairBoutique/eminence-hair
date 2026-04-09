/* eslint-env node */
import Stripe from "stripe";
import { products } from "../src/data/products.js";
import { RTI_PACKAGES } from "../src/data/catalogPricing.js";
import { applyCustomPricing } from "../src/utils/pricing.js";
import { checkRateLimit } from "./_utils/rateLimit.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  return await createHandler(req, res);
}

export async function createHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const allowed = await checkRateLimit(req, res, { max: 5, windowMs: 60_000, endpoint: "checkout" });
  if (!allowed) return;

  try {
    const { items, userId, customerEmail, referralCode } = req.body || {};

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid cart items" });
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

      // ── RTI Package handling ──────────────────────────────────
      // RTI items use ad-hoc IDs (e.g. "rti-10a-sbw-121416-bundles") that don't
      // exist in products.js. Validate them against the RTI_PACKAGES catalog and
      // re-price server-side so the client can never tamper with the amount.
      if (!product && item.rtiPackageId) {
        const rtiPkg = RTI_PACKAGES.find((p) => p.id === item.rtiPackageId);
        if (!rtiPkg) {
          throw new Error(`Unknown RTI package: ${item.rtiPackageId}`);
        }

        const rtiMode = item.rtiMode;
        const rtiPrice =
          rtiMode === "closure"
            ? rtiPkg.closure5x5
            : rtiMode === "frontal"
            ? rtiPkg.frontal13x4
            : rtiMode === "bundles"
            ? rtiPkg.bundlesPrice
            : null;

        if (rtiPrice == null || !Number.isFinite(rtiPrice) || rtiPrice <= 0) {
          throw new Error(`Invalid RTI mode "${rtiMode}" for ${item.rtiPackageId}`);
        }

        const rtiUnitAmount = Math.round(rtiPrice * 100);
        const rtiLabel =
          rtiMode === "closure"
            ? `${rtiPkg.collection} ${rtiPkg.bundleSet} + 5×5 Closure`
            : rtiMode === "frontal"
            ? `${rtiPkg.collection} ${rtiPkg.bundleSet} + 13×4 Frontal`
            : `${rtiPkg.collection} ${rtiPkg.bundleSet}`;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: rtiLabel,
              images: [],
            },
            unit_amount: rtiUnitAmount,
          },
          quantity: Number(item.quantity),
        };
      }

      if (!product) {
        throw new Error(`Unknown product: ${item.id || item.slug}`);
      }

      // Variant selections (null => server applies safe defaults)
      const length = Number(item.length ?? Math.min(...(product.lengths || [0])));
      const density = Number(item.density ?? Math.min(...(product.densities || [0])));
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
      line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,

      // Let Stripe dynamically offer the best payment methods for the buyer.
      payment_method_collection: "if_required",

      // Collect shipping + billing details
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "SE",
          "NO", "DK", "FI", "IE", "AT", "BE", "CH", "NZ", "JP", "SG",
          "AE", "SA", "JM", "TT", "BB", "BS", "GH", "NG", "KE", "ZA",
        ],
      },
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },

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
