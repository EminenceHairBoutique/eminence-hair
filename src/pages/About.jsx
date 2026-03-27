// src/pages/About.jsx — Our Story (Upgraded)

import React from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import db4 from "../assets/db4.png";
import SEO from "../components/SEO";

export default function About() {
  return (
    <>
      <SEO
        title="Our Story — Ethically Sourced Raw Cambodian & Burmese Hair"
        description="Eminence Hair Boutique sources 100% raw Cambodian and Burmese hair, crafted in our partner atelier with third-party lab verification. Learn about our quality standards."
      />
      <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          compact
          eyebrow="Our Story"
          title="Built for women whose standards are as high as their density."
          subtitle="Eminence began with a simple frustration: “raw hair” that tangled, thinned out, and never matched the luxury price tag. We built a tighter system — sourcing, construction, and quality control — so your hair performs like couture." 
          image={db4}
          ctas={[
            { label: "Explore Collections", href: "/collections", variant: "primary" },
            { label: "Authenticity", href: "/authenticity", variant: "ghost" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* Core narrative */}
          <section className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 items-start">
            <div className="space-y-4 text-sm md:text-[15px] text-neutral-700 leading-relaxed">
              <p>
                Luxury should be quiet. No shedding that tells on you. No tangling at the nape.
                No “maybe it will act right” anxiety before dinner, a shoot, or a flight.
              </p>
              <p>
                We source from Cambodia and Myanmar and partner with an atelier that understands
                density balance, lace finesse, and how hair should move on camera.
                Every unit is inspected, balanced, and finished with the same goal:
                hair that disappears into your lifestyle.
              </p>

              <div className="mt-7 rounded-3xl border border-black/5 bg-white p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  The Eminence standard
                </p>
                <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-neutral-800">
                  <li className="rounded-2xl bg-[#FBF6EE] p-4 border border-black/5">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-1">Sourcing</p>
                    <p>Single-donor origin + minimal processing to protect cuticle integrity.</p>
                  </li>
                  <li className="rounded-2xl bg-[#FBF6EE] p-4 border border-black/5">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-1">Construction</p>
                    <p>HD lace options, thoughtful track placement, and believable hairlines.</p>
                  </li>
                  <li className="rounded-2xl bg-[#FBF6EE] p-4 border border-black/5">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-1">Quality Control</p>
                    <p>Density balance, shedding checks, and finish inspection before it ships.</p>
                  </li>
                  <li className="rounded-2xl bg-[#FBF6EE] p-4 border border-black/5">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-1">Longevity</p>
                    <p>Designed to last for years with the right ritual and storage.</p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right rail */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-black/5 bg-[#F3EFE8] p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                  What “luxury” means here
                </p>
                <p className="mt-3 text-sm text-neutral-800">
                  Luxury is less work. Your unit should detangle easily, hold tone, and keep its
                  silhouette — so you can focus on your life.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to="/care"
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                  >
                    Care Guide
                  </Link>
                  <Link
                    to="/custom-orders"
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                  >
                    Custom Orders
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Private consult
                </p>
                <p className="mt-2 text-sm text-neutral-700">
                  Not sure which texture, density, or cap construction fits your lifestyle? We’ll
                  guide you.
                </p>
                <Link
                  to="/private-consult"
                  className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                >
                  Request a consult
                </Link>
              </div>
            </aside>
          </section>

          {/* Divider */}
          <div className="my-14 h-px bg-black/10" />

          {/* 3-up value section */}
          <section>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                Craft, refined
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-light font-display">
                The details you feel — and the ones you don’t have to think about.
              </h2>
              <p className="mt-4 text-sm text-neutral-700">
                We design for the moments that matter: studio lighting, flash photography,
                long flights, long nights — and the day after.
              </p>
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                {
                  t: "Intentional sourcing",
                  d: "Cambodian & Myanmar donors, audited partners, strict limits on processing — so “raw” actually means something.",
                },
                {
                  t: "Couture construction",
                  d: "HD lace options, balanced density, and thoughtfully placed tracks so the hair falls like a tailored garment.",
                },
                {
                  t: "Camera‑ready finish",
                  d: "Soft movement and believable luster that performs under iPhone flash, studio strobes, and everyday light.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm"
                >
                  <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                    {c.t}
                  </p>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
