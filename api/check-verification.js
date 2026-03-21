/* eslint-env node */

// POST /api/check-verification
// Alias for /api/sms-verify — preferred public name for the Twilio Verify check endpoint.
// All logic lives in sms-verify.js to keep a single source of truth.

export { default } from "./sms-verify.js";
