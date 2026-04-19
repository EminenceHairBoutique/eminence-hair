import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import Breadcrumbs from "../components/Breadcrumbs";
import { journalPosts } from "../data/journal";

export default function Journal() {
  return (
    <>
      <SEO
        title="Journal — Eminence Hair Boutique"
        description="Expert guides, founder stories, and behind-the-scenes looks at raw Cambodian hair, HD lace craftsmanship, and luxury hair care."
      />
      <Breadcrumbs current="Journal" />
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
            </Motion.div>
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
              {journalPosts.map((post) => (
                <Motion.article
                  key={post.slug}
                  variants={staggerChild}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm"
                >
                  <Link to={`/journal/${post.slug}`} className="block">
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
                    <div className="p-6">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500 mb-2">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <h2 className="text-lg font-display font-light mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-sm text-neutral-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="inline-block mt-4 text-[11px] uppercase tracking-[0.22em] text-neutral-700 underline underline-offset-4">
                        Read More
                      </span>
                    </div>
                  </Link>
                </Motion.article>
              ))}
            </div>
          </Motion.section>
        </div>
      </PageTransition>
    </>
  );
}
