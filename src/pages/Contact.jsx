// src/pages/Contact.jsx — Client Services Hub

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, HelpCircle, MessageSquare, Package, Sparkles } from "lucide-react";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import { BRAND } from "../config/brand";

const inputBase =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25 transition";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  orderNumber: "",
  preferredContact: "",
  reason: "",
  message: "",
  website: "", // honeypot
};

const FAQ_PREVIEW = [
  {
    id: "faq-ship",
    q: "When will my order ship?",
    a: "Most ready-to-ship orders are processed within 2–3 business days. Custom and made-to-order pieces require additional production time. You will receive a tracking notification once your order has dispatched.",
  },
  {
    id: "faq-return",
    q: "What is your return policy?",
    a: "Due to the hygienic nature of hair products, all sales are final unless your order arrives damaged, defective, or incorrect. Please contact us within 48 hours of delivery with clear photos and your order number.",
  },
  {
    id: "faq-density",
    q: "I'm not sure which texture or density is right for me.",
    a: "Our concierge team is here to help. Send us a message below or request a private consultation — we'll guide you through origin, texture, density, and lace based on your lifestyle and desired look.",
  },
  {
    id: "faq-change",
    q: "Can I change or cancel my order after checkout?",
    a: "Order processing begins immediately. If you need to make changes, please contact us as soon as possible. We will do our best to assist, though modifications cannot be guaranteed once production or packing has begun.",
  },
  {
    id: "faq-custom",
    q: "Do you offer custom wigs or color services?",
    a: "Yes. We offer custom orders including lace options, density preferences, and curated color services. Visit our Custom Atelier to begin your request.",
  },
];

function FaqAccordion({ id, q, a, open, onToggle }) {
  return (
    <div className="border-b border-black/5 last:border-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
        aria-controls={`faq-answer-${id}`}
      >
        <span className="text-sm text-neutral-900">{q}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`faq-answer-${id}`}
        role="region"
        hidden={!open}
        className="pb-4 text-sm text-neutral-600 leading-relaxed"
      >
        {a}
      </div>
    </div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [openFaqs, setOpenFaqs] = useState(() => new Set());

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const toggleFaq = (id) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      if (!fullName || !form.email || !form.reason || !form.message) {
        throw new Error("Please fill in all required fields.");
      }

      const payload = {
        fullName,
        email: form.email,
        phone: form.phone,
        orderNumber: form.orderNumber,
        preferredContact: form.preferredContact,
        reason: form.reason,
        message: form.message,
        website: form.website,
      };

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", payload }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Unable to send your message. Please try again.");
      }

      setSubmitted(true);
      setStatus({ state: "idle", message: "" });
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
        title="Client Services — Order Assistance, Product Guidance & Support"
        description="Contact Eminence Hair for order assistance, product guidance, returns, shipping questions, and personalized consultation. Our team responds within 24 hours."
      />
      <PageTransition>
        <div className="bg-[#F9F7F4] text-[#111]">

          {/* ── HERO ──────────────────────────────────────────────────────── */}
          <PageHero
            eyebrow="Client Services"
            title="How can we assist you today?"
            subtitle="We're here to help with orders, product guidance, and personalized support. For questions regarding shipping, returns, consultations, or product selection, our team would be happy to assist."
            image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp"
            ctas={[
              { label: "Send a Message", href: "/contact#contact-form", variant: "primary" },
              { label: "Browse FAQs", href: "/faqs", variant: "ghost" },
            ]}
          />

          <div className="max-w-6xl mx-auto px-6 py-14 space-y-20">

            {/* ── SERVICES GRID ─────────────────────────────────────────── */}
            <section aria-label="Service areas">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500 mb-6">
                How we can help
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: <Package className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />,
                    title: "Order Assistance",
                    desc: "Track your order, manage returns, and get shipping updates.",
                    href: "#order-assistance",
                    cta: "Order help",
                  },
                  {
                    icon: <Sparkles className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />,
                    title: "Product Guidance",
                    desc: "Expert guidance on texture, density, lace, and custom selection.",
                    href: "#product-guidance",
                    cta: "Get guidance",
                  },
                  {
                    icon: <MessageSquare className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />,
                    title: "Send a Message",
                    desc: "Reach our concierge team directly. We respond within 24 hours.",
                    href: "#contact-form",
                    cta: "Contact us",
                  },
                  {
                    icon: <HelpCircle className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />,
                    title: "FAQs",
                    desc: "Quick answers to our most common shipping, care, and policy questions.",
                    href: "/faqs",
                    cta: "Browse FAQs",
                  },
                ].map((card) => (
                  <a
                    key={card.title}
                    href={card.href}
                    className="group rounded-3xl border border-black/5 bg-white p-6 shadow-sm hover:shadow-md hover:border-black/10 transition block"
                  >
                    <div className="mb-4">{card.icon}</div>
                    <p className="text-sm font-medium text-neutral-900 mb-1">{card.title}</p>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">{card.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-neutral-700 group-hover:text-neutral-900 transition">
                      {card.cta} <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* ── ORDER ASSISTANCE ──────────────────────────────────────── */}
            <section id="order-assistance" aria-labelledby="order-assistance-heading">
              <div className="flex items-baseline gap-6 mb-6">
                <h2
                  id="order-assistance-heading"
                  className="text-2xl font-light font-display text-neutral-900 whitespace-nowrap"
                >
                  Order Assistance
                </h2>
                <div className="h-px flex-1 bg-black/8" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Order Tracking",
                    desc: "Once your order ships, you'll receive a tracking notification by email. Carrier scans can take 24–48 hours to appear after dispatch.",
                  },
                  {
                    title: "Shipping Information",
                    desc: "Most ready-to-ship orders dispatch within 2–3 business days. International orders may be subject to customs duties, which are the customer's responsibility.",
                  },
                  {
                    title: "Returns & Exchanges",
                    desc: "All sales are final due to the hygienic nature of our products. If your order arrives damaged or incorrect, contact us within 48 hours of delivery.",
                    link: { label: "View full policy", href: "/returns" },
                  },
                  {
                    title: "Order Changes",
                    desc: "Order processing begins immediately. Contact us as soon as possible if you need to modify or cancel — we will do everything we can to help.",
                  },
                  {
                    title: "Custom & Made-to-Order",
                    desc: "Custom pieces require additional production time. Timeline and specifications are confirmed at the time of your order.",
                    link: { label: "Custom Atelier", href: "/custom-atelier" },
                  },
                  {
                    title: "Payment & Installments",
                    desc: "Installment options may be available at checkout depending on your region and payment provider.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-black/5 bg-white p-6"
                  >
                    <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-500 mb-2">
                      {item.title}
                    </p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{item.desc}</p>
                    {item.link && (
                      <Link
                        to={item.link.href}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-neutral-700 hover:text-neutral-900 transition"
                      >
                        {item.link.label}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── PRODUCT GUIDANCE ──────────────────────────────────────── */}
            <section id="product-guidance" aria-labelledby="product-guidance-heading">
              <div className="flex items-baseline gap-6 mb-6">
                <h2
                  id="product-guidance-heading"
                  className="text-2xl font-light font-display text-neutral-900 whitespace-nowrap"
                >
                  Product Guidance
                </h2>
                <div className="h-px flex-1 bg-black/8" />
              </div>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="rounded-3xl bg-[#F3EFE8] border border-black/5 p-8">
                  <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                    Personalized guidance
                  </p>
                  <h3 className="mt-2 text-xl font-light font-display text-neutral-900">
                    Not sure where to begin?
                  </h3>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                    Choosing the right hair takes more than browsing. Our concierge team is here to
                    help you navigate texture, density, lace options, and cap fit — based on your
                    lifestyle, not just your preference.
                  </p>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                    Whether you're looking for everyday wear, a special event, or a medical-grade
                    solution, we'd be happy to guide your selection.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/private-consult"
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 transition"
                    >
                      Private Consultation
                    </Link>
                    <Link
                      to="/start-here"
                      className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30 transition"
                    >
                      Start Here
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Texture",
                      desc: "Straight, body wave, loose wave, deep wave — we'll help you match texture to your routine and climate.",
                    },
                    {
                      label: "Length & Cap Fit",
                      desc: "From 14\" to 30\"+, cap sizing, and adjustment band guidance. Comfortable wear starts with the right fit.",
                    },
                    {
                      label: "Density",
                      desc: "150% or 200%? Natural or full glam? Density affects both the look and the install complexity.",
                    },
                    {
                      label: "Lace Type",
                      desc: "HD lace melts seamlessly. Transparent lace offers durability. We'll help you choose based on your skin tone and install preference.",
                    },
                    {
                      label: "Customization",
                      desc: "Custom density, color, lace tinting, and baby hairs. Our atelier handles bespoke requests with care.",
                    },
                    {
                      label: "Special Needs",
                      desc: "Medical hair, sensitive scalp, alopecia support — discreet, dignified, and thoughtfully guided.",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-black/5 bg-white p-5"
                    >
                      <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-500 mb-2">
                        {item.label}
                      </p>
                      <p className="text-xs text-neutral-700 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── CONTACT FORM ──────────────────────────────────────────── */}
            <section id="contact-form" aria-labelledby="contact-form-heading">
              <div className="flex items-baseline gap-6 mb-6">
                <h2
                  id="contact-form-heading"
                  className="text-2xl font-light font-display text-neutral-900 whitespace-nowrap"
                >
                  Send a Message
                </h2>
                <div className="h-px flex-1 bg-black/8" />
              </div>

              <div className="grid lg:grid-cols-[0.85fr,1.15fr] gap-10 items-start">
                {/* Left: contact info */}
                <div className="space-y-6">
                  <div>
                    <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                      Response time
                    </p>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                      Our team will respond within 24 hours. For urgent order changes, please reply
                      directly to your order confirmation email.
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                      Email
                    </p>
                    <a
                      href={`mailto:${BRAND.supportEmail}`}
                      className="mt-1 block text-sm text-neutral-900 hover:text-neutral-700 transition"
                    >
                      {BRAND.supportEmail}
                    </a>
                  </div>
                  <div className="rounded-3xl bg-[#F3EFE8] border border-black/5 p-6">
                    <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                      Prefer a consultation?
                    </p>
                    <p className="mt-2 text-sm text-neutral-800 leading-relaxed">
                      For personalized product guidance or a custom order, our Private Consultation
                      is the best starting point.
                    </p>
                    <Link
                      to="/private-consult"
                      className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-700 hover:text-neutral-900 transition"
                    >
                      Book a Private Consult
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Right: form */}
                <div className="bg-white rounded-3xl border border-black/5 shadow-sm px-6 py-7 md:px-8 md:py-8">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                      {/* honeypot */}
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={update("website")}
                        className="hidden"
                        aria-hidden="true"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cs-firstName"
                            className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                          >
                            First Name <span aria-hidden="true">*</span>
                          </label>
                          <input
                            id="cs-firstName"
                            type="text"
                            required
                            value={form.firstName}
                            onChange={update("firstName")}
                            autoComplete="given-name"
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cs-lastName"
                            className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                          >
                            Last Name <span aria-hidden="true">*</span>
                          </label>
                          <input
                            id="cs-lastName"
                            type="text"
                            required
                            value={form.lastName}
                            onChange={update("lastName")}
                            autoComplete="family-name"
                            className={inputBase}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="cs-email"
                          className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                        >
                          Email <span aria-hidden="true">*</span>
                        </label>
                        <input
                          id="cs-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={update("email")}
                          autoComplete="email"
                          className={inputBase}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cs-phone"
                            className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                          >
                            Phone{" "}
                            <span className="text-neutral-400 normal-case tracking-normal">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="cs-phone"
                            type="tel"
                            value={form.phone}
                            onChange={update("phone")}
                            autoComplete="tel"
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cs-orderNumber"
                            className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                          >
                            Order Number{" "}
                            <span className="text-neutral-400 normal-case tracking-normal">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="cs-orderNumber"
                            type="text"
                            value={form.orderNumber}
                            onChange={update("orderNumber")}
                            className={inputBase}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cs-reason"
                            className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                          >
                            Subject <span aria-hidden="true">*</span>
                          </label>
                          <select
                            id="cs-reason"
                            value={form.reason}
                            onChange={update("reason")}
                            required
                            className={inputBase}
                          >
                            <option value="" disabled>
                              Select a subject
                            </option>
                            <option value="order">Order Assistance</option>
                            <option value="returns">Returns &amp; Exchanges</option>
                            <option value="product">Product Guidance</option>
                            <option value="custom">Custom Order</option>
                            <option value="consultation">Private Consultation</option>
                            <option value="wholesale">Wholesale &amp; Partnerships</option>
                            <option value="general">General Inquiry</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="cs-preferredContact"
                            className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                          >
                            Preferred Contact{" "}
                            <span className="text-neutral-400 normal-case tracking-normal">
                              (optional)
                            </span>
                          </label>
                          <select
                            id="cs-preferredContact"
                            value={form.preferredContact}
                            onChange={update("preferredContact")}
                            className={inputBase}
                          >
                            <option value="">No preference</option>
                            <option value="Email">Email</option>
                            <option value="Phone">Phone</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="cs-message"
                          className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1.5"
                        >
                          Message <span aria-hidden="true">*</span>
                        </label>
                        <textarea
                          id="cs-message"
                          rows={5}
                          required
                          value={form.message}
                          onChange={update("message")}
                          placeholder="Share any relevant details — order number, product of interest, or questions. We'd be happy to assist."
                          className={`${inputBase} min-h-[120px] resize-none`}
                        />
                      </div>

                      {status.state === "error" && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="rounded-2xl px-4 py-3 text-sm border bg-red-50 border-red-200 text-red-900"
                        >
                          {status.message}
                        </div>
                      )}
                      {status.state === "loading" && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="rounded-2xl px-4 py-3 text-sm border bg-neutral-50 border-black/10 text-neutral-700"
                        >
                          Sending your message…
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status.state === "loading"}
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-8 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 disabled:opacity-60 transition"
                      >
                        {status.state === "loading" ? "Sending…" : "Send Message"}
                      </button>
                    </form>
                  ) : (
                    <div className="py-4 space-y-4">
                      <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                        Message received
                      </p>
                      <h3 className="text-2xl font-light font-display text-neutral-900">
                        Thank you for reaching out.
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                        Our team has received your message and will respond within 24 hours. For
                        urgent order changes, please reply directly to your order confirmation email.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm(EMPTY_FORM);
                        }}
                        className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] border border-black/15 hover:border-black/30 transition"
                      >
                        Send another message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── FAQ PREVIEW ───────────────────────────────────────────── */}
            <section aria-labelledby="faq-preview-heading">
              <div className="flex items-baseline gap-6 mb-6">
                <h2
                  id="faq-preview-heading"
                  className="text-2xl font-light font-display text-neutral-900 whitespace-nowrap"
                >
                  Frequently Asked Questions
                </h2>
                <div className="h-px flex-1 bg-black/8" />
              </div>
              <div className="grid lg:grid-cols-[1fr,auto] gap-8 items-start">
                <div className="bg-white rounded-3xl border border-black/5 shadow-sm divide-y divide-black/5 px-6 py-2">
                  {FAQ_PREVIEW.map((item) => (
                    <FaqAccordion
                      key={item.id}
                      id={item.id}
                      q={item.q}
                      a={item.a}
                      open={openFaqs.has(item.id)}
                      onToggle={toggleFaq}
                    />
                  ))}
                </div>
                <div className="lg:w-72 rounded-3xl border border-black/5 bg-[#F3EFE8] p-6">
                  <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                    More answers
                  </p>
                  <p className="mt-2 text-sm text-neutral-800 leading-relaxed">
                    Visit our full FAQ page for complete shipping, care, installation, and custom
                    order guidance.
                  </p>
                  <Link
                    to="/faqs"
                    className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-neutral-700 hover:text-neutral-900 transition"
                  >
                    Browse all FAQs
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            {/* ── PERSONALIZED SERVICES CROSS-LINKS ─────────────────────── */}
            <section aria-labelledby="services-crosslink-heading">
              <div className="flex items-baseline gap-6 mb-6">
                <h2
                  id="services-crosslink-heading"
                  className="text-2xl font-light font-display text-neutral-900 whitespace-nowrap"
                >
                  Personalized Services
                </h2>
                <div className="h-px flex-1 bg-black/8" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Private Consultation",
                    desc: "One-on-one guidance on texture, density, lace, and styling — tailored to your lifestyle and goals.",
                    href: "/private-consult",
                    cta: "Request a Consult",
                  },
                  {
                    title: "Custom Atelier",
                    desc: "Bespoke wig design, custom density, color services, and made-to-order creations from our atelier.",
                    href: "/custom-atelier",
                    cta: "Start a Custom Order",
                  },
                  {
                    title: "Medical Hair",
                    desc: "Discreet, compassionate guidance for medical-grade hair solutions and alopecia support.",
                    href: "/medical-hair",
                    cta: "Learn More",
                  },
                  {
                    title: "Book a Consultation",
                    desc: "Schedule a video consultation to confirm fit, density, lace, and shipping timeline.",
                    href: "/consultation",
                    cta: "Book Now",
                  },
                ].map((service) => (
                  <div
                    key={service.title}
                    className="rounded-3xl border border-black/5 bg-white p-6 flex flex-col"
                  >
                    <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-500 mb-2">
                      {service.title}
                    </p>
                    <p className="text-sm text-neutral-700 leading-relaxed flex-1">
                      {service.desc}
                    </p>
                    <Link
                      to={service.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-neutral-700 hover:text-neutral-900 transition"
                    >
                      {service.cta}
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </PageTransition>
    </>
  );
}
