// src/pages/CustomOrders.jsx — Custom Orders (New, Upgraded)

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";

const inputBase =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25";

export default function CustomOrders() {
  const productTypes = useMemo(
    () => ["HD Lace Wig", "Closure Wig", "Bundles", "Closure/Frontal", "Color Service"],
    []
  );

  const textures = useMemo(
    () => [
      "Straight",
      "Body Wave",
      "Loose Wave",
      "Water Wave",
      "Deep Wave",
      "Curly",
    ],
    []
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    productType: "HD Lace Wig",
    collection: "SEA",
    texture: "Body Wave",
    length: "",
    density: "",
    lace: "HD Lace",
    capSize: "Medium",
    parting: "Middle",
    color: "Natural (1B)",
    deadline: "",
    budget: "",
    notes: "",
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
        body: JSON.stringify({ type: "custom_order", payload: form }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Unable to send request.");
      }

      setStatus({
        state: "success",
        message:
          "Request received. Our concierge will email you shortly with next steps.",
      });
      setForm((p) => ({ ...p, notes: "", budget: "" }));
    } catch (err) {
      setStatus({
        state: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          eyebrow="Custom Orders"
          title="Couture, tailored to you."
          subtitle="Send a reference, choose your details, and let our atelier craft a piece that fits your lifestyle — and your camera roll."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_07.webp"
          ctas={[
            { label: "Private Consult", href: "/private-consult", variant: "ghost" },
            { label: "Shop Ready-to-Ship", href: "/shop", variant: "primary" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* What we can do */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Lace + fit",
                d: "HD or transparent lace, cap sizing, and construction guidance for a clean melt and secure wear.",
              },
              {
                t: "Density + silhouette",
                d: "From natural movement to full glamour — we balance density so it looks rich without feeling heavy.",
              },
              {
                t: "Color services",
                d: "Highlights, toning, and curated blondes — with a maintenance plan that protects longevity.",
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

          {/* Process */}
          <section className="mt-14 rounded-3xl border border-black/5 bg-[#F3EFE8] p-8 md:p-10">
            <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-10 items-start">
              <div>
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                  The process
                </p>
                <h2 className="mt-2 text-2xl font-light font-display">
                  Clear steps. Elevated results.
                </h2>
                <p className="mt-3 text-sm text-neutral-800 leading-relaxed">
                  Inspired by luxury atelier workflows: we confirm details first, then craft — so your final piece matches the vision.
                </p>

                <ol className="mt-6 space-y-3 text-sm text-neutral-800 list-decimal list-inside">
                  <li>Submit your request (details + inspo notes).</li>
                  <li>Concierge reviews and confirms what’s achievable.</li>
                  <li>We provide a quote + timeline (and recommend a consult if needed).</li>
                  <li>Production begins after confirmation.</li>
                  <li>QC inspection + discreet luxury packaging.</li>
                </ol>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Important notes
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700 list-disc list-inside">
                  <li>
                    Custom/made‑to‑order services are <strong>final sale</strong>.
                  </li>
                  <li>
                    Lead times vary by service (texture availability, color complexity, and QC).
                  </li>
                  <li>
                    If you need help choosing, start with a <Link to="/private-consult" className="underline">private consult</Link>.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="mt-14">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                Submit a request
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-light font-display">
                Tell us what you want — we’ll translate it.
              </h2>
              <p className="mt-4 text-sm text-neutral-700">
                Share the essentials below. Concierge will email you with questions, confirmation, and next steps.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="mt-10 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm"
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
                    placeholder="you@email.com"
                    type="email"
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

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Product type</label>
                  <select className={inputBase} value={form.productType} onChange={update("productType")}
                  >
                    {productTypes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Collection</label>
                  <select className={inputBase} value={form.collection} onChange={update("collection")}
                  >
                    {["SEA", "Burmese", "Eminence", "Lavish", "Straight", "613"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Texture</label>
                  <select className={inputBase} value={form.texture} onChange={update("texture")}
                  >
                    {textures.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Length (inches)</label>
                  <input
                    className={inputBase}
                    value={form.length}
                    onChange={update("length")}
                    placeholder='e.g., 22'
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Density (%)</label>
                  <input
                    className={inputBase}
                    value={form.density}
                    onChange={update("density")}
                    placeholder='e.g., 180 or 250'
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Lace</label>
                  <select className={inputBase} value={form.lace} onChange={update("lace")}
                  >
                    {["HD Lace", "Transparent Lace"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Cap size</label>
                  <select className={inputBase} value={form.capSize} onChange={update("capSize")}
                  >
                    {["Small", "Medium", "Large"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Parting</label>
                  <select className={inputBase} value={form.parting} onChange={update("parting")}
                  >
                    {["Middle", "Left", "Right", "Free Part"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Color</label>
                  <select className={inputBase} value={form.color} onChange={update("color")}
                  >
                    {[
                      "Natural (1B)",
                      "Natural Brown",
                      "613 Blonde",
                      "Custom Color (describe below)",
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Needed by</label>
                  <input
                    className={inputBase}
                    value={form.deadline}
                    onChange={update("deadline")}
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Budget range</label>
                  <input
                    className={inputBase}
                    value={form.budget}
                    onChange={update("budget")}
                    placeholder="(optional)"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-neutral-600">
                  Notes / reference description
                </label>
                <textarea
                  className={inputBase + " min-h-[120px]"}
                  value={form.notes}
                  onChange={update("notes")}
                  placeholder="Describe your desired look, color placement, lace preference, and anything we should know."
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Tip: If you have a photo reference, mention where it’s posted (IG handle + screenshot name) and concierge will reply with the best way to share it.
                </p>
              </div>

              {/* status */}
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
                  {status.state === "loading" ? "Sending…" : "Submit request"}
                </button>

                <Link
                  to="/care"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                >
                  Read care guide
                </Link>
              </div>

              <p className="mt-5 text-xs text-neutral-500 leading-relaxed">
                By submitting, you agree to be contacted by Eminence Hair Concierge regarding your request. For policy details, review our <Link className="underline" to="/terms">Terms</Link> and <Link className="underline" to="/privacy">Privacy Policy</Link>.
              </p>
            </form>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
