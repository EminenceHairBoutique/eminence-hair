// src/context/CartContext.jsx
// Single source of truth for cart state + drawer controls.

import React, { createContext, useContext, useMemo, useState } from "react";
import fallbackImage from "../assets/editorial.png";

const CartContext = createContext(null);

// Build a stable variant key from common option fields.
// This prevents "same product, different options" collisions.
function buildVariantKey(item = {}) {
  const id = String(item.id ?? "");
  const length = item.length != null ? String(item.length) : "";
  const density = item.density != null ? String(item.density) : "";
  const lace = item.lace != null ? String(item.lace) : "";
  const color = item.color != null ? String(item.color) : "";
  const size = item.size != null ? String(item.size) : "";
  return [id, length, density, lace, color, size].join("::");
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const addToCart = (item) => {
    if (!item || !item.id) return;

    const variant = item.variant || buildVariantKey(item);

    const normalized = {
      ...item,

      // quantity
      quantity: Number(item.quantity ?? 1) || 1,

      // stable identifiers used by UI
      variant,
      cartKey: `${String(item.id)}::${variant}`,

      // normalize common option names (Checkout + drawer friendliness)
      selectedLength: item.selectedLength ?? item.length ?? "",
      selectedDensity: item.selectedDensity ?? item.density ?? "",
      image: item.image || item.img || item.photo || fallbackImage,
      name: item.name || item.title || "Item",
    };

    setCartItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === normalized.id && p.variant === normalized.variant
      );

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + normalized.quantity };
        return copy;
      }

      return [...prev, normalized];
    });

    // UX: open drawer on add.
    setIsOpen(true);
  };

  // Backwards compatible signature:
  // - updateQuantity(id, qty)
  // - updateQuantity(id, variant, qty)
  const updateQuantity = (id, a, b) => {
    const hasVariant = typeof a === "string";
    const variant = hasVariant ? a : null;
    const qty = hasVariant ? b : a;
    const nextQty = Math.max(1, Number(qty) || 1);

    setCartItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (variant && p.variant !== variant) return p;
        return { ...p, quantity: nextQty };
      })
    );
  };

  // Backwards compatible signature:
  // - removeItem(id)
  // - removeFromCart(id, variant)
  const removeFromCart = (id, variant = null) => {
    setCartItems((prev) =>
      prev.filter((p) => {
        if (p.id !== id) return true;
        if (!variant) return false;
        return p.variant !== variant;
      })
    );
  };

  const removeItem = (id) => removeFromCart(id, null);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  // Alias for components that expect `total`.
  const total = subtotal;

  // Used by CartDrawer if an item doesn't include an image.
  const FALLBACK_IMAGE = fallbackImage;

  const value = {
    // drawer state
    isOpen,
    openCart,
    closeCart,
    toggleCart,

    // cart state
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    removeItem,

    // ✅ backwards-compatible aliases (fixes Checkout expecting these)
    items: cartItems,
    setItems: setCartItems,

    // totals
    subtotal,
    total,

    FALLBACK_IMAGE,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
