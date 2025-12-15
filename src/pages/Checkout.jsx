import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import StripeProvider from "../components/StripeProvider";
import SEO from "../components/SEO";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function Checkout() {
  const { items = [], total = 0, isOpen } = useCart();

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

  return (
    <>
      <SEO
        title="Secure Checkout"
        description="Encrypted checkout with discreet packaging and verified luxury hair."
      />
      <div className="pt-28 pb-24 bg-[#FBF6ED]">
        <div className={`${isOpen ? "blur-sm" : ""} transition`}>
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
                      <p className="text-sm text-neutral-500">
                        Checkout form will be connected at payment-integration stage.
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
                            {item.selectedLength ? `${item.selectedLength}"` : "—"} ·{" "}
                            {item.selectedDensity ? `${item.selectedDensity}%` : "—"} · Qty{" "}
                            {item.quantity}
                          </p>
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

                <div className="mt-5 text-xs text-neutral-500">
                  or 4 interest-free payments of{" "}
                  <span className="font-medium">{money(total / 4)}</span> with Klarna or Afterpay
                </div>

                <button
                  disabled
                  className="mt-6 w-full bg-black text-white py-3 rounded-full text-[12px] tracking-[0.22em] opacity-70 cursor-not-allowed"
                >
                  Continue to Payment
                </button>

                <p className="mt-2 text-xs text-neutral-500 text-center">
                  Payment will be enabled once checkout is connected.
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
      </div>
    </>
  );
}
