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
import { trackAddToCart } from "../utils/track";
import { products } from "../data/products";

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

  useEffect(() => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        length: item.length ?? item.selectedLength ?? Math.min(...(item.lengths || [])),
        density: item.density ?? item.selectedDensity ?? 140,
        selectedLength: item.length ?? item.selectedLength ?? Math.min(...(item.lengths || [])),
        selectedDensity: item.density ?? item.selectedDensity ?? 140,
      }))
    );
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((v) => !v);

  const addToCart = (product, options = {}) => {
    if (!product?.id) return;

    // Base/default options (used when user quick-adds from Shop/Gallery)
    const baseLength =
      options.length ??
      (Array.isArray(product.lengths) ? Math.min(...product.lengths) : null);

    const baseDensity =
      options.density ??
      (Array.isArray(product.densities) && product.densities.includes(140)
        ? 140
        : Array.isArray(product.densities)
        ? Math.min(...product.densities)
        : null);

    const lace = options.lace ?? "Transparent Lace";
    const color = options.color ?? product.color ?? null;
    const quantity = Number(options.quantity ?? 1) || 1;

    const length = baseLength != null ? Number(baseLength) : null;
    const density = baseDensity != null ? Number(baseDensity) : null;

    const price =
      typeof product.price === "function" && length != null && density != null
        ? Number(product.price(length, density, lace) || 0)
        : Number(product.price || 0);

    const image = product.images?.[0] || product.image || product.img || fallbackImage;

    const autoDefaultsApplied =
      options.length == null && options.density == null && options.lace == null;

    const normalized = {
      id: product.id,
      slug: product.slug,
      name: product.displayName || product.name,
      image,

      // ✅ always present now (for quick-add)
      length,
      density,
      lace,
      color,

      // aliases some components may rely on
      selectedLength: length,
      selectedDensity: density,

      price,
      quantity,

      autoDefaultsApplied,

      variant: `${product.id}::${length}::${density}::${lace}::${color || ""}`,
      cartKey: `${product.id}::${length}::${density}::${lace}::${color || ""}`,
    };

    // Analytics / pixels (only if consented)
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.cartKey === normalized.cartKey);

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + normalized.quantity };
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

  const updateItemOptions = (id, cartKey, next = {}) => {
    const product = products.find((p) => p.id === id);

    // Analytics / pixels (only if consented)
    setCartItems((prev) => {
      const current = prev.find((x) => (x.cartKey || x.variant) === cartKey);
      if (!current) return prev;

      const length = Number(next.length ?? current.length ?? current.selectedLength);
      const density = Number(next.density ?? current.density ?? current.selectedDensity);
      const lace = next.lace ?? current.lace ?? "Transparent Lace";
      const color = next.color ?? current.color ?? null;

      const price =
        product && typeof product.price === "function"
          ? Number(product.price(length, density, lace) || 0)
          : Number(current.price || 0);

      const newCartKey = `${id}::${length}::${density}::${lace}::${color || ""}`;

      const updated = {
        ...current,
        length,
        density,
        lace,
        color,
        selectedLength: length,
        selectedDensity: density,
        price,
        autoDefaultsApplied: false, // user explicitly edited
        cartKey: newCartKey,
        variant: newCartKey,
      };

      // Remove current line
      let nextArr = prev.filter((x) => (x.cartKey || x.variant) !== cartKey);

      // Merge if same variant already exists
      const mergeIdx = nextArr.findIndex((x) => (x.cartKey || x.variant) === newCartKey);
      if (mergeIdx >= 0) {
        const copy = [...nextArr];
        copy[mergeIdx] = {
          ...copy[mergeIdx],
          quantity: Number(copy[mergeIdx].quantity || 0) + Number(updated.quantity || 0),
        };
        return copy;
      }

      return [...nextArr, updated];
    });
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
    // ✅ Ensure any cart overlay/drawer state is closed so the UI doesn't feel "locked"
    setIsOpen(false);
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
    updateItemOptions,
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