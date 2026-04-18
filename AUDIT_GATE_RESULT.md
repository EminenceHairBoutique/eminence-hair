# Audit Gate Result — Senior Launch Engineering Pass (April 2026)

**Date:** 2026-04-18
**Branch:** `launch/senior-pass-2026-04` (based on `main` at `90d0017`)
**Auditor:** Copilot (Claude Opus 4.6)

---

## 1. Branch State

- Branch: `main` at commit `90d0017` (Merge PR #60 — client-services system)
- Working tree clean; no uncommitted changes.

## 2. Open PRs

**Expected:** #21, #22, #23 (draft), #24 (draft), #25 (WIP), #26, #27 (draft), #31, #51
**Actual:** Only **#54** is open (fix: CSP policy, popup sequencing, SEO schema, a11y focus traps).

The nine PRs listed in the audit have already been closed or merged prior to this pass. PR #54 is the only open PR and was not listed in the original audit. **This indicates significant work has been merged since the audit was drafted.**

## 3. File Coordinate Verification

| File | Expected | Actual | Status |
|------|----------|--------|--------|
| `index.html:7-8` | `favicon_placeholder.png` | `favicon.ico` + `favicon-192.png` (already updated) | ⚠️ CHANGED |
| `index.html:28` | Inter font in `<noscript>` block | No Google Fonts in noscript; noscript only has plain text JS-required message | ⚠️ CHANGED — already fixed |
| `src/App.jsx:87,179-180` | `<DiscountModal />`, `<CookieBanner />`, `<EmailPopup />` unconditional | Present at lines 91, 186, 187. Skip-to-content link also added. | ✅ MATCH (shifted lines) |
| `src/components/DiscountModal.jsx:~55` | `setTimeout(..., 5000)` | Present at line 67 inside `scheduleShow()` — 5000ms timeout still active | ✅ MATCH |
| `src/components/EmailPopup.jsx:7,~23` | `DELAY_MS = 8000`, `setTimeout(..., DELAY_MS)` | Line 8: `DELAY_MS = 35000` (changed to 35s). setTimeout at line 33. | ⚠️ CHANGED — delay increased from 8s to 35s |
| `src/components/legal/CookieBanner.jsx:10-13` | `setVisible(true)` immediately in useEffect | Lines 11-17: `setVisible(true)` conditional on localStorage check (no stored consent → show) | ✅ MATCH (same logic, conditional on no prior consent) |
| `src/components/Navbar.jsx:117-127,172` | Partner links in aboutSections; "Start Here" at top level | No partner links in aboutSections. No "Start Here" in nav. Nav has Shop, Collections, Services, About. | ⚠️ CHANGED — partner links and Start Here already removed |
| `src/components/ProductCard.jsx:53-101` | `<button>` nested inside `<Link>` | Lines 54-101: Button still nested inside Link — **still needs fixing** | ✅ MATCH (bug still present) |
| `src/pages/Home.jsx:617,739` | Two identical "Atelier Pre-Order" sections | File is 473 lines. Single Atelier Pre-Order at lines 316-351 inside combined section. | ⚠️ CHANGED — duplicate already removed |
| `api/create-checkout-session.js:top of createHandler` | No `checkRateLimit` call | Lines 6,19: `checkRateLimit` already imported and called | ⚠️ CHANGED — already fixed |
| `vercel.json:crons` | `/api/cron/post-purchase-emails` at `0 10 * * *` | Present at lines 58-63 | ✅ MATCH |
| `api/_utils/rateLimit.js` | Supabase-backed, fail-open, MAX_ENDPOINT_LENGTH = 64 | Present as expected — full implementation | ✅ MATCH |
| `lib/email.js:~226` | `uploadsHtml` IIFE (confirms attachmentLine fix) | `uploadsHtml` IIFE at line 393 (not 226). No `attachmentLine` variable found. | ⚠️ LINE SHIFTED — IIFE present but at different line |

## 4. Summary of Pre-Existing Fixes

The following items from the audit have **already been addressed** on main:

1. ✅ Favicon updated from placeholder to proper icons
2. ✅ Inter font removed from noscript fallback
3. ✅ Skip-to-main-content link added to App.jsx
4. ✅ Duplicate Atelier Pre-Order section removed
5. ✅ Homepage reduced to ~7 sections
6. ✅ Rate limiting on checkout endpoint
7. ✅ Rate limiting on subscribe endpoint
8. ✅ CRON_SECRET guard on cron handler
9. ✅ Partner links partially reorganized in nav
10. ✅ "Start Here" removed from top nav
11. ✅ mediapipe dynamic imports (already using `await import()`)
12. ✅ RelatedProducts component exists on PDP
13. ✅ robots.txt exists (partial — missing /admin, /partners/portal)

## 5. Remaining Work Items

Despite the above, the following items **still need implementation**:

1. **ModalCoordinator** — No coordinator exists; modals use event-based sequencing but lack mutual exclusion
2. **Navbar restructure** — Currently has Shop/Collections/Services/About; needs Shop/Collections/Atelier/About Us/Journal
3. **ProductCard** — Button still nested inside Link (accessibility violation)
4. **Favicon set** — Missing: favicon-16.png, favicon-32.png, favicon.svg, android-chrome-192/512.png, maskable-512.png; webmanifest needs updating
5. **robots.txt** — Missing /admin, /partners/portal disallow rules
6. **ErrorBoundary ?debug=1** — Not implemented
7. **ForProfessionals page** — Does not exist
8. **Journal pages** — Do not exist
9. **Breadcrumbs component** — Does not exist
10. **useFocusTrap hook** — Does not exist
11. **Per-route JSON-LD** — SEO.jsx accepts jsonLd but no Product/Collection/FAQ schemas
12. **OG banner WebP** — Still using .jpg
13. **Reduced motion support** — Not implemented in motionPresets.js
14. **Colour contrast pass** — Not audited
15. **Rate limiting on partners/apply.js** — Not implemented
16. **CRON_SECRET in .env.example** — Not present
17. **PDP length selector image swap** — Not implemented
18. **Installer directory links in cart/success** — Not implemented
19. **LCP preload** — Not in index.html
20. **Homepage section order** — Needs verification against spec (7 chapters in correct order)

---

*This audit gate confirms the repository has evolved significantly since the original audit was drafted. Proceeding with remaining items only.*
