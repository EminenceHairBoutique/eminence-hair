import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams, useSearchParams, useLocation } from "react-router-dom";
import { SlidersHorizontal, X, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion as Motion } from "framer-motion";

import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { prefetchRoute } from "../utils/prefetch";
import SEO from "../components/SEO";
import QuickViewModal from "../components/QuickViewModal";
import { resolveProductImages } from "../utils/productMedia";
import { slugify } from "../utils/strings";
import { formatMoney } from "../utils/format";
import { getMinLength, getMinDensity, getStartingPrice, matchesColor } from "../utils/productFiltering";

const prefetchProduct = () => import("./ProductDetail");

const COLLECTION_META = {
  "fw-2025": {
    title: "F/W 2025",
    subtitle:
      "Editorial silhouettes and couture textures curated for Fall/Winter 2025 — a refined lookbook for your next transformation.",
    note: "Seasonal edit",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_01.webp",
    shopLink: "/shop",
    shopCta: "Shop the boutique",
    lookbook: [
      "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_02.webp",
      "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_03.webp",
      "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_04.webp",
      "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_05.webp",
    ],
  },
  "eminence": {
    title: "Eminence Collection",
    subtitle:
      "Our signature line — clean construction, balanced density, and a finish that reads luxury in every light.",
    note: "Signature",
    heroImage: "/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_01.webp",
  },
  "sea": {
    title: "SEA Collection",
    subtitle:
      "Fluid textures sourced from SEA donors, selected for softness, movement, and longevity.",
    note: "Raw origin",
    heroImage: "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
  },
  "burmese": {
    title: "Burmese Collection",
    subtitle: "Rich curl definition with exceptional density and durability.",
    note: "Curl origin",
    heroImage: "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
  },
  "lavish": {
    title: "Lavish Collection",
    subtitle: "Polished waves with an editorial, high‑gloss finish.",
    note: "Wave edit",
    heroImage: "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
  },
  "straight": {
    title: "Straight Collection",
    subtitle: "Ultra‑sleek raw straight textures with natural sheen and flow.",
    note: "Silk finish",
    heroImage: "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
  },
  "eminence-essentials": {
    title: "Eminence Essentials",
    subtitle: "A focused edit of the pieces our clients choose most — refined, realistic, and designed for everyday confidence.",
    note: "Thoughtfully curated. Always in style.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp",
    shopLink: "/shop?collection=eminence-essentials",
    shopCta: "Shop Essentials",
  },
  "natural": {
    title: "Colorway Natural",
    subtitle: "Our natural edit — timeless tones with soft dimension, created to blend seamlessly and wear beautifully.",
    note: "The signature neutral.",
    heroImage: "/gallery/colorways/Natural/Eminence_Colorways_BodyWave_Natural_01.webp",
  },
  "613": {
    title: "Colorway 613",
    subtitle: "Bright, luxe blonde — crafted for clean color and high-shine movement.",
    note: "Light, luminous, and editorial.",
    heroImage: "/gallery/colorways/613/Eminence_Colorways_Curly_613_01.webp",
  },
};

function getCollectionHeader(slug, sampleProduct) {
  const meta = COLLECTION_META[String(slug || "").toLowerCase()];
  if (meta) return meta;

  const pretty =
    sampleProduct?.collection ||
    sampleProduct?.collectionName ||
    sampleProduct?.collections?.[0] ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return {
    title: pretty,
    subtitle:
      "An Eminence collection crafted for softness, realism, and longevity — luxury that performs beautifully in real life.",
    note: "Curated with intention.",
  };
}

/* ---------------- UI bits ---------------- */
function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border transition ${
        active
          ? "bg-black text-white border-black"
          : "border-neutral-800/30 bg-white/60 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-neutral-600">
      <span className="hidden md:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-neutral-900/20 bg-white/70 px-4 py-2 text-[12px] tracking-normal text-neutral-900 outline-none focus:bg-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CollectionDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // route-based "loading skeleton" feel
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, [location.key]);

  const collectionProducts = useMemo(() => {
    const s = String(slug || "").toLowerCase();

    // Special: Essentials isn't a collectionSlug in products.js; it's a curated tag.
    if (s === "eminence-essentials") {
      return products
        .filter(
          (p) =>
            p.isEssential ||
            (Array.isArray(p.collections) &&
              p.collections.some((c) => String(c).toLowerCase().includes("eminence essentials")))
        )
        .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));
    }

    return products.filter((p) => {
      const direct =
        String(p.collectionSlug || "").toLowerCase() === s ||
        String(p.collection || "").toLowerCase() === s;
      if (direct) return true;

      // fallback: match slugified collection name
      const c = slugify(p.collection);
      return c === s;
    });
  }, [slug]);

  const header = useMemo(
    () => getCollectionHeader(slug, collectionProducts?.[0]),
    [slug, collectionProducts]
  );

  const heroImage =
    resolveProductImages(collectionProducts?.[0])?.[0] || header?.heroImage || null;

  const shopLink = useMemo(() => {
    // If the collection has products, we can route straight into the Shop with filters.
    if (collectionProducts.length > 0) return `/shop?collection=${encodeURIComponent(slug)}`;

    // Otherwise use curated fallback (e.g., F/W 2025 is editorial).
    return header?.shopLink || "/shop";
  }, [collectionProducts.length, slug, header]);

  const shopCta = useMemo(() => {
    if (collectionProducts.length > 0) return "Shop this edit";
    return header?.shopCta || "Shop the boutique";
  }, [collectionProducts.length, header]);

  // filters from URL (shareable)
  const typeFilter = searchParams.get("type") || "All";
  const textureFilter = searchParams.get("texture") || "All";
  const colorFilter = searchParams.get("color") || "All";
  const sort = searchParams.get("sort") || "Featured";

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(collectionProducts.map((p) => p.type))).filter(Boolean);
    const labelMap = { wig: "Wigs", bundle: "Bundles", closure: "Closures" };
    const options = types.map((t) => labelMap[t] || t);
    // Preserve canonical ordering
    const ordered = ["Wigs", "Bundles", "Closures"].filter((o) => options.includes(o));
    return ["All", ...ordered];
  }, [collectionProducts]);

  const availableTextures = useMemo(() => {
    const textures = Array.from(new Set(collectionProducts.map((p) => p.texture))).filter(Boolean);
    textures.sort((a, b) => String(a).localeCompare(String(b)));
    return ["All", ...textures];
  }, [collectionProducts]);

  const availableColors = useMemo(() => {
    // present what your Shop already supports today; future-safe
    const base = ["All", "1", "1B", "Brown", "Burgundy", "613", "Silver", "Orange", "Natural"];
    // Only show options that appear to exist, to avoid dead filters
    const exists = (c) =>
      c === "All" || collectionProducts.some((p) => matchesColor(p, c));
    return base.filter((c) => exists(c));
  }, [collectionProducts]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All" || value === "Featured") next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    ["type", "texture", "color", "sort"].forEach((k) => next.delete(k));
    setSearchParams(next, { replace: true });
  };

  const visibleProducts = useMemo(() => {
    let list = [...collectionProducts];

    if (typeFilter !== "All") {
      const mapBack = { Wigs: "wig", Bundles: "bundle", Closures: "closure" };
      const desired = mapBack[typeFilter] || typeFilter.toLowerCase();
      list = list.filter((p) => p.type === desired);
    }

    if (textureFilter !== "All") list = list.filter((p) => p.texture === textureFilter);

    if (colorFilter !== "All") list = list.filter((p) => matchesColor(p, colorFilter));

    if (sort === "Price: Low to High") {
      list.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    } else if (sort === "Price: High to Low") {
      list.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    } else if (sort === "Name: A to Z") {
      list.sort((a, b) => String(a.displayName || a.name).localeCompare(String(b.displayName || b.name)));
    }

    return list;
  }, [collectionProducts, typeFilter, textureFilter, colorFilter, sort]);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const hasFilters =
    typeFilter !== "All" || textureFilter !== "All" || colorFilter !== "All" || sort !== "Featured";

  const slugKey = String(slug || "").toLowerCase();
  const hasKnownMeta = Boolean(COLLECTION_META[slugKey]);

  // Unknown slug with no products → true 404-style state.
  if (!pageLoading && collectionProducts.length === 0 && !hasKnownMeta) {
    return (
      <div className="pt-32 pb-32 bg-[#FBF6ED] text-center px-6">
        <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-4">Eminence Hair</p>
        <h1 className="text-4xl font-light mb-6">Collection not found</h1>
        <p className="max-w-md mx-auto text-neutral-600 leading-relaxed">
          That edit isn’t available yet. Explore all collections or shop the full catalog.
        </p>

        <div className="mt-10 flex gap-3 justify-center">
          <Link
            to="/collections"
            className="inline-block px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
          >
            View Collections
          </Link>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
          >
            Shop All
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${header.title} | Collections`}
        description={header.subtitle}
        image={heroImage}
      />

      <div className="pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
            {/* Breadcrumb */}
            <nav className="text-[11px] tracking-[0.22em] uppercase text-neutral-500">
              <Link to="/" className="hover:text-neutral-900">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/collections" className="hover:text-neutral-900">Collections</Link>
              <span className="mx-2">/</span>
              <span className="text-neutral-700">{header.title}</span>
            </nav>

            {/* HERO */}
            <section className="grid md:grid-cols-[1.35fr,1fr] gap-8 items-center rounded-3xl border border-white/60 bg-gradient-to-r from-[#F6ECE1] via-[#F9F7F4] to-[#F4EBDF] shadow-[0_22px_50px_rgba(17,12,5,0.20)] px-6 md:px-10 py-8 md:py-10 overflow-hidden">
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-600">
                  <Sparkles className="w-4 h-4" /> Eminence Collection
                </p>

                {pageLoading ? (
                  <>
                    <div className="h-10 w-[80%] rounded-xl bg-black/10 animate-pulse" />
                    <div className="h-5 w-[70%] rounded-xl bg-black/10 animate-pulse" />
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-light tracking-wide max-w-xl">
                      {header.title}
                    </h1>
                    <p className="text-sm text-neutral-700 max-w-xl">{header.subtitle}</p>
                  </>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={shopLink}
                    className="px-8 py-2.5 text-[11px] tracking-[0.26em] uppercase rounded-full border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition inline-flex items-center gap-2"
                  >
                    {shopCta} <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-xs text-neutral-600">
                    {collectionProducts.length} styles • {header.note}
                  </p>
                </div>
              </div>

              <div className="relative h-52 md:h-64 rounded-3xl overflow-hidden border border-white/60 bg-white">
                {heroImage ? (
                  <>
                    <img src={heroImage} alt={header.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-black/10 animate-pulse" />
                )}
              </div>
            </section>

            {/* TRUST STRIP */}
            <section className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: "Authenticity-first",
                  body: "Every piece is crafted to be worn with confidence — from hair selection to finishing details.",
                  href: "/authenticity",
                  cta: "Learn more",
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: "Designed for real wear",
                  body: "Balanced density, clean construction, and a comfortable fit — luxury that performs beautifully.",
                  href: "/care",
                  cta: "Care guide",
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: "Private styling support",
                  body: "Need help choosing lace, length, or texture? We’ll guide you discreetly, without pressure.",
                  href: "/private-consult",
                  cta: "Book consult",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-6 py-6 shadow-[0_18px_40px_rgba(15,10,5,0.14)]"
                >
                  <div className="flex items-center gap-3 text-neutral-900">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-black/5 border border-black/10">
                      {card.icon}
                    </span>
                    <p className="text-sm font-medium">{card.title}</p>
                  </div>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{card.body}</p>
                  <Link
                    to={card.href}
                    className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700 hover:text-neutral-900"
                  >
                    {card.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </section>

            {/* FILTER BAR (only when products exist) */}
            {collectionProducts.length > 0 && (
            <section className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur px-5 py-5 shadow-[0_18px_40px_rgba(15,10,5,0.10)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {availableTypes.map((t) => (
                    <Chip
                      key={t}
                      active={typeFilter === t}
                      onClick={() => setParam("type", t)}
                    >
                      {t}
                    </Chip>
                  ))}

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800/30 bg-white/60 hover:bg-white transition inline-flex items-center gap-2"
                      title="Clear filters"
                    >
                      Clear <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <Select
                    label="Texture"
                    value={textureFilter}
                    onChange={(v) => setParam("texture", v)}
                    options={availableTextures}
                  />
                  <Select
                    label="Color"
                    value={colorFilter}
                    onChange={(v) => setParam("color", v)}
                    options={availableColors}
                  />
                  <Select
                    label="Sort"
                    value={sort}
                    onChange={(v) => setParam("sort", v)}
                    options={["Featured", "Price: Low to High", "Price: High to Low", "Name: A to Z"]}
                  />
                </div>

                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="w-full px-5 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.26em] inline-flex items-center justify-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters & Sort
                  </button>
                </div>
              </div>

              {/* Active filter chips */}
              {(textureFilter !== "All" || colorFilter !== "All" || sort !== "Featured") && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-700">
                  {textureFilter !== "All" && (
                    <button
                      type="button"
                      onClick={() => setParam("texture", "All")}
                      className="px-3 py-1.5 rounded-full border border-neutral-900/15 bg-white/70"
                    >
                      {textureFilter} <span className="ml-1 opacity-70">×</span>
                    </button>
                  )}
                  {colorFilter !== "All" && (
                    <button
                      type="button"
                      onClick={() => setParam("color", "All")}
                      className="px-3 py-1.5 rounded-full border border-neutral-900/15 bg-white/70"
                    >
                      {colorFilter} <span className="ml-1 opacity-70">×</span>
                    </button>
                  )}
                  {sort !== "Featured" && (
                    <button
                      type="button"
                      onClick={() => setParam("sort", "Featured")}
                      className="px-3 py-1.5 rounded-full border border-neutral-900/15 bg-white/70"
                    >
                      {sort} <span className="ml-1 opacity-70">×</span>
                    </button>
                  )}
                </div>
              )}
            </section>
            )}

            {/* GRID / EDITORIAL FALLBACK */}
            <section>
              {pageLoading ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-3xl bg-black/10 animate-pulse h-[420px]" />
                  ))}
                </div>
              ) : (
                <>
                  {collectionProducts.length === 0 ? (
                    <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur p-10">
                      <div className="grid lg:grid-cols-[1fr,1.05fr] gap-8 items-center">
                        <div className="text-center lg:text-left">
                          <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-3">
                            {header?.note || "Seasonal edit"}
                          </p>
                          <h2 className="text-2xl font-light mb-3">This edit is being curated.</h2>
                          <p className="text-sm text-neutral-700 max-w-xl lg:max-w-none mx-auto lg:mx-0">
                            We keep editorial collections tight by design. Explore the boutique now, or book a private
                            consult for guidance toward your most natural match.
                          </p>
                          <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                            <Link
                              to={shopLink}
                              className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
                            >
                              {shopCta}
                            </Link>
                            <Link
                              to="/private-consult"
                              className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                            >
                              Book Private Consult
                            </Link>
                          </div>
                        </div>

                        {Array.isArray(header?.lookbook) && header.lookbook.length > 0 && (
                          <div className="grid grid-cols-2 gap-3">
                            {header.lookbook.slice(0, 4).map((src, i) => (
                              <div
                                key={`${src}-${i}`}
                                className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/60 bg-white shadow-[0_18px_40px_rgba(15,10,5,0.18)]"
                              >
                                <img
                                  src={src}
                                  alt={`${header.title} lookbook ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : visibleProducts.length === 0 ? (
                    <div className="rounded-3xl border border-white/60 bg-white/60 backdrop-blur p-10 text-center">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-3">
                        No results
                      </p>
                      <h2 className="text-2xl font-light mb-3">That combination is currently empty.</h2>
                      <p className="text-sm text-neutral-700 max-w-lg mx-auto">
                        Try removing a filter or exploring the full edit. We keep each collection tight by design.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-6 px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                      {visibleProducts.map((p) => {
                        const startingPrice = getStartingPrice(p);
                        const minLength = getMinLength(p);
                        const minDensity = getMinDensity(p);

                        const isWig = p.type === "wig";

                        return (
                          <div
                            key={p.id}
                            className="group flex flex-col h-full rounded-3xl bg-[#F7EFE2] border border-white/40 shadow-[0_18px_40px_rgba(15,10,5,0.22)] overflow-hidden"
                          >
                            <Link
                              to={`/products/${p.slug}`}
                              onMouseEnter={() => prefetchRoute(prefetchProduct)}
                              className="relative block aspect-[3/4] overflow-hidden"
                            >
                              <img
                                src={resolveProductImages(p)?.[0]}
                                alt={p.displayName || p.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                              />

                              {isWig && (
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
                                    {formatMoney(startingPrice)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setQuickViewProduct(p)}
                                    className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800 bg-white/70 hover:bg-white"
                                  >
                                    View
                                  </button>

                                  {isWig ? (
                                    <Link
                                      to={`/products/${p.slug}`}
                                      className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800 bg-black text-white hover:bg-neutral-900"
                                    >
                                      Select
                                    </Link>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const payload = { ...p };
                                        const L = getMinLength(p);
                                        if (L != null) {
                                          payload.length = payload.length ?? L;
                                          payload.selectedLength = payload.selectedLength ?? L;
                                        }
                                        addToCart(payload);
                                      }}
                                      className="px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-800 bg-black text-white hover:bg-neutral-900"
                                    >
                                      Add
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* SUPPORT CTA */}
            <section className="rounded-3xl border border-white/60 bg-gradient-to-r from-[#F6ECE1] via-[#F9F7F4] to-[#F4EBDF] px-7 py-8 shadow-[0_22px_50px_rgba(17,12,5,0.14)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-2">
                    Private Support
                  </p>
                  <h3 className="text-2xl font-light">Not sure which piece is “you”?</h3>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                    If you’re choosing for everyday wear, a major event, or a more sensitive season, we’ll help you
                    select lace, length, and texture with discretion — and zero pressure.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/private-consult"
                    className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
                  >
                    Book Private Consult
                  </Link>
                  <Link
                    to="/medical-hair"
                    className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                  >
                    Medical Hair Concierge
                  </Link>
                </div>
              </div>
            </section>
        </div>

        {/* MOBILE FILTER DRAWER */}
        {filtersOpen && (
          <div className="fixed inset-0 z-[60] bg-black/40 flex items-end">
            <Motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full rounded-t-3xl bg-[#FBF6ED] border-t border-black/10 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm tracking-[0.22em] uppercase text-neutral-800">Filters</p>
                <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-full hover:bg-black/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-600">Texture</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTextures.map((t) => (
                      <Chip key={t} active={textureFilter === t} onClick={() => setParam("texture", t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-600">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((c) => (
                      <Chip key={c} active={colorFilter === c} onClick={() => setParam("color", c)}>
                        {c}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-600">Sort</p>
                  <div className="flex flex-wrap gap-2">
                    {["Featured", "Price: Low to High", "Price: High to Low", "Name: A to Z"].map((s) => (
                      <Chip key={s} active={sort === s} onClick={() => setParam("sort", s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-5 py-3 rounded-full border border-neutral-900 text-[11px] uppercase tracking-[0.26em] hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="flex-1 px-5 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.26em]"
                  >
                    View Results
                  </button>
                </div>
              </div>
            </Motion.div>
          </div>
        )}

        <QuickViewModal
          open={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          product={quickViewProduct}
        />
      </div>
    </>
  );
}
