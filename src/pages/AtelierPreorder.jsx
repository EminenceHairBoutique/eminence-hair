import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, ShieldCheck } from "lucide-react";
import SEO from "../components/SEO";
import { preorderProducts } from "../data/products";

const TIER_ORDER = ["Elite Raw", "SDD", "DD", "Raw Standard", "Tier-1"];

const TIER_LABELS = {
  "Elite Raw": "Elite Raw",
  SDD: "Super Double Drawn",
  DD: "Double Drawn",
  "Raw Standard": "Raw Standard",
  "Tier-1": "High Grade Tier-1",
};

const money = (n) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const POLICY_ITEMS = [
  {
    Icon: Clock,
    label: "14–21 Business Days",
    sub: "Estimated factory dispatch",
  },
  {
    Icon: Truck,
    label: "Factory Drop-Ship",
    sub: "Ships direct from our partner facility",
  },
  {
    Icon: ShieldCheck,
    label: "Signature Required",
    sub: "Adult signature required at delivery",
  },
];

function PolicyItem(props) {
  const Icon = props.Icon;
  const { label, sub } = props;
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-neutral-200 bg-white p-4">
      <Icon className="w-5 h-5 text-neutral-600 mb-1" />
      <p className="text-xs font-medium text-neutral-900">{label}</p>
      <p className="text-[11px] text-neutral-500 text-center">{sub}</p>
    </div>
  );
}

function PreorderCard({ product }) {
  const lengths = Array.isArray(product.lengths) && product.lengths.length > 0
    ? product.lengths
    : [16];
  const fromPrice = product.price ? product.price(Math.min(...lengths)) : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img
          src={product.images?.[0]}
          alt={product.displayName || product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f5f1eb'/%3E%3Ctext x='200' y='250' text-anchor='middle' font-family='serif' font-size='14' fill='%23999'%3EAtelier Pre-Order%3C/text%3E%3C/svg%3E";
          }}
        />
        {/* Pre-Order badge */}
        <span className="absolute top-4 left-4 rounded-full bg-neutral-900 text-[#F9F7F4] text-[10px] uppercase tracking-[0.22em] px-3 py-1">
          Pre-Order
        </span>
        {/* Factory drop-ship badge */}
        <span className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur border border-neutral-200 text-[9px] uppercase tracking-[0.18em] px-2 py-1 flex items-center gap-1 text-neutral-700">
          <Truck className="w-3 h-3" />
          Factory Drop-Ship
        </span>
      </div>

      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          {TIER_LABELS[product.qualityTier] || product.qualityTier}
          {product.texture ? ` · ${product.texture}` : ""}
        </p>

        <p className="mt-2 text-sm text-neutral-900 leading-snug">
          {product.displayName || product.name}
        </p>

        <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-500">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Est. {product.leadTimeDays} business days</span>
        </div>

        <p className="mt-3 text-sm font-light text-neutral-900">
          From {money(fromPrice)}
        </p>
      </div>
    </Link>
  );
}

export default function AtelierPreorder() {
  const [filterTier, setFilterTier] = useState("All");
  const [filterTexture, setFilterTexture] = useState("All");

  const allTiers = ["All", ...TIER_ORDER.filter((t) =>
    preorderProducts.some((p) => p.qualityTier === t)
  )];

  const allTextures = useMemo(() => {
    const set = new Set(preorderProducts.map((p) => p.texture).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return preorderProducts
      .filter((p) => filterTier === "All" || p.qualityTier === filterTier)
      .filter((p) => filterTexture === "All" || p.texture === filterTexture)
      .sort((a, b) => {
        const ai = TIER_ORDER.indexOf(a.qualityTier);
        const bi = TIER_ORDER.indexOf(b.qualityTier);
        return ai - bi;
      });
  }, [filterTier, filterTexture]);

  return (
    <>
      <SEO
        title="Atelier Pre-Order — Factory Drop-Ship Bundles"
        description="Pre-order premium factory drop-shipped bundles across our full quality tier ladder: Elite Raw, SDD, DD, Raw Standard, and Tier-1."
      />

      <div className="pt-28 pb-24 bg-[#FBF6ED]">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-3">
            Eminence Hair · Atelier Pre-Order
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            Factory Drop-Ship Collection
          </h1>
          <p className="text-neutral-600 max-w-xl mx-auto text-sm leading-relaxed">
            Bundles not held in domestic inventory — sourced and shipped directly
            from our factory partners. Select your tier. Reserve your order.
          </p>

          {/* Policy strip */}
          <div className="mt-8 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
            {POLICY_ITEMS.map((item) => (
              <PolicyItem key={item.label} {...item} />
            ))}
          </div>

          {/* Non-negotiables notice */}
          <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-xs text-amber-900 leading-relaxed">
            <p className="font-semibold mb-1 uppercase tracking-[0.14em] text-[10px]">
              Pre-Order Non-Negotiables
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>All pre-order sales are <strong>final</strong>. No returns or exchanges.</li>
              <li>Lead time is estimated. Factory delays may occur — we will notify you.</li>
              <li>Tracking is emailed once your order has physically shipped.</li>
              <li>Adult signature is required at delivery.</li>
              <li>Pre-order items cannot be combined with domestic inventory items in a single checkout.</li>
            </ul>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 self-center mr-1">
              Tier:
            </span>
            {allTiers.map((t) => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] border transition ${
                  filterTier === t
                    ? "bg-neutral-900 text-[#F9F7F4] border-neutral-900"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {t === "All" ? "All Tiers" : (TIER_LABELS[t] || t)}
              </button>
            ))}
          </div>

          {allTextures.length > 2 && (
            <div className="flex flex-wrap gap-2 ml-auto">
              <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 self-center mr-1">
                Texture:
              </span>
              {allTextures.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTexture(t)}
                  className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.18em] border transition ${
                    filterTexture === t
                      ? "bg-neutral-900 text-[#F9F7F4] border-neutral-900"
                      : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {t === "All" ? "All Textures" : t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <p className="text-center text-neutral-500 py-16">
              No items match your current filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <PreorderCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Tier guide */}
        <div className="max-w-4xl mx-auto px-6 mt-16">
          <h2 className="text-center text-lg font-light mb-6">Quality Tier Guide</h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">Tier</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">Draw</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">Best For</th>
                  <th className="text-right px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">From (16″)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Elite Raw", draw: "Single donor · 100% raw", best: "Color work, longevity, reuse", from: 249 },
                  { tier: "SDD", draw: "95%+ full-length strands", best: "Max volume installs", from: 219 },
                  { tier: "DD", draw: "80–85% full-length strands", best: "Everyday fullness", from: 199 },
                  { tier: "Raw Standard", draw: "Cuticle-intact, lightly sorted", best: "Quality at value", from: 179 },
                  { tier: "Tier-1", draw: "Cuticle-aligned, blended draw", best: "Accessible factory quality", from: 149 },
                ].map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? "bg-neutral-50/50" : ""}>
                    <td className="px-5 py-3 font-medium text-neutral-900">{row.tier}</td>
                    <td className="px-5 py-3 text-neutral-600">{row.draw}</td>
                    <td className="px-5 py-3 text-neutral-600">{row.best}</td>
                    <td className="px-5 py-3 text-right text-neutral-900">{money(row.from)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
