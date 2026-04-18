import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";

const PROGRAMS = [
  {
    title: "Stylist Program",
    description:
      "For licensed stylists and salon owners. Get wholesale pricing, priority inventory access, and dedicated support from our concierge team.",
    cta: "Apply as a Stylist",
    href: "/partners/stylists",
    features: ["Wholesale pricing", "Priority restocks", "Marketing assets", "Dedicated concierge"],
  },
  {
    title: "Creator Program",
    description:
      "For content creators and influencers. Receive complimentary units for review, affiliate commission, and early access to new collections.",
    cta: "Apply as a Creator",
    href: "/partners/creators",
    features: ["Complimentary units", "Affiliate commission", "Early access", "Co-branded content"],
  },
  {
    title: "Installer Program",
    description:
      "For wig installers and hair technicians. Join our verified installer directory, receive client referrals, and access professional-grade tools.",
    cta: "Join Our Directory",
    href: "/installers",
    features: ["Directory listing", "Client referrals", "Professional tools", "Training resources"],
  },
];

export default function ForProfessionals() {
  return (
    <>
      <SEO
        title="For Professionals — Partner, Stylist & Creator Programs"
        description="Join Eminence Hair Boutique's professional programs. Wholesale pricing for stylists, affiliate commissions for creators, and client referrals for installers."
      />
      <PageTransition>
        <div className="bg-[#F9F7F4] text-[#1B1B1B]">
          {/* Hero */}
          <section className="pt-32 pb-16 text-center">
            <Motion.div variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500 mb-4">
                For Professionals
              </p>
              <h1 className="text-3xl md:text-4xl font-light font-display max-w-2xl mx-auto leading-tight px-6">
                Elevate your craft with Eminence
              </h1>
              <p className="mt-4 text-sm text-neutral-600 max-w-lg mx-auto px-6">
                Whether you style, create, or install — we built programs that
                respect your expertise and reward your partnership.
              </p>
            </Motion.div>
          </section>

          {/* Program tiles */}
          <Motion.section
            className="pb-20"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {PROGRAMS.map((program) => (
                <Motion.div
                  key={program.title}
                  variants={staggerChild}
                  className="bg-white rounded-3xl border border-neutral-200 p-8 flex flex-col"
                >
                  <h2 className="text-xl font-display font-light mb-3">
                    {program.title}
                  </h2>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6 flex-1">
                    {program.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {program.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-xs text-neutral-500 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={program.href}
                    className="inline-block text-center px-6 py-2.5 text-[11px] tracking-[0.26em] uppercase border border-[#1B1B1B] rounded-full hover:bg-[#1B1B1B] hover:text-[#FAF8F5] transition"
                  >
                    {program.cta}
                  </Link>
                </Motion.div>
              ))}
            </div>
          </Motion.section>

          {/* CTA */}
          <section className="py-16 bg-[#0B0B0C] text-white text-center">
            <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-4">
                Ready to Partner?
              </p>
              <h2 className="text-2xl md:text-3xl font-light font-display mb-4">
                Not sure which program fits?
              </h2>
              <p className="text-sm text-white/70 max-w-md mx-auto mb-8">
                Reach out to our partner team — we'll guide you to the right fit
                based on your work and goals.
              </p>
              <Link
                to="/partners"
                className="inline-block px-8 py-3 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
              >
                Explore All Programs
              </Link>
            </Motion.div>
          </section>
        </div>
      </PageTransition>
    </>
  );
}
