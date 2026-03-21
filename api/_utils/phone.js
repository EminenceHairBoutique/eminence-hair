/* eslint-env node */
/**
 * api/_utils/phone.js
 *
 * Shared phone-number normalisation for SMS API handlers.
 *
 * Converts user-supplied phone strings to E.164 format (+1XXXXXXXXXX for US,
 * or the full international format for other countries).
 *
 * Returns null for inputs that cannot be normalised safely.
 */

/**
 * Normalise a phone number string to E.164 format.
 *
 * @param {string|null|undefined} input - Raw phone number from user input
 * @returns {string|null} E.164 phone number, or null if invalid
 */
export function normalizePhone(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  // Strip all non-digit, non-plus characters
  let s = raw.replace(/[^\d+]/g, "");

  // Convert 00-prefixed international codes to + prefix
  if (s.startsWith("00")) s = "+" + s.slice(2);

  if (s.startsWith("+")) {
    const digits = s.slice(1).replace(/\D/g, "");
    // E.164 requires 7–15 digits after the country code
    if (digits.length < 7 || digits.length > 15) return null;
    return "+" + digits;
  }

  // No country code — assume US
  const digits = s.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;

  return null;
}
