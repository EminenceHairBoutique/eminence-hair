import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { products, eminenceEssentials } from "../data/products";
import { useCart } from "../context/CartContext";
import { prefetchRoute } from "../utils/prefetch";
import SEO from "../components/SEO";
import QuickViewModal from "../components/QuickViewModal";
import { resolveProductImages } from "../utils/productMedia";

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

  // Prefer explicit from/base pricing if present
  if (p.basePrice != null) return Number(p.basePrice) || 0;
  if (p.fromPrice != null) return Number(p.fromPrice) || 0;

  // Compute from price() if available
  if (typeof p.price === "function" && L != null) {
    try {
      const val =
        D == null
          ? Number(p.price(L) || 0) // bundles / closures / frontals
          : Number(p.price(L, D, "Transparent Lace") || 0); // wigs
      return Number.isFinite(val) ? val : 0;
    } catch {
      // fall through
    }
  }

  return Number(p.basePrice ?? p.fromPrice ?? p.price ?? 0);
};

// Normalizes strings so older links like `texture=body-wave` keep working.
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const isSame = (a, b) => norm(a) === norm(b);

const matchesColor = (p, color) => {
  const c = String(color || "").toLowerCase();

  // Backwards compatible: many older products are tagged via collectionSlug / collection name
  const slug = String(p.collectionSlug || "").toLowerCase();
  const collection = String(p.collection || "").toLowerCase();
  const name = String(p.name || "").toLowerCase();
  const displayName = String(p.displayName || "").toLowerCase();
  const productColor = String(p.color || "").toLowerCase();

  const haystack = `${productColor} ${slug} ${collection} ${name} ${displayName}`.toLowerCase();
  const has = (needle) => haystack.includes(needle);

  // Your current color families
  if (c === "1") return productColor === "1" || has("jet black") || has("#1");
  if (c === "1b") return productColor === "1b" || has("1b") || has("natural black") || has("natural");
  if (c === "613") return productColor === "613" || has("613") || has("blonde") || slug === "613" || collection.includes("colorway 613");
  if (c === "burgundy") return productColor === "burgundy" || has("burgundy") || has("burg") || has("h-red") || has("red");
  if (c === "brown") return productColor === "brown" || has("brown") || has("22") || has("24") || has("27");
  if (c === "silver") return productColor === "silver" || has("silver") || has("gray") || has("grey");
  if (c === "orange") return productColor === "orange" || has("orange");

  // Legacy option
  if (c === "natural") return has("natural") || has("1b") || slug === "natural" || collection.includes("colorway natural");

  // If you later add more, this will safely default false
  return false;
};

const prefetchProduct = () => import("./ProductDetail");
const prefetchCheckout = () => import("./Checkout");

function Pill({ active, children }) {
  return (
    <span
      className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border transition ${
        active
          ? "border-neutral-900 bg-neutral-900 text-[#F9F7F4]"
          : "border-neutral-300 bg-white/40 hover:bg-white/60 text-neutral-800"
      }`}
    >
      {children}
    </span>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/50 hover:bg-white"
      aria-label={`Remove filter ${label}`}
    >
      {label}
      <span className="text-neutral-500">×</span>
    </button>
  );
}

export default function Shop() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
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
    location.pathname === "/shop/medical"
      ? "wig"
      : location.pathname === "/shop/wigs"
      ? "wig"
      : location.pathname === "/shop/bundles"
      ? "bundle"
      : location.pathname === "/shop/closures"
      ? "closure"
      : location.pathname === "/shop/preorders"
      ? "preorder"
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
  const sortKey = (searchParams.get("sort") || "featured").toLowerCase();

  // Essentials view is only when explicitly requested
  const isEssentialsView =
    collectionFilter === "eminence-essentials" || collectionFilter === "Eminence Essentials";

  // Special collection-style filter (no stock counts)
  const isReadyToShipView =
    collectionFilter === "ready-to-ship" || collectionFilter === "Ready to Ship";

  // Medical view is a dedicated route (/shop/medical). Keep it explicit so we don't
  // accidentally hide products when a user is browsing the main shop.
  const isMedicalView = location.pathname === "/shop/medical";
  const isPreorderView = location.pathname === "/shop/preorders" || mode === "preorder";

  const [addingId, setAddingId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const filteredByType = useMemo(() => {
    // Hide internal SKUs (e.g., install sets) from the main shop grid.
    const visible = products.filter((p) => !p.hideFromShop);

    if (mode === "all") return visible.filter((p) => !p.isPreorder);

    // Pre-orders dedicated view
    if (mode === "preorder") {
      return visible.filter((p) => p.isPreorder);
    }

    // Closures view includes both closures + frontals.
    if (mode === "closure") {
      return visible.filter((p) => (p.type === "closure" || p.type === "frontal") && !p.isPreorder);
    }

    return visible.filter((p) => p.type === mode && !p.isPreorder);
  }, [mode]);

  const collectionOptions = useMemo(() => {
    const map = new Map();

    // Add Essentials (special view)
    map.set("eminence-essentials", "Eminence Essentials");

    // Add Ready-to-Ship (special view)
    map.set("ready-to-ship", "Ready to Ship");

    filteredByType.forEach((p) => {
      const value = p.collectionSlug || p.collection;
      const label = p.collection || p.collectionSlug;
      if (!value || !label) return;
      if (!map.has(value)) map.set(value, label);
    });

    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [filteredByType]);

  const textureOptions = useMemo(() => {
    const set = new Set();
    filteredByType.forEach((p) => {
      if (p.texture) set.add(p.texture);
    });
    return ["All", ...Array.from(set)];
  }, [filteredByType]);

  const colorOptions = useMemo(() => ["All", "1", "1B", "Brown", "Burgundy", "613", "Silver", "Orange"], []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    // Keep it clean: "All" removes the param
    if (!value || value === "All") next.delete(key);
    else next.set(key, value);

    // Also remove legacy `type` param if user is using path-mode
    if (modeFromPath !== "all") next.delete("type");

    setSearchParams(next, { replace: true });
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams(searchParams);
    ["collection", "texture", "color", "sort"].forEach((k) => next.delete(k));
    if (modeFromPath !== "all") next.delete("type");
    setSearchParams(next, { replace: true });
  };

  const visibleProducts = useMemo(() => {
    let list = [...filteredByType];

    // Pre-Order view: show only pre-order products (filteredByType already scopes this, but texture filter may still apply)
    if (isPreorderView) {
      // Allow texture filter to refine
      if (textureFilter !== "All") {
        list = list.filter((p) => isSame(p.texture, textureFilter));
      }
      return list;
    }

    // Medical Grade view: show only medical products
    if (isMedicalView) {
      list = list.filter((p) => p.isMedical || p.collectionSlug === "medical-grade");
    }

    // ✅ If user is explicitly on Essentials view, show ONLY essentials
    if (isEssentialsView) {
      list = list
        .filter((p) => p.isEssential || p.collections?.includes("Eminence Essentials"))
        .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));
    } else if (isReadyToShipView) {
      // Ready-to-Ship view: fast-ship pieces only (no stock counts)
      list = list.filter((p) => Boolean(p.readyToShip));

      // Allow texture/color filters to still refine
      if (textureFilter !== "All") {
        list = list.filter((p) => isSame(p.texture, textureFilter));
      }
      if (colorFilter !== "All") {
        list = list.filter((p) => matchesColor(p, colorFilter));
      }
    } else {
      // Otherwise show full catalog (with optional filters)
      if (collectionFilter !== "All") {
        list = list.filter(
          (p) =>
            isSame(p.collectionSlug, collectionFilter) ||
            isSame(p.collection, collectionFilter)
        );
      }

      if (textureFilter !== "All") {
        list = list.filter((p) => isSame(p.texture, textureFilter));
      }

      if (colorFilter !== "All") {
        list = list.filter((p) => matchesColor(p, colorFilter));
      }
    }

    // Sorting
    const byPriceAsc = (a, b) => getStartingPrice(a) - getStartingPrice(b);
    const byPriceDesc = (a, b) => getStartingPrice(b) - getStartingPrice(a);
    const byName = (a, b) =>
      String(a.displayName || a.name || "").localeCompare(String(b.displayName || b.name || ""));

    if (sortKey === "price-asc") list.sort(byPriceAsc);
    if (sortKey === "price-desc") list.sort(byPriceDesc);
    if (sortKey === "alpha") list.sort(byName);

    return list;
  }, [filteredByType, isEssentialsView, isReadyToShipView, isMedicalView, isPreorderView, collectionFilter, textureFilter, colorFilter, sortKey]);

  const activeChips = useMemo(() => {
    const collectionLabel =
      collectionOptions.find((o) => isSame(o.value, collectionFilter) || isSame(o.label, collectionFilter))
        ?.label || collectionFilter;

    const textureLabel =
      textureOptions.find((t) => isSame(t, textureFilter)) || textureFilter;

    const chips = [];
    if (collectionFilter !== "All") chips.push({ key: "collection", label: collectionLabel });
    if (textureFilter !== "All") chips.push({ key: "texture", label: textureLabel });
    if (colorFilter !== "All") chips.push({ key: "color", label: colorFilter });
    if (sortKey !== "featured") {
      const label =
        sortKey === "price-asc"
          ? "Price: Low → High"
          : sortKey === "price-desc"
          ? "Price: High → Low"
          : sortKey === "alpha"
          ? "A → Z"
          : sortKey;
      chips.push({ key: "sort", label });
    }
    return chips;
  }, [collectionFilter, textureFilter, colorFilter, sortKey, collectionOptions, textureOptions]);

  // Category-specific empty states (kept, upgraded)
  if ((mode === "bundle" || mode === "closure") && visibleProducts.length === 0) {
    const isBundles = mode === "bundle";
    return (
      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-4">
          Eminence Hair
        </p>
        <h1 className="text-4xl font-light mb-6">
          {isBundles ? "Bundles & Extensions" : "Closures & Lace Pieces"}
        </h1>
        <p className="max-w-md mx-auto text-neutral-600 leading-relaxed">
          {isBundles ? (
            <>
              Our premium bundles and extensions are currently in development. Crafted to the same
              standards as our wigs — launching soon.
            </>
          ) : (
            <>
              Our closures are currently being curated — premium lace pieces designed to blend, melt,
              and wear like the real thing.
            </>
          )}
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
    isMedicalView
      ? "Medical Grade Wigs"
      : isPreorderView
      ? "Pre Orders"
      : isEssentialsView
      ? "Eminence Essentials"
      : mode === "wig"
      ? "Luxury wigs, perfected."
      : mode === "bundle"
      ? "Signature bundles for flawless installs."
      : mode === "closure"
      ? "Closures & frontals that melt."
      : "Luxury hair, curated.";

  const heroSubtitle =
    isMedicalView
      ? "Cranial prosthesis options designed for sensitive scalps — refined realism, ultra-soft construction, and concierge support."
      : isPreorderView
      ? "Factory-direct luxury bundles — True Raw, Double Drawn, and Super Double Drawn — dispatched from our partner atelier with a 10–18 day lead time."
      : isEssentialsView
      ? "Our most-requested textures and best sellers — curated for first-time clients and returning collectors."
      : mode === "wig"
      ? "HD lace wigs crafted from raw SEA & Cambodian hair."
      : mode === "bundle"
      ? "Cambodian & SEA wefts in premium textures, made for volume, longevity, and a seamless blend."
      : mode === "closure"
      ? "Premium HD lace closures & frontals designed for an ultra-natural hairline."
      : "Cambodian & SEA hair, Burmese deep waves, and signature color units built with editorial density.";


  const buildModeTo = (path) => {
    const next = new URLSearchParams(searchParams);
    next.delete("type"); // prefer path-based mode
    const qs = next.toString();
    return qs ? `${path}?${qs}` : path;
  };

  const handleQuickAdd = (product) => {
    // Premium UX: wigs require true option selection → send to PDP
    if (product?.type === "wig") return;

    setAddingId(product.id);

    const payload = { ...product };

    // Provide safe defaults (CartContext can still override if it wants)
    const L = getMinLength(product);
    if (L != null) {
      payload.length = payload.length ?? L;
      payload.selectedLength = payload.selectedLength ?? L;
    }

    addToCart(payload);
    setTimeout(() => setAddingId(null), 350);
  };

  return (
    <>
      <SEO
        title={
          isMedicalView
            ? "Medical Grade Wigs"
            : mode === "wig"
            ? "Luxury HD Lace Wigs"
            : mode === "bundle"
            ? "Premium Hair Bundles"
            : mode === "closure"
            ? "Luxury Closures & Frontals"
            : "Luxury Wigs & Hair Extensions"
        }
        description="Shop luxury wigs, bundles, and textures by Eminence Hair."
      />

      <div className="pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
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
                  {visibleProducts.length} styles • HD lace, editorial density.
                </p>
              </div>
            </div>

            <div className="relative h-52 md:h-64 rounded-3xl overflow-hidden border border-white/60">
              <img src={firstPage} alt="Eminence Shop Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
            </div>
          </section>

          {/* MODE + FILTERS */}
          <section className="space-y-4">
            {/* mode pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to={buildModeTo("/shop")} aria-label="Shop all">
                <Pill active={mode === "all"}>All</Pill>
              </Link>
              <Link to={buildModeTo("/shop/wigs")} aria-label="Shop wigs">
                <Pill active={mode === "wig" && !isMedicalView}>Wigs</Pill>
              </Link>

              <Link to={buildModeTo("/shop/medical")} aria-label="Shop medical grade">
                <Pill active={isMedicalView}>Medical</Pill>
              </Link>
              <Link to={buildModeTo("/shop/bundles")} aria-label="Shop bundles">
                <Pill active={mode === "bundle"}>Bundles</Pill>
              </Link>
              <Link to={buildModeTo("/shop/closures")} aria-label="Shop closures and frontals">
                <Pill active={mode === "closure"}>Closures &amp; Frontals</Pill>
              </Link>

              <div className="ml-auto flex items-center gap-2">
                {/* Mobile: open drawer */}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="md:hidden px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/40 hover:bg-white/60"
                >
                  Filters
                </button>

                {/* Desktop sort */}
                <div className="hidden md:flex lg:hidden items-center gap-2">
                  <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    Sort
                  </label>
                  <select
                    value={sortKey}
                    onChange={(e) => setParam("sort", e.target.value)}
                    className="px-4 py-2 rounded-full border border-neutral-300 bg-white/60 text-xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="alpha">A → Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop filters row */}
            <div className="hidden md:flex lg:hidden flex-wrap items-center gap-3 rounded-3xl border border-white/60 bg-white/40 backdrop-blur px-4 py-3">
              <div className="flex items-center gap-2">
                <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Collection
                </label>
                <select
                  value={collectionFilter}
                  onChange={(e) => setParam("collection", e.target.value)}
                  className="px-4 py-2 rounded-full border border-neutral-300 bg-white/60 text-xs"
                >
                  <option value="All">All</option>
                  {collectionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Texture
                </label>
                <select
                  value={textureFilter}
                  onChange={(e) => setParam("texture", e.target.value)}
                  className="px-4 py-2 rounded-full border border-neutral-300 bg-white/60 text-xs"
                >
                  {textureOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                  Color
                </label>
                <select
                  value={colorFilter}
                  onChange={(e) => setParam("color", e.target.value)}
                  className="px-4 py-2 rounded-full border border-neutral-300 bg-white/60 text-xs"
                >
                  {colorOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-auto px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/40 hover:bg-white/60"
              >
                Clear
              </button>
            </div>

            {/* Active filter chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((c) => (
                  <ActiveChip key={c.key} label={c.label} onRemove={() => setParam(c.key, "All")} />
                ))}
              </div>
            )}
          </section>

          {/* Mobile filter drawer */}
          {drawerOpen && (
            <div className="fixed inset-0 z-50">
              <button
                className="absolute inset-0 bg-black/40"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] border border-white/40 bg-[#FBF6ED] p-6 max-h-[85vh] overflow-auto shadow-[0_-24px_60px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-600">
                    Filters
                  </p>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/50"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Done
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                      Collection
                    </label>
                    <select
                      value={collectionFilter}
                      onChange={(e) => setParam("collection", e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                    >
                      <option value="All">All</option>
                      {collectionOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                      Texture
                    </label>
                    <select
                      value={textureFilter}
                      onChange={(e) => setParam("texture", e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                    >
                      {textureOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                      Color
                    </label>
                    <select
                      value={colorFilter}
                      onChange={(e) => setParam("color", e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                    >
                      {colorOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                      Sort
                    </label>
                    <select
                      value={sortKey}
                      onChange={(e) => setParam("sort", e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price: Low → High</option>
                      <option value="price-desc">Price: High → Low</option>
                      <option value="alpha">A → Z</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="flex-1 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      className="flex-1 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1 — EMINENCE ESSENTIALS */}
          {mode === "all" && !isEssentialsView && !isReadyToShipView && !isMedicalView && eminenceEssentials?.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                    Eminence Essentials
                  </p>
                  <h2 className="text-xl font-light">
                    A focused edit — styles our clients choose most.
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setParam("collection", "eminence-essentials")}
                  className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
                >
                  View All Essentials
                </button>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {eminenceEssentials.slice(0, 6).map((p) => {
                  const startingPrice = getStartingPrice(p);
                  const images = resolveProductImages(p);

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col rounded-3xl bg-[#F7EFE2] border border-white/40 shadow-[0_18px_40px_rgba(15,10,5,0.22)] overflow-hidden card-hover"
                    >
                      <Link
                        to={`/products/${p.slug}`}
                        className="relative block aspect-[3/4] overflow-hidden"
                      >
                        <img
                          src={images?.[0] || p.images?.[0]}
                          alt={p.displayName || p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />

                        <span className="absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.28em] uppercase rounded-full bg-black/80 text-white">
                          Essential
                        </span>

                        {p.readyToShip && (
                          <span className="absolute top-3 right-3 px-3 py-1 text-[9px] tracking-[0.28em] uppercase rounded-full bg-white/80 text-neutral-900 border border-white/60">
                            Ready to ship
                          </span>
                        )}
                      </Link>

                      <div className="px-4 pt-4 pb-5">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                          {p.type === "bundle" ? "Hair Bundle" : p.type === "closure" ? "Closure" : "HD Lace Wig"}
                        </p>

                        <p className="mt-1 text-sm font-medium text-neutral-900">
                          {p.displayName || p.name}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-xs text-neutral-600">
                            From ${Number(startingPrice || 0).toFixed(0)}
                          </p>
                          <button
                            type="button"
                            onClick={() => setQuickViewProduct(p)}
                            className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/70 hover:bg-white"
                          >
                            View
                          </button>
                        </div>
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
                  <div key={i} className="rounded-3xl h-[420px] eminence-skeleton" />
                ))}
              </div>
            ) : (
              <div className="lg:grid lg:grid-cols-[260px,1fr] gap-10">
                {/* Desktop sidebar filters (lg+) */}
                <aside className="hidden lg:block">
                  <div className="sticky top-28 rounded-3xl border border-white/60 bg-white/40 backdrop-blur p-5 shadow-sm">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                      Refine
                    </p>

                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          Collection
                        </label>
                        <select
                          value={collectionFilter}
                          onChange={(e) => setParam("collection", e.target.value)}
                          className="mt-2 w-full px-4 py-2 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                        >
                          <option value="All">All</option>
                          {collectionOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          Texture
                        </label>
                        <select
                          value={textureFilter}
                          onChange={(e) => setParam("texture", e.target.value)}
                          className="mt-2 w-full px-4 py-2 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                        >
                          {textureOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          Color
                        </label>
                        <select
                          value={colorFilter}
                          onChange={(e) => setParam("color", e.target.value)}
                          className="mt-2 w-full px-4 py-2 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                        >
                          {colorOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          Sort
                        </label>
                        <select
                          value={sortKey}
                          onChange={(e) => setParam("sort", e.target.value)}
                          className="mt-2 w-full px-4 py-2 rounded-2xl border border-neutral-300 bg-white/70 text-sm"
                        >
                          <option value="featured">Featured</option>
                          <option value="price-asc">Price: Low → High</option>
                          <option value="price-desc">Price: High → Low</option>
                          <option value="alpha">A → Z</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="w-full mt-2 px-4 py-2.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/60 hover:bg-white"
                      >
                        Clear all
                      </button>

                      <div className="rounded-2xl border border-black/5 bg-white/60 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          Concierge tip
                        </p>
                        <p className="mt-2 text-xs text-neutral-700 leading-relaxed">
                          Not sure what to choose? Start with <strong>Eminence Essentials</strong>, then refine texture and length.
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                  {visibleProducts.map((p) => {
                  const startingPrice = getStartingPrice(p);
                  const minLength = getMinLength(p);
                  const minDensity = getMinDensity(p);
                  const images = resolveProductImages(p);

                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col h-full rounded-3xl bg-[#F7EFE2] border border-white/40 shadow-[0_18px_40px_rgba(15,10,5,0.22)] overflow-hidden card-hover"
                    >
                      <Link
                        to={`/products/${p.slug}`}
                        onMouseEnter={() => prefetchRoute(prefetchProduct)}
                        className="relative block aspect-[3/4] overflow-hidden"
                      >
                        <img
                          src={images?.[0] || p.images?.[0]}
                          alt={p.displayName || p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />

                        <span className="absolute top-3 left-3 px-3 py-1 text-[9px] tracking-[0.28em] uppercase rounded-full bg-black/80 text-white">
                          {p.type === "wig" ? "Wig" : p.type === "bundle" ? "Bundle" : "Closure"}
                        </span>

                        {p.readyToShip && (
                          <span className="absolute top-3 right-3 px-3 py-1 text-[9px] tracking-[0.28em] uppercase rounded-full bg-white/80 text-neutral-900 border border-white/60">
                            Ready to ship
                          </span>
                        )}

                        {p.isPreorder && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#D4AF37] text-[#111] font-medium shadow-sm">
                            Pre-Order
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
                            {p.displayName || p.name}
                          </Link>

                          <p className="text-xs text-neutral-600">
                            {p.texture}
                            {minLength != null ? ` • from ${minLength}"` : ""}{" "}
                            {p.type === "wig" && minDensity != null ? ` • ${minDensity}%+` : ""}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">From</p>
                            <p className="text-sm font-medium text-neutral-900">
                              ${Number(startingPrice || 0).toFixed(0)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setQuickViewProduct(p)}
                              className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/70 hover:bg-white"
                            >
                              View
                            </button>

                            {p.type === "wig" ? (
                              <Link
                                to={`/products/${p.slug}`}
                                className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800 bg-black text-white hover:bg-neutral-900"
                              >
                                Select
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleQuickAdd(p)}
                                disabled={addingId === p.id}
                                className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800 bg-black text-white hover:bg-neutral-900 disabled:bg-neutral-500"
                              >
                                {addingId === p.id ? "Added" : "Add"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
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

      <QuickViewModal
        open={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />
    </>
  );
}
