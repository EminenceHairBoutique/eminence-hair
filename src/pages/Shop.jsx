import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { products, eminenceEssentials } from "../data/products";
import { useCart } from "../context/CartContext";
import { prefetchRoute } from "../utils/prefetch";
import SEO from "../components/SEO";

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

const matchesColor = (p, color) => {
  const c = String(color || "").toLowerCase();

  // Work with what exists TODAY in your products.js:
  // - natural is collectionSlug "natural"
  // - 613 is collectionSlug "613"
  const slug = String(p.collectionSlug || "").toLowerCase();
  const collection = String(p.collection || "").toLowerCase();
  const name = String(p.name || "").toLowerCase();
  const displayName = String(p.displayName || "").toLowerCase();

  if (c === "natural") return slug === "natural" || collection.includes("colorway natural");
  if (c === "613") return slug === "613" || collection.includes("colorway 613") || name.includes("613") || displayName.includes("613");

  // Future categories (safe now, will just return false until you add products)
  if (c === "blended") return collection.includes("ombre") || name.includes("ombre") || displayName.includes("ombre");
  if (c === "red") return collection.includes("red") || name.includes("red") || displayName.includes("red");

  // If someone passes "1b" later and you add p.color fields, it will work if you want:
  const productColor = String(p.color || "").toLowerCase();
  if (productColor && productColor === c) return true;

  return false;
};

const prefetchProduct = () => import("./ProductDetail");
const prefetchCheckout = () => import("./Checkout");

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
  const modeFromPath =
    location.pathname === "/shop/wigs"
      ? "wig"
      : location.pathname === "/shop/bundles"
      ? "bundle"
      : "all";

  // Support Navbar links like /shop?type=wig
  const typeParam = (searchParams.get("type") || "").toLowerCase();
  const mode =
    modeFromPath !== "all"
      ? modeFromPath
      : ["wig", "bundle", "closure"].includes(typeParam)
      ? typeParam
      : "all";

  // ✅ IMPORTANT: do NOT store these in state (it causes "sticky filters")
  const collectionFilter = searchParams.get("collection") || "All";
  const textureFilter = searchParams.get("texture") || "All";
  const colorFilter = searchParams.get("color") || "All";

  // Essentials view is only when explicitly requested
  const isEssentialsView =
    collectionFilter === "eminence-essentials" || collectionFilter === "Eminence Essentials";

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

  const [addingId, setAddingId] = useState(null);

  const filteredByType = useMemo(() => {
    if (mode === "all") return products;
    return products.filter((p) => p.type === mode);
  }, [mode]);

  const visibleProducts = useMemo(() => {
    let list = [...filteredByType];

    // ✅ If user is explicitly on Essentials view, show ONLY essentials
    if (isEssentialsView) {
      return list
        .filter((p) => p.isEssential || p.collections?.includes("Eminence Essentials"))
        .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));
    }

    // Otherwise show full catalog (with optional filters)
    if (collectionFilter !== "All") {
      list = list.filter(
        (p) => p.collectionSlug === collectionFilter || p.collection === collectionFilter
      );
    }

    if (textureFilter !== "All") {
      list = list.filter((p) => p.texture === textureFilter);
    }

    if (colorFilter !== "All") {
      list = list.filter((p) => matchesColor(p, colorFilter));
    }

    return list;
  }, [filteredByType, isEssentialsView, collectionFilter, textureFilter, colorFilter]);

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

  if (!pageLoading && visibleProducts.length === 0) {
    return (
      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-4">
          Eminence Hair
        </p>
        <h1 className="text-4xl font-light mb-6">No results yet</h1>
        <p className="max-w-md mx-auto text-neutral-600 leading-relaxed">
          That edit is currently being curated. Explore the full collection or join the list for restocks.
        </p>

        <div className="mt-10 flex gap-3 justify-center">
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
          >
            Shop All
          </Link>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
          >
            Join the List
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
    setAddingId(product.id);
    addToCart(product); // CartContext applies defaults
    setTimeout(() => setAddingId(null), 350);
  };

  return (
    <>
      <SEO
        title={
          mode === "wig"
            ? "Luxury HD Lace Wigs"
            : mode === "bundle"
            ? "Premium Hair Bundles"
            : "Luxury Wigs & Hair Extensions"
        }
        description="Shop luxury wigs, bundles, and textures by Eminence Hair."
      />
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

          {/* SECTION 1 — EMINENCE ESSENTIALS */}
          {mode === "all" && !isEssentialsView && eminenceEssentials?.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                    Eminence Essentials
                  </p>
                  <h2 className="text-xl font-light">
                    A focused edit — wigs & bundles our clients choose most.
                  </h2>
                </div>

                <Link
                  to="/shop?collection=eminence-essentials"
                  className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
                >
                  View All Essentials
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {eminenceEssentials.slice(0, 6).map((p) => {
                  const startingPrice = getStartingPrice(p);

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col rounded-3xl bg-[#F7EFE2] border border-white/40 shadow-[0_18px_40px_rgba(15,10,5,0.22)] overflow-hidden"
                    >
                      <Link
                        to={`/products/${p.slug}`}
                        className="relative block aspect-[3/4] overflow-hidden"
                      >
                        <img
                          src={p.images?.[0]}
                          alt={p.displayName || p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <span className="absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.28em] uppercase rounded-full bg-black/80 text-white">
                          Essential
                        </span>
                      </Link>

                      <div className="px-4 pt-4 pb-5">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                          {p.type === "bundle" ? "Hair Bundle" : "HD Lace Wig"}
                        </p>

                        <p className="mt-1 text-sm font-medium text-neutral-900">
                          {p.displayName || p.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-600">
                          From ${Number(startingPrice || 0).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

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
                            onMouseEnter={() => prefetchRoute(prefetchProduct)}
                            className="block text-sm font-medium tracking-[0.02em] text-neutral-900"
                          >
                            {p.displayName || p.name}
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

          <Link
            to="/checkout"
            onMouseEnter={() => prefetchRoute(prefetchCheckout)}
            className="inline-block px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
          >
            Checkout
          </Link>
        </div>
      </div>
      </div>
      </>
  );
}
