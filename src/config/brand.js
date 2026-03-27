// src/config/brand.js
// Centralized brand/store constants so you can update copy in one place.

export const BRAND = {
  // NOTE: Keep the brand spelling plain ASCII for maximum consistency across
  // fonts/devices/search and to avoid accidental diacritics rendering.
  name: "Eminence",
  fullName: "Eminence Hair Boutique",
  tagline: "Luxury Hair Atelier",
  supportEmail: "support@eminenceluxuryhair.com",
};

// Social links — UI will automatically hide any socials that are not provided.
export const SOCIAL = {
  instagram: "https://www.instagram.com/eminencehairboutique",
  tiktok: "https://www.tiktok.com/@emininceluxuryhair",
  youtube: "",
};

/**
 * Returns only the social entries that have a non-empty URL.
 * Useful for rendering social links without empty/hidden items.
 */
export function activeSocials() {
  return Object.entries(SOCIAL)
    .filter(([, url]) => Boolean(url))
    .map(([platform, url]) => ({ platform, url }));
}

// Global micro‑copy used across the UI.
export const MICROCOPY = {
  secureCheckout: "Secure checkout powered by Stripe.",
  consultLabel: "Private Consult",
  authenticityLabel: "Verified Origin",
  shippingLabel: "Worldwide shipping available.",
};
