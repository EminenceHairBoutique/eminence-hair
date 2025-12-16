// src/context/CartContext.jsx
// Single source of truth for cart state + drawer controls.

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import fallbackImage from "../assets/editorial.png";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("eminence_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("eminence_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const addToCart = (product, options = {}) => {
    if (!product?.id) return;

    const {
      length,
      density,
      lace = "Transparent Lace",
      color,
      quantity = 1,
    } = options;

    const price =
      typeof product.price === "function"
        ? product.price(length, density, lace)
        : Number(product.price || 0);

    const image =
      product.images?.[0] ||
      product.image ||
      product.img ||
      fallbackImage;

    const normalized = {
      id: product.id,
      slug: product.slug,
      name: product.displayName || product.name,
      image,

      // 🔑 canonical option fields
      length,
      density,
      lace,
      color,

      // 🔑 checkout-friendly aliases
      selectedLength: length,
      selectedDensity: density,

      price,
      quantity: Number(quantity) || 1,

      variant: `${product.id}::${length}::${density}::${lace}::${color || ""}`,
      cartKey: `${product.id}::${length}::${density}::${lace}::${color || ""}`,
    };

    setCartItems((prev) => {
      const idx = prev.findIndex(
        (p) => p.cartKey === normalized.cartKey
      );

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + normalized.quantity,
        };
        return copy;
      }

      return [...prev, normalized];
    });

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

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("eminence_cart");
  };

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
    clearCart,

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