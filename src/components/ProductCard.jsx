// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart, openCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const lengths = Array.isArray(product.lengths) ? product.lengths : [];
    const densities = Array.isArray(product.densities) ? product.densities : [];
    const length = lengths.length ? Math.min(...lengths) : null;
    const density = densities.length ? Math.min(...densities) : null;

    const price =
      typeof product.price === "function" && length && density
        ? product.price(length, density)
        : Number(product.price || 0);

    const variant = length && density ? `${length}-${density}` : "standard";

    addToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image || product.images?.[0],
      length,
      density,
      variant,
      quantity: 1,
    });
    openCart();
  };

  return (
    <Link
      to={`/products/${product.slug ?? product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-[3/4] bg-neutral-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : null}
      </div>

      <div className="px-4 pt-4 pb-5">
        {product.badge && (
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] mb-1">
            {product.badge}
          </div>
        )}
        <h3 className="text-sm text-[#111] mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-neutral-500 mb-2">
          {product.texture && product.texture.replace("-", " ")}{" "}
          {product.laceType ? ` • ${product.laceType}` : ""}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-medium text-[#111]">
            ${(
              typeof product.price === "number"
                ? product.price
                : (product.basePrice ?? 0)
            ).toLocaleString()}
          </span>
          <button
            onClick={handleQuickAdd}
            className="text-[10px] uppercase tracking-[0.22em] border border-neutral-300 rounded-full px-3 py-1 text-neutral-600 group-hover:border-[#111]"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
