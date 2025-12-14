// src/utils/pricing.js

// Catalog-safe custom surcharges
export function applyCustomPricing({
  basePrice = 0,
  density,
  isCustom,
  customNotes = "",
}) {
  let total = Number(basePrice) || 0;
  let breakdown = [];

  // Density surcharges (only beyond catalog)
  if (density > 250) {
    if (density >= 300) {
      total += 250;
      breakdown.push("300% Density Atelier");
    } else {
      total += 150;
      breakdown.push("250%+ Density Atelier");
    }
  }

  // Any custom work requested
  if (isCustom && customNotes.trim().length > 0) {
    total += 100;
    breakdown.push("Custom Atelier Work");
  }

  return {
    price: total,
    breakdown,
  };
}
