# Audit Gate Result — Senior Launch Engineering Pass (April 2026)

**Date:** 2026-04-18
**Branch:** `launch/senior-pass-2026-04`
**Base commit:** `90d0017` (HEAD of `main`)

---

## 1. Branch state

- Clean working tree on `main` at `90d0017`.
- `git log --oneline -n 30` confirmed. Most recent merge: PR #60 (Client Services hub).

## 2. Open PRs

The problem statement expected nine open PRs: **#21, #22, #23 (draft), #24 (draft), #25 (WIP), #26, #27 (draft), #31, #51**.

**Actual open PRs (as of audit):** **#54** and **#61** only.

PRs #21–#31 and #51 were already closed/merged by prior engineering passes. The nine-PR triage described in Phase 0 is therefore **not applicable** — those PRs no longer exist as open. PR #54 and #61 are the only open PRs and are addressed below.

| PR | Status | Action |
|----|--------|--------|
| #21 | Already closed | N/A |
| #22 | Already closed | N/A |
| #23 | Already closed | Reimplemented: `?debug=1` ErrorBoundary mode added in this pass |
| #24 | Already closed | N/A |
| #25 | Already closed | N/A |
| #26 | Already closed | N/A |
| #27 | Already closed | N/A |
| #31 | Already closed | N/A |
| #51 | Already closed | N/A |
| #54 | Open | CSP/popup fixes — partially overlaps; superseded by this pass |
| #61 | Open (draft) | Prior launch pass attempt — superseded by this pass |

## 3. File coordinate audit

| File | Expected | Actual | Status |
|------|----------|--------|--------|
| `index.html` L7–8 | `favicon_placeholder.png` | `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png` | **CHANGED** — already updated by prior PRs |
| `index.html` L28 | Inter font in `<noscript>` | No font link in noscript — just a JS-required message | **CHANGED** — Inter already removed |
| `src/App.jsx` L87,179–180 | `DiscountModal`, `CookieBanner`, `EmailPopup` unconditional | Present at L91, L186, L187 respectively | **MOVED** but functionally matches |
| `src/components/DiscountModal.jsx` ~L55 | `setTimeout(..., 5000)` | setTimeout at L67 with 5000ms, now consent-gated | **PRESENT** — still 5000ms delay |
| `src/components/EmailPopup.jsx` L7 | `DELAY_MS = 8000` | `DELAY_MS = 35000` (35 seconds) | **CHANGED** — delay increased |
| `src/components/legal/CookieBanner.jsx` L10–13 | `setVisible(true)` immediately | Conditional: `if (!stored) setVisible(true)` | **CHANGED** — now conditional |
| `src/components/Navbar.jsx` L117–127,172 | Partner links in aboutSections, "Start Here" top-level | Partner Program in servicesSections L85. No "Start Here" in nav. | **CHANGED** — restructured |
| `src/components/ProductCard.jsx` L53–101 | `<button>` nested in `<Link>` | `<button>` at L92–98 inside `<Link>` at L54 | **MATCHES** — needs fix |
| `src/pages/Home.jsx` L617,739 | Two duplicate Atelier Pre-Order sections | Single Atelier section at L316. Only 473 lines total. | **CHANGED** — duplicate already removed |
| `api/create-checkout-session.js` | No `checkRateLimit` call | `checkRateLimit` already present at L19 | **CHANGED** — already rate-limited |
| `vercel.json` crons | `/api/cron/post-purchase-emails` at `0 10 * * *` | Matches | **MATCHES** |
| `api/_utils/rateLimit.js` | Supabase-backed, fail-open, MAX_ENDPOINT_LENGTH=64 | Matches exactly | **MATCHES** |
| `lib/email.js` ~L226 | `uploadsHtml` IIFE | Present at L393 (file grew) | **MOVED** but present |

## 4. Summary

Many items from the original audit have already been addressed by merged PRs (#55–#60). The following items from the problem statement are **already done**:

- ✅ Favicon updated (no more placeholder)
- ✅ Inter removed from noscript
- ✅ Duplicate Atelier section removed
- ✅ Homepage is 7 sections
- ✅ Rate limiting on checkout endpoint
- ✅ `public/sitemap.xml` does not exist as committed file
- ✅ Skip-to-main-content link present
- ✅ `<main id="main-content">` wrapper present

Items **still needed** (addressed in this pass):

- ModalCoordinator (central popup sequencing)
- ProductCard nested-interactive fix
- 5-item top nav (currently: Shop, Collections, Services, About — needs Atelier mega menu + Journal)
- Partner links moved to footer
- ErrorBoundary `?debug=1` mode
- robots.txt update (missing admin/partners disallows)
- Breadcrumbs component
- Per-route JSON-LD
- useFocusTrap hook
- Journal pages
- ForProfessionals page
- Colour contrast fixes
- Reduced motion support
- Various SEO and feature enhancements
