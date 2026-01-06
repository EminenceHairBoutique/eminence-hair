// src/utils/pricing.js
//
// Checkout-side pricing adjustments.
// IMPORTANT: Density-based pricing is handled by the product price functions
// (including custom densities like 280% via interpolation/extrapolation).
// This helper is for any *additional* custom-request adjustments.

export function applyCustomPricing({
  basePrice,
  density, // kept for compatibility / future use
  isCustom,
  customNotes,
  baseColor,
  customColorTier,
} = {}) {
  let total = Number(basePrice || 0);
  if (!Number.isFinite(total) || total < 0) total = 0;

  const breakdown = [];

  if (isCustom) {
    // Optional color premium for custom requests (e.g., requesting 613 on a non-613 base)
    const tier = String(customColorTier || "").trim();
    const base = String(baseColor || "").trim();

    const COLOR_PREMIUM = {
      "1": 20, // Jet Black premium
      "613": 120, // Blonde premium
      CUSTOM: 160, // Burgundy/Copper/Ombre/etc.
    };

    if (tier && tier !== "AS_LISTED" && tier !== base && COLOR_PREMIUM[tier] != null) {
      const premium = Number(COLOR_PREMIUM[tier]) || 0;
      if (premium > 0) {
        total += premium;

        const label =
          tier === "1"
            ? "Jet Black #1 color premium"
            : tier === "613"
            ? "613 Blonde color premium"
            : "Custom color premium";

        breakdown.push(`${label}: +$${premium}`);
      }
    }

    if (String(customNotes || "").trim()) {
      breakdown.push(
        "Custom request noted (concierge will confirm any additional pricing if needed)."
      );
    }
  }

  return {
    price: Math.round(total),
    breakdown,
  };
}
