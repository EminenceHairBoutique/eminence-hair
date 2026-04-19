import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { setConsentMemory } from "../../lib/consentStore";
import { requestOpen, close, MODAL_IDS, SUPPRESSED_PATHS } from "../../utils/modalCoordinator";

const STORAGE_KEY = "eminence_cookie_consent";


export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const ownsSlotRef = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Belt: check suppressed paths before showing
        if (SUPPRESSED_PATHS.some(rx => rx.test(location.pathname))) return;
        // Braces: use coordinator
        if (requestOpen(MODAL_IDS.COOKIE)) {
          ownsSlotRef.current = true;
          setVisible(true);
        }
      }
    } catch {
      if (requestOpen(MODAL_IDS.COOKIE)) {
        ownsSlotRef.current = true;
        setVisible(true);
      }
    }
    return () => {
      if (ownsSlotRef.current) {
        close(MODAL_IDS.COOKIE);
        ownsSlotRef.current = false;
      }
    };
  }, [location.pathname]);

  // If the browser sends Global Privacy Control, default to essential-only unless
  // the user has already saved a preference.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const gpc = typeof navigator !== "undefined" && Boolean(navigator.globalPrivacyControl);
      if (!stored && gpc) {
        const gpcConsent = { necessary: true, analytics: false, marketing: false, timestamp: Date.now(), source: "gpc" };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(gpcConsent));
        } catch { /* localStorage blocked (e.g. Safari Private) — consent stored in-memory for this session only */
          setConsentMemory(gpcConsent);
        }
        setVisible(false);
    try { window.dispatchEvent(new Event("eminence_consent_updated")); } catch (_e) { /* ignore */ }
    try { window.dispatchEvent(new Event("eminence_consent_decided")); } catch (_e) { /* ignore */ }
      }
    } catch {
      // ignore
    }
  }, []);

  const acceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true, timestamp: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch { /* localStorage blocked (e.g. Safari Private) — consent stored in-memory for this session only */
      setConsentMemory(consent);
    }
    setVisible(false);
    ownsSlotRef.current = false;
    close(MODAL_IDS.COOKIE);
    try { window.dispatchEvent(new Event("eminence_consent_updated")); } catch (_e) { /* ignore */ }
    try { window.dispatchEvent(new Event("eminence_consent_decided")); } catch (_e) { /* ignore */ }
  };

  const acceptEssential = () => {
    const consent = { necessary: true, analytics: false, marketing: false, timestamp: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch { /* localStorage blocked (e.g. Safari Private) — consent stored in-memory for this session only */
      setConsentMemory(consent);
    }
    setVisible(false);
    ownsSlotRef.current = false;
    close(MODAL_IDS.COOKIE);
    try { window.dispatchEvent(new Event("eminence_consent_updated")); } catch (_e) { /* ignore */ }
    try { window.dispatchEvent(new Event("eminence_consent_decided")); } catch (_e) { /* ignore */ }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.25)] p-6">
        <div className="space-y-4">
          <p className="text-sm text-neutral-800 leading-relaxed">
            We use cookies and similar technologies to ensure the best experience,
            analyze traffic, and personalize content. You may accept all cookies
            or choose essential cookies only.
          </p>

          <p className="text-xs text-neutral-600">
            Learn more in our{" "}
            <Link to="/privacy" className="underline hover:text-neutral-900">
              Privacy Policy
            </Link>
            {" "}or manage preferences in{" "}
            <Link to="/privacy-choices" className="underline hover:text-neutral-900">
              Your Privacy Choices
            </Link>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={acceptAll}
              className="rounded-full px-6 text-[11px] tracking-[0.26em] uppercase"
            >
              Accept All
            </Button>

            <Button
              variant="outline"
              onClick={acceptEssential}
              className="rounded-full px-6 text-[11px] tracking-[0.26em] uppercase"
            >
              Essential Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
