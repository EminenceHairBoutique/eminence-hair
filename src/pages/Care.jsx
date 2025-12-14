// src/pages/Care.jsx — Hair Care Ritual

import React from "react";
import PageTransition from "../components/PageTransition";
const Care = () => {
  const items = [
    {
      title: "Before First Install",
      steps: [
        "Gently co-wash with a sulphate-free, moisturizing shampoo and conditioner.",
        "Rinse in lukewarm water only. Avoid twisting bundles; smooth from weft to ends.",
        "Air dry on a wig stand or hanger — no direct radiators or high heat.",
      ],
    },
    {
      title: "Daily Wear",
      steps: [
        "Brush starting from the ends, working up to the roots with a wide-tooth comb or paddle brush.",
        "Use a light serum or leave-in on mid-lengths and ends only; keep lace and roots product-light.",
        "Sleep in a bonnet or silk pillowcase. For longer units, loosely braid or wrap before bed.",
      ],
    },
    {
      title: "Heat & Styling",
      steps: [
        "Always use a professional heat protectant before styling.",
        "Keep hot tools between 300–380°F; avoid holding plates in one spot for too long.",
        "For 613 and colored units, lower heat and minimize bleaching/toning to preserve integrity.",
      ],
    },
    {
      title: "Washing Schedule",
      steps: [
        "Wash every 7–12 wears, depending on product build-up and environment.",
        "Clarify gently if needed, then follow with a deep conditioner to restore slip and shine.",
        "Let hair fully dry before storing to prevent odor or mildew.",
      ],
    },
    {
      title: "Storage",
      steps: [
        "Store on a wig stand or inside a satin dust bag.",
        "Avoid crushing the hairline or lace when packing for travel.",
        "Keep away from direct sunlight when not in use to preserve color.",
      ],
    },
  ];

  return (
    <PageTransition>
    <div className="pt-28 pb-24 px-6 max-w-5xl mx-auto text-[#111]">
      <header className="mb-10">
        <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
          Care Guide
        </p>
        <h1 className="text-3xl font-light font-display mb-3">
          A ritual, not a routine.
        </h1>
        <p className="text-sm text-neutral-700 max-w-3xl">
          Eminence hair is designed to last for years with proper care. Follow
          this ritual to keep each unit soft, silky, and camera-ready.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-8 text-sm text-neutral-700">
        {items.map((block) => (
          <div
            key={block.title}
            className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm"
          >
            <h2 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-3">
              {block.title}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              {block.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
    </PageTransition>
  );
};

export default Care;
