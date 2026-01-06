import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Cancel() {
  return (
    <>
      <SEO title="Payment Cancelled" description="Your payment was cancelled." />
      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <h1 className="text-3xl font-light mb-4">Payment cancelled</h1>
        <p className="text-neutral-600 max-w-md mx-auto mb-10">
          Your payment was not completed. You can return to checkout or continue browsing.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/checkout"
            className="px-8 py-3 rounded-full bg-black text-white text-[11px] tracking-[0.26em]"
          >
            Return to Checkout
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 rounded-full border border-black text-[11px] tracking-[0.26em]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
