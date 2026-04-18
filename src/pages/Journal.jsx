import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";

import { journalPosts } from "../data/journal";
import { staggerContainer, staggerChild, fadeUp, viewport } from "../ui/motionPresets";

export default function Journal() {
  return (
    <>
      <SEO
        title="Journal | Eminence Hair Boutique"
        description="Insights, education, and behind-the-scenes stories from the Eminence Hair Boutique studio."
      />
      <PageTransition>
        <div className="bg-[#FAF8F5] text-[#1B1B1B] min-h-screen">
          {/* Hero */}
          <Motion.section
            className="max-w-6xl mx-auto px-6 pt-24 pb-14 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-3">
              Eminence Editorial
            </p>
            <h1 className="font-header text-4xl md:text-5xl mb-4">The Journal</h1>
            <p className="font-body text-neutral-500 max-w-xl mx-auto text-sm leading-relaxed">
              Education, craftsmanship stories, and honest perspective on luxury hair — straight from our studio.
            </p>
          </Motion.section>

          {/* Post grid */}
          <Motion.section
            className="max-w-6xl mx-auto px-6 pb-24"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {journalPosts.map((post) => (
                <Motion.article key={post.slug} variants={staggerChild}>
                  <Link
                    to={`/journal/${post.slug}`}
                    className="group block"
                  >
                    <div className="overflow-hidden rounded-card mb-4">
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-1">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h2 className="font-header text-lg mb-2 group-hover:text-gold transition-colors">
                      {post.title}
                    </h2>
                    <p className="font-body text-sm text-neutral-500 leading-relaxed">
                      {post.excerpt}
                    </p>
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
