import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Lock } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const money = (n) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export default function CartDrawer() {
  const {
    isOpen = false,
    closeCart,
    items = [],
    total = 0,
    removeItem = () => {},
    updateQuantity = () => {},
  } = useCart();

  // Keep a stable reference for key listeners without fighting exhaustive-deps.
  const closeCartRef = useRef(closeCart);
  useEffect(() => {
    closeCartRef.current = closeCart;
  }, [closeCart]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        closeCartRef.current?.();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={closeCart}
        />
      )}

      <Motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-white"
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <p className="text-sm tracking-[0.22em] uppercase">
            Shopping Bag
          </p>
          <button onClick={closeCart} aria-label="Close cart">
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
                  <p className="text-sm">{item.name}</p>

                  <p className="text-xs text-neutral-500 mt-1">
                    {item.selectedLength && `${item.selectedLength}"`}
                    {item.selectedDensity && ` · ${item.selectedDensity}%`}
                    {item.laceType && ` · ${item.laceType}`}
                    {item.capSize && ` · ${item.capSize}`}
                    {item.customColorTier && item.customColorTier !== "AS_LISTED" && ` · Color ${item.customColorTier}`}
                    {` · Qty ${item.quantity}`}
                  </p>

                  {item.isCustom && (
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-neutral-500">
                      Crafted to Order · Final Sale
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border rounded-full">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant,
                            Math.max(1, item.quantity - 1)
                          )
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
                          updateQuantity(item.id, item.variant, item.quantity + 1)
                        }
                        className="px-3 py-1"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.variant)}
                      className="text-xs text-neutral-500 hover:text-neutral-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="text-sm">
                  {money(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="border-t px-6 py-6 space-y-5">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{money(total)}</span>
          </div>

          <div className="text-xs text-neutral-500">
            Payment methods are displayed during secure Stripe Checkout.
          </div>

          <div className="h-px bg-neutral-200 my-2" />

          <Link
            to="/checkout"
            onClick={closeCart}
            className="block w-full text-center bg-black text-white py-3 rounded-full text-[12px] tracking-[0.22em]"
          >
            Secure Checkout
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <Lock className="w-3 h-3" />
            Secure & encrypted checkout
          </div>
        </div>
      </Motion.aside>
    </div>
  );
}
