import { Link } from "react-router-dom";
import { X, Minus, Plus, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";

const money = (n) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function CartDrawer() {
  const cart = useCart();

const isOpen = cart.isOpen ?? cart.isCartOpen ?? false;
const closeCart =
  cart.closeCart ??
  (() => cart.setIsOpen?.(false) ?? cart.setIsCartOpen?.(false));
const items = cart.items ?? cart.cartItems ?? [];
const total = cart.total ?? cart.cartTotal ?? 0;
const removeItem =
  cart.removeItem ?? cart.removeFromCart ?? (() => {});
const updateQty =
  cart.updateQty ?? cart.updateQuantity ?? (() => {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-[0_0_80px_rgba(0,0,0,0.35)] flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <p className="text-sm tracking-[0.22em] uppercase text-neutral-700">
            Shopping Bag
          </p>
          <button onClick={closeCart}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">
              Your bag is currently empty.
            </p>
          ) : (
            items.map((item) => (
              <div key={item.cartKey} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 rounded-xl object-cover border"
                />

                <div className="flex-1">
                  <p className="text-sm text-neutral-900">
                    {item.name}
                  </p>

                  <p className="text-xs text-neutral-500 mt-1">
                    {item.selectedLength}" · {item.selectedDensity}% · Qty {item.quantity}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border rounded-full">
                      <button
                        onClick={() =>
                          updateQty(item.cartKey, Math.max(1, item.quantity - 1))
                        }
                        className="px-3 py-1"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="px-2 text-xs">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.cartKey, item.quantity + 1)
                        }
                        className="px-3 py-1"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.cartKey)}
                      className="text-xs text-neutral-500 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="text-sm text-neutral-900">
                  {money(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="border-t border-neutral-200 px-6 py-6 space-y-5">

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{money(total)}</span>
          </div>

          <div className="text-xs text-neutral-500">
            or 4 interest-free payments of{" "}
            <span className="font-medium">
              {money(total / 4)}
            </span>{" "}
            with Klarna or Afterpay
          </div>

          <Link
            to="/checkout"
            onClick={closeCart}
            className="block w-full text-center bg-black text-white py-3 rounded-full text-[12px] tracking-[0.22em]"
          >
            Checkout
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <Lock className="w-3 h-3" />
            Secure & encrypted checkout
          </div>
        </div>
      </aside>
    </div>
  );
}
