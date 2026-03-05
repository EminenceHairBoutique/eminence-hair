import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import StripeProvider from "../components/StripeProvider";
import SEO from "../components/SEO";
import { trackBeginCheckout } from "../utils/track";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CONSENT_VERSION = "v1.0"; // bump to v1.1 when policies change
const REFERRAL_KEY = "eminence_referral";

function readReferralCode() {
  try {
    const raw = window?.localStorage?.getItem?.(REFERRAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.code || null;
  } catch {
    return null;
  }
}

export default function Checkout() {
  const { items = [], total = 0 } = useCart();
  const { user } = useUser();

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
                          {(item.length ?? item.selectedLength)
                            ? `${item.length ?? item.selectedLength}"`
                            : "—"} ·{" "}
                          {(item.density ?? item.selectedDensity)
                            ? `${item.density ?? item.selectedDensity}%`
                            : "—"}
                          {item.customColorTier && item.customColorTier !== "AS_LISTED"
                            ? ` · Color ${item.customColorTier}`
                            : ""} · Qty {item.quantity}
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

              <p className="mt-4 text-xs text-neutral-350 text-center">
                By completing your purchase, you agree to our{" "}
                <Link to="/terms" className="underline hover:text-neutral-900">
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link to="/privacy" className="underline hover:text-neutral-900">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link to="/returns" className="underline hover:text-neutral-900">
                  Returns & Exchanges Policy
                </Link>
                .
              </p>

              <button
                disabled={!items || items.length === 0}
                onClick={async () => {
                  try {
                    // Save a lightweight snapshot so we can fire a Purchase event after Stripe redirects back.
                    try {
                      window.localStorage.setItem(
                        "eminence_checkout_snapshot",
                        JSON.stringify({ items, total, currency: "USD", timestamp: Date.now() })
                      );
                    } catch (_e) { /* ignore */ }

                    // Track begin checkout (GA4 + Meta Pixel) — only fires after consent.
                    trackBeginCheckout({ items, value: total });

                    const res = await fetch("/api/create-checkout-session", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        // IMPORTANT: send product identifiers + selected configuration.
                        // Server computes final price to prevent client-side tampering.
                        items: items.map((i) => ({
                          id: i.id,
                          slug: i.slug,
                          name: i.name,
                          image: i.image,
                          quantity: Number(i.quantity) || 1,

                          // configuration (null => server will apply safe defaults)
                          length: i.length ?? i.selectedLength ?? null,
                          density: i.density ?? i.selectedDensity ?? null,
                          lace: i.lace ?? null,
                          color: i.color ?? null,

                          // custom (wigs only, ignored for bundles)
                          isCustom: Boolean(i.isCustom),
                          customNotes: i.customNotes ?? "",
                          customColorTier: i.customColorTier ?? null,
                          capSize: i.capSize ?? null,
                        })),

                        // Logged-in mapping (used for order history + loyalty)
                        userId: user?.id || null,
                        customerEmail: user?.email || null,

                        // Referral attribution (captured from ?ref=CODE URL param)
                        referralCode: readReferralCode() || undefined,

                        consentVersion: CONSENT_VERSION,
                      }),
                    });

                    if (!res.ok) {
                      const errText = await res.text();
                      throw new Error(errText || "Checkout API error");
                    }

                    const data = await res.json();

                    if (!data?.url) {
                      throw new Error("Stripe checkout URL missing");
                    }

                    // 🔐 Redirect to Stripe Checkout
                    window.location.assign(data.url);
                  } catch (err) {
                    console.error("Checkout error:", err);
                    alert(
                      "Payment system is temporarily unavailable. Please refresh and try again."
                    );
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
                <p>• Ships within 2–3 business days (in-stock items)</p>
                <p>• Custom pieces: lead times vary</p>
                <p>• All sales final (see Returns Policy)</p>
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
