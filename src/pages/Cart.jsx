import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!cartItems.length) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-light">Your bag is empty</h1>
        <Link
          to="/shop"
          className="inline-block mt-6 text-[11px] tracking-[0.26em] uppercase underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#FBF5EC]">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-light mb-12">Shopping Bag</h1>

        <div className="space-y-10">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.variant || ""}`}
              className="flex gap-6 border-b pb-8"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-24 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h2 className="text-lg font-light">{item.name}</h2>
                <p className="mt-2 text-sm text-neutral-600">
                  {item.length}&quot; · {item.density}% Density
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, item.variant, Number(e.target.value))
                    }
                    className="border rounded-full px-3 py-1 text-sm"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeFromCart(item.id, item.variant)}
                    className="text-xs uppercase tracking-wide text-neutral-500 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-light">
                  ${item.price.toFixed(0)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-16 flex justify-between items-center">
          <div>
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
              Subtotal
            </p>
            <p className="mt-1 text-3xl font-light">
              ${subtotal.toFixed(0)}
            </p>
          </div>

          <Link
            to="/checkout"
            className="px-10 py-4 rounded-full bg-neutral-900 text-white"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
