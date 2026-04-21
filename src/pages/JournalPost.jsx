import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import { journalPosts } from "../data/journal";

export default function JournalPost() {
  const { slug } = useParams();
  const post = journalPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/journal" replace />;

  const relatedPosts = (post.related || [])
    .map((s) => journalPosts.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <>
      <SEO
        title={`${post.title} — Eminence Journal`}
        description={post.excerpt}
        image={post.heroImage}
      />
      <PageTransition>
        <div className="bg-[#F9F7F4] text-[#1B1B1B]">
          {/* Hero image */}
          <div className="w-full max-h-[52vh] overflow-hidden">
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-full object-cover"
              width={1200}
              height={600}
            />
          </div>

          {/* Article */}
          <article className="max-w-2xl mx-auto px-6 py-16">
            <Motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#D4AF37] font-medium">
                    {post.category}
                  </span>
                )}
                {post.category && <span className="text-neutral-300 text-xs">·</span>}
                <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {post.author && ` · ${post.author}`}
                </p>
                {post.readingTime && (
                  <>
                    <span className="text-neutral-300 text-xs">·</span>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500">
                      {post.readingTime}
                    </p>
                  </>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-light leading-tight mb-8">
                {post.title}
              </h1>
            </Motion.div>

            <div className="space-y-5">
              {post.body.map((block, i) => {
                if (block.type === "h2") {
                  return (
                    <h2
                      key={i}
                      className="text-xl font-display font-light mt-10 mb-3"
                    >
                      {block.content}
                    </h2>
                  );
                }
                if (block.type === "image") {
                  return (
                    <img
                      key={i}
                      src={block.content}
                      alt=""
                      className="w-full rounded-2xl my-6"
                      loading="lazy"
                      width={800}
                      height={450}
                    />
                  );
                }
                return (
                  <p
                    key={i}
                    className="text-sm text-neutral-700 leading-relaxed"
                  >
                    {block.content}
                  </p>
                );
              })}
            </div>

            {/* Article-end CTA */}
            {post.cta && (
              <div className="mt-12 rounded-3xl bg-[#0B0B0C] text-white px-8 py-8 text-center">
                <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-2">
                  Ready to explore?
                </p>
                <p className="text-lg font-display font-light mb-5">{post.cta.label}</p>
                <Link
                  to={post.cta.href}
                  className="inline-block px-7 py-2.5 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
                >
                  {post.cta.label}
                </Link>
              </div>
            )}

            {/* Back to journal */}
            <div className="mt-10 pt-8 border-t border-neutral-200">
              <Link
                to="/journal"
                className="text-[11px] uppercase tracking-[0.22em] text-neutral-600 underline underline-offset-4 hover:text-neutral-900 transition"
              >
                &larr; Back to Journal
              </Link>
            </div>
          </article>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <section className="max-w-6xl mx-auto px-6 pb-20">
              <Motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-2">
                  Continue Reading
                </p>
                <h2 className="text-xl font-display font-light mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => (
                    <Motion.article key={related.slug} variants={staggerChild}>
                      <Link
                        to={`/journal/${related.slug}`}
                        className="group block bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-sm"
                      >
                        <div className="aspect-[3/2] overflow-hidden">
                          <img
                            src={related.heroImage}
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            loading="lazy"
                            width={400}
                            height={267}
                          />
                        </div>
                        <div className="p-5">
                          {related.category && (
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] mb-1">
                              {related.category}
                            </p>
                          )}
                          <h3 className="text-sm font-display font-light line-clamp-2">
                            {related.title}
                          </h3>
                          {related.readingTime && (
                            <p className="text-[10px] text-neutral-400 mt-2">{related.readingTime}</p>
                          )}
                        </div>
                      </Link>
                    </Motion.article>
                  ))}
                </div>
              </Motion.div>
            </section>
          )}
        </div>
      </PageTransition>
    </>
  );
}
