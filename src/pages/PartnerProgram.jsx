import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

export default function PartnerProgram() {
  const { user } = useUser();

  const [status, setStatus] = useState({ state: "idle", message: "" });

  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    businessName: "",
    businessType: "Salon / Stylist",
    website: "",
    instagram: "",
    country: "",
    monthlyVolume: "",
    interest: ["Bundles", "Closures/Frontals", "Wigs"],
    branding: "Unbranded (factory-style)",
    notes: "",
  });

  const interestOptions = useMemo(
    () => ["Bundles", "Closures/Frontals", "Wigs", "Medical Grade", "Private Label"],
    []
  );

  const toggleInterest = (value) => {
    setForm((f) => {
      const set = new Set(f.interest);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, interest: Array.from(set) };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        message: [
          "PARTNER PROGRAM APPLICATION",
          "",
          `Business Name: ${form.businessName}`,
          `Business Type: ${form.businessType}`,
          `Phone: ${form.phone}`,
          `Country: ${form.country}`,
          `Website: ${form.website}`,
          `Instagram: ${form.instagram}`,
          `Monthly Volume (estimate): ${form.monthlyVolume}`,
          `Interest: ${form.interest.join(", ")}`,
          `Branding: ${form.branding}`,
          "",
          `Notes: ${form.notes}`,
        ].join("\n"),
      };

      // 1) Email concierge (always)
      const r = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "partner_application", payload }),
      });

      // 2) Optional: store in Supabase (if table exists)
      try {
        await supabase.from("partner_applications").insert([
          {
            user_id: user?.id ?? null,
            full_name: form.fullName,
            email: form.email,
            phone: form.phone,
            business_name: form.businessName,
            business_type: form.businessType,
            website: form.website,
            instagram: form.instagram,
            country: form.country,
            monthly_volume: form.monthlyVolume,
            interest: form.interest,
            branding: form.branding,
            notes: form.notes,
            status: "submitted",
          },
        ]);
      } catch {
        // Ignore if table doesn't exist — email still sent.
      }

      if (!r.ok) throw new Error("Failed to submit application.");

      setStatus({
        state: "success",
        message:
          "Application received. Our team will review and follow up via email.",
      });

      setForm((f) => ({ ...f, notes: "" }));
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err?.message ||
          "We couldn’t submit your application right now. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
              Partner Program
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
              Bulk, unbranded hair — with Eminence-level quality.
            </h1>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Built for salons, stylists, boutiques, and beauty brands who want premium hair in
              consistent, repeatable volume. Choose unbranded (factory-style) inventory or ask
              about private label.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-neutral-200 p-6">
                <p className="text-sm font-medium">Wholesale access</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Bundles, closures/frontals, wigs, and select medical-grade pieces.
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 p-6">
                <p className="text-sm font-medium">MOQs + tiers</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Structured minimums for consistent pricing and predictable fulfillment.
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 p-6">
                <p className="text-sm font-medium">Concierge support</p>
                <p className="mt-2 text-sm text-neutral-600">
                  Shade matching, texture guidance, and reorder planning.
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-neutral-50 p-7">
              <h2 className="text-lg font-semibold">Typical starting minimums</h2>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                <li>• Bundles: 10+ units (mix-and-match lengths by texture)</li>
                <li>• Closures/Frontals: 5+ units</li>
                <li>• Wigs: 3+ units (selected caps/textures)</li>
                <li className="text-neutral-500">
                  Final MOQs vary by texture, color, and turnaround.
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/partner-portal"
                  className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
                >
                  Partner Portal
                </Link>
                <Link
                  to="/consultation"
                  className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
                >
                  Book a call
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-7">
            <h2 className="text-xl font-semibold tracking-tight">Apply for access</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Submit the form below — we’ll respond with next steps and pricing.
            </p>

            {status.state !== "idle" && (
              <div
                className={`mt-4 rounded-2xl p-3 text-sm ${
                  status.state === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : status.state === "error"
                    ? "bg-rose-50 text-rose-800"
                    : "bg-neutral-50 text-neutral-700"
                }`}
              >
                {status.message || (status.state === "loading" ? "Submitting…" : "")}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Full name
                </label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Country
                  </label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Business name
                </label>
                <input
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Business type
                </label>
                <select
                  value={form.businessType}
                  onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                >
                  {[
                    "Salon / Stylist",
                    "Boutique / Retail",
                    "Beauty Brand",
                    "Distributor",
                    "Influencer / Creator",
                    "Other",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Website
                  </label>
                  <input
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Instagram
                  </label>
                  <input
                    value={form.instagram}
                    onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Monthly volume (estimate)
                </label>
                <input
                  value={form.monthlyVolume}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, monthlyVolume: e.target.value }))
                  }
                  placeholder='e.g., 50 bundles / month, 10 wigs / month'
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Interested in
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {interestOptions.map((opt) => {
                    const active = form.interest.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`rounded-full border px-4 py-2 text-xs ${
                          active
                            ? "border-black bg-black text-white"
                            : "border-neutral-200 bg-white text-neutral-800"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Branding preference
                </label>
                <select
                  value={form.branding}
                  onChange={(e) => setForm((f) => ({ ...f, branding: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                >
                  {[
                    "Unbranded (factory-style)",
                    "Private Label",
                    "Not sure yet",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="mt-2 min-h-[110px] w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  placeholder="Textures, colors, target pricing, timeline, shipping preferences…"
                />
              </div>

              <button
                type="submit"
                disabled={status.state === "loading"}
                className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                Submit application
              </button>

              <p className="text-xs text-neutral-500">
                Already approved? Visit{" "}
                <Link to="/partner-portal" className="underline underline-offset-4">
                  Partner Portal
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
