import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import { products, eminenceEssentials } from "../data/products";

const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const TEXTURE_OPTIONS = [
  { label: "Straight", value: "Straight" },
  { label: "Loose Wave", value: "LooseWave" },
  { label: "Body Wave", value: "BodyWave" },
  { label: "Deep Wave", value: "DeepWave" },
];

const COLOR_OPTIONS = [
  { label: "1 (Jet Black)", value: "1" },
  { label: "1B (Natural Black)", value: "1B" },
  { label: "Brown", value: "Brown" },
  { label: "Burgundy", value: "Burgundy" },
  { label: "613 Blonde", value: "613" },
  { label: "Silver", value: "Silver" },
  { label: "Orange", value: "Orange" },
];

const LENGTH_OPTIONS = [
  { label: "Short (12–16\")", value: "short", min: 12, max: 16 },
  { label: "Medium (18–22\")", value: "medium", min: 18, max: 22 },
  { label: "Long (24–30\")", value: "long", min: 24, max: 30 },
];

export default function StartHere() {
  const [type, setType] = useState("wig"); // 'wig' | 'bundle'
  const [texture, setTexture] = useState("All");
  const [color, setColor] = useState("All");
  const [lengthBand, setLengthBand] = useState("All");

  const lengthRange = useMemo(() => {
    const band = LENGTH_OPTIONS.find((x) => x.value === lengthBand);
    return band ? { min: band.min, max: band.max } : null;
  }, [lengthBand]);

  const suggested = useMemo(() => {
    let list = products.filter((p) => p.type === type);

    if (texture !== "All") {
      list = list.filter((p) => norm(p.texture) === norm(texture));
    }
    if (color !== "All") {
      list = list.filter((p) => norm(p.color) === norm(color) || norm(p.collectionSlug) === norm(color));
    }

    if (lengthRange) {
      list = list.filter((p) => {
        const lens = Array.isArray(p.lengths) ? p.lengths : [];
        return lens.some((L) => L >= lengthRange.min && L <= lengthRange.max);
      });
    }

    // Small scoring: essentials first, then same texture.
    const score = (p) => {
      let s = 0;
      if (p.isEssential) s += 4;
      if (texture !== "All" && norm(p.texture) === norm(texture)) s += 2;
      if (color !== "All" && (norm(p.color) === norm(color) || norm(p.collectionSlug) === norm(color))) s += 1;
      return s;
    };

    return list
      .slice()
      .sort((a, b) => score(b) - score(a))
      .slice(0, 8);
  }, [type, texture, color, lengthRange]);

  const shopLink = useMemo(() => {
    const params = new URLSearchParams();
    if (type === "wig") params.set("type", "wig");
    if (type === "bundle") params.set("type", "bundle");
    if (texture !== "All") params.set("texture", texture);
    if (color !== "All") params.set("color", color);
    return `/shop?${params.toString()}`;
  }, [type, texture, color]);

  const empty = suggested.length === 0;

  return (
    <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          eyebrow="Start Here"
          title="A guided way to shop Eminence."
          subtitle="Choose what you want — wig or bundles — then narrow by texture, color, and length. If anything feels uncertain, our concierge can help you select the right unit without pressure."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp"
          ctas={[
            { label: "Private Consult", href: "/private-consult", variant: "primary" },
            { label: "Shop All", href: "/shop", variant: "ghost" },
          ]}
          compact
        />

        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Filters */}
            <aside className="lg:col-span-4">
              <div className="rounded-3xl border border-black/10 bg-white/60 p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Matchmaker
                </p>
                <h2 className="mt-2 text-xl font-light font-display">Build your shortlist</h2>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                  Start broad, then refine. The right choice is the one you can wear repeatedly —
                  and style confidently.
                </p>

                <div className="mt-7 space-y-6">
                  <Field label="Shopping for">
                    <div className="grid grid-cols-2 gap-2">
                      <Pill active={type === "wig"} onClick={() => setType("wig")}>Wigs</Pill>
                      <Pill active={type === "bundle"} onClick={() => setType("bundle")}>Bundles</Pill>
                    </div>
                  </Field>

                  <Field label="Texture">
                    <div className="flex flex-wrap gap-2">
                      <Pill active={texture === "All"} onClick={() => setTexture("All")}>All</Pill>
                      {TEXTURE_OPTIONS.map((t) => (
                        <Pill
                          key={t.value}
                          active={texture === t.value}
                          onClick={() => setTexture(t.value)}
                        >
                          {t.label}
                        </Pill>
                      ))}
                    </div>
                  </Field>

                  <Field label="Color">
                    <div className="flex flex-wrap gap-2">
                      <Pill active={color === "All"} onClick={() => setColor("All")}>All</Pill>
                      {COLOR_OPTIONS.map((c) => (
                        <Pill
                          key={c.value}
                          active={color === c.value}
                          onClick={() => setColor(c.value)}
                        >
                          {c.label}
                        </Pill>
                      ))}
                    </div>
                  </Field>

                  <Field label="Length">
                    <div className="flex flex-wrap gap-2">
                      <Pill active={lengthBand === "All"} onClick={() => setLengthBand("All")}>All</Pill>
                      {LENGTH_OPTIONS.map((b) => (
                        <Pill
                          key={b.value}
                          active={lengthBand === b.value}
                          onClick={() => setLengthBand(b.value)}
                        >
                          {b.label}
                        </Pill>
                      ))}
                    </div>
                  </Field>
                </div>

                <div className="mt-7 flex flex-col gap-3">
                  <Link
                    to={shopLink}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                  >
                    View matching items
                  </Link>
                  <Link
                    to="/private-consult"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                  >
                    Prefer help? Book a consult
                  </Link>
                </div>

                <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
                  If you’re new to wigs, start with a medium length (18–22\") and 180–200% density.
                  It’s the most forgiving for everyday wear and styling.
                </p>
              </div>
            </aside>

            {/* Results */}
            <section className="lg:col-span-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                    Suggested for you
                  </p>
                  <h3 className="mt-2 text-2xl font-light font-display">Shortlist</h3>
                </div>
                <Link
                  to={shopLink}
                  className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
                >
                  Shop these filters
                </Link>
              </div>

              {empty ? (
                <div className="mt-8 rounded-3xl border border-black/10 bg-white/60 p-8">
                  <p className="text-sm text-neutral-800">
                    We don’t have an exact match for that combination yet.
                  </p>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    Try a nearby texture (Body Wave ↔ Loose Wave) or keep color at “All”.
                    Meanwhile, here are our Essentials — the safest first choices.
                  </p>
                  <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eminenceEssentials.slice(0, 6).map((p) => (
                      <ProductMiniCard key={p.id} p={p} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggested.map((p) => (
                    <ProductMiniCard key={p.id} p={p} />
                  ))}
                </div>
              )}

              {/* Education */}
              <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoCard
                  title="Density"
                  body="For everyday, 180–200% is the sweet spot. Higher densities are bold and photo-forward, but require more styling." 
                  link={{ label: "Medical hair", href: "/medical-hair" }}
                />
                <InfoCard
                  title="Lace"
                  body="HD lace melts under flash and daylight. Transparent lace is more forgiving for first installs and lighter maintenance." 
                  link={{ label: "Authenticity", href: "/authenticity" }}
                />
                <InfoCard
                  title="Care"
                  body="Treat it like couture: gentle wash schedule, low heat, and proper storage. Your longevity depends on your ritual." 
                  link={{ label: "Care guide", href: "/care" }}
                />
                <InfoCard
                  title="Custom Atelier"
                  body="Need a specific color, density, lace, or fit? Build a request and let our concierge confirm the best construction." 
                  link={{ label: "Build your custom wig", href: "/custom-atelier" }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border transition " +
        (active
          ? "border-neutral-900 bg-neutral-900 text-[#F9F7F4]"
          : "border-neutral-300 bg-white/40 hover:bg-white/70 text-neutral-800")
      }
    >
      {children}
    </button>
  );
}

function ProductMiniCard({ p }) {
  return (
    <Link
      to={`/products/${p.slug}`}
      className="group rounded-3xl overflow-hidden border border-black/10 bg-white/50 hover:bg-white transition"
    >
      <div className="aspect-[4/5] overflow-hidden bg-white">
        <img
          src={p.images?.[0]}
          alt={p.displayName || p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          {p.type === "bundle" ? "Bundle" : "Wig"}
          {p.texture ? ` • ${p.texture}` : ""}
        </p>
        <p className="mt-2 text-sm text-neutral-900">{p.displayName || p.name}</p>
        {p.collection && <p className="mt-1 text-xs text-neutral-600">{p.collection}</p>}
      </div>
    </Link>
  );
}

function InfoCard({ title, body, link }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 p-6">
      <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">{title}</p>
      <p className="mt-3 text-sm text-neutral-800 leading-relaxed">{body}</p>
      {link && (
        <Link
          to={link.href}
          className="mt-4 inline-block text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
