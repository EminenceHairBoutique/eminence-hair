// src/pages/OrderConfirmation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import SEO from "../components/SEO";

const OrderConfirmation = () => {
  const location = useLocation();
  const summary = location.state?.summary;

  return (
    <>
      <SEO
        title="Order Confirmed"
        description="Your order has been successfully placed with Eminence Hair Boutique."
      />

      <div className="pt-32 pb-32 max-w-3xl mx-auto px-6 text-center">
        <CheckCircle className="mx-auto mb-6 h-14 w-14 text-green-600" />

        <h1 className="text-3xl font-display mb-3">
          Thank you, beautiful.
        </h1>

        <p className="text-sm text-neutral-700 mb-8">
          Your Eminence pieces are officially reserved. A confirmation email will
          be sent with your order details.
        </p>

        <p className="mt-4 text-xs text-neutral-600">
          Your purchase is subject to our{" "}
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

        {/* EXISTING SUMMARY LOGIC — UNCHANGED */}
        {summary && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-left text-sm text-neutral-700 mb-8">
            <p className="mb-2">
              <span className="font-medium">Name:</span> {summary.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> {summary.email}
            </p>
            <p className="mb-4">
              <span className="font-medium">Total:</span> $
              {summary.total.toFixed(2)}
            </p>

            <p className="text-[11px] text-neutral-500">
              This is a frontend demo only. Connect Stripe / PayPal later to make
              this fully live.
            </p>
          </div>
        )}

        {/* NEW: WHAT HAPPENS NEXT (TRUST UX) */}
        <div className="bg-[#FBF6ED] border border-neutral-200 rounded-2xl p-6 text-left text-sm text-neutral-700 mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-3">
            What happens next
          </p>

          <ul className="space-y-2">
            <li>• Processing time: 2–5 business days</li>
            <li>• Quality inspection & discreet packaging</li>
            <li>• Shipping confirmation sent via email</li>
            <li>• Support available if you need anything</li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="px-8 py-3 rounded-full border border-black text-xs tracking-[0.26em] uppercase hover:bg-black hover:text-white transition"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account"
            className="px-8 py-3 rounded-full border border-neutral-300 text-xs tracking-[0.26em] uppercase hover:border-black transition"
          >
            View My Orders
          </Link>
        </div>

        <p className="mt-10 text-[11px] text-neutral-500">
          Questions? Email{" "}
          <a
            href="mailto:support@eminencehair.com"
            className="underline underline-offset-4"
          >
            support@eminencehair.com
          </a>
        </p>
      </div>
    </>
  );
};

export default OrderConfirmation;
