// src/pages/Collections.jsx — Collections (Upgraded)

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import LazyImage from "../components/LazyImage";

export default function Collections() {
  const collections = useMemo(
    () => [
      {
        slug: "fw-2025",
        title: "F/W 2025",
        eyebrow: "Seasonal Edit",
        description:
          "Editorial silhouettes and couture textures curated for Fall/Winter 2025.",
        image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_01.webp",
        tag: "Limited",
        type: "seasonal",
        // Editorial lookbook — shop routes to the boutique (not a filtered catalog yet)
        shopLink: "/shop",
        shopCta: "Shop the boutique",
      },
      {
        slug: "eminence",
        title: "Eminence Collection",
        eyebrow: "Core Line",
        description:
          "Our signature luxury line — timeless textures crafted in our partner atelier.",
        image: "/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_01.webp",
        tag: "Signature",
        type: "core",
      },
      {
        slug: "sea",
        title: "SEA Collection",
        eyebrow: "Origin",
        description:
          "Fluid textures sourced from SEA donors, selected for softness, movement, and longevity.",
        image: "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
        tag: "Raw",
        type: "core",
      },
      {
        slug: "burmese",
        title: "Burmese Collection",
        eyebrow: "Origin",
        description: "Rich curl definition with exceptional density and durability.",
        image: "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
        tag: "Curl",
        type: "core",
      },
      {
        slug: "lavish",
        title: "Lavish Collection",
        eyebrow: "Texture",
        description:
          "Polished wave patterns with an editorial, high‑gloss finish.",
        image: "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
        tag: "Wave",
        type: "core",
      },
      {
        slug: "straight",
        title: "Straight Collection",
        eyebrow: "Texture",
        description: "Ultra‑sleek raw straight textures with natural sheen and flow.",
        image: "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
        tag: "Silk",
        type: "core",
      },
      {
        slug: "613",
        title: "613 Blonde",
        eyebrow: "Colorway",
        description:
          "Bright blonde units ideal for customization or wear as‑is. Designed to tone beautifully.",
        image: "/gallery/colorways/613/Eminence_Colorways_Curly_613_01.webp",
        tag: "Blonde",
        type: "color",
      },
      {
        slug: "medical-grade",
        title: "Medical Grade",
        eyebrow: "Hair Solutions",
        description:
          "Cranial prosthesis options designed for sensitive scalps — refined realism and ultra-soft construction.",
        image: "/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_02.webp",
        tag: "Medical",
        type: "edit",
        shopLink: "/shop/medical",
        shopCta: "Shop medical grade",
        shopOnly: true,
      },
      {
        slug: "eminence-essentials",
        title: "Eminence Essentials",
        eyebrow: "Edit",
        description:
          "Our most requested pieces — curated for everyday luxury and effortless choice.",
        image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp",
        tag: "Best‑Sellers",
        type: "edit",
        shopOnly: true,
      },
    ],
    []
  );

  const filters = useMemo(
    () => [
      { id: "all", label: "All" },
      { id: "core", label: "Core" },
      { id: "seasonal", label: "Seasonal" },
      { id: "color", label: "Colorways" },
      { id: "edit", label: "Edits" },
    ],
    []
  );

  const [active, setActive] = useState("all");

  const visible = useMemo(() => {
    if (active === "all") return collections;
    return collections.filter((c) => c.type === active);
  }, [active, collections]);

  return (
    <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          eyebrow="Collections"
          title="Curated textures. Signature construction."
          subtitle="Explore the Eminence universe — origin-driven collections, editorial edits, and colorways designed to perform under every light."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_04.webp"
          ctas={[
            { label: "Shop All", href: "/shop", variant: "primary" },
            { label: "Private Consult", href: "/private-consult", variant: "ghost" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-6 py-14">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((f) => {
              const on = f.id === active;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(f.id)}
                  className={
                    "text-[11px] uppercase tracking-[0.26em] px-4 py-2 rounded-full border transition " +
                    (on
                      ? "border-black/30 bg-black text-white"
                      : "border-black/10 hover:border-black/20 bg-white/50")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Collection cards */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((c) => (
              <article
                key={c.slug}
                className="group rounded-3xl overflow-hidden bg-white border border-black/5 shadow-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <LazyImage
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90" />
                  <div className="absolute left-5 right-5 bottom-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.32em] text-white/80">
                        {c.eyebrow}
                      </p>
                      {c.tag && (
                        <span className="text-[10px] uppercase tracking-[0.26em] text-white/90 border border-white/30 px-3 py-1 rounded-full">
                          {c.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-xl font-light font-display text-white">
                      {c.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-neutral-700 leading-relaxed">{c.description}</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {!c.shopOnly && (
                      <Link
                        to={`/collections/${c.slug}`}
                        className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                      >
                        Explore
                      </Link>
                    )}
                    <Link
                      to={c.shopLink || `/shop?collection=${c.slug}`}
                      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                    >
                      {c.shopCta || "Shop"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Shop by Texture + Colorways (fast luxury browsing) */}
          <div className="mt-14 grid lg:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-black/5 bg-white/60 p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                Shop by texture
              </p>
              <h3 className="mt-2 text-2xl font-light font-display">
                Signature patterns
              </h3>
              <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                Choose the movement that matches your lifestyle — sleek, soft wave, full wave, or
                defined.
              </p>

              <div className="mt-7 grid sm:grid-cols-2 gap-5">
                {[
                  {
                    label: "Straight",
                    href: "/shop?texture=Straight",
                    image: "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
                  },
                  {
                    label: "Loose Wave",
                    href: "/shop?texture=LooseWave",
                    image: "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
                  },
                  {
                    label: "Body Wave",
                    href: "/shop?texture=BodyWave",
                    image: "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
                  },
                  {
                    label: "Deep Wave",
                    href: "/shop?texture=DeepWave",
                    image: "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
                  },
                ].map((t) => (
                  <Link
                    key={t.label}
                    to={t.href}
                    className="group rounded-2xl overflow-hidden border border-black/10 bg-white hover:bg-white transition"
                  >
                    <div className="aspect-[3/2] overflow-hidden bg-white">
                      <LazyImage src={t.image} alt={t.label} className="w-full h-full" />
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-700">
                        {t.label}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-500 group-hover:text-neutral-700">
                        Shop
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-[#F3EFE8] p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-600">
                Shop by colorway
              </p>
              <h3 className="mt-2 text-2xl font-light font-display">
                Signature shades
              </h3>
              <p className="mt-3 text-sm text-neutral-800 leading-relaxed">
                From natural blacks to luminous blonde — shop the color family, then refine by
                texture and length.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  { label: "1", href: "/shop?color=1" },
                  { label: "1B", href: "/shop?color=1B" },
                  { label: "Brown", href: "/shop?color=Brown" },
                  { label: "Burgundy", href: "/shop?color=Burgundy" },
                  { label: "613", href: "/shop?color=613" },
                  { label: "Silver", href: "/shop?color=Silver" },
                  { label: "Orange", href: "/shop?color=Orange" },
                ].map((c) => (
                  <Link
                    key={c.label}
                    to={c.href}
                    className="px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.26em] border border-black/15 bg-white/50 hover:bg-white hover:border-black/30 transition"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-black/10 bg-white/60 p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-600">
                  New to wigs?
                </p>
                <p className="mt-2 text-sm text-neutral-900">
                  Take the guided Matchmaker to find your first purchase.
                </p>
                <Link
                  to="/start-here"
                  className="mt-4 inline-block text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
                >
                  Start Here
                </Link>
              </div>
            </div>
          </div>

          {/* Concierge CTA */}
          <div className="mt-14 rounded-3xl border border-black/5 bg-[#F3EFE8] p-8 md:p-10">
            <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
              <div>
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                  Need help choosing?
                </p>
                <h3 className="mt-2 text-2xl font-light font-display">
                  We’ll match your lifestyle to the right texture.
                </h3>
                <p className="mt-3 text-sm text-neutral-800 leading-relaxed">
                  Tell us what you want (soft glam, wet curl, sleek ponytail energy), and we’ll
                  recommend the best collection, density, and lace.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  to="/private-consult"
                  className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                >
                  Private consult
                </Link>
                <Link
                  to="/custom-orders"
                  className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                >
                  Custom orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
