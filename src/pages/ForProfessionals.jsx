import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

import SEO from "../components/SEO";
import PageTransition from "../components/PageTransition";

import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";

const programs = [
  {
    title: "Stylist Program",
    description:
      "Exclusive wholesale pricing, priority access to new drops, and a dedicated rep for licensed stylists who install and retail Eminence pieces.",
    href: "/partners/stylists",
    cta: "Apply as a Stylist",
  },
  {
    title: "Creator Program",
    description:
      "Complimentary units, affiliate commissions, and campaign features for content creators who align with the Eminence aesthetic and values.",
    href: "/partners/creators",
    cta: "Apply as a Creator",
  },
  {
    title: "Installer & Partner Program",
    description:
      "Join our certified installer network and gain referral visibility, co-branded marketing support, and tiered commission structures.",
    href: "/partners",
    cta: "Explore Partnership",
  },
];

export default function ForProfessionals() {
  return (
    <>
      <SEO
        title="For Professionals | Eminence Hair Boutique"
        description="Explore Eminence professional programs — wholesale for stylists, affiliate for creators, and partnership for installers."
      />
      <PageTransition>
        <div className="bg-[#FAF8F5] text-[#1B1B1B] min-h-screen">
          {/* Editorial hero */}
          <Motion.section
            className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-3">
              Professional Programs
            </p>
            <h1 className="font-header text-4xl md:text-5xl mb-5">
              For Professionals
            </h1>
            <p className="font-body text-neutral-500 max-w-2xl mx-auto text-sm leading-relaxed">
              Whether you're a licensed stylist, content creator, or certified
              installer — there's a place for you in the Eminence ecosystem.
              Every program is designed to reward quality work and long-term
              partnership.
            </p>
          </Motion.section>

          {/* Program tiles */}
          <Motion.section
            className="max-w-6xl mx-auto px-6 pb-20"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={staggerContainer}
          >
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <Motion.div
                  key={program.title}
                  variants={staggerChild}
                  className="bg-white rounded-card p-8 shadow-sm flex flex-col"
                >
                  <h2 className="font-header text-xl mb-3">{program.title}</h2>
                  <p className="font-body text-sm text-neutral-500 leading-relaxed mb-6 flex-1">
                    {program.description}
                  </p>
                  <Link
                    to={program.href}
                    className="inline-block text-center text-[11px] uppercase tracking-[0.18em] border border-charcoal text-charcoal px-6 py-3 rounded-full hover:bg-charcoal hover:text-white transition-colors"
                  >
                    {program.cta}
                  </Link>
                </Motion.div>
              ))}
            </div>
          </Motion.section>

          {/* Combined CTA */}
          <Motion.section
            className="max-w-3xl mx-auto px-6 pb-24 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <h2 className="font-header text-2xl md:text-3xl mb-4">
              Not Sure Which Program Fits?
            </h2>
            <p className="font-body text-sm text-neutral-500 mb-8 max-w-xl mx-auto leading-relaxed">
              Reach out and we'll help you find the right partnership tier.
              We're selective — but intentionally so, because our partners
              deserve a network that protects the brand they represent.
            </p>
            <Link
              to="/contact"
              className="inline-block text-[11px] uppercase tracking-[0.18em] bg-charcoal text-white px-8 py-3.5 rounded-full hover:bg-gold transition-colors"
            >
              Contact Us
            </Link>
          </Motion.section>
        </div>
      </PageTransition>
    </>
  );
}
