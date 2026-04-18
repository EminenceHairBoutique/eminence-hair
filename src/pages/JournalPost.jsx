import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";

import { journalPosts } from "../data/journal";
import { fadeUp, fadeIn, viewport } from "../ui/motionPresets";

function renderBlock(block, index) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={index}
          className="font-header text-2xl md:text-3xl mt-10 mb-4"
        >
          {block.content}
        </h2>
      );
    case "image":
      return (
        <Motion.figure
          key={index}
          className="my-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeIn}
        >
          <img
            src={block.src || block.content}
            alt={block.alt || ""}
            className="w-full rounded-card"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="text-xs text-neutral-400 mt-2 text-center">
              {block.caption}
            </figcaption>
          )}
        </Motion.figure>
      );
    case "p":
    default:
      return (
        <p
          key={index}
          className="font-body text-[15px] leading-[1.85] text-neutral-600 mb-5"
        >
          {block.content}
        </p>
      );
  }
}

export default function JournalPost() {
  const { slug } = useParams();
  const post = journalPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <>
        <SEO title="Post Not Found | Eminence Hair Boutique" />
        <PageTransition>
          <div className="bg-[#FAF8F5] min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-header text-3xl mb-4">Post not found</h1>
              <Link
                to="/journal"
                className="text-sm uppercase tracking-[0.18em] text-gold hover:underline"
              >
                ← Back to Journal
              </Link>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} | Eminence Hair Boutique`}
        description={post.excerpt}
        image={post.heroImage}
      />
      <PageTransition>
        <div className="bg-[#FAF8F5] text-[#1B1B1B] min-h-screen">
          {/* Hero image */}
          <Motion.div
            className="w-full max-h-[520px] overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <img
              src={post.heroImage}
              alt={post.title}
              className="w-full h-[520px] object-cover"
            />
          </Motion.div>

          {/* Article */}
          <Motion.article
            className="max-w-2xl mx-auto px-6 py-16"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link
              to="/journal"
              className="inline-block text-[10px] uppercase tracking-[0.22em] text-neutral-400 hover:text-gold transition-colors mb-8"
            >
              ← Back to Journal
            </Link>

            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-3">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h1 className="font-header text-3xl md:text-4xl mb-8">
              {post.title}
            </h1>

            {post.body.map((block, i) => renderBlock(block, i))}
          </Motion.article>
        </div>
      </PageTransition>
    </>
  );
}
