// src/pages/Home.jsx — Extended Luxury Homepage

import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { eminenceEssentials } from "../data/products";
import { resolveProductImages } from "../utils/productMedia";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";

import hero from "../assets/hero.jpg.png";
import firstPage from "../assets/first_page.png";
import firstPage2 from "../assets/first_page_2.png";

import yummy from "../assets/yummy.png";
import yummy1 from "../assets/yummy1.png";
import yummy2 from "../assets/yummy2.png";
import yummy3 from "../assets/yummy3.png";

import db1 from "../assets/db1.png";
import db2 from "../assets/db2.png";
import db3 from "../assets/db3.png";
import db4 from "../assets/db4.png";
import db5 from "../assets/db5.png";

import heroVideo from "../assets/videos/eminence_hero.mp4";
import PageTransition from "../components/PageTransition.jsx";
import SEO from "../components/SEO";
import TrustStrip from "../components/TrustStrip";
import { subscribeEmail } from "../utils/subscribe";

const Home = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const [newsletterError, setNewsletterError] = useState("");

  const { isOpen } = useCart();
  const location = useLocation();

  // route-based "loading skeleton" feel
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, [location.key]);

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
      setNewsletterError(e?.message || "Something went wrong. Please try again.");
    }
  };


  return (
    <>
      <SEO
        title="Raw Cambodian Hair & HD Lace Wigs — Luxury Hair Boutique"
        description="Shop 100% raw Cambodian & Burmese HD lace wigs, bundles, and closures. 180–250% density, ethically sourced, third-party verified. Free shipping on select orders."
      />
      <PageTransition>
        <div className={`bg-[#F9F7F4] text-[#111] ${isOpen ? "blur-sm" : ""} transition`}>
          {/* SECTION A — IMAGE HERO */}
          <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
            <img
              src={hero}
              alt="Luxury raw Cambodian hair styled in editorial body wave"
              className="w-full h-full object-cover"
              fetchPriority="high"
              decoding="async"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/40 to-transparent" />

            <div className="absolute inset-x-0 bottom-20 px-6 max-w-5xl mx-auto text-[#F9F7F4]">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-200 mb-3">
                Eminence Hair Boutique
              </p>

              {pageLoading ? (
                <>
                  <div className="h-10 w-[70%] rounded-xl bg-white/20 animate-pulse" />
                  <div className="mt-3 h-5 w-[60%] rounded-xl bg-white/15 animate-pulse" />
                </>
              ) : (
                <Motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <h1 className="text-3xl md:text-4xl font-light font-display max-w-xl leading-tight">
                    100% Raw Cambodian Hair. HD Lace. Built Like Couture.
                  </h1>
                  <p className="mt-4 text-sm text-neutral-100 max-w-lg">
                    Third-party verified, 180–250% density wigs and bundles from our partner atelier.
                    Ethically sourced from Cambodia &amp; Myanmar — engineered for camera, studio, and everyday luxury.
                  </p>
                </Motion.div>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/shop?collection=eminence-essentials"
                  className="px-10 py-3 text-xs tracking-[0.26em] uppercase border border-[#F9F7F4] bg-[#F9F7F4] text-[#111] rounded-full hover:bg-transparent hover:text-[#F9F7F4] transition"
                >
                  Shop Eminence Essentials
                </Link>

                <Link
                  to="/start-here"
                  className="px-8 py-3 text-xs tracking-[0.26em] uppercase border border-[#F9F7F4]/70 rounded-full hover:border-[#F9F7F4] hover:bg-white/10 transition"
                >
                  Start Here
                </Link>

                <Link
                  to="/collections"
                  className="px-8 py-3 text-xs tracking-[0.26em] uppercase border border-[#F9F7F4]/70 rounded-full hover:border-[#F9F7F4] transition"
                >
                  View Collections
                </Link>
              </div>
            </div>
          </section>

          {/* TRUST STRIP — Social proof badges */}
          <TrustStrip />

          {/* SECTION A.5 — READY-TO-SHIP */}
          <section className="py-14 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="rounded-[2.25rem] overflow-hidden border border-neutral-200 shadow-[0_24px_70px_rgba(17,12,5,0.18)]">
                <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative p-8 md:p-10 bg-[#0B0B0C] text-white">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-white/60">
                      Ready‑to‑Ship Edit
                    </p>

                    <h2 className="mt-4 text-2xl md:text-3xl font-light font-display leading-tight">
                      Fast dispatch. Zero compromise.
                    </h2>

                    <p className="mt-4 text-sm text-white/75 leading-relaxed max-w-md">
                      A rotating capsule of bundles, closures &amp; select HD lace units prepared in
                      advance for clients who want Eminence quality on a tighter timeline.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to="/ready-to-ship"
                        className="rounded-full bg-white text-black px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] hover:bg-white/90 transition"
                      >
                        Shop Ready‑to‑Ship
                      </Link>
                      <Link
                        to="/custom-atelier"
                        className="rounded-full border border-white/25 px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] text-white hover:border-white/50 hover:bg-white/5 transition"
                      >
                        Build a Custom
                      </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {[
                        { t: "2–3 day dispatch", d: "Domestic (U.S.)" },
                        { t: "Install‑ready", d: "Soft, refined, dense" },
                        { t: "Concierge", d: "Help choosing pieces" },
                      ].map((x) => (
                        <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs font-medium">{x.t}</p>
                          <p className="mt-1 text-[11px] text-white/60">{x.d}</p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-6 text-[11px] text-white/50">
                      Inventory rotates weekly. For guaranteed specs (density, knots, color), use
                      Custom Atelier.
                    </p>
                  </div>

                  <div className="relative min-h-[260px]">
                    <img
                      src={firstPage2}
                      alt="Ready to ship Eminence hair"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[11px] uppercase tracking-[0.26em] text-white/75">
                          Quick‑ship capsule
                        </p>
                        <Link
                          to="/ready-to-ship"
                          className="text-[11px] uppercase tracking-[0.26em] text-white underline underline-offset-4"
                        >
                          View edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION B.5 — EMINENCE ESSENTIALS */}
          <section className="py-16 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
                  Eminence Essentials
                </p>
                <h2 className="text-2xl font-light font-display mb-3">
                  Our most requested pieces — edited for everyday luxury.
                </h2>
                <p className="text-sm text-neutral-700 max-w-xl mx-auto">
                  A focused selection of wigs and bundles chosen for versatility, longevity, and natural wear.
                  Designed to simplify your choice without limiting your options.
                </p>
              </div>

              <Motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {eminenceEssentials.slice(0, 3).map((p) => (
                  <Motion.div
                    key={p.id}
                    variants={staggerChild}
                    className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm card-hover"
                  >
                    <img
                      src={resolveProductImages(p)?.[0]}
                      alt={p.displayName || p.name}
                      className="h-64 w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={256}
                    />
                    <div className="p-5">
                      <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-500 mb-1">
                        Eminence Essential
                      </p>

                      <p className="text-sm text-neutral-800 mb-2">
                        {p.displayName || p.name}
                      </p>

                      <Link
                        to={`/products/${p.slug}`}
                        className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </Motion.div>
                ))}

                {/* Explore All */}
                <Motion.div
                  variants={staggerChild}
                  className="bg-[#F3EFE8] border border-neutral-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 card-hover"
                >
                  <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-600 mb-2">
                    Full Edit
                  </p>
                  <p className="text-sm text-neutral-700 mb-4">
                    Explore all wigs, bundles, textures, and custom options.
                  </p>
                  <Link
                    to="/shop"
                    className="px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                  >
                    Shop All
                  </Link>
                </Motion.div>
              </Motion.div>
            </div>
          </section>

          {/* SECTION B — EDITORIAL INTRO */}
          <section className="py-16 border-t border-neutral-200">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.3fr,1fr] gap-10 items-center">
              {pageLoading ? (
                <div className="space-y-4">
                  <div className="h-8 w-32 rounded-lg bg-black/10 animate-pulse" />
                  <div className="h-10 w-full rounded-lg bg-black/10 animate-pulse" />
                  <div className="h-20 w-full rounded-lg bg-black/10 animate-pulse" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                    Eminence Signature
                  </p>
                  <h2 className="text-2xl font-light font-display">
                    Hair that photographs like a fragrance campaign.
                  </h2>
                  <p className="text-sm text-neutral-700">
                    180–250% density units designed to hold structure, luster, and movement under any
                    lighting — from front camera flash to studio strobes. HD lace that melts into skin,
                    silkiness that behaves like natural hair, never plastic shine.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-4 text-[11px] text-neutral-700">
                    <div>
                      <p className="uppercase tracking-[0.2em] mb-1 text-neutral-500">Raw Origin</p>
                      <p>
                        Cambodian &amp; Myanmar donors, low-processed, single-drawn for believable
                        fullness.
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] mb-1 text-neutral-500">HD Lace</p>
                      <p>Transparent, melt-ready lace suitable for editorial installs and daily wear.</p>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.2em] mb-1 text-neutral-500">Density</p>
                      <p>180–250% luxury density for silhouettes that read rich.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <img
                  src={firstPage}
                  alt="Raw Cambodian hair editorial styling"
                  className="rounded-3xl object-cover h-60 w-full shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={240}
                />
                <img
                  src={firstPage2}
                  alt="HD lace wig editorial close-up"
                  className="rounded-3xl object-cover h-60 w-full translate-y-6 shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={240}
                />
              </div>
            </div>
          </section>

          {/* SECTION C — EXPERIENCE EMINENCE (3 COL FEATURES) */}
          <section className="py-16 border-t border-neutral-200 bg-[#F3EFE8]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-2">
                  Experience Eminence
                </p>
                <h2 className="text-2xl font-light font-display">
                  Built like couture, worn like second skin.
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-sm text-neutral-700">
                <div className="bg-white/80 border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-3">
                    Raw Cambodian &amp; SEA
                  </h3>
                  <p>
                    Ethically sourced hair from Cambodia and Myanmar, selected for strand strength,
                    uniformity, and natural luster — never coated with plastic shine.
                  </p>
                </div>
                <div className="bg-white/80 border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-3">
                    HD Lace Architecture
                  </h3>
                  <p>
                    Lace grids so fine they disappear with minimal tint. Hairlines pre-plucked for a
                    believable melt without over-thinning.
                  </p>
                </div>
                <div className="bg-white/80 border border-neutral-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-3">
                    Density You Can Feel
                  </h3>
                  <p>
                    180–250% density mapped across the cap to keep fullness where the eye lands —
                    front, crown, and ends — not just packed at the nape.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION D — CINEMATIC VIDEO BLOCK */}
          <section className="relative w-full h-[80vh] bg-black overflow-hidden border-t border-neutral-900">
            <video
              ref={videoRef}
              src={heroVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="none"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-16 px-6 max-w-5xl mx-auto text-white">
              <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-300 mb-2">In Motion</p>
              <h2 className="text-2xl md:text-3xl font-display font-light mb-3">
                The way luxury hair is meant to move.
              </h2>
              <p className="text-sm text-neutral-200 max-w-lg">
                Shot in 4K to capture true luster, density, and flow — not filters. Every frame is
                your hair&apos;s audition under real lighting.
              </p>
            </div>

            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 px-4 py-2 text-[11px] tracking-[0.2em] uppercase bg-white/10 border border-white/50 text-white rounded-full backdrop-blur hover:bg-white/20 transition"
            >
              {isMuted ? "Unmute" : "Mute"} Video
            </button>
          </section>

          {/* SECTION E — THE SILHOUETTES (LIKE INDIQUE) */}
          <section className="py-16 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                    The Silhouettes
                  </p>
                  <h2 className="text-xl font-light font-display">Choose your signature frame.</h2>
                </div>
                <Link
                  to="/shop"
                  className="text-[11px] uppercase tracking-[0.2em] text-neutral-700 underline underline-offset-4"
                >
                  View All
                </Link>
              </div>

              <Motion.div
                className="grid md:grid-cols-4 gap-6 text-sm"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <Motion.div variants={staggerChild} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm flex flex-col card-hover">
                  <img src={yummy1} alt="Silky Straight" className="h-56 w-full object-cover" loading="lazy" decoding="async" width={400} height={224} />
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-500 mb-1">
                      Silky Straight
                    </p>
                    <p className="flex-1 text-neutral-700">
                      Pin-straight precision with HD parting and 180–220% density for sleek, tailored
                      looks.
                    </p>
                    <Link
                      to="/shop?texture=Straight"
                      className="mt-3 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                    >
                      Shop Straight
                    </Link>
                  </div>
                </Motion.div>

                <Motion.div variants={staggerChild} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm flex flex-col card-hover">
                  <img src={yummy2} alt="Body Wave" className="h-56 w-full object-cover" loading="lazy" decoding="async" width={400} height={224} />
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-500 mb-1">
                      Body Wave
                    </p>
                    <p className="flex-1 text-neutral-700">
                      Off-duty glamour waves with 200–250% density for soft, expensive movement.
                    </p>
                    <Link
                      to="/shop?texture=BodyWave"
                      className="mt-3 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                    >
                      Shop Body Wave
                    </Link>
                  </div>
                </Motion.div>

                <Motion.div variants={staggerChild} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm flex flex-col card-hover">
                  <img src={yummy3} alt="Deep Wave / Curly" className="h-56 w-full object-cover" loading="lazy" decoding="async" width={400} height={224} />
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-500 mb-1">
                      Deep Wave / Curly
                    </p>
                    <p className="flex-1 text-neutral-700">
                      Defined, brushable textures that keep their pattern after washing when properly
                      cared for.
                    </p>
                    <Link
                      to="/shop?texture=DeepWave"
                      className="mt-3 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                    >
                      Shop Textures
                    </Link>
                  </div>
                </Motion.div>

                <Motion.div variants={staggerChild} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm flex flex-col card-hover">
                  <img src={yummy} alt="613 / Blonde" className="h-56 w-full object-cover" loading="lazy" decoding="async" width={400} height={224} />
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-[11px] tracking-[0.22em] uppercase text-neutral-500 mb-1">
                      613 / Blonde
                    </p>
                    <p className="flex-1 text-neutral-700">
                      Champagne-toned 613 pieces built to avoid brassiness and keep their integrity
                      under toners.
                    </p>
                    <Link
                      to="/shop?collection=613"
                      className="mt-3 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                    >
                      Shop Blonde
                    </Link>
                  </div>
                </Motion.div>
              </Motion.div>
            </div>
          </section>

          {/* SECTION F — F/W COLLECTION PREVIEW */}
          <section className="py-16 border-t border-neutral-200 bg-[#F3EFE8]">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.4fr,1.2fr] gap-10 items-center">
              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-2">
                  Eminence Luxury F/W 2025
                </p>
                <h2 className="text-2xl font-light font-display mb-3">The Eminence Edit.</h2>
                <p className="text-sm text-neutral-700 mb-5">
                  A curated capsule of silhouettes for this season: sharp middle parts, off-duty
                  blowouts, and deep waves that photograph like campaign hair.
                </p>
                <Link
                  to="/collections"
                  className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4"
                >
                  Explore the Collection
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <img
                  src={db4}
                  alt="F/W 2025 Collection body wave texture"
                  className="h-52 w-full rounded-3xl object-cover shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={208}
                />
                <img
                  src={db3}
                  alt="F/W 2025 Collection deep wave styling"
                  className="h-52 w-full rounded-3xl object-cover translate-y-6 shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={208}
                />
              </div>
            </div>
          </section>

          {/* SECTION F.5 — ATELIER PRE-ORDER CTA */}
          <section className="py-16 border-t border-neutral-200 bg-[#0B0B0C] text-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.3fr,1fr] gap-10 items-center">
              <Motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-[#D4AF37] mb-3">
                  Atelier Pre-Order
                </p>
                <h2 className="text-2xl md:text-3xl font-light font-display leading-tight mb-4">
                  Factory-direct luxury,<br className="hidden md:block" /> available by pre-order.
                </h2>
                <p className="text-sm text-white/75 leading-relaxed max-w-md mb-6">
                  Select premium bundles and wigs are available via factory drop-ship when not stocked
                  domestically. Ethically sourced, curated by quality tier — dispatched directly from
                  our partner atelier.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/shop/preorders"
                    className="rounded-full bg-[#D4AF37] text-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.26em] hover:bg-[#c4a030] transition font-medium"
                  >
                    Shop Pre-Orders
                  </Link>
                  <Link
                    to="/shop/preorders#how-it-works"
                    className="rounded-full border border-white/25 px-7 py-3 text-[11px] uppercase tracking-[0.26em] text-white hover:border-white/50 hover:bg-white/5 transition"
                  >
                    How Pre-Orders Work
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { t: "Factory-direct", d: "Sourced from our atelier" },
                    { t: "10–18 day lead", d: "Transparent timeline" },
                    { t: "Quality-tiered", d: "DD, SDD, True Raw & more" },
                  ].map((x) => (
                    <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs font-medium text-white">{x.t}</p>
                      <p className="mt-1 text-[11px] text-white/60">{x.d}</p>
                    </div>
                  ))}
                </div>
              </Motion.div>

              <div className="hidden md:block">
                <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_24px_70px_rgba(212,175,55,0.12)]">
                  <img
                    src={firstPage}
                    alt="Pre-order luxury hair"
                    className="w-full h-72 object-cover opacity-80"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION G — AUTHENTICITY / FACTORY */}
          <section className="py-16 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1.4fr,1.3fr] gap-10 items-center">
              <div className="grid grid-cols-3 gap-4">
                <img
                  src={db1}
                  alt="Raw hair quality close-up"
                  className="h-40 w-full rounded-3xl object-cover shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={300}
                  height={160}
                />
                <img
                  src={db2}
                  alt="Lab-verified hair inspection"
                  className="h-40 w-full rounded-3xl object-cover translate-y-6 shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={300}
                  height={160}
                />
                <img
                  src={db5}
                  alt="Third-party verification certificate"
                  className="h-40 w-full rounded-3xl object-cover shadow-md"
                  loading="lazy"
                  decoding="async"
                  width={300}
                  height={160}
                />
              </div>

              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
                  Verified Origin &amp; Density
                </p>
                <h2 className="text-xl font-light font-display mb-3">
                  Every fiber, every certificate, every detail — audited.
                </h2>
                <p className="text-sm text-neutral-700 mb-4">
                  Your pieces are produced in our vetted partner factory, with documentation for
                  origin, processing level, and density. We go beyond typical "raw hair" claims —
                  Eminence units are built to live on camera and in real life.
                </p>
                <Link
                  to="/authenticity"
                  className="text-[11px] uppercase tracking-[0.2em] underline underline-offset-4 text-neutral-700"
                >
                  View Authenticity &amp; Certificates
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION G.5 — ATELIER PRE-ORDER CTA */}
          <section className="py-16 border-t border-neutral-200 bg-[#F3EFE8]">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className="rounded-[2.25rem] overflow-hidden border border-neutral-200 shadow-[0_24px_70px_rgba(17,12,5,0.12)] bg-[#0B0B0C] text-white"
              >
                <div className="grid md:grid-cols-[1.15fr_0.85fr]">
                  {/* Left — copy block */}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-white/55 mb-4">
                      Atelier Pre-Order
                    </p>
                    <h2 className="text-2xl md:text-3xl font-light font-display leading-tight max-w-md">
                      Factory-direct luxury, available by pre-order.
                    </h2>
                    <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-md">
                      Select premium bundles and wigs can be fulfilled directly
                      from our partner atelier when not held in domestic stock —
                      giving you access to the full range at true factory quality.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        to="/custom-orders"
                        className="rounded-full bg-white text-[#111] px-7 py-2.5 text-[11px] uppercase tracking-[0.26em] hover:bg-white/90 transition"
                      >
                        Shop Pre-Orders
                      </Link>
                      <Link
                        to="/custom-atelier"
                        className="rounded-full border border-white/25 px-7 py-2.5 text-[11px] uppercase tracking-[0.26em] text-white hover:border-white/55 hover:bg-white/6 transition"
                      >
                        How Pre-Orders Work
                      </Link>
                    </div>

                    <div className="mt-10 grid grid-cols-3 gap-3">
                      {[
                        { t: "Factory-direct", d: "Atelier quality at origin" },
                        { t: "Full selection", d: "Beyond domestic stock" },
                        { t: "Concierge support", d: "Guided pre-order process" },
                      ].map((x) => (
                        <div
                          key={x.t}
                          className="rounded-2xl border border-white/10 bg-white/5 p-3"
                        >
                          <p className="text-xs font-medium">{x.t}</p>
                          <p className="mt-1 text-[11px] text-white/55">{x.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — accent panel */}
                  <div className="relative hidden md:flex flex-col justify-center items-center bg-white/4 border-l border-white/8 p-10 text-center gap-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-transparent pointer-events-none" />
                    <p className="text-[11px] uppercase tracking-[0.36em] text-white/40">
                      How it works
                    </p>
                    <div className="space-y-5 text-left w-full max-w-[220px]">
                      {[
                        { n: "01", label: "Choose your piece", sub: "Select from the full atelier catalogue" },
                        { n: "02", label: "We confirm specs", sub: "Density, knots, color — all verified" },
                        { n: "03", label: "Factory fulfillment", sub: "Produced & shipped direct to you" },
                      ].map((step) => (
                        <div key={step.n} className="flex gap-4 items-start">
                          <span className="text-[11px] text-[#D4AF37] tracking-[0.2em] mt-0.5 shrink-0">
                            {step.n}
                          </span>
                          <div>
                            <p className="text-xs font-medium text-white/90">{step.label}</p>
                            <p className="text-[11px] text-white/45 mt-0.5">{step.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Motion.div>
            </div>
          </section>

          {/* SECTION H — WHY EMINENCE (USP GRID) */}
          <section className="py-16 border-t border-neutral-200 bg-[#111] text-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400 mb-2">
                  Why Eminence
                </p>
                <h2 className="text-2xl font-light font-display">Less trial-and-error, more silk.</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-sm text-neutral-100">
                <div>
                  <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-400 mb-2">
                    Honest Density
                  </h3>
                  <p>
                    180–250% density that matches the label, not just staged photos. What you see is
                    what you unbox.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-400 mb-2">
                    Camera-Tested
                  </h3>
                  <p>
                    Units tested under flash, daylight, and low light so your hair performs in real
                    life, not just studio renders.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-400 mb-2">
                    Longevity Focused
                  </h3>
                  <p>
                    Built to be washed, styled, and reworn — not disposable hair for a single event.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION I — NEWSLETTER CTA */}
          <section className="py-16 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
                Private List
              </p>
              <h2 className="text-2xl font-light font-display mb-3">
                Be the first to know when new units drop.
              </h2>
              <p className="text-sm text-neutral-700 mb-6">
                Early access to capsules, priority restocks, and ritual-based care guides. Your 10%
                welcome code will meet you at checkout.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-white border border-neutral-300 rounded-full px-4 py-2 text-sm outline-none focus:border-[#111]"
                />
                <button
                  onClick={handleNewsletterSignup}
                  disabled={newsletterStatus === "loading"}
                  className="px-8 py-2.5 text-xs tracking-[0.26em] uppercase border border-[#111] bg-[#111] text-[#F9F7F4] rounded-full hover:bg-transparent hover:text-[#111] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {newsletterStatus === "loading" ? "Joining..." : newsletterStatus === "success" ? "You’re in" : "Join Eminence"}
                </button>
              </div>

              <p className="mt-3 text-[11px] text-neutral-500">
                {newsletterStatus === "success"
                  ? "You’re on the list — watch your inbox for early access."
                  : newsletterStatus === "error"
                  ? newsletterError
                  : "No spam — just launches, drops, and things worth knowing."}
              </p>
            </div>
          </section>
        </div>
      </PageTransition>
    </>
  );
};

export default Home;
