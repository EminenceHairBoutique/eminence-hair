// src/pages/PrivateConsult.jsx — Private Consult (New, Upgraded)

import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

const inputBase =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25";

export default function PrivateConsult() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    interest: "Wigs",
    timeline: "",
    goals: "",
    preferredContact: "Email",
    website: "", // honeypot
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      if (!form.fullName || !form.email) {
        throw new Error("Please include your name and email.");
      }

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "private_consult", payload: form }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Unable to send request.");
      }

      setStatus({
        state: "success",
        message:
          "Request received. Concierge will reply with availability and the next best steps.",
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <SEO
        title="Private Consult — Concierge Guidance"
        description="Tell us your goals, schedule, and maintenance tolerance — and we'll recommend the right collection, density, lace, and installation plan."
      />
      <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          compact
          eyebrow="Private Consult"
          title="Concierge guidance — tailored to your lifestyle."
          subtitle="Choosing hair should feel effortless. Tell us your goal, your schedule, and your maintenance tolerance — and we’ll recommend the right collection, density, lace, and plan."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_10.webp"
          ctas={[
            { label: "Explore Collections", href: "/collections", variant: "primary" },
            { label: "Care Guide", href: "/care", variant: "ghost" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* Benefits */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "The right match",
                d: "We help you choose origin, texture, and density based on your desired look and how you actually live.",
              },
              {
                t: "Fit + melt",
                d: "Cap sizing, lace options, and install guidance — so the unit wears securely and photographs seamlessly.",
              },
              {
                t: "Maintenance plan",
                d: "We’ll recommend a realistic care routine (heat, wash schedule, products) that protects longevity.",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  {c.t}
                </p>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </section>

          {/* Prep + form */}
          <section className="mt-14 grid lg:grid-cols-[0.95fr,1.05fr] gap-10 items-start">
            <div className="rounded-3xl border border-black/5 bg-[#F3EFE8] p-8">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                How to prepare
              </p>
              <h2 className="mt-2 text-2xl font-light font-display">
                Get the best recommendation.
              </h2>
              <ul className="mt-5 space-y-2 text-sm text-neutral-800 list-disc list-inside">
                <li>Know your preferred length range (or share your height).</li>
                <li>Share your daily styling habits (heat / no heat).</li>
                <li>Tell us if you want “natural” or “full glam” density.</li>
                <li>Note your timeline (event date, travel, photoshoot).</li>
              </ul>

              <div className="mt-7 rounded-3xl bg-white border border-black/5 p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Prefer custom?
                </p>
                <p className="mt-2 text-sm text-neutral-700">
                  If you already have a reference look, you can also start a custom request.
                </p>
                <Link
                  to="/custom-orders"
                  className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                >
                  Custom orders
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500 text-center">
                Request a consult
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-light font-display text-center">
                Tell us where you’re going — we’ll dress your hair for it.
              </h2>

              <form
                onSubmit={onSubmit}
                className="mt-8 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm"
              >
                {/* honeypot */}
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update("website")}
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-600">Full name *</label>
                    <input
                      className={inputBase}
                      value={form.fullName}
                      onChange={update("fullName")}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Email *</label>
                    <input
                      className={inputBase}
                      value={form.email}
                      onChange={update("email")}
                      type="email"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Phone</label>
                    <input
                      className={inputBase}
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="(optional)"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Location</label>
                    <input
                      className={inputBase}
                      value={form.location}
                      onChange={update("location")}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-neutral-600">I’m shopping for</label>
                    <select className={inputBase} value={form.interest} onChange={update("interest")}>
                      {[
                        "Wigs",
                        "Bundles",
                        "Custom order",
                        "Not sure yet",
                      ].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Timeline</label>
                    <input
                      className={inputBase}
                      value={form.timeline}
                      onChange={update("timeline")}
                      placeholder="e.g., 2 weeks / for NYE"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Preferred contact</label>
                    <select
                      className={inputBase}
                      value={form.preferredContact}
                      onChange={update("preferredContact")}
                    >
                      {["Email", "Text", "Phone"].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs text-neutral-600">
                    Goals / desired look
                  </label>
                  <textarea
                    className={inputBase + " min-h-[120px]"}
                    value={form.goals}
                    onChange={update("goals")}
                    placeholder="Tell us what you want (texture, length, density vibe), how you style, and what matters most (melt, volume, longevity…)."
                  />
                </div>

                {status.state !== "idle" && (
                  <div
                    className={
                      "mt-6 rounded-2xl px-4 py-3 text-sm border " +
                      (status.state === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : status.state === "error"
                        ? "bg-red-50 border-red-200 text-red-900"
                        : "bg-neutral-50 border-black/10 text-neutral-700")
                    }
                  >
                    {status.message || (status.state === "loading" ? "Sending…" : "")}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={status.state === "loading"}
                    className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 disabled:opacity-60"
                  >
                    {status.state === "loading" ? "Sending…" : "Request consult"}
                  </button>
                  <Link
                    to="/collections"
                    className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                  >
                    Browse collections
                  </Link>
                </div>

                <p className="mt-5 text-xs text-neutral-500 leading-relaxed">
                  By submitting, you agree to be contacted by Eminence Hair Concierge. For policy details, review our{" "}
                  <Link className="underline" to="/terms">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link className="underline" to="/privacy">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
