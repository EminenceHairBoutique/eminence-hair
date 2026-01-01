import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  FileText,
  Receipt,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

import SEO from "../components/SEO";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-neutral-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm tracking-wide text-neutral-900">{title}</span>
        <span className="text-xs text-neutral-500">{open ? "—" : "+"}</span>
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-neutral-600">{children}</div>
      )}
    </div>
  );
}

function Step({ n, title, body }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-6 py-6 shadow-[0_18px_40px_rgba(15,10,5,0.14)]">
      <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Step {n}</p>
      <p className="mt-2 text-lg font-light text-neutral-900">{title}</p>
      <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{body}</p>
    </div>
  );
}

export default function MedicalHair() {
  const [copied, setCopied] = useState(false);

  const checklist = useMemo(
    () => [
      "A Letter of Medical Necessity (LMN) or prescription from a licensed healthcare provider",
      "An itemized invoice/receipt from Eminence Hair (keep a copy for your records)",
      "Terminology your plan prefers (often “cranial prosthesis” rather than “wig”)",
      "Any claim form required by your plan administrator or insurer",
      "A billing code if your insurer requests one (ask your plan which code to use)",
    ],
    []
  );

  const copyTerm = async () => {
    try {
      await navigator.clipboard.writeText("cranial prosthesis");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <>
      <SEO
        title="Medical Hair Concierge | HSA/FSA & Insurance Guidance"
        description="Luxury medical hair solutions for alopecia and cancer-related hair loss with guidance on HSA/FSA and insurance reimbursement."
      />

      <div className="pt-28 pb-24 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {/* HERO */}
          <section className="grid md:grid-cols-[1.3fr,1fr] gap-8 items-center rounded-3xl border border-white/60 bg-gradient-to-r from-[#F6ECE1] via-[#F9F7F4] to-[#F4EBDF] shadow-[0_22px_50px_rgba(17,12,5,0.20)] px-6 md:px-10 py-10 overflow-hidden">
            <div className="space-y-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-600">
                <Sparkles className="w-4 h-4" /> Eminence Hair Concierge
              </p>

              <h1 className="text-3xl md:text-4xl font-light tracking-wide max-w-xl">
                Medical Hair — without the medical vibe.
              </h1>

              <p className="text-sm text-neutral-700 max-w-xl leading-relaxed">
                Hair loss can be deeply personal — whether it’s alopecia, cancer-related hair loss, or another
                health journey. Eminence is a luxury experience first: refined pieces, discreet guidance, and
                a clear path to using <span className="font-medium text-neutral-900">HSA/FSA</span> or
                seeking <span className="font-medium text-neutral-900">insurance reimbursement</span> where eligible.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/shop/wigs"
                  className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition inline-flex items-center gap-2"
                >
                  Shop Wigs <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/private-consult"
                  className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                >
                  Book Private Consult
                </Link>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Note: Coverage and eligibility vary by plan. We can’t guarantee reimbursement, but we can help
                you prepare what many plans typically request.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: <CreditCard className="w-5 h-5" />,
                  title: "HSA / FSA",
                  body:
                    "Many plans allow reimbursement for a medically necessary wig with the right documentation.",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: "Insurance (Cranial Prosthesis)",
                  body:
                    "Some policies include a cranial prosthesis benefit for medical hair loss — your plan can confirm what’s covered.",
                },
                {
                  icon: <FileText className="w-5 h-5" />,
                  title: "Documentation Support",
                  body:
                    "We can provide purchase documentation suitable for reimbursement upon request.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-6 py-6 shadow-[0_18px_40px_rgba(15,10,5,0.14)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-black/5 border border-black/10">
                      {c.icon}
                    </span>
                    <p className="text-sm font-medium">{c.title}</p>
                  </div>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT PATHS */}
          <section className="grid lg:grid-cols-3 gap-6">
            {[
              {
                icon: <CreditCard className="w-5 h-5" />,
                title: "Pay with HSA",
                body:
                  "If your plan allows it, you may be able to use your HSA card at checkout or submit for reimbursement with receipts and an LMN/prescription.",
                bullets: ["Save receipts", "Keep product details", "Confirm required docs with your plan"],
              },
              {
                icon: <Receipt className="w-5 h-5" />,
                title: "Pay with FSA",
                body:
                  "Many FSAs require a Letter of Medical Necessity. If your card doesn’t work online, you can often pay normally and then file for reimbursement.",
                bullets: ["LMN commonly required", "Submit itemized receipt", "Check year-end deadlines"],
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                title: "Insurance reimbursement",
                body:
                  "Some insurers reimburse a wig under the term “cranial prosthesis.” Your plan will tell you what wording and codes they require on your invoice.",
                bullets: ["Ask about “cranial prosthesis” coverage", "Request needed invoice details", "Submit your claim + follow up"],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-6 py-6 shadow-[0_18px_40px_rgba(15,10,5,0.14)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-black/5 border border-black/10">
                    {card.icon}
                  </span>
                  <p className="text-sm font-medium">{card.title}</p>
                </div>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{card.body}</p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-neutral-900" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* HOW IT WORKS */}
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">How it works</p>
                <h2 className="text-2xl font-light">A simple, discreet process.</h2>
              </div>

              <Link
                to="/contact"
                className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700 hover:text-neutral-900"
              >
                Questions? Contact us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Step
                n="1"
                title="Choose your piece"
                body="Browse online or book a private consult for guidance on lace, fit, density, and a natural hairline."
              />
              <Step
                n="2"
                title="Confirm your plan’s requirements"
                body="Ask your plan administrator what documentation is required for reimbursement, and what wording they prefer on receipts."
              />
              <Step
                n="3"
                title="Checkout + keep documentation"
                body="Complete your purchase, save your itemized receipt, and submit your paperwork according to your plan’s process."
              />
            </div>
          </section>

          {/* LANGUAGE THAT MATTERS */}
          <section className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-7 py-8 shadow-[0_18px_40px_rgba(15,10,5,0.14)]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-neutral-500">
                  <HelpCircle className="w-4 h-4" /> Language tip
                </p>
                <h3 className="mt-2 text-2xl font-light">Some plans treat “wig” as cosmetic.</h3>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                  When you call your insurer or plan administrator, ask about coverage for a{" "}
                  <span className="font-medium text-neutral-900">cranial prosthesis</span>. If they require a
                  prescription/LMN, they’ll tell you what exact terminology to include.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={copyTerm}
                  className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
                >
                  {copied ? "Copied" : "Copy “cranial prosthesis”"}
                </button>
                <Link
                  to="/contact"
                  className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition text-center"
                >
                  Request documentation help
                </Link>
              </div>
            </div>
          </section>

          {/* CHECKLIST */}
          <section className="grid lg:grid-cols-[1fr,1.1fr] gap-8 items-start">
            <div className="space-y-3">
              <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">What you may need</p>
              <h2 className="text-2xl font-light">Reimbursement checklist.</h2>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Requirements vary, but these are commonly requested items. Always confirm with your plan
                administrator before you submit.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/returns"
                  className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                >
                  Returns Policy
                </Link>
                <Link
                  to="/care"
                  className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                >
                  Care Guide
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur p-7 shadow-[0_18px_40px_rgba(15,10,5,0.14)]">
              <ul className="space-y-3 text-sm text-neutral-700">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-neutral-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-xs text-neutral-500 leading-relaxed">
                Important: This page is for general information only and isn’t tax, legal, or insurance advice.
                Your plan administrator is the best source for eligibility and documentation requirements.
              </p>
            </div>
          </section>

          {/* ALOPECIA + CANCER SECTION (luxury tone) */}
          <section className="rounded-3xl border border-white/60 bg-gradient-to-r from-[#F6ECE1] via-[#F9F7F4] to-[#F4EBDF] px-7 py-8 shadow-[0_22px_50px_rgba(17,12,5,0.14)]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-2">
              Designed for sensitive seasons
            </p>
            <h2 className="text-2xl font-light">Alopecia & cancer-related hair loss</h2>
            <p className="mt-3 text-sm text-neutral-700 leading-relaxed max-w-3xl">
              If you’re choosing hair for alopecia or cancer-related hair loss, comfort and realism matter —
              and so does privacy. We focus on breathable construction, soft lace, balanced density, and clean finishing
              so you can feel secure in your appearance, quietly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/shop?collection=eminence-essentials"
                className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
              >
                Shop Essentials
              </Link>
              <Link
                to="/custom-orders"
                className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
              >
                Custom Orders
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur px-7 py-8 shadow-[0_18px_40px_rgba(15,10,5,0.14)]">
            <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500 mb-2">FAQ</p>
            <h2 className="text-2xl font-light mb-2">Quick answers.</h2>

            <div className="mt-6">
              <Accordion title="Can I use my HSA/FSA card online?">
                Many HSA/FSA cards work like a debit card and can be used at checkout. Some plans prefer
                reimbursement instead. If your card is declined, you can still often pay normally and submit
                your documentation to your plan administrator.
              </Accordion>

              <Accordion title="Will you provide an itemized receipt or invoice?">
                Yes — we can provide purchase documentation suitable for reimbursement upon request. If your
                plan requires specific wording, tell us what they need and we’ll do our best to align.
              </Accordion>

              <Accordion title="Do you guarantee reimbursement?">
                We can’t guarantee reimbursement because coverage varies by plan. We recommend calling your
                insurer or plan administrator before purchase to confirm eligibility and required documentation.
              </Accordion>

              <Accordion title="What should I ask my insurance company?">
                Ask whether your plan covers a <span className="text-neutral-900 font-medium">cranial prosthesis</span>,
                what percentage is reimbursed, what wording is required on a prescription/LMN, and what details
                they need on the receipt (such as a billing code).
              </Accordion>

              <Accordion title="Where do I start if I’m not sure which wig to choose?">
                Book a private consult. We’ll help you select lace, cap size, density, and length for a natural hairline
                and a comfortable, secure fit.
              </Accordion>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="text-center pt-2">
            <p className="text-sm text-neutral-700 max-w-2xl mx-auto">
              Luxury should feel effortless — even when you’re navigating logistics.
              If you need help choosing or preparing documentation, we’re here.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/private-consult"
                className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 bg-neutral-900 text-[#F9F7F4] hover:bg-transparent hover:text-neutral-900 transition"
              >
                Book Private Consult
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
              >
                Contact Eminence
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
