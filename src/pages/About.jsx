// src/pages/About.jsx — Our Story

import React from "react";
import db4 from "../assets/db4.png";
import PageTransition from "../components/PageTransition";

const About = () => {
  return (
    <PageTransition>
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto text-[#111]">
      <header className="mb-10">
        <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
          Our Story
        </p>
        <h1 className="text-3xl font-light font-display mb-3">
          Built for women whose standards are as high as their density.
        </h1>
        <p className="text-sm text-neutral-700 max-w-3xl">
          Eminence began with a simple frustration: “raw hair” that tangled,
          thinned out, and never matched the luxury price tag. We spent years
          obsessing over sourcing, density, and construction — so you don&apos;t
          have to.
        </p>
      </header>

      <section className="grid md:grid-cols-[1.4fr,1.2fr] gap-10 items-start mb-14">
        <div className="space-y-4 text-sm text-neutral-700">
          <p>
            Our hair is sourced from Cambodia and Myanmar, then shipped to our
            partner factory where each unit is crafted, inspected, and balanced
            for density. We require documentation on origin, processing,
            cuticles, and lace quality before any piece can carry the Eminence
            name.
          </p>
          <p>
            Eminence is for women who value silence from their hair — no
            tangling, no embarrassing shedding, no guessing if it will “act
            right” when it matters. Just silk, movement, and pieces that age
            gracefully with you.
          </p>
        </div>

        <div className="bg-[#F3EFE8] rounded-3xl overflow-hidden shadow-sm">
          <img
            src={db4}
            alt="Eminence factory / detail"
            className="w-full h-64 object-cover"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-sm text-neutral-700">
        <div>
          <h2 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-2">
            Intentional Sourcing
          </h2>
          <p>
            Cambodian &amp; Myanmar donors, audited partners, and strict limits
            on processing — so “raw” actually means something.
          </p>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-2">
            Couture Construction
          </h2>
          <p>
            HD lace, balanced density, and thoughtfully placed tracks for hair
            that falls like a tailored garment, not a costume.
          </p>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-2">
            Camera-Ready Finish
          </h2>
          <p>
            Built to withstand iPhone flash, studio lighting, and long nights
            out — while still feeling soft when you take it off.
          </p>
        </div>
      </section>
    </div>
    </PageTransition>
  );
};

export default About;
