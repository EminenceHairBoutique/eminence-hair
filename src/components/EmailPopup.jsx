import { useState, useEffect, useCallback } from "react";
import { subscribeEmail } from "../utils/subscribe";

const STORAGE_KEY = "eminence_popup_shown";
const SUPPRESS_DAYS = 7;

function isSuppressed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < SUPPRESS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function suppress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now() }));
  } catch {
    // ignore
  }
}

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const dismiss = useCallback(() => {
    setVisible(false);
    suppress();
  }, []);

  useEffect(() => {
    if (isSuppressed()) return;

    let exitBound = false;

    // Trigger 1: 8-second delay
    const timer = setTimeout(() => {
      if (!isSuppressed()) setVisible(true);
    }, 8000);

    // Trigger 2: exit intent (desktop only — mouse moves near top of viewport)
    const onMouseOut = (e) => {
      if (exitBound) return;
      if (e.clientY <= 10) {
        exitBound = true;
        if (!isSuppressed()) setVisible(true);
        clearTimeout(timer);
      }
    };

    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await subscribeEmail({ email: trimmed, source: "popup_vip" });
      setStatus("success");
      suppress();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        String(err?.message || "").includes("already") ||
          String(err?.message || "").toLowerCase().includes("exist")
          ? "You're already on the list — check your inbox!"
          : "Something went wrong. Please try again."
      );
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-popup-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#FBF6EE] rounded-3xl shadow-2xl p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 transition"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center space-y-4 py-4">
            <p className="text-2xl">✨</p>
            <p className="text-[15px] font-medium text-neutral-900 tracking-wide">
              Welcome to the VIP List
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Your 10% off code is on its way to your inbox. Keep an eye out for early access drops too.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-[11px] tracking-[0.22em] uppercase hover:bg-neutral-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Brand mark */}
            <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-400 mb-6">
              Eminence Hair Boutique
            </p>

            <h2
              id="email-popup-title"
              className="font-display text-2xl sm:text-3xl text-neutral-900 leading-snug mb-3"
            >
              Join the Eminence VIP List
            </h2>

            <p className="text-sm text-neutral-600 leading-relaxed mb-7">
              Get 10% off your first order + early access to new drops.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-full border border-neutral-300 bg-white text-sm placeholder-neutral-400 outline-none focus:border-neutral-500 transition"
                disabled={status === "loading"}
              />

              {status === "error" && (
                <p className="text-xs text-red-600 px-1">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 rounded-full bg-neutral-900 text-white text-[11px] tracking-[0.26em] uppercase hover:bg-neutral-700 disabled:opacity-60 transition"
              >
                {status === "loading" ? "Sending…" : "Claim My 10% Off"}
              </button>
            </form>

            <button
              type="button"
              onClick={dismiss}
              className="mt-5 w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
