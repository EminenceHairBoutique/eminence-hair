// src/components/JournalCTA.jsx — Reusable editorial inline CTA component
// Use on Journal, JournalPost, StartHere, MedicalHair, ForProfessionals, etc.
//
// Props:
//   theme   — "consult" | "collections" | "guide" | "list" | "partner" | "start" | "results"
//   className — optional additional wrapper classes
//   compact — boolean, renders a more compact horizontal layout

import React from "react";
import { Link } from "react-router-dom";

const THEMES = {
  consult: {
    eyebrow: "Private Consult",
    heading: "Still deciding? Let us help.",
    body: "Book a one-on-one session with our concierge team — no pressure, just guidance.",
    cta: { label: "Book a Consult", href: "/private-consult" },
  },
  collections: {
    eyebrow: "Shop",
    heading: "Ready to explore the collection?",
    body: "Browse raw Cambodian and Burmese hair across every texture, length, and lace type.",
    cta: { label: "Shop Collections", href: "/collections" },
  },
  guide: {
    eyebrow: "The Journal",
    heading: "New to raw hair?",
    body: "Read our first-time buyer guide — everything you need to make a confident first purchase.",
    cta: { label: "Read the Guide", href: "/journal/first-wig-guide" },
  },
  list: {
    eyebrow: "Stay Connected",
    heading: "Get early access to new arrivals.",
    body: "Join our list for new collection drops, restocks, and editorial updates.",
    cta: { label: "Join the List", href: "/start-here" },
  },
  partner: {
    eyebrow: "For Professionals",
    heading: "Work in hair? There's a program for you.",
    body: "Explore stylist wholesale, creator affiliate, and installer directory programs.",
    cta: { label: "Partner With Us", href: "/for-professionals" },
  },
  start: {
    eyebrow: "Start Here",
    heading: "Not sure where to begin?",
    body: "Use our guided matchmaker to build your shortlist by texture, length, and color.",
    cta: { label: "Find Your Hair", href: "/start-here" },
  },
  results: {
    eyebrow: "See It in Practice",
    heading: "Want to see how it actually looks?",
    body: "Browse installs, editorial styling, and real-world versatility references.",
    cta: { label: "View Results", href: "/client-results" },
  },
};

export default function JournalCTA({ theme = "consult", className = "", compact = false }) {
  const config = THEMES[theme] || THEMES.consult;

  if (compact) {
    return (
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white px-6 py-5 ${className}`}
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#D4AF37] mb-1">
            {config.eyebrow}
          </p>
          <p className="text-sm font-display font-light">{config.heading}</p>
        </div>
        <Link
          to={config.cta.href}
          className="shrink-0 inline-block px-6 py-2.5 text-[11px] tracking-[0.26em] uppercase border border-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white transition"
        >
          {config.cta.label}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl bg-[#0B0B0C] text-white px-8 py-10 text-center ${className}`}
    >
      <p className="text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] mb-2">
        {config.eyebrow}
      </p>
      <h2 className="text-xl font-display font-light mb-3">{config.heading}</h2>
      <p className="text-sm text-white/60 max-w-xs mx-auto mb-6">{config.body}</p>
      <Link
        to={config.cta.href}
        className="inline-block px-7 py-2.5 text-[11px] tracking-[0.26em] uppercase bg-white text-[#1B1B1B] rounded-full hover:bg-white/90 transition"
      >
        {config.cta.label}
      </Link>
    </div>
  );
}
