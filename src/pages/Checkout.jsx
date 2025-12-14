import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCart } from "../context/CartContext";

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function Checkout() {
  const { items = [], total = 0 } = useCart();

  return (
    <div className="pt-28 pb-24 bg-[#FBF6ED]">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        {/* LEFT — DETAILS */}
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-light mb-6">Checkout</h1>

          {/* trust line */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-8">
            <Lock className="w-4 h-4" />
            Secure checkout · Encrypted payments
          </div>

          {/* placeholder form */}
          <div className="space-y-6">
            <div className="border border-neutral-200 rounded-2xl bg-white p-6">
              <p className="text-sm text-neutral-500">
                Checkout form will be connected at payment-integration stage.
              </p>
            </div>
          </div>
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
                  <div key={item.cartKey || `${item.id}::${item.variant || ""}`} className="flex gap-4">
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

            {/* pay later */}
            <div className="mt-5 text-xs text-neutral-500">
              or 4 interest-free payments of{" "}
              <span className="font-medium">{money(total / 4)}</span> with Klarna or Afterpay
            </div>

            {/* CTA */}
            <button
              disabled
              className="mt-6 w-full bg-black text-white py-3 rounded-full text-[12px] tracking-[0.22em] opacity-70 cursor-not-allowed"
            >
              Continue to Payment
            </button>

            {/* reassurance */}
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
  );
}
