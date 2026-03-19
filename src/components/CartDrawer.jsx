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
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      <Motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-[#FAF8F5] flex flex-col"
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 bg-white">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-800">
              Shopping Bag
            </p>
            {items.length > 0 && (
              <p className="text-[10px] text-neutral-400 mt-0.5">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 rounded-full hover:bg-neutral-100 transition"
          >
            <X className="w-4 h-4 text-neutral-700" />
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="pt-10 text-center">
              <p className="text-sm text-neutral-500 mb-1">Your bag is empty.</p>
              <p className="text-xs text-neutral-400">Add a piece to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartKey} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 rounded-2xl object-cover border border-neutral-100"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 leading-snug">{item.name}</p>

                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                    {item.selectedLength && `${item.selectedLength}"`}
                    {item.selectedDensity && ` · ${item.selectedDensity}%`}
                    {item.laceType && ` · ${item.laceType}`}
                    {item.capSize && ` · ${item.capSize}`}
                    {item.customColorTier && item.customColorTier !== "AS_LISTED" && ` · Color ${item.customColorTier}`}
                  </p>

                  {item.isCustom && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      Crafted to Order · Final Sale
                    </p>
                  )}

                  {item.isPreorder && (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-amber-700">
                      Pre-Order · Factory Drop-Ship
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border border-neutral-200 rounded-full bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.variant,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-3 py-1.5 tap-compact"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>

                      <span className="px-2 text-xs min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.variant, item.quantity + 1)
                        }
                        className="px-3 py-1.5 tap-compact"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id, item.variant)}
                      className="text-[11px] text-neutral-400 hover:text-neutral-800 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-neutral-900 shrink-0">
                  {money(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="border-t border-neutral-200 px-6 py-5 space-y-4 bg-white">
          <div className="flex justify-between items-baseline">
            <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Subtotal</span>
            <span className="text-base font-medium text-neutral-900">{money(total)}</span>
          </div>

          <Link
            to="/checkout"
            onClick={closeCart}
            className="block w-full text-center bg-[#111] text-[#F9F7F4] py-3.5 rounded-full text-[11px] tracking-[0.26em] uppercase hover:bg-neutral-800 transition"
          >
            Secure Checkout
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <Lock className="w-3 h-3" />
            <span>256-bit encrypted · Powered by Stripe</span>
          </div>
        </div>
      </Motion.aside>
    </div>
  );
}
