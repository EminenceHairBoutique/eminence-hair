import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

const SESSION_KEY = "eminence_cart_banner_dismissed";

function markDismissed() {
  try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
}

export default function AbandonedCartBanner() {
  const { items, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const hasCancelledOut =
    !location.pathname.includes("checkout") &&
    !location.pathname.includes("cart") &&
    !location.pathname.includes("success") &&
    !location.pathname.includes("cancel");

  useEffect(() => {
    // Reset trigger on route change
    setTriggered(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!hasCancelledOut) return;
    if (items.length === 0) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    if (triggered) return;

    let exited = false;

    const onMouseOut = (e) => {
      if (exited) return;
      if (e.clientY <= 10) {
        exited = true;
        setTriggered(true);
        setVisible(true);
      }
    };

    document.addEventListener("mouseout", onMouseOut, { passive: true });
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [items.length, hasCancelledOut, triggered]);

  const dismiss = () => {
    setVisible(false);
    markDismissed();
  };

  if (!visible || items.length === 0) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 text-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl animate-banner-in"
    >
      <p className="text-sm leading-snug">
        You left something behind 👀 — complete your order before it sells out!
      </p>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            dismiss();
            openCart ? openCart() : navigate("/cart");
          }}
          className="px-5 py-2 rounded-full bg-[#c9a84c] text-neutral-900 text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-[#d4b55e] transition"
        >
          Go to Cart
        </button>

        <button
          type="button"
          onClick={dismiss}
          className="p-1.5 rounded-full hover:bg-white/10 transition"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
