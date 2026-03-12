// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { resolveProductImages } from "../utils/productMedia";

const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useCart();

  const images = resolveProductImages(product);

  const handleQuickAdd = (e) => {
    e.preventDefault();

    const lengths = Array.isArray(product.lengths) ? product.lengths : [];
    const densities = Array.isArray(product.densities) ? product.densities : [];

    const length =
      lengths.length ? Math.min(...lengths) : (product.defaultLength ?? null);
    const density =
      densities.length ? Math.min(...densities) : (product.defaultDensity ?? null);

    const price =
      typeof product.price === "function" && length != null && density != null
        ? Number(product.price(length, density) || 0)
        : Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0);

    const variant =
      length != null && density != null ? `${length}-${density}` : "standard";

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image || images?.[0] || product.images?.[0],

      // ✅ store option fields for drawer/checkout display
      length,
      density,
      selectedLength: length,
      selectedDensity: density,

      variant,
      quantity: 1,
    });

    openCart();
  };

  return (
    <Link
      to={`/products/${product.slug ?? product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 card-hover"
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm card-hover border border-neutral-100"
    >
      <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
        {product.image || images?.[0] || product.images?.[0] ? (
          <img
            src={product.image || images?.[0] || product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#F3EFE8]">
            <span className="text-[11px] tracking-[0.22em] uppercase text-neutral-400">Eminence</span>
          </div>
        )}
      </div>

      <div className="px-4 pt-4 pb-5">
            <span className="text-[11px] tracking-[0.22em] uppercase text-neutral-400">
              Eminence Hair
            </span>
          </div>
        )}
        {(product.badge || product.readyToShip) && (
          <div className="absolute top-3 left-3 bg-[#111]/80 backdrop-blur-sm text-[#D4AF37] text-[9px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full">
            {product.badge || (product.readyToShip ? "Ready to Ship" : "")}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 pb-5">
        <h3 className="text-sm text-[#111] mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-neutral-500 mb-2">
          {product.texture && product.texture.replace("-", " ")}{" "}
          {product.laceType ? ` • ${product.laceType}` : ""}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-[#111]">
            ${Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0).toLocaleString()}
          </span>
          <button
            onClick={handleQuickAdd}
            className="text-[10px] uppercase tracking-[0.22em] border border-neutral-300 rounded-full px-3 py-1 text-neutral-600 transition-colors group-hover:border-[#111] hover:bg-[#111] hover:text-[#F9F7F4]"
            className="text-[10px] uppercase tracking-[0.22em] border border-neutral-300 rounded-full px-3 py-1 text-neutral-600 hover:border-[#111] hover:text-[#111] transition"
            type="button"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
