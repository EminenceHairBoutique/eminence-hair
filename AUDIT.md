# REPO AUDIT SUMMARY

| Field | Value |
|---|---|
| **Framework** | Vite 6.4 + React 19 (SPA) |
| **Language** | JavaScript (ES Modules, no TypeScript) |
| **Styling** | Tailwind CSS v4 (utility-first, `@tailwindcss/vite` plugin) |
| **Package manager** | npm (package-lock.json) |
| **Deployment target** | Vercel (serverless functions in `/api/`, SPA in `dist/`) |
| **Frontend entry point** | `src/main.jsx` → `BrowserRouter > UserProvider > CartProvider > App` |
| **Routing system** | React Router DOM v7 — flat route config in `App.jsx`, 42+ lazy-loaded pages |
| **Server architecture** | Vercel serverless functions (`/api/*.js`), Express 5 local dev (`dev-server.js`) |

---

## KEY FLOWS FOUND

### Cart Flow
- **State**: `src/context/CartContext.jsx` — React Context with localStorage persistence (`eminence_cart`).
- **Operations**: `addToCart`, `removeFromCart`, `updateQuantity`, `updateItemOptions`, `clearCart`.
- **Variant key**: Composite string `id::length::density::lace::color::capSize::isCustom::customColorTier::customNotes`.
- **Status**: ✅ Complete and well-structured. Supports mixed preorder/domestic detection.

### Checkout Flow
- **Page**: `src/pages/Checkout.jsx` — redirects to Stripe Checkout via `/api/create-checkout-session`.
- **Server**: `api/create-checkout-session.js` — re-validates prices server-side from `src/data/products.js`. Supports custom pricing (density, color tier).
- **Mixed cart**: Server rejects mixed preorder + domestic; client shows modal to split.
- **Status**: ✅ Secure. Prices are **never trusted from client input** — always re-computed server-side.

### Account/Auth Flow
- **Context**: `src/context/UserContext.jsx` — wraps Supabase Auth (`signUp`, `signInWithPassword`, `signInWithOAuth`).
- **Auth methods**: Email/password, Google OAuth.
- **Profile hydration**: Reads `profiles` table for `account_tier`, `partner_status`, `partner_tier`.
- **Pages**: `src/pages/Account.jsx`, `src/pages/Register.jsx`.
- **Status**: ✅ Functional. Auth state change listener handles session recovery.

### Order Flow
- **Webhook**: `api/stripe-webhook.js` — handles `checkout.session.completed`.
- **Order creation**: Inserts into `orders` table in Supabase (with fallback for missing columns).
- **Duplicate prevention**: Checks `stripe_session_id` before inserting.
- **Loyalty**: Awards points via `profiles` table + optional `loyalty_ledger`.
- **Email**: Sends confirmation via Resend (`lib/email.js`).
- **Status**: ✅ Well-structured. Idempotent webhook handling.

### SMS/Auth/Verify Flow
- **Start**: `api/sms-start.js` — Twilio Verify API (direct HTTP, no SDK dependency at runtime).
- **Verify**: `api/sms-verify.js` — checks code, stores in `sms_signups` table, returns discount code.
- **Frontend**: `src/components/DiscountModal.jsx` — modal with phone input → code verification → discount reveal.
- **Rate limiting**: 3 starts/min, 5 verifies/min per IP (via Supabase `rate_limits` table).
- **Status**: ✅ Complete end-to-end. Twilio is installed (`twilio@5.11.1`) but SMS endpoints use direct HTTP to Twilio Verify API.

---

## STRIPE STATUS

| Item | Status |
|---|---|
| **Installed** | ✅ `stripe@20.1.0` (server), `@stripe/stripe-js@8.6.0` + `@stripe/react-stripe-js@5.4.1` (client) |
| **Files involved** | `api/create-checkout-session.js`, `api/stripe-webhook.js`, `src/components/StripeProvider.jsx`, `src/pages/Checkout.jsx`, `src/pages/Success.jsx`, `src/pages/Cancel.jsx` |
| **Architecture** | Stripe Checkout (redirect mode). Server creates session → client redirects to Stripe-hosted page → webhook fires on completion. |
| **Price validation** | ✅ Server-side. Prices re-computed from `src/data/products.js` — client cannot manipulate amounts. |
| **Webhook signature** | ✅ Verified via `stripe.webhooks.constructEvent()` with raw body. |
| **Idempotency** | ✅ Duplicate check on `stripe_session_id` before order insert. |

### Risks
1. **`VITE_STRIPE_PUBLISHABLE_KEY` missing from `.env.example`** — `StripeProvider.jsx` uses it but it's not documented in the env template. New developers won't know to set it.
2. **`StripeProvider` wraps checkout but `loadStripe()` is called at module level** — if key is undefined, Stripe SDK logs a warning but doesn't crash. Still, it should be documented.
3. **Dev server doesn't register SMS/subscribe routes** — `dev-server.js` only mounts `create-checkout-session`, `stripe-webhook`, and `concierge`. Missing: `sms-start`, `sms-verify`, `subscribe`.

### What Must Be Fixed
- Add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env.example`.
- Register missing API routes in `dev-server.js`.

---

## TWILIO STATUS

| Item | Status |
|---|---|
| **Installed** | ✅ `twilio@5.11.1` in dependencies (but SMS endpoints use direct HTTP to Twilio Verify REST API, not the SDK) |
| **Files involved** | `api/sms-start.js`, `api/sms-verify.js`, `src/components/DiscountModal.jsx` |
| **Architecture** | Server-side only. Direct HTTP POST to `https://verify.twilio.com/v2/Services/{SID}/Verifications` and `/VerificationCheck`. |
| **Rate limiting** | ✅ 3 starts/min, 5 verifies/min per IP via Supabase `rate_limits` table. |
| **Honeypot** | ✅ Both endpoints check for `website` field (bot trap). |
| **Phone normalization** | ✅ Handles US 10/11-digit, international with `+`, `00` prefix. |

### Risks
1. **`dev-server.js` does not mount `/api/sms-start` or `/api/sms-verify`** — local development cannot test SMS flows without Vite proxy directly hitting the API files.
2. **Twilio SDK installed but unused** — `twilio@5.11.1` is in `dependencies` but never imported. The endpoints use direct `fetch()`. This is fine (smaller bundle) but the dependency could be removed to reduce install size if desired.

### Best Insertion Point
- SMS verification is **already fully implemented**. The frontend (`DiscountModal.jsx`) calls `/api/sms-start` and `/api/sms-verify`. The backend endpoints are complete with rate limiting, phone normalization, and consent handling.
- Future expansion: Could add SMS to the checkout flow (pre-purchase phone verification for fraud prevention) or account creation.

---

## SUPABASE STATUS

### Client Setup Files
| File | Purpose |
|---|---|
| `src/lib/supabaseClient.js` | Browser client (anon key, `import.meta.env`) |
| `lib/supabaseServer.js` | Server client (service role key, `process.env`) |

### Migration Files (SQL scripts, not in `supabase/migrations/`)
| File | Tables/Changes |
|---|---|
| `SUPABASE_LOYALTY.sql` | `profiles`, `loyalty_ledger`, extends `orders` |
| `SUPABASE_PARTNERS.sql` | `partner_applications`, extends `profiles` |
| `SUPABASE_PARTNERS_APPROVAL.sql` | Same as PARTNERS (duplicate file) |
| `SUPABASE_PARTNER_TIERS.sql` | `partner_tier_history`, `creator_referrals`, extends `profiles` + `partner_applications` |
| `SUPABASE_SMS_SIGNUPS.sql` | `sms_signups` |
| `SUPABASE_RATE_LIMITS.sql` | `rate_limits` |
| `SUPABASE_ATELIER_TRYON.sql` | `tryon_sessions`, `fit_profiles` |
| `SUPABASE_STYLIST_DIRECTORY.sql` | Extends `partner_applications`, `tryon_sessions` |

### Known Tables
- `profiles` (id, email, loyalty_points, lifetime_spend_cents, first_purchase_bonus_awarded, account_tier, partner_status, partner_tier, partner_track, referral_code, commission_rate, total_referral_sales, tier_promoted_at)
- `orders` (order_number, stripe_session_id, stripe_payment_intent, user_id, email, customer_name, amount_total, currency, items, consent, status)
- `loyalty_ledger` (user_id, delta, reason, order_number, stripe_session_id)
- `partner_applications` (many fields for stylist/creator tracks)
- `partner_tier_history` (audit trail)
- `creator_referrals` (referral tracking)
- `sms_signups` (phone, consent, source, path, utm, verified_at)
- `rate_limits` (key, request_count, window_start)
- `tryon_sessions` (product_id, user_id, overlay_key, adjustments, status)
- `fit_profiles` (user preferences for try-on)
- `email_signups` (referenced in `api/subscribe.js` but no SQL file found)

### Auth/Storage Usage
- **Auth**: Supabase Auth (email/password, Google OAuth). Session hydrated on load via `getSession()`.
- **Storage**: Private buckets (`atelier-uploads`, `tryon-sessions`) with signed URL access.

### Schema Gaps
1. **`email_signups` table** — referenced in `api/subscribe.js` but no SQL migration file exists.
2. **`orders` table base creation** — `SUPABASE_LOYALTY.sql` uses `ALTER TABLE` to add columns, but never `CREATE TABLE`. The base `orders` table must exist beforehand.
3. **`concierge_requests` table** — referenced as FK target in `SUPABASE_ATELIER_TRYON.sql` but no migration creates it.
4. **No `supabase/` directory** — migrations are standalone SQL files in the repo root, not using the Supabase CLI migration system.

---

## ENV STATUS

### Frontend-Safe Variables (`VITE_` prefix)
| Variable | Used In | Status |
|---|---|---|
| `VITE_SUPABASE_URL` | `src/lib/supabaseClient.js` | ✅ In .env.example |
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabaseClient.js` | ✅ In .env.example |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `src/components/StripeProvider.jsx` | ⚠️ **Missing from .env.example** |
| `VITE_GA_MEASUREMENT_ID` | `src/components/AnalyticsTracker.jsx` | ✅ In .env.example |
| `VITE_META_PIXEL_ID` | Analytics | ✅ In .env.example |
| `VITE_ADMIN_EMAILS` | `src/components/AdminRoute.jsx` | ✅ In .env.example |
| `VITE_CRISP_WEBSITE_ID` | `src/components/LiveChat.jsx` | ✅ In .env.example |
| `VITE_CRISP_VISIBILITY` | `src/components/LiveChat.jsx` | ✅ In .env.example |
| `VITE_SITE_URL` | SEO scripts | ✅ In .env.example |
| `VITE_CALENDLY_URL` | `src/pages/Consultation.jsx` | ⚠️ **Missing from .env.example** |
| `VITE_VIDEO_CONSULT_URL` | `src/pages/VideoConsult.jsx` | ⚠️ **Missing from .env.example** |
| `VITE_TRYON_PROVIDER` | `src/lib/tryon/providers/index.js` | ⚠️ **Missing from .env.example** |

### Server-Only Variables
| Variable | Used In | Status |
|---|---|---|
| `STRIPE_SECRET_KEY` | `api/create-checkout-session.js`, `api/stripe-webhook.js` | ✅ In .env.example |
| `STRIPE_WEBHOOK_SECRET` | `api/stripe-webhook.js` | ✅ In .env.example |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabaseServer.js` | ✅ In .env.example |
| `RESEND_API_KEY` | `lib/email.js` | ✅ In .env.example |
| `TWILIO_ACCOUNT_SID` | `api/sms-start.js`, `api/sms-verify.js` | ✅ In .env.example |
| `TWILIO_AUTH_TOKEN` | `api/sms-start.js`, `api/sms-verify.js` | ✅ In .env.example |
| `TWILIO_VERIFY_SERVICE_SID` | `api/sms-start.js`, `api/sms-verify.js` | ✅ In .env.example |
| `ADMIN_EMAILS` | `api/_utils/auth.js`, `api/admin/*.js` | ✅ In .env.example |
| `SUPABASE_ATELIER_BUCKET` | `api/atelier/signed-upload.js`, `lib/email.js` | ✅ In .env.example |

### Incorrect Usages
- None found. Server secrets use `process.env`, frontend keys use `import.meta.env` with `VITE_` prefix.

### Leak Risks
- ✅ No secret leakage. Service role key is only in `lib/supabaseServer.js` (server-only). Stripe secret key is only in `/api/` files.
- ⚠️ `VITE_ADMIN_EMAILS` is exposed to the browser (by design, for client-side admin route gating). Server-side admin auth still validates via `ADMIN_EMAILS` in `/api/_utils/auth.js`.

---

## EXISTING BUGS FOUND

### 1. `lib/email.js` — `attachmentLine` is not defined (line 254)
**Severity**: 🔴 Runtime error — `sendConciergeRequestEmail()` will throw `ReferenceError: attachmentLine is not defined`.
**Root cause**: The variable `uploadsHtml` (line 186) contains the attachment/upload HTML, but the template on line 254 references `attachmentLine` (which was never declared).
**Fix**: Replace `${attachmentLine}` with `${uploadsHtml}` on line 254.

### 2. `lib/email.js` — Unnecessary escape (line 89)
**Severity**: 🟡 Lint error — `\"` in `replace(/\"/g, ...)` should be `"`.
**Fix**: Change `/\"/g` to `/"/g`.

### 3. `dev-server.js` — Missing API route registrations
**Severity**: 🟡 Dev experience — SMS verification (`/api/sms-start`, `/api/sms-verify`) and newsletter subscription (`/api/subscribe`) cannot be tested locally.
**Fix**: Add route registrations for `sms-start`, `sms-verify`, and `subscribe` endpoints.

### 4. `.env.example` — Missing `VITE_STRIPE_PUBLISHABLE_KEY`
**Severity**: 🟡 Developer experience — New developers won't know this variable is needed.
**Fix**: Add it to `.env.example`.

### 5. `api/stripe-webhook.js` — Unused destructured `user_id` (line 37)
**Severity**: 🟢 Lint warning — `user_id` is destructured out in the fallback path but never used.
**Fix**: Prefix with `_` to indicate intentional non-use.

---

## FILES TO MODIFY NEXT

1. `lib/email.js` — Fix `attachmentLine` → `uploadsHtml` bug + escape fix
2. `dev-server.js` — Register missing API routes (`sms-start`, `sms-verify`, `subscribe`)
3. `.env.example` — Add `VITE_STRIPE_PUBLISHABLE_KEY` and other missing vars
4. `api/stripe-webhook.js` — Fix unused `user_id` lint error

## FILES TO CREATE NEXT

_None required for this phase._

---

## IMPLEMENTATION PLAN

### Immediate Fixes (This PR)
1. **Fix `lib/email.js`**: Replace `attachmentLine` with `uploadsHtml` (line 254) and fix escape warning (line 89).
2. **Fix `dev-server.js`**: Register `/api/sms-start`, `/api/sms-verify`, `/api/subscribe` routes.
3. **Fix `.env.example`**: Add `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_CALENDLY_URL`, `VITE_VIDEO_CONSULT_URL`, `VITE_TRYON_PROVIDER`.
4. **Fix `api/stripe-webhook.js`**: Prefix unused `user_id` with `_`.

### Next Phase (Future PRs)
1. **Create `email_signups` SQL migration** — table is used in `api/subscribe.js` but has no migration.
2. **Create base `orders` table SQL** — `SUPABASE_LOYALTY.sql` assumes it exists.
3. **Create `concierge_requests` SQL migration** — FK referenced in atelier schema.
4. **Consolidate SQL migrations** — Move from root-level SQL files to `supabase/migrations/` for proper migration management.
5. **Consider removing `twilio` npm dependency** — SMS endpoints use direct HTTP, not the Twilio SDK.

---

## WATCH-OUTS

1. **`lib/email.js` is currently broken** — Any concierge request email will throw `ReferenceError: attachmentLine is not defined`. This is a **production blocker** for custom order, atelier, contact, and partner application email notifications.
2. **SQL migrations are not managed** — All migrations are standalone files in the repo root. There's no version tracking or ordering. Running them out of order could fail (e.g., `SUPABASE_PARTNER_TIERS.sql` depends on `SUPABASE_PARTNERS.sql`).
3. **`orders` table must pre-exist** — The loyalty SQL only adds columns, never creates the table. If deployed fresh, the webhook will fail.
4. **Twilio SDK vs. direct HTTP** — The `twilio@5.11.1` package is installed (31MB) but never used. SMS endpoints use direct `fetch()` to Twilio REST API. Consider removing the unused dependency.
5. **`StripeProvider` loads at module level** — `loadStripe()` is called when the module loads, not when the component mounts. If `VITE_STRIPE_PUBLISHABLE_KEY` is undefined, Stripe will show console warnings.
6. **`SUPABASE_PARTNERS.sql` and `SUPABASE_PARTNERS_APPROVAL.sql` are identical files** — Duplicate maintenance risk.
7. **Rate limiting fails open** — By design, but important to note: if Supabase is down, rate limiting is bypassed entirely.
8. **No unit tests** — Only Playwright E2E tests exist. No unit/integration test framework.

---

Audit complete. Ready for implementation.
