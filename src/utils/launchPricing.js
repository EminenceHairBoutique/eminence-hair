// src/utils/launchPricing.js
// Launch-window pricing helper.
// Bundle catalog products use "launch" pricing for the first 45 days after LAUNCH_START_DATE,
// then automatically switch to regular retail pricing.

// ─── Configuration ─────────────────────────────────────────────────────────
// Set this to the catalog launch date in ISO-8601 format.
// The 45-day window is measured from midnight (UTC) on this date.
export const LAUNCH_START_DATE = "2026-04-09"; // YYYY-MM-DD
export const LAUNCH_WINDOW_DAYS = 45;

// ─── Helpers ────────────────────────────────────────────────────────────────
/**
 * Returns true if the current date is within the launch pricing window.
 * Works in both browser and Node environments.
 */
export function isInLaunchWindow() {
  try {
    const start = new Date(`${LAUNCH_START_DATE}T00:00:00Z`);
    const end = new Date(start.getTime() + LAUNCH_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const now = new Date();
    return now >= start && now < end;
  } catch {
    return false;
  }
}

/**
 * Given a pricing tuple [launchPrice, retailPrice], returns the active price
 * based on whether we are currently in the launch window.
 *
 * @param {[number, number]} tuple - [launchPrice, retailPrice]
 * @returns {number}
 */
export function activeCatalogPrice([launch, retail]) {
  return isInLaunchWindow() ? launch : retail;
}
