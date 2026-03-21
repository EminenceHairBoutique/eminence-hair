import React, { useEffect, useState } from "react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { Clock, Truck, PenLine } from "lucide-react";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";
import { trackPurchase } from "../utils/track";

const DEFAULT_PREORDER_LEAD_TIME_RANGE = "14–21 business days";

// Verification states
const STATE_LOADING = "loading";
const STATE_VERIFIED = "verified";
const STATE_FAILED = "failed";
const STATE_NO_SESSION = "no_session";

export default function Success() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [verifyState, setVerifyState] = useState(
    sessionId ? STATE_LOADING : STATE_NO_SESSION
  );
  const [isPreorder, setIsPreorder] = useState(false);
  const [leadTimeDays, setLeadTimeDays] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setVerifyState(STATE_NO_SESSION);
      return;
    }

    // Read the pre-redirect cart snapshot for preorder detection.
    // Done before the async verify so UI can render optimistically on the
    // preorder branch once we know the session is valid.
    let snapItems = [];
    try {
      const snapRaw = window.localStorage.getItem("eminence_checkout_snapshot");
      const snap = snapRaw ? JSON.parse(snapRaw) : null;
      snapItems = Array.isArray(snap?.items) ? snap.items : [];
    } catch {
      // ignore parse errors
    }

    // Verify with the server before clearing cart or firing any tracking pixels.
    // This prevents cart clearing / tracking on:
    //  - manually crafted ?session_id= URLs
    //  - canceled / expired sessions
    //  - sessions that belong to a different site
    (async () => {
      try {
        const resp = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await resp.json().catch(() => ({}));

        if (!resp.ok || !data.ok) {
          setVerifyState(STATE_FAILED);
          return;
        }

        // Session is verified paid. Now safe to:
        //  1. Detect preorder (prefer server response, fall back to local snapshot)
        const serverIsPreorder = Boolean(data.isPreorder);
        const localIsPreorder = snapItems.some((i) => i.isPreorder);
        const preorder = serverIsPreorder || localIsPreorder;
        setIsPreorder(preorder);

        if (preorder) {
          const serverLead = data.leadTimeDays > 0 ? data.leadTimeDays : null;
          if (!serverLead) {
            const leads = snapItems
              .map((i) => Number(i.leadTimeDays || 0))
              .filter((n) => n > 0);
            setLeadTimeDays(leads.length > 0 ? Math.max(...leads) : null);
          } else {
            setLeadTimeDays(serverLead);
          }
        }

        //  2. Clear the cart (only on verified success)
        clearCart();

        //  3. Fire purchase tracking once per session
        try {
          const lastTracked = window.localStorage.getItem(
            "eminence_purchase_tracked_session"
          );
          if (lastTracked !== sessionId) {
            const snapRaw = window.localStorage.getItem(
              "eminence_checkout_snapshot"
            );
            const snap = snapRaw ? JSON.parse(snapRaw) : null;
            const value =
              snap && typeof snap.total !== "undefined"
                ? Number(snap.total)
                : data.amount != null
                ? data.amount / 100
                : undefined;
            const trackItems = Array.isArray(snap?.items) ? snap.items : [];

            trackPurchase({ transaction_id: sessionId, value, items: trackItems });

            window.localStorage.setItem(
              "eminence_purchase_tracked_session",
              sessionId
            );
            window.localStorage.removeItem("eminence_checkout_snapshot");
          }
        } catch {
          // tracking errors must never break the success page
        }

        setVerifyState(STATE_VERIFIED);
      } catch {
        // Network error — show verified anyway so the user isn't stuck;
        // the webhook already recorded the order server-side.
        setVerifyState(STATE_VERIFIED);
        clearCart();
      }
    })();
  }, [sessionId, clearCart]);

  // No session_id in the URL — redirect to home rather than showing a blank page.
  if (verifyState === STATE_NO_SESSION) {
    return <Navigate to="/" replace />;
  }

  // Session verification explicitly failed (payment not complete / unknown session).
  if (verifyState === STATE_FAILED) {
    return (
      <>
        <SEO title="Session Invalid" noindex={true} />
        <div className="pt-32 pb-32 bg-[#FBF6ED] text-center px-6">
          <h1 className="text-2xl font-light mb-4">Unable to confirm order</h1>
          <p className="text-neutral-600 max-w-md mx-auto mb-8">
            We could not verify your payment session. If you completed a purchase,
            your order has been recorded and you will receive a confirmation email.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/shop"
              className="px-8 py-3 rounded-full bg-black text-white text-[11px] tracking-[0.26em]"
            >
              Continue Shopping
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 rounded-full border border-black text-[11px] tracking-[0.26em]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Loading state while verifying.
  if (verifyState === STATE_LOADING) {
    return (
      <>
        <SEO title="Confirming Order…" noindex={true} />
        <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
          <p className="text-neutral-500 text-sm tracking-wide">
            Confirming your order…
          </p>
        </div>
      </>
    );
  }

  // STATE_VERIFIED
  return (
    <>
      <SEO
        title="Order Confirmed"
        description="Your Eminence Hair order has been successfully placed."
        noindex={true}
      />

      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <h1 className="text-3xl font-light mb-4">Order Confirmed</h1>

        <p className="text-neutral-600 max-w-md mx-auto mb-6">
          Thank you for choosing <strong>Eminence Hair</strong>.
        </p>

        {isPreorder ? (
          /* Preorder-specific confirmation */
          <div className="max-w-md mx-auto mb-10 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-left space-y-4">
              <p className="text-sm font-medium text-amber-900 text-center">
                Pre-Order Confirmation
              </p>

              <div className="flex items-center gap-3 text-sm text-amber-800">
                <Clock className="w-5 h-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium">
                    Estimated dispatch:{" "}
                    {leadTimeDays
                      ? `${leadTimeDays} business days`
                      : DEFAULT_PREORDER_LEAD_TIME_RANGE}
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Your order enters the factory queue immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-amber-800">
                <Truck className="w-5 h-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium">Tracking will be sent when shipped</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    A tracking number will be emailed once your order has physically
                    shipped.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-amber-800">
                <PenLine className="w-5 h-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium">Signature required</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    An adult signature is required upon delivery. Ensure someone is
                    available.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              This is a factory drop-ship pre-order. All pre-order sales are final.
              No returns or exchanges. You&apos;ll receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          /* Standard order confirmation */
          <p className="text-neutral-600 max-w-md mx-auto mb-10">
            Your payment was successful and your order is now being prepared. A
            confirmation email has been sent with your order details.
          </p>
        )}

        {sessionId && (
          <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-400 mb-10">
            Stripe Session · {sessionId.slice(-8)}
          </p>
        )}

        <div className="flex justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3 rounded-full bg-black text-white text-[11px] tracking-[0.26em]"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account"
            className="px-8 py-3 rounded-full border border-black text-[11px] tracking-[0.26em]"
          >
            View Orders
          </Link>
        </div>
      </div>
    </>
  );
}
