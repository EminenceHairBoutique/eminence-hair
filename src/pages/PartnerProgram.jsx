import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import SEO from "../components/SEO";
import PageHero from "../components/PageHero";
import { staggerContainer, staggerChild, hoverLift, viewport } from "../ui/motionPresets";

const STYLIST_TIERS = [
  {
    num: "01",
    name: "Registered Stylist",
    flag: "registered_stylist",
    benefit: "Entry-level wholesale pricing, tester access",
    req: "Cosmetology license + paid tester SKU purchase",
  },
  {
    num: "02",
    name: "Approved Salon Partner",
    flag: "approved_salon_partner",
    benefit: "Revenue split eligibility, Partner Portal access",
    req: "Verified license + consistent install volume",
  },
  {
    num: "03",
    name: "Preferred Salon Partner",
    flag: "preferred_salon_partner",
    benefit: "Best pricing, priority restocks, site features",
    req: "Performance track record + brand alignment",
  },
  {
    num: "04",
    name: "Eminence Atelier Partner",
    flag: "atelier_partner",
    benefit: "Custom pricing, editorial features, invite only",
    req: "Invitation by Eminence team",
  },
];

const CREATOR_TIERS = [
  {
    num: "01",
    name: "Affiliate Creator",
    flag: "affiliate_creator",
    benefit: "Unique referral link, 10\u201315% commission",
    req: "Content review + platform verification",
  },
  {
    num: "02",
    name: "Featured Creator",
    flag: "featured_creator",
    benefit: "15\u201325% commission, paid campaigns, product gifting",
    req: "Proven conversions + engagement at Tier 1",
  },
  {
    num: "03",
    name: "Brand Muse",
    flag: "brand_muse",
    benefit: "Campaign shoots, exclusive launches, invite only",
    req: "Invitation by Eminence team",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    label: "Apply",
    desc: "Choose your track \u2014 Stylist & Salon or Creator & Influencer.",
  },
  {
    step: "02",
    label: "Qualify",
    desc: "Meet entry requirements. Stylists: license + tester purchase. Creators: content review.",
  },
  {
    step: "03",
    label: "Level Up",
    desc: "Performance unlocks better pricing, commissions, and brand features.",
  },
];

function TierCard({ num, name, benefit, req }) {
  return (
    <Motion.div
      className="rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl p-5 card-hover"
      variants={staggerChild}
      whileHover={hoverLift}
    >
      <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400">{num}</p>
      <p className="mt-2 text-sm font-medium text-neutral-900">{name}</p>
      <p className="mt-1 text-xs text-neutral-700 leading-relaxed">{benefit}</p>
      <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">Req: {req}</p>
    </Motion.div>
  );
}

export default function Partners() {
  const { user } = useUser();

  const isPartner = useMemo(() => {
    const t = String(user?.accountTier || "").toLowerCase();
    const s = String(user?.partnerStatus || "").toLowerCase();
    return t === "partner" || t === "wholesale" || t.startsWith("partner_") || s === "approved";
  }, [user?.accountTier, user?.partnerStatus]);

  const partnerTier = user?.partnerTier || null;

  const formatTierName = (tier) =>
    String(tier || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <SEO
        title="Partner Program"
        description="Two-track partnership ecosystem for stylists, salons, creators, and influencers. Performance earns access."
      />

      <PageHero
        eyebrow="Stylists \u2022 Creators \u2022 Salons"
        title="The Eminence Partnership Ecosystem"
        subtitle="Two tracks. One standard. Built for professionals who perform \u2014 not just promote."
        image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp"
        ctas={
          isPartner
            ? [{ label: "Go to Partner Portal", href: "/partner-portal", variant: "primary" }]
            : [
                { label: "Salon & Stylist Partners", href: "/partners/stylists", variant: "primary" },
                { label: "Creators & Influencers", href: "/partners/creators", variant: "ghost" },
              ]
        }
      />

      <section className="bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-16">

          {isPartner && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 backdrop-blur-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-emerald-700">Active Partner</p>
                <p className="mt-1 text-sm text-emerald-900 font-medium">
                  {partnerTier ? `Tier: ${formatTierName(partnerTier)}` : "Your account has partner access."}
                </p>
              </div>
              <Link
                to="/partner-portal"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 transition"
              >
                Go to Partner Portal
              </Link>
            </div>
          )}

          <div>
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">How It Works</p>
            <h2 className="mt-3 text-2xl font-light text-neutral-900">Three steps to partnership</h2>
            <Motion.div
              className="mt-8 grid sm:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {HOW_IT_WORKS.map((s) => (
                <Motion.div
                  key={s.step}
                  className="rounded-3xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.08)] p-6 card-hover"
                  variants={staggerChild}
                  whileHover={hoverLift}
                >
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400">{s.step}</p>
                  <p className="mt-3 text-base font-medium text-neutral-900">{s.label}</p>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{s.desc}</p>
                </Motion.div>
              ))}
            </Motion.div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Track A</p>
                <h2 className="mt-3 text-2xl font-light text-neutral-900">Stylist & Salon Tiers</h2>
                <p className="mt-2 text-sm text-neutral-700 max-w-xl">
                  Service-based. Technical skill + revenue reliability. Four tiers that reward real performance.
                </p>
              </div>
              <Link
                to="/partners/stylists"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 transition shrink-0"
              >
                Apply \u2014 Stylist Program
              </Link>
            </div>
            <Motion.div
              className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {STYLIST_TIERS.map((t) => (
                <TierCard key={t.flag} {...t} />
              ))}
            </Motion.div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Track B</p>
                <h2 className="mt-3 text-2xl font-light text-neutral-900">Creator & Influencer Tiers</h2>
                <p className="mt-2 text-sm text-neutral-700 max-w-xl">
                  Audience-based. Content + conversions. Three tiers driven by performance and brand fit.
                </p>
              </div>
              <Link
                to="/partners/creators"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 transition shrink-0"
              >
                Apply \u2014 Creator Program
              </Link>
            </div>
            <Motion.div
              className="mt-6 grid sm:grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {CREATOR_TIERS.map((t) => (
                <TierCard key={t.flag} {...t} />
              ))}
            </Motion.div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.12)] p-8 text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">The Eminence Standard</p>
            <p className="mt-4 text-base font-light text-neutral-900 leading-relaxed">
              No free product guarantees. No inflated promises. Performance earns access.
              <span className="block mt-2 text-neutral-600 text-sm">Your best work is your application.</span>
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
