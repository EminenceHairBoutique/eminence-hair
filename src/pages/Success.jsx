import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Clock, Truck, PenLine } from "lucide-react";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";
import { trackPurchase } from "../utils/track";

const DEFAULT_PREORDER_LEAD_TIME_RANGE = "14–21 business days";

export default function Success() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isPreorder, setIsPreorder] = useState(false);
  const [leadTimeDays, setLeadTimeDays] = useState(null);

  useEffect(() => {
    if (!sessionId) return;

    // Detect preorder from snapshot saved before Stripe redirect.
    try {
      const snapRaw = window.localStorage.getItem("eminence_checkout_snapshot");
      const snap = snapRaw ? JSON.parse(snapRaw) : null;
      const items = Array.isArray(snap?.items) ? snap.items : [];
      const hasPreorder = items.some((i) => i.isPreorder);
      setIsPreorder(hasPreorder);
      if (hasPreorder && items.length > 0) {
        const leads = items.map((i) => Number(i.leadTimeDays || 0)).filter((n) => n > 0);
        const maxLead = leads.length > 0 ? Math.max(...leads) : 0;
        setLeadTimeDays(maxLead > 0 ? maxLead : null);
      }
    } catch {
      // ignore
    }

    // Purchase tracking (GA4 + Meta Pixel) — only fires after cookie consent.
    try {
      const lastTracked = window.localStorage.getItem("eminence_purchase_tracked_session");
      if (lastTracked !== sessionId) {
        const snapRaw = window.localStorage.getItem("eminence_checkout_snapshot");
        const snap = snapRaw ? JSON.parse(snapRaw) : null;

        const value =
          snap && typeof snap.total !== "undefined" ? Number(snap.total) : undefined;
        const items = Array.isArray(snap?.items) ? snap.items : [];

        trackPurchase({
          transaction_id: sessionId,
          value,
          items,
        });

        window.localStorage.setItem("eminence_purchase_tracked_session", sessionId);
        window.localStorage.removeItem("eminence_checkout_snapshot");
      }
    } catch {
      // ignore
    }

    // Only clear cart if Stripe session exists
    clearCart();
  }, [sessionId, clearCart]);

  return (
    <>
      <SEO
        title="Order Confirmed"
        description="Your Eminence Hair order has been successfully placed."
      />

      <div className="pt-32 pb-32 bg-[#FBF6ED] min-h-screen">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.32em] uppercase text-[#D4AF37] mb-4">Confirmed</p>
          <h1 className="text-3xl font-light font-display mb-4">
            Order Confirmed
          </h1>

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
                    Estimated dispatch: {leadTimeDays ? `${leadTimeDays} business days` : DEFAULT_PREORDER_LEAD_TIME_RANGE}
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
                    A tracking number will be emailed once your order has physically shipped.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-amber-800">
                <PenLine className="w-5 h-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-medium">Signature required</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    An adult signature is required upon delivery. Ensure someone is available.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              This is a factory drop-ship pre-order. All pre-order sales are final.
              No returns or exchanges. You'll receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          /* Standard order confirmation */
          <p className="text-neutral-600 max-w-md mx-auto mb-10">
            Your payment was successful and your order is now being prepared.
            A confirmation email has been sent with your order details.
          </p>
        )}

        {sessionId && (
          <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-400 mb-10">
            Reference · {sessionId.slice(-8)}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="px-8 py-3 rounded-full bg-[#111] text-[#F9F7F4] text-[11px] tracking-[0.26em] hover:bg-black transition uppercase"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account"
            className="px-8 py-3 rounded-full border border-neutral-300 text-[11px] tracking-[0.26em] hover:border-neutral-600 transition uppercase"
          >
            My Account
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}
