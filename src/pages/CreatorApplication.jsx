import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/SEO";
import PageHero from "../components/PageHero";

const CREATOR_TIERS = [
  {
    num: "01",
    name: "Affiliate Creator",
    benefit: "Unique referral link, 10\u201315% commission",
    req: "Content review + platform verification",
  },
  {
    num: "02",
    name: "Featured Creator",
    benefit: "15\u201325% commission, paid campaigns, product gifting",
    req: "Proven conversions + engagement at Tier 1",
  },
  {
    num: "03",
    name: "Brand Muse",
    benefit: "Campaign shoots, exclusive launches, invite only",
    req: "Invitation by Eminence team",
  },
];

const Input = ({ label, required: req, ...props }) => (
  <label className="block">
    <span className="block text-xs text-neutral-600 mb-1">
      {label}{req && <span className="text-red-500 ml-0.5">*</span>}
    </span>
    <input
      required={req}
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

const Select = ({ label, children, required: req, ...props }) => (
  <label className="block">
    <span className="block text-xs text-neutral-600 mb-1">
      {label}{req && <span className="text-red-500 ml-0.5">*</span>}
    </span>
    <select
      required={req}
      {...props}
      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm"
    >
      {children}
    </select>
  </label>
);

export default function CreatorApplication() {
  const { user } = useUser();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    primaryPlatform: "",
    instagramHandle: "",
    tiktokHandle: "",
    youtubeUrl: "",
    followerCount: "",
    engagementRate: "",
    contentExamples: "",
    previousBrandWork: "",
    message: "",
    consent: false,
    website: "", // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const sessionRes = await supabase.auth.getSession();
      const accessToken = sessionRes?.data?.session?.access_token;

      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          payload: {
            ...form,
            partnerTrack: "creator",
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
        title="Creator Program Application"
        description="Join the Eminence Creator & Influencer Program. Commission-based, performance-driven. Apply for your referral link."
      />

      <PageHero
        eyebrow="Creators & Influencers"
        title="Join the Eminence Creator Program"
        subtitle="Commission-based. Performance-driven. Gifting is earned at Tier 2 \u2014 not guaranteed."
      />

      <section className="bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* Tier Ladder */}
          <div>
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Tier Progression</p>
            <h2 className="mt-3 text-2xl font-light text-neutral-900">Three levels of partnership</h2>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {CREATOR_TIERS.map((t) => (
                <div
                  key={t.num}
                  className="rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl p-5"
                >
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-400">{t.num}</p>
                  <p className="mt-2 text-sm font-medium text-neutral-900">{t.name}</p>
                  <p className="mt-1 text-xs text-neutral-700 leading-relaxed">{t.benefit}</p>
                  <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">Req: {t.req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Callout */}
          <div className="rounded-3xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.10)] p-7">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Transparency</p>
            <p className="mt-3 text-base font-light text-neutral-900">
              This is a commission-based program.
            </p>
            <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
              No guaranteed free product. Gifting is earned at Tier 2+. We reward creators who actually drive sales
              \u2014 not follower counts alone.
            </p>
          </div>

          {/* Application Form */}
          <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-7 max-w-3xl mx-auto w-full">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Application</p>
            <h2 className="mt-3 text-2xl font-light text-neutral-900">Creator partner application</h2>
            <p className="mt-2 text-sm text-neutral-700">
              Tell us about your platform and content. We review every application personally.
            </p>

            {done ? (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-5 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900">Application received.</p>
                <p className="mt-2">
                  We&apos;ll review your content, platforms, and engagement. Expect a response within 3–5 business days.
                </p>
                <p className="mt-3 text-xs text-neutral-500">
                  Tip: create an account with the same email so your referral link can be activated upon approval.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full name" required value={form.fullName} onChange={onChange("fullName")} />
                  <Input label="Email" type="email" required value={form.email} onChange={onChange("email")} />
                </div>

                <Input label="Phone" value={form.phone} onChange={onChange("phone")} placeholder="+1 555 555 5555" />

                <Select
                  label="Primary platform"
                  required
                  value={form.primaryPlatform}
                  onChange={onChange("primaryPlatform")}
                >
                  <option value="">Select\u2026</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Blog/Website">Blog / Website</option>
                  <option value="Other">Other</option>
                </Select>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Instagram handle"
                    value={form.instagramHandle}
                    onChange={onChange("instagramHandle")}
                    placeholder="@yourhandle"
                  />
                  <Input
                    label="TikTok handle"
                    value={form.tiktokHandle}
                    onChange={onChange("tiktokHandle")}
                    placeholder="@yourhandle"
                  />
                </div>

                <Input
                  label="YouTube channel URL"
                  type="url"
                  value={form.youtubeUrl}
                  onChange={onChange("youtubeUrl")}
                  placeholder="https://youtube.com/@…"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Combined follower count"
                    value={form.followerCount}
                    onChange={onChange("followerCount")}
                  >
                    <option value="">Select\u2026</option>
                    <option value="Under 5K">Under 5K</option>
                    <option value="5K-25K">5K\u201325K</option>
                    <option value="25K-100K">25K\u2013100K</option>
                    <option value="100K-500K">100K\u2013500K</option>
                    <option value="500K+">500K+</option>
                  </Select>

                  <Select
                    label="Average engagement rate"
                    value={form.engagementRate}
                    onChange={onChange("engagementRate")}
                  >
                    <option value="">Select\u2026</option>
                    <option value="Under 2%">Under 2%</option>
                    <option value="2-5%">2\u20135%</option>
                    <option value="5-10%">5\u201310%</option>
                    <option value="10%+">10%+</option>
                    <option value="Not sure">Not sure</option>
                  </Select>
                </div>

                <Textarea
                  label="Content examples (URLs, one per line)"
                  value={form.contentExamples}
                  onChange={onChange("contentExamples")}
                  placeholder="https://www.instagram.com/p/…&#10;https://www.tiktok.com/@…"
                />

                <Textarea
                  label="Have you worked with hair brands before? (Yes / No / Which ones)"
                  value={form.previousBrandWork}
                  onChange={onChange("previousBrandWork")}
                  placeholder="Yes \u2014 I've worked with Brand X and Brand Y…"
                />

                <Textarea
                  label="Why Eminence?"
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Tell us why this partnership makes sense for your audience and your brand…"
                />

                {/* Honeypot */}
                <input
                  type="text"
                  value={form.website}
                  onChange={onChange("website")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <label className="flex items-start gap-2 text-xs text-neutral-600">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={onChange("consent")}
                    className="mt-0.5"
                    required
                  />
                  I agree to be contacted about this application and understand that product gifting is performance-based, not guaranteed.
                </label>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !form.consent}
                  className="w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 transition disabled:opacity-50"
                >
                  {submitting ? "Submitting\u2026" : "Submit creator application"}
                </button>

                <p className="text-[11px] text-neutral-500 text-center">
                  Already approved?{" "}
                  <Link className="underline" to="/partner-portal">
                    Go to Partner Portal
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
