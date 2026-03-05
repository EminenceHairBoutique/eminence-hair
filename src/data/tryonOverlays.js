/**
 * src/data/tryonOverlays.js
 *
 * Maps product IDs to virtual try-on overlay configuration.
 *
 * Each overlay entry defines:
 *  - label:      Display name shown in the UI
 *  - src:        Path to transparent PNG overlay (relative to /public)
 *                If a product has no unique overlay, 'fallback' key is used.
 *  - defaults:   Starting {scale, offsetX, offsetY, rotation} for the overlay
 *                so it aligns reasonably with a detected face.
 *
 * IMPORTANT: Overlay images must be transparent-background PNGs with the hair
 * filling the majority of the frame. The renderer scales / positions them using
 * face landmark anchor points (forehead top & chin bottom).
 *
 * If a product_id is not listed here it falls back to the 'fallback' entry.
 *
 * NOTE: Overlay images are TODO — the correct product photos are not yet
 * available as transparent-background PNGs. When the creative team delivers
 * cut-out overlays, place them in /public/overlays/ and update src below.
 */

/** Default adjustment values applied when no face is detected (manual mode). */
export const DEFAULT_ADJUSTMENTS = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

/**
 * Overlay registry.
 * Key: product slug / id (must match products.js id field).
 * Value: OverlayConfig object.
 */
export const tryonOverlays = {
  // ── Fallback (used for any product without a specific overlay) ────────────
  fallback: {
    label: "Eminence Hair",
    src: null, // no image yet — renderer shows text watermark placeholder
    defaults: DEFAULT_ADJUSTMENTS,
  },

  // ── SEA Collection ────────────────────────────────────────────────────────
  "sea-bodywave": {
    label: "SEA Raw Body Wave",
    src: null, // TODO: /overlays/sea-bodywave.png
    defaults: { scale: 1.05, offsetX: 0, offsetY: -0.05, rotation: 0 },
  },
  "sea-waterwave": {
    label: "SEA Water Wave",
    src: null, // TODO: /overlays/sea-waterwave.png
    defaults: { scale: 1.05, offsetX: 0, offsetY: -0.05, rotation: 0 },
  },

  // ── Burmese Collection ────────────────────────────────────────────────────
  "burmese-deepwave": {
    label: "Burmese Deep Wave",
    src: null, // TODO: /overlays/burmese-deepwave.png
    defaults: { scale: 1.1, offsetX: 0, offsetY: -0.08, rotation: 0 },
  },

  // ── Lavish Collection ─────────────────────────────────────────────────────
  "lavish-loosewave": {
    label: "Lavish Loose Wave",
    src: null,
    defaults: { scale: 1.05, offsetX: 0, offsetY: -0.05, rotation: 0 },
  },
  "silky-straight": {
    label: "Silky Straight",
    src: null,
    defaults: { scale: 1.0, offsetX: 0, offsetY: -0.03, rotation: 0 },
  },

  // ── Colorway Collection ───────────────────────────────────────────────────
  "colorway-613": {
    label: "Colorway 613 Blonde",
    src: null,
    defaults: { scale: 1.05, offsetX: 0, offsetY: -0.05, rotation: 0 },
  },
  "colorway-natural-bodywave": {
    label: "Colorway Natural Body Wave",
    src: null,
    defaults: { scale: 1.05, offsetX: 0, offsetY: -0.05, rotation: 0 },
  },

  // ── Medical Grade ─────────────────────────────────────────────────────────
  "medical-grade-straight": {
    label: "Medical Grade Straight",
    src: null,
    defaults: { scale: 1.0, offsetX: 0, offsetY: -0.04, rotation: 0 },
  },
  "medical-grade-bodywave": {
    label: "Medical Grade Body Wave",
    src: null,
    defaults: { scale: 1.0, offsetX: 0, offsetY: -0.04, rotation: 0 },
  },
};

/**
 * Resolve overlay config for a given product id.
 * Always returns a valid config object (falls back to `fallback` entry).
 */
export function getOverlay(productId) {
  return tryonOverlays[productId] || tryonOverlays.fallback;
}
