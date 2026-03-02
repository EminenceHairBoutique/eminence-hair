import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import SEO from "../components/SEO";
import PageHero from "../components/PageHero";

const STYLIST_TIERS = [
  {
    num: "01",
    name: "Registered Stylist",
    benefit: "Entry-level wholesale pricing, tester access",
    req: "Cosmetology license + paid tester SKU purchase",
  },
  {
    num: "02",
    name: "Approved Salon Partner",
    benefit: "Revenue split eligibility, Partner Portal access",
    req: "Verified license + consistent install volume",
  },
  {
    num: "03",
    name: "Preferred Salon Partner",
    benefit: "Best pricing, priority restocks, site features",
    req: "Performance track record + brand alignment",
  },
  {
    num: "04",
    name: "Eminence Atelier Partner",
    benefit: "Custom pricing, editorial features, invite only",
    req: "Invitation by Eminence team",
  },
];

const HAIR_TYPE_OPTIONS = [
  "Virgin bundles",
  "HD lace wigs",
  "Closures/frontals",
  "Colored/custom units",
  "Other",
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

export default function StylistApplication() {
  const { user } = useUser();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    businessName: "",
    salonAddress: "",
    licenseNumber: "",
    licenseState: "",
    instagramHandle: "",
    portfolioUrl: "",
    installVolume: "",
    hairTypes: [],
    howHeard: "",
    message: "",
    consent: false,
    website: "", // honeypot
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const toggleHairType = (type) =>
    setForm((p) => ({
      ...p,
      hairTypes: p.hairTypes.includes(type)
        ? p.hairTypes.filter((t) => t !== type)
        : [...p.hairTypes, type],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const sessionRes = await supabase.auth.getSession();
      const accessToken = sessionRes?.data?.session?.access_token;

      let licenseFileUrl = null;

      // Upload license file if provided
      if (licenseFile) {
        const ext = licenseFile.name.split(".").pop();
        const path = `licenses/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("partner-licenses")
          .upload(path, licenseFile, { upsert: false });

        if (uploadErr) {
          console.warn("License upload failed:", uploadErr);
        } else {
          const { data: urlData } = supabase.storage
            .from("partner-licenses")
            .getPublicUrl(uploadData.path);
          licenseFileUrl = urlData?.publicUrl || null;
        }
      }

      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          payload: {
            ...form,
            hairTypes: form.hairTypes.join(", "),
            licenseFileUrl,
            partnerTrack: "stylist",
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
        title="Stylist Program Application"
        description="Apply to the Eminence Salon & Stylist Partner Program. Tier-based access with wholesale pricing and dedicated support."
      />

      <PageHero
        eyebrow="Salon & Stylist Partners"
        title="Apply to the Eminence Stylist Program"
        subtitle="A tiered system built for licensed professionals. Entry begins with a paid tester — no free product, no risk to either side."
      />

      <section className="bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">

          {/* Tier Ladder */}
          <div>
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Tier Progression</p>
            <h2 className="mt-3 text-2xl font-light text-neutral-900">Four levels of partnership</h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STYLIST_TIERS.map((t) => (
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

          {/* Tester SKU Callout */}
          <div className="rounded-3xl border border-white/70 bg-white/55 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.10)] p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Start Here</p>
              <p className="mt-2 text-base font-light text-neutral-900">
                Every new stylist begins with a paid tester set.
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                No free product. No risk to either side. Your tester purchase is step one of your application.
              </p>
            </div>
            <Link
              to="/shop?collection=stylist-testers"
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 transition shrink-0"
            >
              Shop Tester Sets
            </Link>
          </div>

          {/* Application Form */}
          <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-7 max-w-3xl mx-auto w-full">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Application</p>
            <h2 className="mt-3 text-2xl font-light text-neutral-900">Stylist partner application</h2>
            <p className="mt-2 text-sm text-neutral-700">
              Submit your details and we&apos;ll review your application and follow up via email.
            </p>

            {done ? (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-5 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900">Application received.</p>
                <p className="mt-2">
                  We&apos;ll review your license, portfolio, and install volume. Expect a response within 3–5 business days.
                </p>
                <p className="mt-3 text-xs text-neutral-500">
                  Tip: create an account with the same email so approval can be applied to your login.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full name" required value={form.fullName} onChange={onChange("fullName")} />
                  <Input label="Email" type="email" required value={form.email} onChange={onChange("email")} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Phone" value={form.phone} onChange={onChange("phone")} placeholder="+1 555 555 5555" />
                  <Input label="Salon / Business name" value={form.businessName} onChange={onChange("businessName")} />
                </div>

                <Input
                  label="Salon address (city, state)"
                  value={form.salonAddress}
                  onChange={onChange("salonAddress")}
                  placeholder="Atlanta, GA"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Cosmetology license number"
                    value={form.licenseNumber}
                    onChange={onChange("licenseNumber")}
                  />
                  <Input
                    label="License state"
                    value={form.licenseState}
                    onChange={onChange("licenseState")}
                    placeholder="GA"
                  />
                </div>

                <label className="block">
                  <span className="block text-xs text-neutral-600 mb-1">License file (image or PDF)</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-black file:text-white file:text-[11px] file:px-4 file:py-1.5"
                  />
                </label>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Instagram handle"
                    required
                    value={form.instagramHandle}
                    onChange={onChange("instagramHandle")}
                    placeholder="@yoursalon"
                  />
                  <Input
                    label="Portfolio URL or TikTok"
                    value={form.portfolioUrl}
                    onChange={onChange("portfolioUrl")}
                    placeholder="https://… or @…"
                  />
                </div>

                <Select
                  label="Monthly install volume"
                  value={form.installVolume}
                  onChange={onChange("installVolume")}
                >
                  <option value="">Select…</option>
                  <option value="1-5">1–5 installs/month</option>
                  <option value="5-15">5–15 installs/month</option>
                  <option value="15-30">15–30 installs/month</option>
                  <option value="30+">30+ installs/month</option>
                </Select>

                <div>
                  <span className="block text-xs text-neutral-600 mb-2">
                    Hair types currently used (select all that apply)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {HAIR_TYPE_OPTIONS.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleHairType(type)}
                        className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.22em] border transition ${
                          form.hairTypes.includes(type)
                            ? "bg-black text-white border-black"
                            : "border-neutral-300 hover:border-neutral-500"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="How did you hear about Eminence?"
                  value={form.howHeard}
                  onChange={onChange("howHeard")}
                />

                <Textarea
                  label="Tell us about your work"
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Your specialty, clientele, typical installs, and why Eminence fits your work…"
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
                  I agree to be contacted about this application and understand that product access is performance-based.
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
                  {submitting ? "Submitting\u2026" : "Submit stylist application"}
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
