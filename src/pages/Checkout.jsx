import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, AlertTriangle, Truck, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import StripeProvider from "../components/StripeProvider";
import SEO from "../components/SEO";
import { trackBeginCheckout } from "../utils/track";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CONSENT_VERSION = "v1.0"; // bump to v1.1 when policies change
const REFERRAL_KEY = "eminence_referral";
const DEFAULT_PREORDER_LEAD_DAYS = 21;

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

/** Modal shown when cart contains both preorder + domestic items */
function MixedCartModal({ onCheckoutDomestic, onCheckoutPreorder, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>

        <h2 className="text-lg font-light mb-3">Mixed Cart Detected</h2>

        <p className="text-sm text-neutral-600 leading-relaxed mb-6">
          Your cart contains <strong>domestic</strong> and{" "}
          <strong>pre-order (factory drop-ship)</strong> items. These cannot
          be shipped together. Please checkout separately to avoid delays.
        </p>

        <div className="space-y-3">
          <button
            onClick={onCheckoutDomestic}
            className="w-full py-3 rounded-full bg-black text-white text-[12px] tracking-[0.22em]"
          >
            Checkout Domestic Items
          </button>
          <button
            onClick={onCheckoutPreorder}
            className="w-full py-3 rounded-full border border-neutral-900 text-[12px] tracking-[0.22em] flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Checkout Pre-Order Items
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-900"
          >
            Go back to cart
          </button>
        </div>

        <p className="mt-4 text-[11px] text-neutral-400 leading-relaxed">
          Pre-order items ship factory direct (14–21 business days).
          Domestic items ship within 2–3 business days.
        </p>
      </div>
    </div>
  );
}

async function buildAndRedirectCheckout({ items, user, filterFn, onError }) {
  try {
    const filteredItems = filterFn ? items.filter(filterFn) : items;
    const filteredTotal = filteredItems.reduce(
      (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
      0
    );

    try {
      window.localStorage.setItem(
        "eminence_checkout_snapshot",
        JSON.stringify({
          items: filteredItems,
          total: filteredTotal,
          currency: "USD",
          timestamp: Date.now(),
        })
      );
    } catch (_e) { /* ignore */ }

    trackBeginCheckout({ items: filteredItems, value: filteredTotal });

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: filteredItems.map((i) => ({
          id: i.id,
          slug: i.slug,
          name: i.name,
          image: i.image,
          quantity: Number(i.quantity) || 1,
          length: i.length ?? i.selectedLength ?? null,
          density: i.density ?? i.selectedDensity ?? null,
          lace: i.lace ?? null,
          color: i.color ?? null,
          isCustom: Boolean(i.isCustom),
          customNotes: i.customNotes ?? "",
          customColorTier: i.customColorTier ?? null,
          capSize: i.capSize ?? null,
          // RTI package fields
          rtiPackageId: i.rtiPackageId ?? null,
          rtiMode: i.rtiMode ?? null,
          // Preorder fields
          isPreorder: Boolean(i.isPreorder),
          shipsFrom: i.shipsFrom ?? "Domestic",
          leadTimeDays: i.leadTimeDays ?? null,
          qualityTier: i.qualityTier ?? null,
        })),
        userId: user?.id || null,
        customerEmail: user?.email || null,
        referralCode: readReferralCode() || undefined,
        consentVersion: CONSENT_VERSION,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Checkout API error");
    }

    const data = await res.json();
    if (!data?.url) throw new Error("Stripe checkout URL missing");
    window.location.assign(data.url);
  } catch (err) {
    console.error("Checkout error:", err);
    if (onError) onError(err);
  }
}

export default function Checkout() {
  const { items = [], total = 0 } = useCart();
  const { user } = useUser();

  const [pageLoading, setPageLoading] = useState(true);
  const [showMixedModal, setShowMixedModal] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    rootRef.current?.focus?.();
  }, [pageLoading]);

  const hasPreorder = items.some((i) => i.isPreorder);
  const hasDomestic = items.some((i) => !i.isPreorder);
  const isMixed = hasPreorder && hasDomestic;

  const onError = (err) => {
    setCheckoutError(err?.message || "Payment system is temporarily unavailable. Please refresh and try again.");
  };

  async function handleCheckout() {
    setCheckoutError(null);
    if (isMixed) {
      setShowMixedModal(true);
      return;
    }
    await buildAndRedirectCheckout({ items, user, onError });
  }

  async function handleCheckoutDomestic() {
    setShowMixedModal(false);
    setCheckoutError(null);
    await buildAndRedirectCheckout({
      items,
      user,
      filterFn: (i) => !i.isPreorder,
      onError,
    });
  }

  async function handleCheckoutPreorder() {
    setShowMixedModal(false);
    setCheckoutError(null);
    await buildAndRedirectCheckout({
      items,
      user,
      filterFn: (i) => i.isPreorder,
      onError,
    });
  }

  return (
    <>
      <SEO
        title="Secure Checkout"
        description="Encrypted checkout with discreet packaging and verified luxury hair."
      />

      {showMixedModal && (
        <MixedCartModal
          onCheckoutDomestic={handleCheckoutDomestic}
          onCheckoutPreorder={handleCheckoutPreorder}
          onClose={() => setShowMixedModal(false)}
        />
      )}

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

            {/* Mixed cart warning banner */}
            {isMixed && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <p className="font-medium mb-1">Mixed cart — separate checkout required</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Your cart contains domestic + pre-order items. Clicking
                    "Continue to Payment" will prompt you to choose which to checkout first.
                  </p>
                </div>
              </div>
            )}

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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='96' viewBox='0 0 80 96'%3E%3Crect width='80' height='96' fill='%23f5f1eb'/%3E%3C/svg%3E";
                        }}
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
                        {item.isPreorder && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-amber-700">
                            <Truck className="w-3 h-3" />
                            <span>Pre-Order · {item.leadTimeDays ?? DEFAULT_PREORDER_LEAD_DAYS} days</span>
                          </div>
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

              {checkoutError && (
                <p className="mt-3 text-xs text-red-600 text-center">{checkoutError}</p>
              )}

              <button
                disabled={!items || items.length === 0}
                onClick={handleCheckout}
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
                {hasPreorder && (
                  <p className="text-amber-700">
                    • Pre-order items: 14–21 business days (factory drop-ship)
                  </p>
                )}
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

