// This file is intentionally a thin re-export so that any legacy imports from
// src/lib/email.js continue to resolve without breakage.
// The canonical implementation (with RESEND_API_KEY guard, correct from-address,
// and concierge email support) lives at lib/email.js (project root).
//
// Do NOT add logic here — update lib/email.js instead.
export { sendOrderConfirmationEmail, sendConciergeRequestEmail } from "../../lib/email.js";