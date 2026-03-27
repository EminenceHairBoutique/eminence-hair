// src/components/EmailPopup.jsx — First-visit email capture modal
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { subscribeEmail } from "../utils/subscribe";

const STORAGE_KEY = "eminence_email_popup_dismissed";
const DELAY_MS = 8000; // 8 seconds before showing

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Don't show if already dismissed or already subscribed
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    // Don't show if DiscountModal already claimed this session
    try {
      if (sessionStorage.getItem("eminence_discount_seen")) return;
    } catch {
      // ignore
    }

    // Wait for cookie consent decision before showing marketing popup
    const consentAlreadyDecided = !!localStorage.getItem("eminence_cookie_consent");

    let timer;
    let onConsent;

    const scheduleShow = () => {
      timer = setTimeout(() => setVisible(true), DELAY_MS);
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
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
      sessionStorage.setItem("eminence_email_popup_shown", "1");
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const trimmed = String(email || "").trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMsg("Please enter your email.");
      return;
    }

    try {
      setStatus("loading");
      setErrorMsg("");
      await subscribeEmail({ email: trimmed, source: "popup" });
      setStatus("success");
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter signup"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-[#F9F7F4] rounded-3xl max-w-md w-full p-8 shadow-2xl animate-modal-in">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-200 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <p className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37] mb-3">
              Welcome to Eminence
            </p>
            <p className="text-lg font-display font-light text-neutral-900 mb-2">
              You&apos;re on the list.
            </p>
            <p className="text-sm text-neutral-600">
              Watch your inbox for early access to new drops and your welcome offer.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37] mb-3">
              Private List
            </p>
            <h2 className="text-xl font-display font-light text-neutral-900 mb-2">
              Get 10% off your first order.
            </h2>
            <p className="text-sm text-neutral-600 mb-6">
              Join our private list for early access to drops, restock alerts, and a welcome code at checkout.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#111] transition"
                autoComplete="email"
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-6 py-2.5 text-xs tracking-[0.26em] uppercase bg-[#111] text-[#F9F7F4] rounded-full hover:bg-neutral-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Joining..." : "Join & Get 10% Off"}
              </button>
            </form>

            {status === "error" && errorMsg && (
              <p className="mt-2 text-xs text-red-600 text-center">{errorMsg}</p>
            )}

            <p className="mt-4 text-[10px] text-neutral-500 text-center">
              No spam — just launches, drops, and things worth knowing.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
