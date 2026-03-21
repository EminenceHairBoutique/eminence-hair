/* eslint-env node */

// POST /api/send-verification
// Alias for /api/sms-start — preferred public name for the Twilio Verify send endpoint.
// All logic lives in sms-start.js to keep a single source of truth.

export { default } from "./sms-start.js";
