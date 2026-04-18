import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeUp } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";
import { journalPosts } from "../data/journal";

export default function JournalPost() {
  const { slug } = useParams();
  const post = journalPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/journal" replace />;

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
          <div className="w-full max-h-[50vh] overflow-hidden">
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
              <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500 mb-3">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.author && ` · ${post.author}`}
              </p>
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

            {/* Back to journal */}
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <Link
                to="/journal"
                className="text-[11px] uppercase tracking-[0.22em] text-neutral-600 underline underline-offset-4 hover:text-neutral-900 transition"
              >
                &larr; Back to Journal
              </Link>
            </div>
          </article>
        </div>
      </PageTransition>
    </>
  );
}
