import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/SEO";
import PageHero from "../components/PageHero";
import { Button } from "../components/ui/button";

const Input = ({ label, ...props }) => (
  <label className="block">
    <span className="block text-xs text-neutral-600 mb-1">{label}</span>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm"
    />
  </label>
);

const Textarea = ({ label, ...props }) => (
  <label className="block">
    <span className="block text-xs text-neutral-600 mb-1">{label}</span>
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm min-h-[110px]"
    />
  </label>
);

const Select = ({ label, children, ...props }) => (
  <label className="block">
    <span className="block text-xs text-neutral-600 mb-1">{label}</span>
    <select
      {...props}
      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm"
    >
      {children}
    </select>
  </label>
);

export default function Partners() {
  const { user } = useUser();

  const isPartner = useMemo(() => {
    const t = String(user?.accountTier || "").toLowerCase();
    const s = String(user?.partnerStatus || "").toLowerCase();
    return t === "partner" || t === "wholesale" || t.startsWith("partner_") || s === "approved";
  }, [user?.accountTier, user?.partnerStatus]);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    businessName: "",
    websiteOrInstagram: "",
    country: "",
    monthlyVolume: "",
    interestedIn: "Bundles + Closures",
    message: "",
    consent: true,
    website: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const sessionRes = await supabase.auth.getSession();
      const accessToken = sessionRes?.data?.session?.access_token;

      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify({
          payload: {
            ...form,
            accountId: user?.id || null,
            accountEmail: user?.email || null,
            accountTier: user?.accountTier || "guest",
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setDone(true);
    } catch (err) {
      setError(err?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Partners"
        description="Wholesale + private label partnerships with Eminence Hair. Apply for partner access to distributor pricing, MOQs, and dedicated support."
      />

      <PageHero
        eyebrow="Wholesale • Private Label • Distribution"
        title="Eminence Partner Program"
        subtitle="For salons, retailers, and founders building a premium hair brand. Get partner-only pricing, MOQ packs, and white-label support — without compromising luxury."
        image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp"
        ctas={
          isPartner
            ? [{ label: "Go to Partner Portal", href: "/partner-portal", variant: "primary" }]
            : [
                { label: "Apply", href: "#apply", variant: "primary" },
                { label: "Sign in", href: "/account", variant: "ghost" },
              ]
        }
      />

      <section className="bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.12)] p-7">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">What partners receive</p>
                <h2 className="mt-3 text-2xl font-light text-neutral-900">Wholesale access, elevated.</h2>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                  The Partner Program is built for brands who want premium quality with clean logistics — and a
                  storefront-level experience for replenishment + quoting.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  {[ 
                    { t: "Partner-only pricing", d: "Tiered wholesale pricing (5+ / 10+) inside the Partner Portal." },
                    { t: "MOQ packs", d: "Bundle packs and wholesale minimums designed for real inventory moves." },
                    { t: "Private label support", d: "Unbranded fulfillment options, brand-building guidance, and QC standards." },
                    { t: "Partner live chat", d: "Priority chat for partners (when enabled), plus fast concierge response." },
                  ].map((x) => (
                    <div key={x.t} className="rounded-2xl border border-neutral-200 bg-white/70 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{x.t}</p>
                      <p className="mt-2 text-sm text-neutral-800">{x.d}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Wholesale minimums</p>
                  <ul className="mt-3 text-sm text-neutral-700 space-y-2">
                    <li>• Bundles / wefts / closures: <span className="font-medium">10+ units</span> to activate wholesale pricing</li>
                    <li>• Wigs: <span className="font-medium">5+ units</span> to activate wholesale pricing</li>
                    <li>• Tiered pricing: <span className="font-medium">5+</span> and <span className="font-medium">10+</span> rates (exact pricing inside portal)</li>
                  </ul>
                  <p className="mt-3 text-xs text-neutral-500">
                    These minimums can be adjusted per partnership. Submit an application and we’ll confirm your lane.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5" id="apply">
              <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-7">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Apply</p>
                <h2 className="mt-3 text-2xl font-light text-neutral-900">Partner application</h2>
                <p className="mt-2 text-sm text-neutral-700">
                  Submit your info and we’ll follow up with approval + portal access.
                </p>

                {isPartner && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Your account is already approved for Partner access. <Link className="underline" to="/partner-portal">Go to Partner Portal</Link>.
                  </div>
                )}

                {done ? (
                  <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm text-neutral-700">
                    <p className="font-medium text-neutral-900">Application received.</p>
                    <p className="mt-2">We’ll review and reply via email with next steps and approval.</p>
                    <p className="mt-3 text-xs text-neutral-500">
                      Tip: create an account with the same email you used above so approval can be applied to your login.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Full name" value={form.fullName} onChange={onChange("fullName")} required />
                      <Input label="Email" type="email" value={form.email} onChange={onChange("email")} required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Phone" value={form.phone} onChange={onChange("phone")} placeholder="+1 555 555 5555" />
                      <Input label="Business name" value={form.businessName} onChange={onChange("businessName")} />
                    </div>
                    <Input
                      label="Website / Instagram"
                      value={form.websiteOrInstagram}
                      onChange={onChange("websiteOrInstagram")}
                      placeholder="https://… or @…"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Country" value={form.country} onChange={onChange("country")} />
                      <Select label="Estimated monthly volume" value={form.monthlyVolume} onChange={onChange("monthlyVolume")}
                      >
                        <option value="">Select…</option>
                        <option value="Starter (0–20 units)">Starter (0–20 units)</option>
                        <option value="Growing (20–75 units)">Growing (20–75 units)</option>
                        <option value="Scaling (75–200 units)">Scaling (75–200 units)</option>
                        <option value="Enterprise (200+ units)">Enterprise (200+ units)</option>
                      </Select>
                    </div>
                    <Select label="Interested in" value={form.interestedIn} onChange={onChange("interestedIn")}
                    >
                      <option>Bundles + Closures</option>
                      <option>Wholesale Wigs</option>
                      <option>Private Label / Unbranded Fulfillment</option>
                      <option>All categories</option>
                    </Select>

                    <Textarea
                      label="Tell us about your brand"
                      value={form.message}
                      onChange={onChange("message")}
                      placeholder="What you sell, where you sell, your ideal launch timeline, and what you need from us…"
                    />

                    {/* honeypot */}
                    <input
                      type="text"
                      value={form.website}
                      onChange={onChange("website")}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <label className="flex items-start gap-2 text-xs text-neutral-600">
                      <input type="checkbox" checked={form.consent} onChange={onChange("consent")} className="mt-0.5" />
                      I agree to be contacted about this application.
                    </label>

                    {error && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <Button className="w-full rounded-full" disabled={submitting || !form.consent}>
                      {submitting ? "Submitting…" : "Submit application"}
                    </Button>

                    <p className="text-[11px] text-neutral-500 text-center">
                      Already approved? <Link className="underline" to="/partner-portal">Go to Partner Portal</Link>.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
