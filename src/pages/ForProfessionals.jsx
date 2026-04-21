import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp, staggerContainer, staggerChild, viewport } from "../ui/motionPresets";
import PageTransition from "../components/PageTransition";
import SEO from "../components/SEO";

const PROGRAMS = [
  {
    id: "stylist",
    title: "Stylist Program",
    who: "For licensed stylists and salon owners who install or recommend luxury hair to clients.",
    description:
      "Access wholesale pricing, priority inventory, and a dedicated concierge line. We support your business with marketing assets and professional-grade product guidance.",
    cta: "Apply as a Stylist",
    href: "/partners/stylists",
    features: [
      "Wholesale pricing on all collections",
      "Priority inventory access and restocks",
      "Marketing and content assets",
      "Dedicated concierge support",
    ],
    expectations: "Active stylist license. Minimum volume commitment. Professional portfolio recommended.",
  },
  {
    id: "creator",
    title: "Creator Program",
    who: "For content creators and influencers who produce hair, beauty, or lifestyle content with an engaged audience.",
    description:
      "Receive complimentary units for honest review, earn affiliate commission on referrals, and get early access to new collections before public launch.",
    cta: "Apply as a Creator",
    href: "/partners/creators",
    features: [
      "Complimentary units for review content",
      "Affiliate commission on referrals",
      "Early access to new collections",
      "Co-branded content opportunities",
    ],
    expectations: "Consistent publishing cadence. Authentic voice and engaged community. Content examples required.",
  },
  {
    id: "installer",
    title: "Installer Directory",
    who: "For wig installers and hair technicians who work with clients seeking professional installation.",
    description:
      "Join our verified directory and receive client referrals from Eminence buyers in your area. Access professional tools and ongoing training resources.",
    cta: "Join Our Directory",
    href: "/installers",
    features: [
      "Verified directory listing",
      "Client referrals from Eminence buyers",
      "Access to professional installation tools",
      "Training and technique resources",
    ],
    expectations: "Demonstrated installation experience. Client portfolio or references. Service area coverage.",
  },
];

const FAQS = [
  {
    q: "How long does the application review take?",
    a: "Most applications receive a response within 5–7 business days. We review each application personally, so we appreciate your patience.",
  },
  {
    q: "Can I apply to more than one program?",
    a: "Yes. If you're both a stylist and a creator, you're welcome to apply to both programs. Each is evaluated separately based on your primary activity in that role.",
  },
  {
    q: "Is there a minimum purchase requirement for the Stylist Program?",
    a: "There is a minimum volume expectation for wholesale access. Details are outlined during the application process — we'll discuss your typical order cadence as part of the review.",
  },
  {
    q: "I'm a new creator without a large following. Can I still apply?",
    a: "Follower count is one signal, not the only one. We look at content quality, engagement rate, and audience fit. Strong, niche communities are often a better fit than large but disengaged audiences.",
  },
  {
    q: "Do I need to be in a specific location?",
    a: "Our Stylist and Creator programs are open regardless of location. The Installer Directory is location-based, so coverage area is part of the listing.",
  },
  {
    q: "What if I'm not sure which program is right for me?",
    a: "Reach out through the partner contact form and describe your work — we'll point you in the right direction before you submit a full application.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        className="w-full flex items-center justify-between py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-light text-neutral-900">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm text-neutral-600 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

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
                Built for stylists, creators, and installers.
              </h1>
              <p className="mt-4 text-sm text-neutral-600 max-w-lg mx-auto px-6">
                Three programs designed around how you actually work — with real support, real pricing, and no filler.
              </p>
            </Motion.div>
          </section>

          {/* Who is this for — quick summary */}
          <section className="max-w-4xl mx-auto px-6 pb-12">
            <Motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="grid md:grid-cols-3 gap-6"
            >
              {PROGRAMS.map((prog) => (
                <Motion.div
                  key={prog.id}
                  variants={staggerChild}
                  className="text-center"
                >
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#D4AF37] mb-2">
                    {prog.title}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">{prog.who}</p>
                </Motion.div>
              ))}
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

                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-400 mb-2">What you get</p>
                    <ul className="space-y-2">
                      {program.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-xs text-neutral-600 flex items-start gap-2"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#D4AF37] shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-7">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-400 mt-4 mb-2">What we ask</p>
                    <p className="text-xs text-neutral-500 leading-relaxed">{program.expectations}</p>
                  </div>

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

          {/* FAQ */}
          <section className="max-w-2xl mx-auto px-6 pb-20">
            <Motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-2">
                Common Questions
              </p>
              <h2 className="text-2xl font-display font-light mb-8">
                Partner FAQ
              </h2>
              <div>
                {FAQS.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </Motion.div>
          </section>

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
                Reach out to our partner team — we'll guide you to the right fit based on your work and goals.
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
