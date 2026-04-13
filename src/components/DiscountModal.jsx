import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Button } from "./ui/button";
import { safeSessionGet, safeSessionSet, safeLocalGet, safeLocalSet } from "../utils/storage";

// SMS-only discount modal (Twilio Verify)
// Reveals a promo code *after* phone verification.

const DEFAULT_COUNTRIES = [
  { label: "US", code: "+1" },
  { label: "UK", code: "+44" },
  { label: "AUS", code: "+61" },
  { label: "NG", code: "+234" },
  { label: "SA", code: "+27" },
];

export default function DiscountModal() {
  const { user } = useUser();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  // Step: phone → code → success
  const [step, setStep] = useState("phone");

  const [countryCode, setCountryCode] = useState("+1");
  const [localNumber, setLocalNumber] = useState("");
  const [code, setCode] = useState("");

  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [discountCode, setDiscountCode] = useState("WELCOME10");

  const phone = useMemo(() => {
    const digits = String(localNumber || "").replace(/\D/g, "");
    if (!digits) return "";
    return `${countryCode}${digits}`;
  }, [countryCode, localNumber]);

  useEffect(() => {
    // Don’t show if logged in
    if (user) return;

    // Don’t show during checkout
    if (location.pathname.includes("checkout")) return;

    // Don’t show repeatedly
    if (safeSessionGet("eminence_discount_seen")) return;

    // Don’t show if already verified previously
    if (safeLocalGet("eminence_sms_verified") === "true") return;

    // Don’t show if EmailPopup was already shown/dismissed this session
    if (safeSessionGet("eminence_email_popup_shown")) return;

    // Wait for cookie consent decision before showing marketing popup
    const consentAlreadyDecided = !!safeLocalGet("eminence_cookie_consent");

    let timer;
    let onConsent;

    const scheduleShow = () => {
      if (safeSessionGet("eminence_email_popup_shown")) return;
      timer = setTimeout(() => {
        if (!safeSessionGet("eminence_email_popup_shown")) {
          setOpen(true);
          safeSessionSet("eminence_discount_seen", "true");
        }
      }, 5000);
    };

    if (consentAlreadyDecided) {
      scheduleShow();
    } else {
      onConsent = () => {
        scheduleShow();
        window.removeEventListener("eminence_consent_decided", onConsent);
      };
      window.addEventListener("eminence_consent_decided", onConsent);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (onConsent) window.removeEventListener("eminence_consent_decided", onConsent);
    };
  }, [user, location.pathname]);

  if (!open) return null;

  const close = () => setOpen(false);

  const startVerification = async () => {
    setError("");
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }
    if (!consent) {
      setError("Please confirm SMS consent.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/sms-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          consent,
          source: "discount_modal",
          path: window.location.pathname,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to send code.");

      setStep("code");
    } catch (e) {
      setError(e?.message || "Unable to send code.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError("");
    const next = String(code || "").trim();
    if (!next) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/sms-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code: next,
          consent,
          source: "discount_modal",
          path: window.location.pathname,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Verification failed.");

      if (!data?.verified) {
        throw new Error(data?.error || "Incorrect code. Please try again.");
      }

      setDiscountCode(data?.discountCode || "WELCOME10");
      safeLocalSet("eminence_sms_verified", "true");
      safeLocalSet("eminence_sms_verified_phone", phone);
      setStep("success");
    } catch (e) {
      setError(e?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Unlock your first-order gift"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.35)] overflow-hidden">
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-neutral-700 hover:text-black hover:bg-white transition"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="grid md:grid-cols-2">
          {/* LEFT */}
          <div className="p-8 md:p-10">
            <p className="text-xs tracking-[0.28em] uppercase text-neutral-500 mb-3">
              Want to save big?
            </p>
            <h2 className="text-3xl font-light leading-tight mb-3">
              Unlock your first-order gift
            </h2>
            <p className="text-sm text-neutral-600 mb-6">
              Verify your number to receive a welcome code for your first purchase.
              Premium hair. Premium perks.
            </p>

            {step === "phone" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-[92px] border border-neutral-300 rounded-full px-3 py-3 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    aria-label="Country code"
                  >
                    {DEFAULT_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label} {c.code}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="Phone number"
                    value={localNumber}
                    onChange={(e) => setLocalNumber(e.target.value)}
                    className="flex-1 border border-neutral-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-neutral-500">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I agree to receive SMS messages from Eminence. Message & data rates may apply.
                  </span>
                </label>

                <Button
                  disabled={loading}
                  className="w-full rounded-full text-xs tracking-[0.25em] uppercase"
                  onClick={startVerification}
                >
                  {loading ? "Sending..." : "Text me the code"}
                </Button>
              </div>
            )}

            {step === "code" && (
              <div className="space-y-4">
                <p className="text-xs text-neutral-500">
                  We sent a verification code to <span className="text-neutral-900">{phone}</span>
                </p>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-neutral-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    disabled={loading}
                    className="flex-1 rounded-full text-xs tracking-[0.25em] uppercase"
                    onClick={() => {
                      setStep("phone");
                      setCode("");
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    disabled={loading}
                    className="flex-1 rounded-full text-xs tracking-[0.25em] uppercase"
                    onClick={verifyCode}
                  >
                    {loading ? "Verifying..." : "Unlock"}
                  </Button>
                </div>

                <button
                  type="button"
                  className="text-xs text-neutral-500 underline hover:text-neutral-900"
                  onClick={startVerification}
                >
                  Resend code
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="space-y-4">
                <p className="text-xs tracking-[0.28em] uppercase text-neutral-500">
                  Your code
                </p>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-2xl font-light tracking-wide text-neutral-900">
                    {discountCode}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Apply at checkout. Limited-time welcome gift.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full text-xs tracking-[0.25em] uppercase"
                    onClick={() => {
                      try {
                        navigator.clipboard.writeText(discountCode);
                      } catch (_e) {
                        // clipboard not available
                      }
                    }}
                  >
                    Copy code
                  </Button>

                  <Button
                    className="flex-1 rounded-full text-xs tracking-[0.25em] uppercase"
                    onClick={close}
                  >
                    Start shopping
                  </Button>
                </div>

                <p className="text-[11px] text-neutral-400">
                  By subscribing, you consent to receive order updates and occasional offers.
                  Reply STOP to unsubscribe.
                </p>
              </div>
            )}

            {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
          </div>

          {/* RIGHT (image) */}
          <div className="hidden md:block relative">
            <img
              src="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp"
              alt="Eminence"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/25 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
