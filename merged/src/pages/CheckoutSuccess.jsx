import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ef] px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-light tracking-wide mb-4">
          Thank you for your order
        </h1>

        <p className="text-sm text-neutral-600 mb-8">
          Your payment was successful. A confirmation email will be sent shortly.
        </p>

        <div className="space-y-4">
          <Link
            to="/shop"
            className="block w-full bg-black text-white py-3 rounded-full text-[11px] tracking-[0.22em]"
          >
            Continue Shopping
          </Link>

          <Link
            to="/account/orders"
            className="block text-xs tracking-wide text-neutral-500 underline"
          >
            View my orders
          </Link>
        </div>

        <p className="mt-10 text-[11px] text-neutral-400">
          Complimentary QC inspection · Discreet packaging · Ships in 2–3 business days
        </p>
      </div>
    </div>
  );
}
