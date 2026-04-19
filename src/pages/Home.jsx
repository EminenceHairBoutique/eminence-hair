// src/pages/Home.jsx — 7-Section Luxury Homepage

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { eminenceEssentials } from "../data/products";
import { resolveProductImages } from "../utils/productMedia";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  viewport,
} from "../ui/motionPresets";

import firstPage from "../assets/first_page.png";
import db5 from "../assets/db5.png";
import heroVideo from "../assets/videos/eminence_hero.mp4";
import PageTransition from "../components/PageTransition.jsx";
import SEO from "../components/SEO";
import TrustStrip from "../components/TrustStrip";
import { subscribeEmail } from "../utils/subscribe";

const VALUE_PROPS = [
  {
    title: "Third-Party Verified",
    desc: "CNAS-accredited lab inspection for every batch",
  },
  {
    title: "Camera-Tested",
    desc: "Performs under flash, daylight, and low light",
  },
  {
    title: "Longevity Focused",
    desc: "Built to wash, style, and rewear \u2014 not disposable",
  },
];

const Home = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterError, setNewsletterError] = useState("");

  const { isOpen } = useCart();

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleNewsletterSignup = async () => {
    if (newsletterStatus === "loading") return;
    setNewsletterError("");

    const email = String(newsletterEmail || "").trim();
    if (!email) {
      setNewsletterStatus("error");
      setNewsletterError("Please enter your email.");
      return;
    }

    try {
      setNewsletterStatus("loading");
      await subscribeEmail({ email, source: "home_newsletter" });
      setNewsletterStatus("success");
    } catch (e) {
      setNewsletterStatus("error");
      setNewsletterError(
        e?.message || "Something went wrong. Please try again."
      );
    }
  };

  const essentialsCards = eminenceEssentials.slice(0, 4);

  return (
    <>
      <SEO
        title="Raw Cambodian Hair & HD Lace Wigs \u2014 Luxury Hair Boutique"
        description="Shop 100% raw Cambodian & Burmese HD lace wigs, bundles, and closures. 180\u2013250% density, ethically sourced, third-party verified. Free shipping on select orders."
      />
      <PageTransition>
        <div
          className={`bg-[#F9F7F4] text-[#1B1B1B] ${isOpen ? "blur-sm" : ""} transition`}
        >
          {/* \u2500\u2500 SECTION 1 \u2014 HERO \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
            <video
              ref={videoRef}
              src={heroVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-20 px-6 max-w-5xl mx-auto text-[#FAF8F5]">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-200 mb-3">
                Eminence Hair Boutique
              </p>

              <Motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <h1 className="text-3xl md:text-4xl font-light font-display max-w-xl leading-tight">
                  100% Raw Cambodian Hair. HD Lace. Built Like Couture.
                </h1>
                <p className="mt-4 text-sm text-neutral-100 max-w-lg">
                  Third-party verified, 180&ndash;250% density wigs and bundles
                  from our partner atelier. Ethically sourced from Cambodia
                  &amp; Myanmar &mdash; engineered for camera, studio, and
                  everyday luxury.
                </p>
              </Motion.div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="px-10 py-3 text-[11px] tracking-[0.26em] uppercase border border-[#FAF8F5] bg-[#FAF8F5] text-[#1B1B1B] rounded-full hover:bg-transparent hover:text-[#FAF8F5] transition"
                >
                  Shop the Collection
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-3 text-[11px] tracking-[0.26em] uppercase border border-[#FAF8F5]/70 rounded-full text-[#FAF8F5] hover:border-[#FAF8F5] hover:bg-white/10 transition"
                >
                  Our Story
                </Link>
              </div>
            </div>

            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 px-4 py-2 text-[11px] tracking-[0.2em] uppercase bg-white/10 border border-white/50 text-white rounded-full backdrop-blur hover:bg-white/20 transition"
            >
              {isMuted ? "Unmute" : "Mute"} Video
            </button>
          </section>

          {/* \u2500\u2500 TRUST STRIP \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <TrustStrip />
          <p className="text-center text-[11px] tracking-[0.18em] text-neutral-500 mt-3">
            Trusted by stylists, creators, and clients nationwide.
          </p>

          {/* \u2500\u2500 SECTION 2 \u2014 BESTSELLER SHELF \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <Motion.section
            className="py-16 bg-[#FAF8F5]"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
              <Motion.div variants={fadeUp} className="space-y-5">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                  The Edit
                </p>
                <h2 className="text-2xl md:text-3xl font-light font-display leading-tight">
                  Eminence Essentials
                </h2>
                <p className="text-sm text-neutral-700 leading-relaxed max-w-md">
                  Our most requested pieces &mdash; edited for everyday luxury.
                  A focused selection of wigs and bundles chosen for versatility,
                  longevity, and natural wear.
                </p>
                <Link
                  to="/shop?collection=eminence-essentials"
                  className="inline-block px-8 py-2.5 text-[11px] tracking-[0.26em] uppercase border border-[#1B1B1B] rounded-full hover:bg-[#1B1B1B] hover:text-[#FAF8F5] transition"
                >
                  Shop Essentials
                </Link>
              </Motion.div>

              <Motion.div
                className="grid grid-cols-2 gap-5"
                variants={staggerContainer}
              >
                {essentialsCards.map((p) => (
                  <Motion.div
                    key={p.id}
                    variants={staggerChild}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <img
                      src={resolveProductImages(p)?.[0]}
                      alt={p.displayName || p.name}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={176}
                    />
                    <div className="p-4">
                      <p className="text-sm text-neutral-800 mb-1 line-clamp-1">
                        {p.displayName || p.name}
                      </p>
                      <Link
                        to={`/products/${p.slug}`}
                        className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-600"
                      >
                        View
                      </Link>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            </div>
          </Motion.section>

          {/* \u2500\u2500 SECTION 3 \u2014 AUTHENTICITY RAIL \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <Motion.section
            className="py-20 bg-[#0B0B0C] text-white"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
              <Motion.div variants={fadeUp}>
                <img
                  src={firstPage}
                  alt="Eminence editorial product styling"
                  className="w-full rounded-3xl object-cover shadow-lg"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={720}
                />
              </Motion.div>

              <Motion.div variants={fadeUp} className="space-y-6">
                <p className="text-[11px] tracking-[0.26em] uppercase text-[#D4AF37]">
                  The Eminence Standard
                </p>
                <h2 className="text-2xl md:text-3xl font-light font-display leading-tight">
                  Hair that performs under every light
                </h2>

                <div className="grid gap-5 mt-4">
                  {VALUE_PROPS.map((vp) => (
                    <div key={vp.title}>
                      <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-400 mb-1">
                        {vp.title}
                      </h3>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {vp.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/authenticity"
                  className="inline-block mt-2 px-8 py-2.5 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
                >
                  Our Process
                </Link>
              </Motion.div>
            </div>
          </Motion.section>

          {/* \u2500\u2500 SECTION 4 \u2014 COLLECTION TRIPTYCH \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-16 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src={db5}
                  alt="The Eminence Edit collection — body wave texture editorial styling"
                  className="w-full h-[420px] object-cover"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={420}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-10 px-8 text-white">
                  <Motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                  >
                    <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-300 mb-2">
                      The Eminence Edit
                    </p>
                    <h2 className="text-2xl md:text-3xl font-light font-display mb-4">
                      The Eminence Edit
                    </h2>
                    <Link
                      to="/collections/fw-2025"
                      className="inline-block px-8 py-2.5 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
                    >
                      Explore the Collection
                    </Link>
                  </Motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 5 \u2014 ATELIER PRE-ORDER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-20 bg-[#0B0B0C] text-white">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="max-w-xl mx-auto text-center space-y-5"
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-white/55">
                  Atelier Pre-Order
                </p>
                <h2 className="text-2xl md:text-3xl font-light font-display leading-tight">
                  Factory-direct luxury, available by pre-order.
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  Select premium bundles and wigs fulfilled directly from our
                  partner atelier &mdash; giving you access to the full range at
                  true factory quality.
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <Link
                    to="/custom-orders"
                    className="rounded-full bg-white text-[#1B1B1B] px-7 py-2.5 text-[11px] uppercase tracking-[0.26em] hover:bg-white/90 transition"
                  >
                    Shop Pre-Orders
                  </Link>
                  <Link
                    to="/custom-atelier"
                    className="rounded-full border border-white/25 px-7 py-2.5 text-[11px] uppercase tracking-[0.26em] text-white hover:border-white/55 hover:bg-white/5 transition"
                  >
                    Custom Atelier
                  </Link>
                </div>
              </Motion.div>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 6 \u2014 EDITORIAL CARD \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-16 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <Link to="/journal/raw-vs-virgin-hair" className="group block">
                <div className="relative rounded-3xl overflow-hidden">
                  <img
                    src={db5}
                    alt="Inside the Eminence editorial"
                    className="w-full h-[400px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-10 px-8 text-white">
                    <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-300 mb-2">
                      From the Journal
                    </p>
                    <h2 className="text-2xl md:text-3xl font-light font-display mb-2">
                      The Difference Between Raw and Virgin Hair
                    </h2>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-white/80 underline underline-offset-4 group-hover:text-white transition">
                      Read the Guide
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 7 \u2014 NEWSLETTER \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-20 bg-[#0B0B0C] text-white">
            <div className="max-w-xl mx-auto px-6 text-center">
              <Motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="space-y-5"
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-white/55">
                  Private List
                </p>
                <h2 className="text-2xl md:text-3xl font-light font-display leading-tight">
                  Be the first to know.
                </h2>
                <p className="text-sm text-white/70 leading-relaxed max-w-md mx-auto">
                  Early access to capsules, priority restocks, and care guides.
                  Your 10% welcome code will meet you at checkout.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
                    aria-label="Email address for newsletter signup"
                    autoComplete="email"
                  />
                  <button
                    onClick={handleNewsletterSignup}
                    disabled={newsletterStatus === "loading"}
                    className="px-8 py-2.5 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {newsletterStatus === "loading"
                      ? "Joining..."
                      : newsletterStatus === "success"
                        ? "You\u2019re in"
                        : "Join Eminence"}
                  </button>
                </div>

                <p className="text-[11px] text-white/50">
                  {newsletterStatus === "success"
                    ? "You\u2019re on the list \u2014 watch your inbox for early access."
                    : newsletterStatus === "error"
                      ? newsletterError
                      : "No spam \u2014 just launches, drops, and things worth knowing."}
                </p>
              </Motion.div>
            </div>
          </section>
        </div>
      </PageTransition>
    </>
  );
};

export default Home;
