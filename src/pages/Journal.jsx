import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import { journalPosts } from "../data/journal";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(journalPosts.map((p) => p.category).filter(Boolean)))];

const featuredPost = journalPosts.find((p) => p.featured) || journalPosts[0];

export default function Journal() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? journalPosts.filter((p) => p.slug !== featuredPost.slug)
    : journalPosts.filter((p) => p.category === activeCategory && p.slug !== featuredPost.slug);

  return (
    <>
      <SEO
        title="Journal — Eminence Hair Boutique"
        description="Expert guides, founder stories, and behind-the-scenes looks at raw Cambodian hair, HD lace craftsmanship, and luxury hair care."
      />
      <PageTransition>
        <div className="bg-[#F9F7F4] text-[#1B1B1B]">
          {/* Header */}
          <section className="pt-32 pb-12 text-center">
            <Motion.div variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500 mb-4">
                The Eminence Journal
              </p>
              <h1 className="text-3xl md:text-4xl font-light font-display">
                Stories, guides &amp; craft
              </h1>
              <p className="mt-4 text-sm text-neutral-600 max-w-md mx-auto px-6">
                Education, founder perspective, and honest guidance — for every stage of your hair journey.
              </p>
            </Motion.div>
          </section>

          {/* Featured post */}
          <section className="max-w-6xl mx-auto px-6 pb-12">
            <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <Link
                to={`/journal/${featuredPost.slug}`}
                className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm"
              >
                <div className="aspect-[3/2] md:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.heroImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="eager"
                    width={700}
                    height={500}
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.26em] text-[#D4AF37] font-medium">
                      Featured
                    </span>
                    {featuredPost.category && (
                      <>
                        <span className="text-neutral-300">·</span>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          {featuredPost.category}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-light leading-snug mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500">
                      {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {featuredPost.readingTime && (
                      <>
                        <span className="text-neutral-300">·</span>
                        <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500">
                          {featuredPost.readingTime}
                        </p>
                      </>
                    )}
                  </div>
                  <span className="inline-block mt-6 text-[11px] uppercase tracking-[0.26em] text-neutral-800 underline underline-offset-4 group-hover:text-neutral-500 transition">
                    Read Article →
                  </span>
                </div>
              </Link>
            </Motion.div>
          </section>

          {/* Category filter */}
          <section className="max-w-6xl mx-auto px-6 pb-6">
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => (
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
            </div>
          </section>

          {/* Post grid */}
          <Motion.section
            className="pb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {filtered.length === 0 ? (
                <div className="md:col-span-3 text-center py-16 text-sm text-neutral-500">
                  No articles in this category yet. More coming soon.
                </div>
              ) : (
                filtered.map((post) => (
                  <Motion.article
                    key={post.slug}
                    variants={staggerChild}
                    className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm flex flex-col"
                  >
                    <Link to={`/journal/${post.slug}`} className="block flex-1">
                      <div className="aspect-[3/2] overflow-hidden">
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                          width={600}
                          height={400}
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37]">
                              {post.category}
                            </span>
                          )}
                          {post.readingTime && (
                            <>
                              <span className="text-neutral-300 text-[10px]">·</span>
                              <span className="text-[10px] tracking-[0.18em] text-neutral-400">
                                {post.readingTime}
                              </span>
                            </>
                          )}
                        </div>
                        <h2 className="text-lg font-display font-light mb-2 line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-sm text-neutral-600 line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-[10px] tracking-[0.18em] uppercase text-neutral-400">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-700 underline underline-offset-4">
                            Read
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Motion.article>
                ))
              )}
            </div>
          </Motion.section>

          {/* Bottom CTA strip */}
          <section className="bg-[#0B0B0C] text-white py-14 text-center">
            <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-3">
                New to Eminence?
              </p>
              <h2 className="text-xl md:text-2xl font-light font-display mb-4">
                Not sure where to begin?
              </h2>
              <p className="text-sm text-white/60 max-w-sm mx-auto mb-7">
                Use our guided matchmaker to find the right texture, length, and lace for your lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/start-here"
                  className="inline-block px-7 py-3 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
                >
                  Start Here
                </Link>
                <Link
                  to="/private-consult"
                  className="inline-block px-7 py-3 text-[11px] tracking-[0.26em] uppercase border border-white/20 text-white rounded-full hover:border-white/40 transition"
                >
                  Book a Consult
                </Link>
              </div>
            </Motion.div>
          </section>
        </div>
      </PageTransition>
    </>
  );
}
