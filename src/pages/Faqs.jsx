// src/pages/Faqs.jsx — FAQs (Upgraded)

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

function normalize(s = "") {
  return String(s).toLowerCase().trim();
}

function FaqItem({ id, q, a, open, onToggle }) {
  return (
    <div className="border border-black/5 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm md:text-[15px] text-neutral-900">{q}</span>
        <ChevronDown
          className={
            "h-4 w-4 text-neutral-600 transition-transform " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <div className="px-5 pb-5 text-sm text-neutral-700 leading-relaxed">
          {typeof a === "string" ? <p>{a}</p> : a}
        </div>
      )}
    </div>
  );
}

export default function Faqs() {
  const categories = useMemo(
    () => [
      {
        id: "ordering",
        label: "Ordering",
        items: [
          {
            q: "When will my order ship?",
            a: (
              <div className="space-y-3">
                <p>
                  Most ready‑to‑ship orders are processed within <strong>2–3 business days</strong>.
                  Made‑to‑order or custom work may require additional production time.
                </p>
                <p>
                  Shipping timelines are estimates only and can be impacted by carrier delays,
                  customs, weather, and peak seasons.
                </p>
              </div>
            ),
          },
          {
            q: "Can I change or cancel my order after checkout?",
            a: "Order processing begins immediately. If you need help, contact support as soon as possible — we will do our best, but changes aren’t guaranteed once production or packing has started.",
          },
          {
            q: "Do you offer payment installments?",
            a: "Installment options may be available at checkout depending on your region and payment provider (e.g., Afterpay / Klarna / Shop Pay).",
          },
        ],
      },
      {
        id: "hair",
        label: "Hair & Quality",
        items: [
          {
            q: "What does “raw” mean at Eminence?",
            a: "Raw hair is minimally processed, cuticle‑aligned human hair. Expect natural variations (tone, wave pattern, and density) — those variations are part of what makes it real.",
          },
          {
            q: "Will my unit look exactly like the photos?",
            a: "Hair is a natural material. Color and texture can vary slightly by batch and lighting. Our images are reference for finish and vibe, not a guarantee of identical strands.",
          },
          {
            q: "What’s the difference between HD lace and transparent lace?",
            a: "HD lace is finer and designed to “melt” more easily on skin (especially under flash). Transparent lace is slightly more durable and can still look seamless with proper tint and install.",
          },
        ],
      },
      {
        id: "install",
        label: "Installation & Care",
        items: [
          {
            q: "Should I wash my hair before installing?",
            a: "Yes. We recommend a gentle co‑wash before first wear to remove storage residue and help the hair behave like your own.",
          },
          {
            q: "How often should I wash raw hair?",
            a: "Typically every 7–12 wears. If you use a lot of product or heat, wash a little more frequently and always deep condition.",
          },
          {
            q: "Do curly textures require different care?",
            a: "Yes. Detangle while damp, avoid brushing curls dry, and moisturize more often to maintain definition and prevent frizz.",
          },
        ],
      },
      {
        id: "shipping",
        label: "Shipping",
        items: [
          {
            q: "Do you ship internationally?",
            a: "International shipping availability depends on destination and carrier service. Please note that customs duties and import fees (if any) are the customer’s responsibility.",
          },
          {
            q: "My tracking hasn’t updated — what should I do?",
            a: "Carrier scans can take 24–48 hours to update, especially during peak seasons. If tracking is stalled for more than 72 hours, contact support with your order number.",
          },
        ],
      },
      {
        id: "returns",
        label: "Returns",
        items: [
          {
            q: "What is your return policy?",
            a: (
              <div className="space-y-3">
                <p>
                  Due to the hygienic nature of hair products, <strong>all sales are final</strong>.
                </p>
                <p>
                  If your order arrives damaged, defective, or incorrect, contact us within
                  <strong> 48 hours of delivery</strong> with photos and your order number.
                </p>
                <p>
                  For full details, visit our <Link className="underline" to="/returns">Returns &amp; Exchanges</Link> page.
                </p>
              </div>
            ),
          },
          {
            q: "Are custom items final sale?",
            a: "Yes. Custom/made‑to‑order, worn, altered, installed, colored, or lace‑cut items are final sale.",
          },
        ],
      },
      {
        id: "custom",
        label: "Custom",
        items: [
          {
            q: "Do you offer custom orders?",
            a: (
              <div className="space-y-3">
                <p>
                  Yes — we offer custom requests including lace options, density preferences,
                  and curated color services.
                </p>
                <p>
                  Start here: <Link className="underline" to="/custom-orders">Custom Orders</Link>.
                </p>
              </div>
            ),
          },
          {
            q: "Can you match a look from Instagram or a reference photo?",
            a: "Often, yes. Send your inspo and we’ll advise what’s achievable with your desired texture and maintenance level.",
          },
        ],
      },
      {
        id: "auth",
        label: "Authenticity",
        items: [
          {
            q: "How do I know my hair is authentic?",
            a: (
              <div className="space-y-3">
                <p>
                  Eminence pieces are supported by third‑party inspection and our internal QC.
                  Some items include a verification code on the product detail page.
                </p>
                <p>
                  Learn more on our <Link className="underline" to="/authenticity">Authenticity</Link> page.
                </p>
              </div>
            ),
          },
        ],
      },
    ],
    []
  );

  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = normalize(query);
    const byCategory =
      activeCategory === "all"
        ? categories
        : categories.filter((c) => c.id === activeCategory);

    if (!q) return byCategory;

    return byCategory
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (i) => normalize(i.q).includes(q) || normalize(typeof i.a === "string" ? i.a : "").includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [activeCategory, categories, query]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <SEO
        title="FAQs — Shipping, Returns, Hair Care & Custom Orders"
        description="Get answers about Eminence Hair shipping times, return policy, raw hair care, custom orders, medical wigs, and payment options including installments."
      />
      <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          compact
          eyebrow="Support"
          title="FAQs"
          subtitle="Quick answers, clear policies, and guidance that makes choosing your hair effortless. If you don’t see your question, concierge is one message away."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_09.webp"
          ctas={[{ label: "Contact", href: "/contact", variant: "primary" }]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* Search + category tabs */}
          <div className="bg-white border border-black/5 rounded-3xl p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div>
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Find an answer
                </p>
                <p className="mt-1 text-sm text-neutral-700">
                  Search or browse categories below.
                </p>
              </div>

              <div className="w-full md:max-w-md">
                <label className="sr-only" htmlFor="faq-search">
                  Search FAQs
                </label>
                <input
                  id="faq-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search: shipping, HD lace, returns…"
                  className="w-full rounded-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-black/30"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={
                  "text-[11px] uppercase tracking-[0.26em] px-4 py-2 rounded-full border transition " +
                  (activeCategory === "all"
                    ? "border-black/30 bg-black text-white"
                    : "border-black/10 hover:border-black/20")
                }
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  className={
                    "text-[11px] uppercase tracking-[0.26em] px-4 py-2 rounded-full border transition " +
                    (activeCategory === c.id
                      ? "border-black/30 bg-black text-white"
                      : "border-black/10 hover:border-black/20")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mt-10 space-y-10">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-neutral-700">No results found.</p>
                <p className="mt-2 text-xs text-neutral-500">
                  Try a different keyword or contact concierge.
                </p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                >
                  Contact
                </Link>
              </div>
            ) : (
              filtered.map((cat) => (
                <section key={cat.id} className="space-y-4">
                  <div className="flex items-baseline justify-between gap-6">
                    <h2 className="text-lg md:text-xl font-light font-display text-neutral-900">
                      {cat.label}
                    </h2>
                    <div className="h-px flex-1 bg-black/10" />
                  </div>

                  <div className="grid gap-3">
                    {cat.items.map((item, idx) => {
                      const id = `${cat.id}-${idx}`;
                      return (
                        <FaqItem
                          key={id}
                          id={id}
                          q={item.q}
                          a={item.a}
                          open={openIds.has(id)}
                          onToggle={toggle}
                        />
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-black/5 bg-white p-6">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                Still deciding?
              </p>
              <h3 className="mt-2 text-xl font-light font-display">
                Request a private consult.
              </h3>
              <p className="mt-2 text-sm text-neutral-700">
                We’ll help you pick the right texture, length, and lace based on your lifestyle and desired look.
              </p>
              <Link
                to="/private-consult"
                className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
              >
                Private consult
              </Link>
            </div>

            <div className="rounded-3xl border border-black/5 bg-[#F3EFE8] p-6">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                Custom work
              </p>
              <h3 className="mt-2 text-xl font-light font-display">
                Bring a reference. We’ll translate it.
              </h3>
              <p className="mt-2 text-sm text-neutral-800">
                Density, lace, and color services — curated with a realistic maintenance plan.
              </p>
              <Link
                to="/custom-orders"
                className="mt-5 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
              >
                Start a custom order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
