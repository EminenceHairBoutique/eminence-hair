// src/pages/Home.jsx — Luxury Homepage (7-Section Editorial Architecture)

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { eminenceEssentials } from "../data/products";
import { resolveProductImages } from "../utils/productMedia";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";

import hero from "../assets/hero.jpg.png";
import firstPage from "../assets/first_page.png";
import firstPage2 from "../assets/first_page_2.png";
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

  const pageLoading = false;

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
        description="Shop 100% raw Cambodian & Burmese HD lace wigs, bundles, and closures. 180\u2013250% density, ethically sourced, third-party verified. Free shipping on select orders."
      />
      <PageTransition>
        <div className={`bg-[#F9F7F4] text-[#111] ${isOpen ? "blur-sm" : ""} transition`}>

          {/* \u2500\u2500 SECTION 1 \u2014 HERO (Video) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={heroVideo}
              poster={hero}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
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
                    Third-party verified, 180\u2013250% density wigs and bundles from our partner atelier.
                    Ethically sourced from Cambodia &amp; Myanmar \u2014 engineered for camera, studio, and everyday luxury.
                  </p>
                </Motion.div>
              )}

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="px-10 py-3 text-xs tracking-[0.26em] uppercase border border-[#F9F7F4] bg-[#F9F7F4] text-[#111] rounded-full hover:bg-transparent hover:text-[#F9F7F4] transition"
                >
                  Shop the Collection
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-3 text-xs tracking-[0.26em] uppercase border border-[#F9F7F4]/70 rounded-full hover:border-[#F9F7F4] hover:bg-white/10 transition"
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

          {/* \u2500\u2500 SECTION 2 \u2014 TRUST STRIP + SOCIAL PROOF \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <TrustStrip />
          <div className="bg-white border-b border-neutral-200 py-3">
            <p className="text-center text-[11px] tracking-[0.18em] uppercase text-neutral-500">
              Trusted by stylists, creators, and clients nationwide.
            </p>
          </div>

          {/* \u2500\u2500 SECTION 3 \u2014 EDITORIAL PRODUCT SHOWCASE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-16 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                className="grid md:grid-cols-[1fr_1.4fr] gap-12 items-start"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {/* Editorial intro */}
                <div className="md:sticky md:top-24">
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
                    The Essentials Edit
                  </p>
                  <h2 className="text-2xl font-light font-display mb-3">
                    Our most requested pieces \u2014 edited for everyday luxury.
                  </h2>
                  <p className="text-sm text-neutral-700 mb-6 leading-relaxed">
                    A focused selection of wigs and bundles chosen for versatility, longevity, and natural wear.
                    Each piece is third-party verified and engineered for camera-ready confidence.
                  </p>
                  <Link
                    to="/shop?collection=eminence-essentials"
                    className="inline-block px-8 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                  >
                    Shop All Essentials
                  </Link>
                </div>

                {/* 4-product 2-col grid */}
                <Motion.div
                  className="grid grid-cols-2 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                >
                  {eminenceEssentials.slice(0, 4).map((p) => (
                    <Motion.div
                      key={p.id}
                      variants={staggerChild}
                      className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm card-hover"
                    >
                      <img
                        src={resolveProductImages(p)?.[0]}
                        alt={p.displayName || p.name}
                        className="h-56 w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={224}
                      />
                      <div className="p-4">
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
                </Motion.div>
              </Motion.div>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 4 \u2014 BRAND STORY (Why Eminence + Authenticity) \u2500\u2500 */}
          <section className="py-16 border-t border-neutral-900 bg-[#111] text-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                className="grid md:grid-cols-[1.2fr_1fr] gap-12 items-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {/* Left \u2014 editorial images */}
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src={firstPage}
                    alt="Raw Cambodian hair editorial styling"
                    className="rounded-3xl object-cover h-72 w-full shadow-md"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={288}
                  />
                  <img
                    src={db5}
                    alt="Third-party verification and quality assurance"
                    className="rounded-3xl object-cover h-72 w-full shadow-md mt-6"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={288}
                  />
                </div>

                {/* Right \u2014 value props */}
                <div>
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400 mb-2">
                    Why Eminence
                  </p>
                  <h2 className="text-2xl font-light font-display mb-6">
                    Less trial-and-error, more silk.
                  </h2>

                  <div className="space-y-6 text-sm text-neutral-100">
                    <div>
                      <h3 className="text-xs tracking-[0.24em] uppercase text-neutral-400 mb-2">
                        Honest Density
                      </h3>
                      <p>
                        180\u2013250% density that matches the label, not just staged photos. What you see is
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
                        Built to be washed, styled, and reworn \u2014 not disposable hair for a single event.
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/authenticity"
                    className="inline-block mt-8 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-300 hover:text-white transition"
                  >
                    Learn Our Process
                  </Link>
                </div>
              </Motion.div>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 5 \u2014 COLLECTION MOMENT (F/W 2025) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="relative py-16 border-t border-neutral-200 bg-[#F3EFE8]">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <div>
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-600 mb-2">
                    Eminence Luxury F/W 2025
                  </p>
                  <h2 className="text-2xl font-light font-display mb-3">The Eminence Edit.</h2>
                  <p className="text-sm text-neutral-700 mb-5 leading-relaxed">
                    A curated capsule of silhouettes for this season: sharp middle parts, off-duty
                    blowouts, and deep waves that photograph like campaign hair.
                  </p>
                  <Link
                    to="/collections"
                    className="inline-block px-8 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                  >
                    Explore the Collection
                  </Link>
                </div>

                <div>
                  <img
                    src={db4}
                    alt="F/W 2025 Collection body wave texture"
                    className="w-full rounded-3xl object-cover shadow-md aspect-[4/3]"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={450}
                  />
                </div>
              </Motion.div>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 6 \u2014 PRE-ORDER + NEWSLETTER (combined) \u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-16 border-t border-neutral-900 bg-[#0B0B0C] text-white">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                className="grid md:grid-cols-2 gap-12 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                {/* Left \u2014 Atelier Pre-Order */}
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-white/55 mb-4">
                    Atelier Pre-Order
                  </p>
                  <h2 className="text-2xl md:text-3xl font-light font-display leading-tight max-w-md mb-4">
                    Factory-direct luxury, available by pre-order.
                  </h2>
                  <p className="text-sm text-white/70 leading-relaxed max-w-md mb-6">
                    Select premium bundles and wigs can be fulfilled directly
                    from our partner atelier when not held in domestic stock \u2014
                    giving you access to the full range at true factory quality.
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
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
                      How It Works
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
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

                {/* Right \u2014 Newsletter */}
                <div className="flex flex-col justify-center">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-white/55 mb-2">
                      Private List
                    </p>
                    <h3 className="text-xl font-light font-display mb-3">
                      Be the first to know when new units drop.
                    </h3>
                    <p className="text-sm text-white/60 mb-6 leading-relaxed">
                      Early access to capsules, priority restocks, and care guides. Your 10%
                      welcome code will meet you at checkout.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
                      />
                      <button
                        onClick={handleNewsletterSignup}
                        disabled={newsletterStatus === "loading"}
                        className="px-6 py-2.5 text-[11px] tracking-[0.26em] uppercase bg-white text-[#111] rounded-full hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {newsletterStatus === "loading" ? "Joining..." : newsletterStatus === "success" ? "You're in" : "Join Eminence"}
                      </button>
                    </div>

                    <p className="mt-3 text-[11px] text-white/40">
                      {newsletterStatus === "success"
                        ? "You're on the list \u2014 watch your inbox for early access."
                        : newsletterStatus === "error"
                        ? newsletterError
                        : "No spam \u2014 just launches, drops, and things worth knowing."}
                    </p>
                  </div>
                </div>
              </Motion.div>
            </div>
          </section>

          {/* \u2500\u2500 SECTION 7 \u2014 READY-TO-SHIP (compact, light) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */}
          <section className="py-14 border-t border-neutral-200 bg-[#F9F7F4]">
            <div className="max-w-6xl mx-auto px-6">
              <Motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
              >
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-1">
                      Ready\u2011to\u2011Ship
                    </p>
                    <h2 className="text-xl font-light font-display">
                      Fast dispatch. Zero compromise.
                    </h2>
                  </div>
                  <Link
                    to="/ready-to-ship"
                    className="text-[11px] uppercase tracking-[0.2em] text-neutral-700 underline underline-offset-4"
                  >
                    View All
                  </Link>
                </div>

                <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-center">
                  <div className="relative rounded-3xl overflow-hidden shadow-md">
                    <img
                      src={firstPage2}
                      alt="Ready to ship Eminence hair"
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={450}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-white/90 backdrop-blur text-[11px] tracking-[0.22em] uppercase text-neutral-800 rounded-full px-4 py-1.5">
                        Ships within 48 hours
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-700 leading-relaxed mb-6">
                      A rotating capsule of bundles, closures &amp; select HD lace units prepared in
                      advance for clients who want Eminence quality on a tighter timeline.
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { t: "2\u20133 day dispatch", d: "Domestic (U.S.)" },
                        { t: "Install\u2011ready", d: "Soft, refined, dense" },
                        { t: "Concierge", d: "Help choosing pieces" },
                      ].map((x) => (
                        <div key={x.t} className="rounded-2xl border border-neutral-200 bg-white p-3">
                          <p className="text-xs font-medium text-neutral-800">{x.t}</p>
                          <p className="mt-1 text-[11px] text-neutral-500">{x.d}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/ready-to-ship"
                        className="rounded-full bg-[#111] text-[#F9F7F4] px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] hover:bg-[#111]/90 transition"
                      >
                        Shop Ready\u2011to\u2011Ship
                      </Link>
                      <Link
                        to="/custom-atelier"
                        className="rounded-full border border-neutral-900 px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] text-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                      >
                        Build a Custom
                      </Link>
                    </div>
                  </div>
                </div>
              </Motion.div>
            </div>
          </section>

        </div>
      </PageTransition>
    </>
  );
};

export default Home;
