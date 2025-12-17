import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext";
import StripeProvider from "../components/StripeProvider";
import SEO from "../components/SEO";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CONSENT_VERSION = "v1.0"; // bump to v1.1 when policies change

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Checkout() {
  const { items = [], total = 0 } = useCart();

  // route-based "loading skeleton" feel
  const [pageLoading, setPageLoading] = useState(true);
  const rootRef = useRef(null);

  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, []);

  // focus lock: bring focus to checkout container on mount
  useEffect(() => {
    rootRef.current?.focus?.();
  }, [pageLoading]);

  // When submitting order, include consent in metadata
  const handleCheckout = async (paymentIntentId) => {
    const consent = {
      consent_version: CONSENT_VERSION,
      consent_timestamp: new Date().toISOString(),
      consent_source: "checkout",
      policies: {
        terms: CONSENT_VERSION,
        privacy: CONSENT_VERSION,
        returns: CONSENT_VERSION,
      },
    };

    const orderData = {
      items,
      total,
      paymentIntentId,

      // 🔐 Consent + evidence metadata
      metadata: {
        ...consent,
        product_urls: items.map((i) =>
          i.productUrl || `${window.location.origin}/product/${i.slug}`
        ),
        returns_url: `${window.location.origin}/returns`,
        terms_url: `${window.location.origin}/terms`,
      },
    };

    // Submit to your backend/API
    // await submitOrder(orderData);
  };

  return (
    <>
      <SEO
        title="Secure Checkout"
        description="Encrypted checkout with discreet packaging and verified luxury hair."
      />
      <div className="pt-28 pb-24 bg-[#FBF6ED]">
        <div
          ref={rootRef}
          tabIndex={-1}
          className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12 outline-none"
        >
            {/* LEFT — DETAILS */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
                <span className="font-medium text-neutral-900">Cart</span>
                <span>→</span>
                <span className="font-medium text-neutral-900">Information</span>
                <span>→</span>
                <span className="text-neutral-400">Payment</span>
              </div>

              <h1 className="text-2xl font-light mb-6">Checkout</h1>

              <div className="flex items-center gap-2 text-xs text-neutral-600 mb-8">
                <Lock className="w-4 h-4" />
                Secure & encrypted checkout · Verified payments
              </div>

              {pageLoading ? (
                <div className="space-y-4">
                  <div className="h-24 rounded-2xl bg-black/10 animate-pulse" />
                  <div className="h-24 rounded-2xl bg-black/10 animate-pulse" />
                </div>
              ) : (
                <StripeProvider>
                  <div className="space-y-6">
                    <div className="border border-neutral-200 rounded-2xl bg-white p-6">
                      <p className="text-xs text-neutral-500">
                        You will be securely redirected to Stripe to complete your purchase.
                      </p>
                    </div>
                  </div>
                </StripeProvider>
              )}
            </div>

            {/* RIGHT — SUMMARY */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 border border-neutral-200 rounded-2xl bg-white p-6">
                <h2 className="text-sm uppercase tracking-[0.22em] text-neutral-600 mb-6">
                  Order Summary
                </h2>

                {items.length === 0 ? (
                  <p className="text-sm text-neutral-500">Your cart is currently empty.</p>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.cartKey || `${item.id}::${item.variant || ""}`}
                        className="flex gap-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded-xl border"
                        />

                        <div className="flex-1">
                          <p className="text-sm">{item.name}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {(item.length ?? item.selectedLength) ? `${item.length ?? item.selectedLength}"` : "—"} ·{" "}
                            {(item.density ?? item.selectedDensity) ? `${item.density ?? item.selectedDensity}%` : "—"} · Qty {item.quantity}
                          </p>
                          {item.autoDefaultsApplied && (
                            <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-neutral-400">
                              Base configuration applied
                            </p>
                          )}
                        </div>

                        <p className="text-sm">{money(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{money(total)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between text-base font-medium pt-3">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                </div>

                <div className="mt-7 text-sm text-neutral-500">
                  or 4 interest-free payments of{" "}
                  <span className="font-medium">{money(total / 4)}</span> with Klarna or Afterpay
                </div>

                <p className="mt-4 text-xs text-neutral-350 text-center">
                  By completing your purchase, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-neutral-900">
                    Terms & Conditions
                  </Link>,{" "}
                  <Link to="/privacy" className="underline hover:text-neutral-900">
                    Privacy Policy
                  </Link>, and{" "}
                  <Link to="/returns" className="underline hover:text-neutral-900">
                    Returns & Exchanges Policy
                  </Link>.
                </p>

                <button
                  disabled={!items || items.length === 0}
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/create-checkout-session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          items: items.map(i => ({
                            name: i.name,
                            price: Number(i.price),
                            quantity: Number(i.quantity),
                          })),
                        }),
                      });

                      const text = await res.text();
                      console.log("FRONTEND RAW RESPONSE:", text);
                      const data = JSON.parse(text);

                      if (!data.url) throw new Error("No checkout URL");

                      window.location.href = data.url;
                    } catch (err) {
                      console.error("Checkout error:", err);
                      alert("Payment system error. Please try again.");
                    }
                  }}
                  className={`mt-6 w-full py-3 rounded-full text-[12px] tracking-[0.22em] ${
                    !items || items.length === 0
                      ? "bg-neutral-400 cursor-not-allowed"
                      : "bg-black text-white"
                  }`}
                >
                  Continue to Payment
                </button>

                <p className="mt-2 text-xs text-neutral-500 text-center">
                  SSL Encrypted Secure Payment Portal - Stripe.
                </p>

                <div className="mt-6 text-xs text-neutral-500 space-y-1">
                  <p>• Complimentary QC inspection</p>
                  <p>• Discreet, secure packaging</p>
                  <p>• Ships within 2–3 business days</p>
                </div>

                <Link
                  to="/shop"
                  className="block text-center text-xs text-neutral-600 mt-6 hover:text-neutral-900"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
