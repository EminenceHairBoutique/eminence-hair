import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

export default function PartnerPortal() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [quote, setQuote] = useState({
    fullName: "",
    email: user?.email || "",
    businessName: "",
    items: "",
    timeline: "",
    shippingCountry: "",
    notes: "",
  });

  const statusLabel = useMemo(() => {
    const s = profile?.partner_status || "none";
    if (s === "approved") return "Approved";
    if (s === "submitted") return "Submitted";
    if (s === "rejected") return "Not approved";
    return "Not enrolled";
  }, [profile?.partner_status]);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");

      try {
        const { data, error: err } = await supabase
          .from("profiles")
          .select("id, partner_status, partner_tier")
          .eq("id", user.id)
          .single();

        if (err) throw err;
        setProfile(data);
      } catch (e) {
        setError(
          "Partner access is not configured in the database yet. (If you're the admin, run SUPABASE_PARTNERS.sql.)"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const requestQuote = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        fullName: quote.fullName,
        email: quote.email,
        message: [
          "PARTNER PORTAL — BULK QUOTE REQUEST",
          "",
          `Partner Email: ${quote.email}`,
          `Business: ${quote.businessName}`,
          `Shipping Country: ${quote.shippingCountry}`,
          `Timeline: ${quote.timeline}`,
          "",
          "Requested Items:",
          quote.items,
          "",
          `Notes: ${quote.notes}`,
        ].join("\n"),
      };

      const r = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "partner_quote", payload }),
      });

      if (!r.ok) throw new Error("Could not submit quote request.");

      setQuote((q) => ({ ...q, items: "", notes: "" }));
      alert("Quote request sent. We’ll respond via email.");
    } catch (e) {
      setError(e?.message || "Could not submit quote request.");
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
              Partner Portal
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
              Wholesale ordering + support.
            </h1>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              This portal is for approved partners. If you’re not enrolled yet, apply for access
              and we’ll follow up with pricing, MOQs, and timelines.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/partners"
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
            >
              Partner Program
            </Link>
            <Link
              to="/consultation"
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
            >
              Book a call
            </Link>
          </div>
        </div>

        {!user && (
          <div className="mt-10 rounded-3xl border border-neutral-200 p-8">
            <h2 className="text-xl font-semibold">Sign in required</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Please sign in to view your partner status.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/account"
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
              >
                Go to account
              </Link>
              <Link
                to="/partners"
                className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
              >
                Apply for access
              </Link>
            </div>
          </div>
        )}

        {user && (
          <div className="mt-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-neutral-200 p-7">
              <h2 className="text-lg font-semibold">Your status</h2>

              {loading ? (
                <p className="mt-3 text-sm text-neutral-600">Loading…</p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-neutral-700">
                    <span className="font-medium">Status:</span> {statusLabel}
                  </p>
                  {profile?.partner_tier && (
                    <p className="mt-2 text-sm text-neutral-700">
                      <span className="font-medium">Tier:</span> {profile.partner_tier}
                    </p>
                  )}

                  {error && (
                    <p className="mt-4 text-sm text-rose-700 bg-rose-50 p-3 rounded-2xl">
                      {error}
                    </p>
                  )}

                  {profile?.partner_status !== "approved" && !error && (
                    <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
                      <p className="text-sm text-neutral-700">
                        Your account isn’t approved for wholesale pricing yet.
                      </p>
                      <p className="mt-2 text-xs text-neutral-500">
                        Apply for access and we’ll follow up with details.
                      </p>
                      <Link
                        to="/partners"
                        className="mt-4 inline-flex rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
                      >
                        Apply now
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="rounded-3xl border border-neutral-200 p-7">
              <h2 className="text-lg font-semibold">Bulk quote request</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Submit what you need (textures, lengths, quantities, and colors). We’ll reply with
                wholesale pricing + timeline.
              </p>

              <form onSubmit={requestQuote} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                      Full name
                    </label>
                    <input
                      required
                      value={quote.fullName}
                      onChange={(e) =>
                        setQuote((q) => ({ ...q, fullName: e.target.value }))
                      }
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
                      value={quote.email}
                      onChange={(e) => setQuote((q) => ({ ...q, email: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Business name
                  </label>
                  <input
                    value={quote.businessName}
                    onChange={(e) =>
                      setQuote((q) => ({ ...q, businessName: e.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                      Shipping country
                    </label>
                    <input
                      value={quote.shippingCountry}
                      onChange={(e) =>
                        setQuote((q) => ({ ...q, shippingCountry: e.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                      Timeline
                    </label>
                    <input
                      value={quote.timeline}
                      onChange={(e) => setQuote((q) => ({ ...q, timeline: e.target.value }))}
                      placeholder="e.g., ASAP, 2 weeks, date…"
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Requested items
                  </label>
                  <textarea
                    required
                    value={quote.items}
                    onChange={(e) => setQuote((q) => ({ ...q, items: e.target.value }))}
                    className="mt-2 min-h-[140px] w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                    placeholder="Example: 30 units — Natural Straight bundles (10x 16″, 10x 18″, 10x 20″). 10 units — 4×4 closures (16″)."
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                    Notes
                  </label>
                  <textarea
                    value={quote.notes}
                    onChange={(e) => setQuote((q) => ({ ...q, notes: e.target.value }))}
                    className="mt-2 min-h-[90px] w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-300"
                    placeholder="Packaging preferences, private label request, shipping method…"
                  />
                </div>

                {error && (
                  <p className="text-sm text-rose-700 bg-rose-50 p-3 rounded-2xl">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white"
                >
                  Request quote
                </button>

                <p className="text-xs text-neutral-500">
                  For immediate help, use Live Chat or email our concierge.
                </p>
              </form>
            </div>
          </div>
        )}

        <div className="mt-12 rounded-3xl bg-neutral-50 p-7">
          <h2 className="text-lg font-semibold">Wholesale notes</h2>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            <li>• Unbranded (factory-style) options available for bundles, closures, and wigs.</li>
            <li>• Private label available on request (branding, packaging, inserts).</li>
            <li>• Medical-grade requests supported on a case-by-case basis.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
