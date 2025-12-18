import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";

export default function Success() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Only clear cart if Stripe session exists
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <>
      <SEO
        title="Order Confirmed"
        description="Your Eminence Hair order has been successfully placed."
      />

      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <h1 className="text-3xl font-light mb-4">
          Order Confirmed
        </h1>

        <p className="text-neutral-600 max-w-md mx-auto mb-6">
          Thank you for choosing <strong>Eminence Hair</strong>.
        </p>

        <p className="text-neutral-600 max-w-md mx-auto mb-10">
          Your payment was successful and your order is now being prepared.
          A confirmation email has been sent with your order details.
        </p>

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
