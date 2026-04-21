import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import { clientResults, RESULT_CATEGORIES } from "../data/clientResults";

export default function ClientResults() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? clientResults
      : clientResults.filter((r) => r.category === activeCategory);

  return (
    <>
      <SEO
        title="Results — Real Hair, Real Styling"
        description="A gallery of Eminence Hair installs, editorial looks, and versatility studies. See how the hair performs across textures, lengths, and occasions."
      />
      <PageTransition>
        <div className="bg-[#F9F7F4] text-[#1B1B1B]">
          {/* Header */}
          <section className="pt-32 pb-12 text-center">
            <Motion.div variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500 mb-4">
                Eminence in Practice
              </p>
              <h1 className="text-3xl md:text-4xl font-light font-display max-w-xl mx-auto leading-tight px-6">
                Real hair. Real styling.
              </h1>
              <p className="mt-4 text-sm text-neutral-600 max-w-md mx-auto px-6">
                A gallery of installs, editorial looks, and versatility studies — so you can see how each texture, density, and length actually performs.
              </p>
            </Motion.div>
          </section>

          {/* Category filter */}
          <section className="max-w-6xl mx-auto px-6 pb-8">
            <Motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-wrap gap-2 justify-center"
            >
              {RESULT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={
                    "px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border transition " +
                    (activeCategory === cat
                      ? "border-neutral-900 bg-neutral-900 text-[#F9F7F4]"
                      : "border-neutral-300 bg-white/60 hover:bg-white text-neutral-700")
                  }
                >
                  {cat}
                </button>
              ))}
            </Motion.div>
          </section>

          {/* Gallery grid */}
          <Motion.section
            className="max-w-6xl mx-auto px-6 pb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((entry) => (
                <Motion.div
                  key={entry.id}
                  variants={staggerChild}
                  className="group rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={entry.image}
                      alt={entry.caption}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                      width={400}
                      height={533}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]">
                        {entry.category}
                      </span>
                    </div>
                    {entry.styleNote && (
                      <p className="text-[11px] text-neutral-500 mb-1">{entry.styleNote}</p>
                    )}
                    <p className="text-xs text-neutral-700 leading-relaxed line-clamp-2">
                      {entry.caption}
                    </p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {entry.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.section>

          {/* Context note */}
          <section className="max-w-2xl mx-auto px-6 pb-14 text-center">
            <p className="text-xs text-neutral-500 leading-relaxed">
              Images shown are editorial styling references and real install examples created with Eminence Hair products. Individual results will vary based on install method, care routine, and styling.
            </p>
          </section>

          {/* CTA strip */}
          <section className="bg-[#0B0B0C] text-white py-14 text-center">
            <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
                Find your look
              </p>
              <h2 className="text-xl md:text-2xl font-light font-display mb-4">
                Ready to choose your texture?
              </h2>
              <p className="text-sm text-white/60 max-w-sm mx-auto mb-7">
                Use our guided matchmaker, or book a private consult to talk through exactly what you're looking for.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/start-here"
                  className="inline-block px-7 py-3 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
                >
                  Start Here
                </Link>
                <Link
                  to="/shop"
                  className="inline-block px-7 py-3 text-[11px] tracking-[0.26em] uppercase border border-white/20 text-white rounded-full hover:border-white/40 transition"
                >
                  Shop the Collection
                </Link>
              </div>
            </Motion.div>
          </section>
        </div>
      </PageTransition>
    </>
  );
}
