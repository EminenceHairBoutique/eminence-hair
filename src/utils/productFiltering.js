// src/utils/productFiltering.js
// Shared product filtering and pricing helpers used across shop pages.

/** Returns the minimum value in an array, or a fallback when the array is empty. */
export const safeMin = (arr, fallback = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return fallback;
  return Math.min(...arr);
};

/** Returns the minimum available length for a product, or its default. */
export const getMinLength = (p) => safeMin(p.lengths, p.defaultLength ?? null);

/** Returns the minimum available density for a product, or its default. */
export const getMinDensity = (p) => safeMin(p.densities, p.defaultDensity ?? null);

/**
 * Returns the starting (lowest) price for a product.
 * Prefers explicit basePrice / fromPrice, then falls back to computing via price().
 */
export const getStartingPrice = (p) => {
  const L = getMinLength(p);
  const D = getMinDensity(p);

  // Prefer explicit from/base pricing if present
  if (p.basePrice != null) return Number(p.basePrice) || 0;
  if (p.fromPrice != null) return Number(p.fromPrice) || 0;

  // Compute from price() if available
  if (typeof p.price === "function" && L != null) {
    try {
      const val =
        D == null
          ? Number(p.price(L) || 0) // bundles / closures / frontals
          : Number(p.price(L, D, "Transparent Lace") || 0); // wigs
      return Number.isFinite(val) ? val : 0;
    } catch {
      // fall through
    }
  }

  return Number(p.basePrice ?? p.fromPrice ?? p.price ?? 0);
};

/**
 * Returns true when a product matches the given color family.
 * Backwards compatible: checks collectionSlug, collection name, product name, and displayName.
 */
export const matchesColor = (p, color) => {
  const c = String(color || "").toLowerCase();

  const slug = String(p.collectionSlug || "").toLowerCase();
  const collection = String(p.collection || "").toLowerCase();
  const name = String(p.name || "").toLowerCase();
  const displayName = String(p.displayName || "").toLowerCase();
  const productColor = String(p.color || "").toLowerCase();

  const haystack = `${productColor} ${slug} ${collection} ${name} ${displayName}`.toLowerCase();
  const has = (needle) => haystack.includes(needle);

  if (c === "1") return productColor === "1" || has("jet black") || has("#1");
  if (c === "1b") return productColor === "1b" || has("1b") || has("natural black") || has("natural");
  if (c === "613") return productColor === "613" || has("613") || has("blonde") || slug === "613" || collection.includes("colorway 613");
  if (c === "burgundy") return productColor === "burgundy" || has("burgundy") || has("burg") || has("h-red") || has("red");
  if (c === "brown") return productColor === "brown" || has("brown") || has("22") || has("24") || has("27");
  if (c === "silver") return productColor === "silver" || has("silver") || has("gray") || has("grey");
  if (c === "orange") return productColor === "orange" || has("orange");

  // Legacy option
  if (c === "natural") return has("natural") || has("1b") || slug === "natural" || collection.includes("colorway natural");

  return false;
};
