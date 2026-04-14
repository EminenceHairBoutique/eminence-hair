import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { resolveProductImages } from "../utils/productMedia";

export default function RecentlyViewed({ recentIds = [], currentProductId }) {
  const items = useMemo(() => {
    if (!recentIds || recentIds.length < 2) return [];
    return recentIds
      .filter((id) => id !== currentProductId)
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean)
      .slice(0, 8);
  }, [recentIds, currentProductId]);

  if (items.length < 2) return null;

  return (
    <section className="mt-10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-4">
        Recently Viewed
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((p) => {
          const img = resolveProductImages(p)?.[0] || p.images?.[0];
          return (
            <Link
              key={p.id}
              to={`/products/${p.slug}`}
              className="shrink-0 w-28 group"
            >
              <div className="w-28 h-36 rounded-xl overflow-hidden border border-neutral-200 bg-white">
                <img
                  src={img}
                  alt={p.displayName || p.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-2 text-[10px] text-neutral-700 line-clamp-1">
                {p.displayName || p.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
