import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Cancel() {
  return (
    <>
      <SEO title="Payment Cancelled" description="Your payment was cancelled." noindex={true} />
      <div className="pt-32 pb-32 bg-[#FBF6ED] min-h-screen text-center flex flex-col items-center justify-center">
        <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-400 mb-4">Checkout</p>
        <h1 className="text-3xl font-light font-display mb-3">Payment not completed.</h1>
        <p className="text-neutral-500 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
          No charge was made. Your items are still in your bag — you can return to checkout anytime.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/checkout"
            className="px-8 py-3 rounded-full bg-[#111] text-[#F9F7F4] text-[11px] uppercase tracking-[0.26em] hover:bg-black transition"
          >
            Return to Checkout
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.26em] hover:border-neutral-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
