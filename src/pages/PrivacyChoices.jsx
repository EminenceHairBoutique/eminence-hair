import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// Matches src/components/legal/CookieBanner.jsx
const STORAGE_KEY = "eminence_cookie_consent";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getDefaultConsent() {
  // Respect Global Privacy Control when present.
  const gpc = typeof navigator !== "undefined" && Boolean(navigator.globalPrivacyControl);
  return {
    necessary: true,
    analytics: !gpc,
    marketing: !gpc,
    timestamp: Date.now(),
  };
}

function readConsent() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage?.getItem?.(STORAGE_KEY);
  if (!raw) return null;
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;
  return {
    necessary: true,
    analytics: Boolean(parsed.analytics),
    marketing: Boolean(parsed.marketing),
    timestamp: Number(parsed.timestamp || Date.now()),
  };
}

function writeConsent(next) {
  if (typeof window === "undefined") return;
  window.localStorage?.setItem?.(
    STORAGE_KEY,
    JSON.stringify({
      necessary: true,
      analytics: Boolean(next.analytics),
      marketing: Boolean(next.marketing),
      timestamp: Date.now(),
    })
  );
}

export default function PrivacyChoices() {
  const gpc = useMemo(
    () => typeof navigator !== "undefined" && Boolean(navigator.globalPrivacyControl),
    []
  );

  const [consent, setConsent] = useState(() => readConsent() || getDefaultConsent());
  const [saved, setSaved] = useState(false);

  // If GPC is enabled, default to opting out of non-essential processing.
  useEffect(() => {
    if (!gpc) return;
    const existing = readConsent();
    if (!existing) {
      const next = getDefaultConsent();
      writeConsent(next);
      setConsent(next);
    }
  }, [gpc]);

  const save = () => {
    writeConsent(consent);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const acceptAll = () => {
    const next = { necessary: true, analytics: true, marketing: true, timestamp: Date.now() };
    setConsent(next);
    writeConsent(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const essentialOnly = () => {
    const next = { necessary: true, analytics: false, marketing: false, timestamp: Date.now() };
    setConsent(next);
    writeConsent(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <>
      <SEO
        title="Your Privacy Choices"
        description="Control how non-essential technologies are used on the Eminence Hair Boutique website."
      />
      <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-light tracking-wide">Your Privacy Choices</h1>
          <p className="text-sm text-neutral-600">
            Control how non-essential technologies are used on this site. Necessary features
            (like security and basic site functionality) are always enabled.
          </p>

          {gpc && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
              Global Privacy Control (GPC) appears to be enabled in your browser. We treat this
              as a request to opt out of non-essential analytics and marketing where applicable.
            </div>
          )}
        </header>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">Always on</p>
            <p className="text-lg font-light">Necessary</p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              These technologies help the site function and stay secure (for example: fraud
              prevention, basic performance, and remembering core settings). They can’t be
              switched off.
            </p>
          </div>

          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <p className="text-lg font-light">Analytics</p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Helps us understand how the site is used so we can improve content and
                  performance. If disabled, we won’t send analytics page-view events.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(consent.analytics)}
                  onChange={(e) => setConsent((c) => ({ ...c, analytics: e.target.checked }))}
                />
                Enabled
              </label>
            </div>

            <div className="flex items-start justify-between gap-6">
              <div className="space-y-1">
                <p className="text-lg font-light">Marketing</p>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Helps personalize content and measure marketing performance. If disabled, we
                  won’t enable marketing cookies/pixels where applicable.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(consent.marketing)}
                  onChange={(e) => setConsent((c) => ({ ...c, marketing: e.target.checked }))}
                />
                Enabled
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
            >
              {saved ? "Saved" : "Save preferences"}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={essentialOnly}
              className="rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
            >
              Essential only
            </button>
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            For more details about what we collect and how we use it, read our{" "}
            <Link to="/privacy" className="underline hover:text-neutral-900">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
    </>
  );
}
