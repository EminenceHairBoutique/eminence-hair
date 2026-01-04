// src/components/MedicalMatchmaker.jsx
// Lightweight "Wig Matchmaker" quiz for Medical Hair.

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, RefreshCcw } from "lucide-react";

import { products } from "../data/products";

const inputBase =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25";

function Pill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.22em] border transition " +
        (active
          ? "bg-black text-white border-black"
          : "border-black/10 bg-white/60 hover:bg-white")
      }
    >
      {children}
    </button>
  );
}

export default function MedicalMatchmaker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: "Natural everyday",
    sensitivity: "Sensitive scalp",
    texture: "Straight",
    lengthRange: "16–18",
    density: 150,
    adhesive: "Glueless / gentle",
    fullName: "",
    email: "",
    phone: "",
    notes: "",
    website: "", // honeypot
  });

  const steps = useMemo(
    () => [
      {
        title: "Your goal",
        body: "Choose the intent — we’ll recommend the right silhouette and realism level.",
        render: () => (
          <div className="flex flex-wrap gap-2">
            {["Natural everyday", "Photos / events", "Medical hair loss", "Not sure"].map((v) => (
              <Pill
                key={v}
                active={answers.goal === v}
                onClick={() => setAnswers((p) => ({ ...p, goal: v }))}
              >
                {v}
              </Pill>
            ))}
          </div>
        ),
      },
      {
        title: "Comfort level",
        body: "Medical Grade pieces are built comfort-first — tell us what you need.",
        render: () => (
          <div className="flex flex-wrap gap-2">
            {["Sensitive scalp", "Normal scalp", "Very sensitive / no friction"].map((v) => (
              <Pill
                key={v}
                active={answers.sensitivity === v}
                onClick={() => setAnswers((p) => ({ ...p, sensitivity: v }))}
              >
                {v}
              </Pill>
            ))}
          </div>
        ),
      },
      {
        title: "Texture",
        body: "Pick the movement you want to live in.",
        render: () => (
          <div className="flex flex-wrap gap-2">
            {["Straight", "BodyWave", "LooseWave", "DeepWave"].map((v) => (
              <Pill
                key={v}
                active={answers.texture === v}
                onClick={() => setAnswers((p) => ({ ...p, texture: v }))}
              >
                {v}
              </Pill>
            ))}
          </div>
        ),
      },
      {
        title: "Length",
        body: "We’ll start you with a balanced length range (you can always go longer).",
        render: () => (
          <div className="flex flex-wrap gap-2">
            {["12–14", "16–18", "20–22"].map((v) => (
              <Pill
                key={v}
                active={answers.lengthRange === v}
                onClick={() => setAnswers((p) => ({ ...p, lengthRange: v }))}
              >
                {v}
              </Pill>
            ))}
          </div>
        ),
      },
      {
        title: "Density",
        body: "For medical realism we usually recommend 150–180. You can choose fuller if you prefer.",
        render: () => (
          <div className="flex flex-wrap gap-2">
            {[150, 180, 210, 250].map((v) => (
              <Pill
                key={v}
                active={Number(answers.density) === Number(v)}
                onClick={() => setAnswers((p) => ({ ...p, density: v }))}
              >
                {v}%
              </Pill>
            ))}
          </div>
        ),
      },
      {
        title: "Install preference",
        body: "We can guide you either way — this helps us recommend lace + fit strategy.",
        render: () => (
          <div className="flex flex-wrap gap-2">
            {["Glueless / gentle", "Adhesive OK", "Not sure"].map((v) => (
              <Pill
                key={v}
                active={answers.adhesive === v}
                onClick={() => setAnswers((p) => ({ ...p, adhesive: v }))}
              >
                {v}
              </Pill>
            ))}
          </div>
        ),
      },
      {
        title: "Get your matches",
        body: "Add your contact so concierge can confirm cap sizing + the most natural option for your hairline.",
        render: () => (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neutral-600">Full name *</label>
              <input
                className={inputBase}
                value={answers.fullName}
                onChange={(e) => setAnswers((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600">Email *</label>
              <input
                className={inputBase}
                value={answers.email}
                onChange={(e) => setAnswers((p) => ({ ...p, email: e.target.value }))}
                type="email"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600">Phone (optional)</label>
              <input
                className={inputBase}
                value={answers.phone}
                onChange={(e) => setAnswers((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(optional)"
              />
            </div>
            <div className="hidden">
              {/* honeypot */}
              <input
                value={answers.website}
                onChange={(e) => setAnswers((p) => ({ ...p, website: e.target.value }))}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-neutral-600">Anything else we should know?</label>
              <textarea
                className={inputBase + " min-h-[110px]"}
                value={answers.notes}
                onChange={(e) => setAnswers((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Scalp sensitivity, timeline, inspiration, parting preference, cap size…"
              />
            </div>
          </div>
        ),
      },
    ],
    [answers]
  );

  const isLast = step === steps.length - 1;
  const canContinue = useMemo(() => {
    if (!isLast) return true;
    return String(answers.fullName || "").trim() && String(answers.email || "").trim();
  }, [answers.email, answers.fullName, isLast]);

  const matches = useMemo(() => {
    const texture = String(answers.texture || "");
    const medical = products.filter((p) => p?.type === "wig" && p?.isMedical);
    const filtered = medical.filter((p) => String(p.texture || "") === texture);
    const fallback = medical;
    return (filtered.length ? filtered : fallback).slice(0, 3);
  }, [answers.texture]);

  const shopLink = useMemo(() => {
    const texture = encodeURIComponent(String(answers.texture || ""));
    return `/shop?collection=medical&texture=${texture}`;
  }, [answers.texture]);

  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async () => {
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "medical_matchmaker",
          payload: {
            fullName: answers.fullName,
            email: answers.email,
            phone: answers.phone,
            goal: answers.goal,
            sensitivity: answers.sensitivity,
            texture: answers.texture,
            lengthRange: answers.lengthRange,
            density: answers.density,
            adhesive: answers.adhesive,
            notes: answers.notes,
            website: answers.website,
            recommended: matches.map((m) => m.displayName || m.name).join(" | "),
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Unable to send.");
      }

      setStatus({
        state: "success",
        message: "Submitted. Concierge will follow up with the closest match and next steps.",
      });
    } catch (e) {
      setStatus({ state: "error", message: e?.message || "Something went wrong." });
    }
  };

  return (
    <section className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-7 py-8 shadow-[0_18px_40px_rgba(15,10,5,0.14)]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Wig matchmaker</p>
          <h2 className="mt-2 text-2xl font-light">Find your Medical Grade silk top match.</h2>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            A quick, discreet quiz to point you to the right silhouette. We’ll confirm fit + cap details
            with you privately.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setStep(0);
            setAnswers((p) => ({
              ...p,
              goal: "Natural everyday",
              sensitivity: "Sensitive scalp",
              texture: "Straight",
              lengthRange: "16–18",
              density: 150,
              adhesive: "Glueless / gentle",
              fullName: "",
              email: "",
              phone: "",
              notes: "",
              website: "",
            }));
            setStatus({ state: "idle", message: "" });
          }}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 bg-white/60 hover:bg-white"
        >
          <RefreshCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1.05fr,0.95fr] gap-8 items-start">
        {/* Quiz */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
            Step {step + 1} of {steps.length}
          </p>
          <h3 className="mt-2 text-xl font-light">{steps[step].title}</h3>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{steps[step].body}</p>

          <div className="mt-6">{steps[step].render()}</div>

          {status.state !== "idle" && (
            <div
              className={
                "mt-6 rounded-2xl px-4 py-3 text-sm border " +
                (status.state === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : status.state === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-neutral-50 border-neutral-200 text-neutral-900")
              }
            >
              {status.message || (status.state === "loading" ? "Sending…" : "")}
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={
                "px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border transition " +
                (step === 0
                  ? "border-black/10 text-neutral-400 cursor-not-allowed"
                  : "border-black/15 hover:border-black/25")
              }
            >
              Back
            </button>

            {!isLast ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canContinue || status.state === "loading"}
                className={
                  "px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] transition " +
                  (canContinue && status.state !== "loading"
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed")
                }
              >
                Get my matches
              </button>
            )}

            <Link
              to="/video-consult"
              className="px-7 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/25 inline-flex items-center gap-2"
            >
              Book video consult <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Your matches</p>
          <h3 className="mt-2 text-xl font-light">Medical Grade silk top options.</h3>
          <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
            Based on your texture preference. You can adjust length + density on the product page.
          </p>

          <div className="mt-6 space-y-4">
            {matches.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-black/10 bg-white/60 p-4"
              >
                <p className="text-sm font-medium text-neutral-900">{m.displayName || m.name}</p>
                <p className="mt-1 text-sm text-neutral-700">
                  Silk Top • {m.texture} • Medical Grade
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                  <span>Recommended density: {answers.density}%</span>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/products/${m.slug}`}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <Link
              to={shopLink}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/25"
            >
              Shop all medical grade <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-neutral-500 leading-relaxed">
        This quiz is designed to guide your first choice. For medical hair loss, fit and comfort are
        deeply personal — concierge can help confirm cap size, scalp sensitivity considerations, and
        the most natural hairline strategy.
      </p>
    </section>
  );
}
