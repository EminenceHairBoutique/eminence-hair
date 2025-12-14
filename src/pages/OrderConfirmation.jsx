// src/pages/OrderConfirmation.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const summary = location.state?.summary;

  return (
    <div className="pt-32 pb-32 max-w-3xl mx-auto px-6 text-center">
      <h1 className="text-3xl font-display mb-3">Thank you, beautiful.</h1>
      <p className="text-sm text-neutral-700 mb-6">
        Your Eminence pieces are officially reserved. A confirmation email will
        be sent with your order details.
      </p>

      {summary && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-left text-sm text-neutral-700 mb-8">
          <p className="mb-2">
            <span className="font-medium">Name:</span> {summary.name}
          </p>
          <p className="mb-2">
            <span className="font-medium">Email:</span> {summary.email}
          </p>
          <p className="mb-4">
            <span className="font-medium">Total:</span> ${summary.total.toFixed(2)}
          </p>
          <p className="text-[11px] text-neutral-500">
            This is a frontend demo only. Connect Stripe / PayPal later to make
            this fully live.
          </p>
        </div>
      )}

      <Link
        to="/shop"
        className="inline-block px-8 py-3 rounded-full border border-black text-xs tracking-[0.26em] uppercase hover:bg-black hover:text-white transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
