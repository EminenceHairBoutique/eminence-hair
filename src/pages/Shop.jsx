import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

import firstPage from "../assets/first_page.png";

const safeMin = (arr, fallback = null) => {
  if (!Array.isArray(arr) || arr.length === 0) return fallback;
  return Math.min(...arr);
};

const getMinLength = (p) => safeMin(p.lengths, p.defaultLength ?? null);
const getMinDensity = (p) => safeMin(p.densities, p.defaultDensity ?? null);

const getStartingPrice = (p) => {
  const L = getMinLength(p);
  const D = getMinDensity(p);
  if (typeof p.price === "function" && L != null && D != null) return Number(p.price(L, D) || 0);
  return Number(p.basePrice ?? p.fromPrice ?? p.price ?? 0);
};

export default function Shop() {
  const { addToCart, isOpen } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // route-based "loading skeleton" feel
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, [location.key]);

  /* MODE FROM URL */
  const mode =
    location.pathname === "/shop/wigs"
      ? "wig"
      : location.pathname === "/shop/bundles"
      ? "bundle"
      : "all";

  /* SEO */
  useEffect(() => {
    document.title =
      mode === "wig"
        ? "Luxury HD Lace Wigs | Eminence Hair"
        : mode === "bundle"
        ? "Premium Hair Bundles & Extensions | Eminence Hair"
        : "Luxury Wigs & Hair Extensions | Eminence Hair";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }

    meta.content =
      mode === "wig"
        ? "Shop luxury HD lace wigs crafted from raw SEA and Cambodian hair."
        : mode === "bundle"
        ? "Premium hair bundles and extensions by Eminence Hair. Launching soon."
        : "Shop luxury wigs, bundles, and textures by Eminence Hair.";
  }, [mode]);

  const initialCollection = searchParams.get("collection") || "All";
  const initialTexture = searchParams.get("texture") || "All";

  const [collectionFilter] = useState(initialCollection);
  const [textureFilter] = useState(initialTexture);
  const [addingId, setAddingId] = useState(null);

  const filteredByType = useMemo(() => {
    if (mode === "all") return products;
    return products.filter((p) => p.type === mode);
  }, [mode]);

  const visibleProducts = useMemo(() => {
    let list = [...filteredByType];

    if (collectionFilter !== "All") list = list.filter((p) => p.collection === collectionFilter);
    if (textureFilter !== "All") list = list.filter((p) => p.texture === textureFilter);

    return list;
  }, [filteredByType, collectionFilter, textureFilter]);

  if (mode === "bundle" && visibleProducts.length === 0) {
    return (
      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-4">
          Eminence Hair
        </p>
        <h1 className="text-4xl font-light mb-6">Bundles & Extensions</h1>
        <p className="max-w-md mx-auto text-neutral-600 leading-relaxed">
          Our premium bundles and extensions are currently in development. Crafted to the same
          standards as our wigs — launching soon.
        </p>

        <div className="mt-10">
          <Link
            to="/contact"
            className="inline-block px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
          >
            Join the Waitlist
          </Link>
        </div>
      </div>
    );
  }

  const heroTitle =
    mode === "wig" ? "Luxury wigs, perfected." : "Shop all luxury wigs, bundles, and textures in one edit.";

  const heroSubtitle =
    mode === "wig"
      ? "HD lace wigs crafted from raw SEA & Cambodian hair."
      : "Raw Cambodian & SEA hair, Burmese deep waves, and signature color units built with 180–250% density.";

  const handleQuickAdd = (product) => {
    const length = getMinLength(product);
    const density = getMinDensity(product);

    const price =
      typeof product.price === "function" && length != null && density != null
        ? Number(product.price(length, density) || 0)
        : Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0);

    setAddingId(product.id);

    addToCart({
      id: product.id,
      variant: length != null && density != null ? `${length}-${density}` : "standard",
      name: product.name,
      price,
      image: product.images?.[0],

      length,
      density,
      selectedLength: length,
      selectedDensity: density,

      quantity: 1,
    });

    setTimeout(() => setAddingId(null), 350);
  };

  return (
    <div className="pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
      <div className={`${isOpen ? "blur-sm" : ""} transition`}>
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {/* HERO */}
          <section className="grid md:grid-cols-[1.4fr,1fr] gap-8 items-center rounded-3xl border border-white/60 bg-gradient-to-r from-[#F6ECE1] via-[#F9F7F4] to-[#F4EBDF] shadow-[0_22px_50px_rgba(17,12,5,0.20)] px-6 md:px-10 py-8 md:py-10">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-600">
                Eminence Hair Boutique
              </p>

              {pageLoading ? (
                <>
                  <div className="h-10 w-[80%] rounded-xl bg-black/10 animate-pulse" />
                  <div className="h-5 w-[70%] rounded-xl bg-black/10 animate-pulse" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-light tracking-wide max-w-xl">
                    {heroTitle}
                  </h1>
                  <p className="text-sm text-neutral-700 max-w-xl">{heroSubtitle}</p>
                </>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/collections?type=fw25"
                  className="px-8 py-2.5 text-[11px] tracking-[0.26em] uppercase rounded-full border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
                >
                  F/W 2025 Edit
                </Link>
                <p className="text-xs text-neutral-600">
                  {visibleProducts.length} styles • HD lace, editorial densities.
                </p>
              </div>
            </div>

            <div className="relative h-52 md:h-64 rounded-3xl overflow-hidden border border-white/60">
              <img src={firstPage} alt="Eminence Shop Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            </div>
          </section>

          {/* PRODUCT GRID */}
          <section>
            {pageLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-3xl bg-black/10 animate-pulse h-[420px]" />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {visibleProducts.map((p) => {
                  const startingPrice = getStartingPrice(p);
                  const minLength = getMinLength(p);
                  const minDensity = getMinDensity(p);

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col h-full rounded-3xl bg-[#F7EFE2] border border-white/40 shadow-[0_18px_40px_rgba(15,10,5,0.22)] overflow-hidden"
                    >
                      <Link to={`/products/${p.slug}`} className="relative block aspect-[3/4] overflow-hidden">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {p.type === "wig" && (
                          <span className="absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.28em] uppercase rounded-full bg-black/80 text-white">
                            Wig
                          </span>
                        )}
                      </Link>

                      <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                            {p.collection}
                          </p>
                          <Link
                            to={`/products/${p.slug}`}
                            className="block text-sm font-medium tracking-[0.02em] text-neutral-900"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-neutral-600">
                            {p.texture} • from {minLength != null ? `${minLength}"` : "—"} •{" "}
                            {minDensity != null ? `${minDensity}%` : "—"}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">From</p>
                            <p className="text-sm font-medium text-neutral-900">
                              ${Number(startingPrice || 0).toFixed(0)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(p)}
                            disabled={addingId === p.id}
                            className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800 bg-black text-white hover:bg-neutral-900 disabled:bg-neutral-500"
                          >
                            {addingId === p.id ? "Added" : "Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
