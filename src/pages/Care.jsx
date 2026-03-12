// src/pages/Care.jsx — Care Ritual (Upgraded)

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function Care() {
  const sections = useMemo(
    () => [
      {
        id: "pre-install",
        title: "Pre-installation QC",
        eyebrow: "Before first wear",
        points: [
          "Co-wash once before install (sulfate-free shampoo + conditioner).",
          "Rinse lukewarm only. Never twist or bunch the hair — smooth from weft to ends.",
          "Air dry completely on a wig stand / hanger before styling or storing.",
          "If anything looks off before install, stop and contact concierge before altering the unit.",
        ],
      },
      {
        id: "daily",
        title: "Daily wear",
        eyebrow: "Keep it soft, keep it clean",
        points: [
          "Detangle from ends → up with a wide-tooth comb or paddle brush.",
          "Use lightweight leave-in on mid-lengths & ends only (keep lace + knots product-light).",
          "For longer units: loosely braid or wrap before bed. Always use a bonnet or silk pillowcase.",
        ],
      },
      {
        id: "wash",
        title: "Wash schedule",
        eyebrow: "Reset + restore",
        points: [
          "Wash every 7–12 wears depending on product build-up, climate, and styling frequency.",
          "Clarify gently when needed, then deep condition to restore slip and shine.",
          "Allow hair to fully dry before storing to prevent odor or mildew.",
        ],
      },
      {
        id: "heat",
        title: "Heat & styling",
        eyebrow: "Luxury lasts when you protect it",
        points: [
          "Always apply a professional heat protectant before hot tools.",
          "Keep tools between 300–380°F and avoid holding plates in one spot.",
          "For 613 & color-treated units: lower heat, minimize toning/bleaching, and deep condition more often.",
        ],
      },
      {
        id: "storage",
        title: "Storage",
        eyebrow: "Preserve the silhouette",
        points: [
          "Store on a wig stand or inside a satin dust bag.",
          "Avoid crushing the hairline/lace when packing.",
          "Keep away from direct sunlight when not in use to preserve tone and luster.",
        ],
      },
    ],
    []
  );

  const textures = useMemo(
    () => [
      {
        id: "straight",
        label: "Straight / Silky",
        notes: [
          "Use a light serum on ends only for glassy movement.",
          "Avoid heavy oils at the root to keep the hairline airy.",
          "Use a silk wrap at night to maintain a sleek finish.",
        ],
      },
      {
        id: "wavy",
        label: "Body / Loose Wave",
        notes: [
          "Scrunch a light leave-in to refresh wave definition.",
          "Comb while damp to preserve the pattern (avoid aggressive brushing when dry).",
          "Air dry whenever possible for the cleanest wave.",
        ],
      },
      {
        id: "curly",
        label: "Deep / Water Wave",
        notes: [
          "Detangle with fingers or a wide-tooth comb while damp.",
          "Condition more often than straight/wavy textures.",
          "Avoid brushing curls dry — refresh with water + leave-in and scrunch.",
        ],
      },
      {
        id: "613",
        label: "613 & Color-Treated",
        notes: [
          "Lower heat, more moisture: deep condition weekly if you style often.",
          "Use purple shampoo sparingly (only when needed) to prevent dryness.",
          "Always use a heat protectant and keep tools on the lower end of the range.",
        ],
      },
    ],
    []
  );

  const [activeTexture, setActiveTexture] = useState("straight");
  const active = textures.find((t) => t.id === activeTexture);

  return (
    <>
      <SEO
        title="Hair Care Guide"
        description="Keep your Eminence hair soft, silky, and camera-ready with our expert care guide. Proper wash, heat, and storage rituals for lasting luxury."
      />
      <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          compact
          eyebrow="Care Guide"
          title="A ritual, not a routine."
          subtitle="Eminence hair is designed to last for years with proper care. Follow this guide to keep each unit soft, silky, and camera‑ready — every time you wear it."
          image="/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_01.webp"
          ctas={[
            { label: "Browse Collections", href: "/collections", variant: "primary" },
            { label: "FAQs", href: "/faqs", variant: "ghost" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* Quick Nav */}
          <div className="flex flex-wrap gap-2 mb-10">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[11px] uppercase tracking-[0.26em] px-4 py-2 rounded-full border border-black/10 hover:border-black/20 bg-white/60"
              >
                {s.title}
              </a>
            ))}
            <a
              href="#texture"
              className="text-[11px] uppercase tracking-[0.26em] px-4 py-2 rounded-full border border-black/10 hover:border-black/20 bg-white/60"
            >
              By texture
            </a>
          </div>

          {/* Core sections */}
          <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-10">
            <div className="space-y-8">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-28 bg-white border border-black/5 rounded-3xl p-6 md:p-7 shadow-sm"
                >
                  <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                    {s.eyebrow}
                  </p>
                  <h2 className="mt-2 text-xl md:text-2xl font-light font-display text-neutral-900">
                    {s.title}
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700 list-disc list-inside">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </section>
              ))}

              {/* Texture-specific */}
              <section
                id="texture"
                className="scroll-mt-28 bg-white border border-black/5 rounded-3xl p-6 md:p-7 shadow-sm"
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Texture Notes
                </p>
                <h2 className="mt-2 text-xl md:text-2xl font-light font-display text-neutral-900">
                  Care by texture
                </h2>

                <div className="mt-5 flex flex-wrap gap-2">
                  {textures.map((t) => {
                    const isActive = t.id === activeTexture;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTexture(t.id)}
                        className={
                          "text-[11px] uppercase tracking-[0.26em] px-4 py-2 rounded-full border transition " +
                          (isActive
                            ? "border-black/30 bg-black text-white"
                            : "border-black/10 hover:border-black/20 bg-white")
                        }
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
                    {active?.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Right rail */}
            <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
              <div className="rounded-3xl border border-black/5 bg-[#F3EFE8] p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                  Quick essentials
                </p>
                <div className="mt-4 space-y-3 text-sm text-neutral-800">
                  <p>
                    • Sulfate-free shampoo + conditioner
                    <br />
                    • Wide-tooth comb / paddle brush
                    <br />
                    • Heat protectant
                    <br />
                    • Satin bonnet / silk pillowcase
                  </p>
                  <p className="text-xs text-neutral-600">
                    Pro tip: product-light roots + clean lace is the secret to that “fresh install” look.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Need personalization?
                </p>
                <h3 className="mt-2 text-lg font-light font-display">
                  Let concierge guide you.
                </h3>
                <p className="mt-2 text-sm text-neutral-700">
                  For custom installs, color services, or texture matching, our team can recommend the right unit and care plan.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/private-consult"
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                  >
                    Private Consult
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
