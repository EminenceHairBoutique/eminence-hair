import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <>
      <SEO title="Order Confirmed" description="Your order has been successfully placed." />
      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <h1 className="text-3xl font-light mb-4">Thank you for your order</h1>
        <p className="text-neutral-600 max-w-md mx-auto mb-10">
          Your payment was successful. A confirmation email will be sent shortly.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3 rounded-full bg-black text-white text-[11px] tracking-[0.26em]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
