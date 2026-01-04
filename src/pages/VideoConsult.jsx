// src/pages/VideoConsult.jsx — Video Consultation (Embed)

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Video, ArrowRight, ShieldCheck } from "lucide-react";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { BRAND } from "../config/brand";

export default function VideoConsult() {
  const videoUrl = import.meta.env.VITE_VIDEO_CONSULT_URL;
  const [loaded, setLoaded] = useState(false);

  const canEmbed = useMemo(() => {
    const s = String(videoUrl || "").trim();
    if (!s) return false;
    // Allow https URLs only (prevents accidental `javascript:`)
    return /^https:\/\//i.test(s);
  }, [videoUrl]);

  return (
    <PageTransition>
      <SEO
        title="Video Consult | Eminence Concierge"
        description="Book a private video consultation for expert guidance on fit, density, lace, and medical-grade silk top options."
      />

      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          compact
          eyebrow="Video Consult"
          title="A private video consultation — refined, discreet, and tailored."
          subtitle="For clients who want precision: cap fit, scalp sensitivity, density realism, and the most natural hairline for your lifestyle."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_12.webp"
          ctas={[
            { label: "Shop Medical Grade", href: "/shop?collection=medical", variant: "primary" },
            { label: "Medical Hair", href: "/medical-hair", variant: "ghost" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          <section className="grid lg:grid-cols-[1fr,1.1fr] gap-8 items-start">
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">What we cover</p>
              <h2 className="mt-2 text-2xl font-light font-display">A calm, expert-fit session.</h2>
              <ul className="mt-5 space-y-2 text-sm text-neutral-700 list-disc list-inside">
                <li>Cap sizing + fit guidance (including sensitive scalp notes)</li>
                <li>Natural density selection (150/180/210/250) and custom requests</li>
                <li>Lace + melt strategy for your complexion and hairline goals</li>
                <li>Medical-grade silk top options (discreet realism)</li>
                <li>Care plan and longevity expectations</li>
              </ul>

              <div className="mt-7 rounded-3xl bg-[#F3EFE8] border border-black/5 p-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-black/5 border border-black/10">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Discreet by default</p>
                    <p className="mt-1 text-sm text-neutral-700 leading-relaxed">
                      You can keep your camera off if you prefer. Share photos, inspiration, or measurements
                      only if you’re comfortable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Book</p>
                  <h2 className="mt-2 text-2xl font-light font-display">Choose a time.</h2>
                </div>

                {canEmbed && !loaded && (
                  <button
                    type="button"
                    onClick={() => setLoaded(true)}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                  >
                    <Video className="w-4 h-4" /> Load scheduler
                  </button>
                )}
              </div>

              {!canEmbed && (
                <div className="mt-5 rounded-2xl border border-black/10 bg-[#FBF6EE] p-5">
                  <p className="text-sm text-neutral-800">
                    Your booking link isn’t configured yet.
                  </p>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                    Add <span className="font-mono">VITE_VIDEO_CONSULT_URL</span> in Vercel to embed your
                    Calendly / Cal.com / Acuity scheduler.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/private-consult"
                      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                    >
                      Request consult <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                    <a
                      href={`mailto:${BRAND.supportEmail}`}
                      className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                    >
                      Email concierge
                    </a>
                  </div>
                </div>
              )}

              {canEmbed && loaded && (
                <div className="mt-5">
                  <div className="rounded-3xl overflow-hidden border border-black/10 bg-white">
                    <iframe
                      title="Video consult booking"
                      src={videoUrl}
                      className="w-full h-[720px]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                    Tip: If your scheduler supports it, set the meeting location to Zoom or Google Meet so
                    the link is generated automatically.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
