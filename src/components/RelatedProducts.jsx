import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { products } from "../data/products";
import { resolveProductImages } from "../utils/productMedia";
import { staggerContainer, staggerChild, viewport } from "../ui/motionPresets";

export default function RelatedProducts({ currentProduct }) {
  const related = useMemo(() => {
    if (!currentProduct) return [];

    const others = products.filter(
      (p) => p.id !== currentProduct.id && !p.hidden
    );

    const score = (p) => {
      let s = 0;
      if (currentProduct.type && p.type === currentProduct.type) s += 2;
      if (currentProduct.texture && p.texture === currentProduct.texture) s += 3;
      if (
        currentProduct.collection &&
        p.collection === currentProduct.collection
      )
        s += 2;
      if (
        currentProduct.collectionSlug &&
        p.collectionSlug === currentProduct.collectionSlug
      )
        s += 1;
      return s;
    };

    // Score, shuffle within same score, take top 4
    const scored = others.map((p) => ({
      product: p,
      score: score(p) + Math.random() * 0.5,
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((s) => s.product);
  }, [currentProduct]);

  if (!currentProduct || related.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-xl font-light font-display">You may also like</h2>
        <Link
          to="/shop"
          className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
        >
          Shop All
        </Link>
      </div>

      <Motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        {related.map((p) => {
          const img = resolveProductImages(p)?.[0] || p.images?.[0];
          return (
            <Motion.div key={p.id} variants={staggerChild}>
              <Link
                to={`/products/${p.slug}`}
                className="group block rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-[4/5] overflow-hidden bg-white">
                  <img
                    src={img}
                    alt={p.displayName || p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={500}
                  />
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-1">
                    {p.type === "bundle"
                      ? "Bundle"
                      : p.type === "closure"
                        ? "Closure"
                        : "Wig"}
                    {p.texture ? ` · ${p.texture}` : ""}
                  </p>
                  <p className="text-sm text-neutral-900 line-clamp-1">
                    {p.displayName || p.name}
                  </p>
                </div>
              </Link>
            </Motion.div>
          );
        })}
      </Motion.div>
    </section>
  );
}
