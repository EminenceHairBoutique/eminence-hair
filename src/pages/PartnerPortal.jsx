import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { products, STANDARD_WIG_DENSITIES } from "../data/products";
import { Button } from "../components/ui/button";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";

const money = (amount) => `$${Number(amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const WHOLESALE_DISCOUNTS = {
  retail: 0,
  tier5: 0.20,
  tier10: 0.30,
};

const classifyGroup = (productType) => {
  if (productType === "wig") return "wigs";
  if (productType === "bundle" || productType === "closure") return "bundles";
  return "other";
};

function unitRetailPrice(product, { length, density, lace }) {
  if (!product) return 0;

  if (product.type === "wig") {
    return Number(product.price?.(length, density, lace) || 0);
  }
  return Number(product.price?.(length) || 0);
}

function tierForQty(qty, kind) {
  // MOQ guidance (editable):
  // - bundles/closures: wholesale pricing generally at 10+
  // - wigs: wholesale pricing generally at 5+
  if (kind === "bundles") {
    if (qty >= 10) return "tier10";
    if (qty >= 5) return "tier5";
    return "retail";
  }
  if (kind === "wigs") {
    if (qty >= 10) return "tier10";
    if (qty >= 5) return "tier5";
    return "retail";
  }
  if (qty >= 10) return "tier10";
  if (qty >= 5) return "tier5";
  return "retail";
}

const prettyType = (productType) => {
  if (productType === "wig") return "Wig";
  if (productType === "bundle") return "Bundle";
  if (productType === "closure") return "Closure / Frontal";
  return productType;
};

// ─── Affiliate / Directory Panel ────────────────────────────────────────────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 px-3 py-1 text-[10px] uppercase tracking-[0.18em] rounded-full border border-black/20 hover:border-black/40 transition"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const SPECIALTY_OPTIONS = [
  "Wig Installation", "Wig Customisation", "Extensions", "Braids",
  "Color / Bleaching", "Medical Hair", "Natural Hair", "Loc Extensions",
];

function DirectorySettings({ userId, partnerTrack }) {
  const [settings, setSettings] = useState({
    city: "", booking_url: "", specialties: [], directory_opt_in: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const token = session?.session?.access_token;
        if (!token) return;
        const fetchResponse = await fetch("/api/partners/directory-settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (fetchResponse.ok) {
          const { settings: settingsData } = await fetchResponse.json();
          setSettings((prev) => ({ ...prev, ...(settingsData || {}) }));
        }
      } catch (_) { /* ignore */ } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const toggleSpecialty = (spec) => {
    setSettings((prev) => {
      const cur = Array.isArray(prev.specialties) ? prev.specialties : [];
      return {
        ...prev,
        specialties: cur.includes(spec) ? cur.filter((specialty) => specialty !== spec) : [...cur, spec],
      };
    });
  };

  const save = async () => {
    setErr("");
    setSaving(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;
      const fetchResponse = await fetch("/api/partners/directory-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      });
      if (!fetchResponse.ok) throw new Error(await fetchResponse.text());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setErr(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (partnerTrack !== "stylist") return null;
  if (loading) return <p className="text-xs text-neutral-400 py-2">Loading directory settings…</p>;

  const specs = Array.isArray(settings.specialties) ? settings.specialties : [];

  return (
    <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.10)] p-6 mt-6">
      <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Stylist Directory</p>
      <h2 className="mt-2 text-xl font-light">Directory listing settings</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Control how you appear in the{" "}
        <Link to="/installers" className="underline hover:text-black transition">public stylist directory</Link>.
      </p>

      <div className="mt-5 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!settings.directory_opt_in}
            onChange={(e) => setSettings((p) => ({ ...p, directory_opt_in: e.target.checked }))}
            className="w-4 h-4 accent-black"
          />
          <span className="text-sm">Show me in the public stylist directory</span>
        </label>

        {settings.directory_opt_in && (
          <>
            <label className="block">
              <span className="block text-xs text-neutral-600 mb-1">City / Location</span>
              <input
                type="text"
                value={settings.city || ""}
                onChange={(e) => setSettings((p) => ({ ...p, city: e.target.value }))}
                placeholder="e.g. Atlanta, GA"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </label>

            <label className="block">
              <span className="block text-xs text-neutral-600 mb-1">Booking URL</span>
              <input
                type="url"
                value={settings.booking_url || ""}
                onChange={(e) => setSettings((p) => ({ ...p, booking_url: e.target.value }))}
                placeholder="https://calendly.com/your-link"
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm"
              />
            </label>

            <div>
              <span className="block text-xs text-neutral-600 mb-2">Specialties (select all that apply)</span>
              <div className="flex flex-wrap gap-2">
                {SPECIALTY_OPTIONS.map((specialtyOption) => (
                  <button
                    key={specialtyOption}
                    type="button"
                    onClick={() => toggleSpecialty(specialtyOption)}
                    className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider border transition ${
                      specs.includes(specialtyOption)
                        ? "bg-black text-white border-black"
                        : "border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {specialtyOption}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {err && <p className="text-xs text-red-600">{err}</p>}
        {saved && <p className="text-xs text-green-700">Saved successfully.</p>}

        <Button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full"
        >
          {saving ? "Saving…" : "Save directory settings"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Portal ─────────────────────────────────────────────────────────────

export default function PartnerPortal() {
  const { user } = useUser();

  // Fetch extra profile fields not loaded by UserContext
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("referral_code, commission_rate, total_referral_sales, partner_track")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data || {}));
  }, [user?.id]);

  const referralCode = profile?.referral_code || "";
  const commissionRate = Number(profile?.commission_rate || 0);
  const totalReferralSales = Number(profile?.total_referral_sales || 0);
  const partnerTrack = profile?.partner_track || user?.partnerTrack || "";

  const siteOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://eminencehairboutique.com";
  const affiliateLink = referralCode ? `${siteOrigin}?ref=${referralCode}` : "";

  const catalog = useMemo(() => {
    return (products || [])
      .filter((p) => ["wig", "bundle", "closure"].includes(p.type))
      .slice()
      .sort((a, b) => (a.collection || "").localeCompare(b.collection || "") || (a.displayName || a.name || "").localeCompare(b.displayName || b.name || ""));
  }, []);

  // O(1) lookup map so resolvedLines doesn't need to scan the full catalog per line
  const catalogMap = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);

  const [lines, setLines] = useState(() => [
    {
      id: `line_${Date.now()}`,
      productId: catalog?.[0]?.id || "",
      length: catalog?.[0]?.lengths?.[0] || 16,
      density: 180,
      lace: "Transparent Lace",
      qty: 0,
    },
  ]);

  const setLine = (id, patch) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addLine = () => {
    const fallback = catalog?.[0];
    setLines((prev) => [
      ...prev,
      {
        id: `line_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        productId: fallback?.id || "",
        length: fallback?.lengths?.[0] || 16,
        density: 180,
        lace: "Transparent Lace",
        qty: 0,
      },
    ]);
  };

  const removeLine = (id) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  };

  const resolvedLines = useMemo(() => {
    return lines
      .map((l) => {
        const product = catalogMap.get(l.productId);
        const group = classifyGroup(product?.type);
        const safeLength = Number(l.length || product?.lengths?.[0] || 16);
        const safeDensity = Number(l.density || 180);
        const safeLace = l.lace || "Transparent Lace";
        const qty = Math.max(0, Math.floor(Number(l.qty || 0)));

        const retail = unitRetailPrice(product, {
          length: safeLength,
          density: safeDensity,
          lace: safeLace,
        });

        return {
          ...l,
          product,
          group,
          length: safeLength,
          density: safeDensity,
          lace: safeLace,
          qty,
          retailUnit: retail,
        };
      })
      .filter((l) => l.product);
  }, [lines, catalogMap]);

  const totalsByGroup = useMemo(() => {
    const groupTotals = { bundles: 0, wigs: 0, other: 0 };
    for (const l of resolvedLines) groupTotals[l.group] = (groupTotals[l.group] || 0) + (l.qty || 0);
    return groupTotals;
  }, [resolvedLines]);

  const tierBundles = tierForQty(totalsByGroup.bundles, "bundles");
  const tierWigs = tierForQty(totalsByGroup.wigs, "wigs");

  const pricing = useMemo(() => {
    let retailTotal = 0;
    let wholesaleTotal = 0;

    for (const l of resolvedLines) {
      if (!l.qty) continue;
      const discountRate = l.group === "wigs" ? WHOLESALE_DISCOUNTS[tierWigs] : l.group === "bundles" ? WHOLESALE_DISCOUNTS[tierBundles] : 0;
      const unitWholesale = Math.round(l.retailUnit * (1 - discountRate));
      retailTotal += l.retailUnit * l.qty;
      wholesaleTotal += unitWholesale * l.qty;
    }

    return {
      retailTotal: Math.round(retailTotal),
      wholesaleTotal: Math.round(wholesaleTotal),
      savings: Math.max(0, Math.round(retailTotal - wholesaleTotal)),
    };
  }, [resolvedLines, tierBundles, tierWigs]);

  const qualifiesMOQ = useMemo(() => {
    // Qualify if either lane hits minimum.
    const bundlesOk = totalsByGroup.bundles >= 10;
    const wigsOk = totalsByGroup.wigs >= 5;
    return bundlesOk || wigsOk;
  }, [totalsByGroup]);

  const [quote, setQuote] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    company: "",
    shipToCountry: "",
    notes: "",
    website: "", // honeypot
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onQuoteChange = (key) => (e) => setQuote((p) => ({ ...p, [key]: e.target.value }));

  const requestQuote = async () => {
    setError("");
    setSending(true);

    try {
      const lineItems = resolvedLines
        .filter((l) => l.qty > 0)
        .map((l) => ({
          productId: l.product?.id,
          name: l.product?.displayName || l.product?.name,
          type: l.product?.type,
          collection: l.product?.collection,
          color: l.product?.color,
          texture: l.product?.texture,
          length: l.length,
          density: l.product?.type === "wig" ? l.density : null,
          lace: l.product?.type === "wig" ? l.lace : null,
          qty: l.qty,
          retailUnit: l.retailUnit,
        }));

      if (!lineItems.length) {
        setError("Add at least one item to request a quote.");
        return;
      }

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner_quote",
          payload: {
            ...quote,
            accountId: user?.id || null,
            accountEmail: user?.email || null,
            accountTier: user?.accountTier || "unknown",
            totals: {
              bundlesQty: totalsByGroup.bundles,
              wigsQty: totalsByGroup.wigs,
              tierBundles,
              tierWigs,
              retailTotal: pricing.retailTotal,
              wholesaleTotal: pricing.wholesaleTotal,
              savings: pricing.savings,
            },
            lineItems,
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      setSent(true);
    } catch (e) {
      setError(e?.message || "Failed to send quote request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <SEO
        title="Partner Portal"
        description="Partner-only wholesale portal for approved Eminence partners."
        noindex
      />

      <div className="pt-28 pb-20 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Partner Portal</p>
              <h1 className="mt-3 text-3xl md:text-4xl font-light">Wholesale Ordering</h1>
              <p className="mt-3 text-sm text-neutral-700 max-w-2xl leading-relaxed">
                This portal is gated for approved partners. Build a wholesale cart, see tiered pricing, and request a quote.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <LinkPill href="/partners" label="Program overview" />
              <LinkPill href="/contact" label="Support" />
            </div>
          </div>

          {/* ── Partner Status + Affiliate Code ── */}
          <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.10)] p-6 mb-6">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Your account</p>
            <div className="mt-3 grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Status</p>
                <p className="mt-2 text-base font-medium capitalize">{user?.partnerStatus || "approved"}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{user?.accountTier || "partner"}</p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Commission rate</p>
                <p className="mt-2 text-base font-medium">
                  {commissionRate > 0 ? `${commissionRate}%` : "—"}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {totalReferralSales > 0 ? `${money(totalReferralSales)} in referral sales` : "No referral sales yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Affiliate code</p>
                {referralCode ? (
                  <>
                    <p className="mt-2 text-base font-medium font-mono tracking-wider">{referralCode}</p>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-neutral-500 truncate max-w-[140px]">{affiliateLink}</span>
                      <CopyButton value={affiliateLink} />
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-neutral-400">No code yet — contact support.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-6">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Quick order</p>
                <h2 className="mt-2 text-xl font-light">Build your wholesale request</h2>

                <div className="mt-5 space-y-3">
                  {resolvedLines.map((l) => (
                    <LineRow
                      key={l.id}
                      line={l}
                      catalog={catalog}
                      onChange={setLine}
                      onRemove={removeLine}
                    />
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button variant="outline" className="rounded-full" type="button" onClick={addLine}>
                    Add another item
                  </Button>
                  <p className="text-xs text-neutral-500">
                    Tip: use +5 / +10 buttons for MOQ packs.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">MOQ + tier pricing</p>
                  <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
                    <Stat label="Bundles / Closures" value={`${totalsByGroup.bundles} units`} sub={`Tier: ${tierLabel(tierBundles)} (10+ recommended)`} />
                    <Stat label="Wigs" value={`${totalsByGroup.wigs} units`} sub={`Tier: ${tierLabel(tierWigs)} (MOQ 5+)`} />
                    <Stat label="Estimated total" value={money(pricing.wholesaleTotal)} sub={`Savings vs retail: ${money(pricing.savings)}`} />
                  </div>

                  {!qualifiesMOQ && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Your order doesn’t hit standard wholesale minimums yet. Add <strong>10+ bundles/closures</strong> or <strong>5+ wigs</strong> to unlock wholesale tiers.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.18)] p-6">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Request quote</p>
                <h2 className="mt-2 text-xl font-light">Send this to the concierge</h2>
                <p className="mt-2 text-sm text-neutral-700">
                  We’ll confirm availability, lead times, shipping, and final totals.
                </p>

                {sent ? (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                    <p className="font-medium text-emerald-900">Quote request sent.</p>
                    <p className="mt-2">We’ll reply by email with next steps and an invoice/checkout option.</p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <Field label="Full name" value={quote.fullName} onChange={onQuoteChange("fullName")} />
                    <Field label="Email" type="email" value={quote.email} onChange={onQuoteChange("email")} />
                    <Field label="Phone" value={quote.phone} onChange={onQuoteChange("phone")} placeholder="+1 555 555 5555" />
                    <Field label="Company" value={quote.company} onChange={onQuoteChange("company")} />
                    <Field label="Ship-to country" value={quote.shipToCountry} onChange={onQuoteChange("shipToCountry")} />
                    <Field label="Notes" textarea value={quote.notes} onChange={onQuoteChange("notes")} placeholder="Anything we should know? Preferred textures/lengths, rush timeline, branding requirements…" />

                    {/* honeypot */}
                    <input
                      type="text"
                      value={quote.website}
                      onChange={onQuoteChange("website")}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {error && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <Button
                      className="w-full rounded-full"
                      disabled={sending}
                      onClick={requestQuote}
                    >
                      {sending ? "Sending…" : "Request quote"}
                    </Button>

                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Prices shown are estimates. Final partner pricing may vary for custom-color units, special sourcing,
                      and rush timelines.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Stylist Directory Settings ── */}
          <DirectorySettings userId={user?.id} partnerTrack={partnerTrack} />
        </div>
      </div>
    </>
  );
}

function LinkPill({ href, label }) {
  return (
    <Link
      to={href}
      className="inline-flex items-center px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/40 hover:bg-white/70 transition"
    >
      {label}
    </Link>
  );
}

function tierLabel(tierKey) {
  if (tierKey === "tier10") return "10+";
  if (tierKey === "tier5") return "5+";
  return "Retail";
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">{label}</p>
      <p className="mt-2 text-lg font-medium text-neutral-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}

function Field({ label, textarea = false, ...props }) {
  return (
    <label className="block">
      <span className="block text-xs text-neutral-600 mb-1">{label}</span>
      {textarea ? (
        <textarea
          {...props}
          className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm min-h-[110px]"
        />
      ) : (
        <input
          {...props}
          className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/70 focus:outline-none focus:ring-1 focus:ring-black text-sm"
        />
      )}
    </label>
  );
}

function LineRow({ line, catalog, onChange, onRemove }) {
  const lineProduct = line.product;
  const wigDensities = (lineProduct?.densities?.length ? lineProduct.densities : STANDARD_WIG_DENSITIES) || [150, 180, 210, 250];

  const retailUnit = line.retailUnit || 0;
  const unit5 = Math.round(retailUnit * (1 - WHOLESALE_DISCOUNTS.tier5));
  const unit10 = Math.round(retailUnit * (1 - WHOLESALE_DISCOUNTS.tier10));

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
      <div className="grid md:grid-cols-[1.4fr,0.8fr,0.8fr,0.6fr,auto] gap-3 items-end">
        <label className="block">
          <span className="block text-xs text-neutral-600 mb-1">Product</span>
          <select
            value={line.productId}
            onChange={(e) => {
              const nextId = e.target.value;
              const next = catalog.find((x) => x.id === nextId);
              onChange(line.id, {
                productId: nextId,
                length: next?.lengths?.[0] || 16,
                density: 180,
                lace: "Transparent Lace",
              });
            }}
            className="w-full px-3 py-3 rounded-2xl border border-neutral-300 bg-white/80 text-sm"
          >
            {catalog.map((x) => (
              <option key={x.id} value={x.id}>
                {prettyType(x.type)} • {x.displayName || x.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-xs text-neutral-600 mb-1">Length</span>
          <select
            value={line.length}
            onChange={(e) => onChange(line.id, { length: Number(e.target.value) })}
            className="w-full px-3 py-3 rounded-2xl border border-neutral-300 bg-white/80 text-sm"
          >
            {(lineProduct?.lengths || []).map((len) => (
              <option key={len} value={len}>
                {len}{lineProduct?.type === "wig" ? "\"" : "\""}
              </option>
            ))}
          </select>
        </label>

        {lineProduct?.type === "wig" ? (
          <label className="block">
            <span className="block text-xs text-neutral-600 mb-1">Density</span>
            <select
              value={line.density}
              onChange={(e) => onChange(line.id, { density: Number(e.target.value) })}
              className="w-full px-3 py-3 rounded-2xl border border-neutral-300 bg-white/80 text-sm"
            >
              {wigDensities.map((densityValue) => (
                <option key={densityValue} value={densityValue}>
                  {densityValue}%
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="hidden md:block" />
        )}

        <label className="block">
          <span className="block text-xs text-neutral-600 mb-1">Qty</span>
          <input
            type="number"
            min={0}
            value={line.qty}
            onChange={(e) => onChange(line.id, { qty: e.target.value })}
            className="w-full px-3 py-3 rounded-2xl border border-neutral-300 bg-white/80 text-sm"
          />
        </label>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            className="px-3 py-2 rounded-full border border-neutral-300 bg-white/70 text-xs hover:bg-white"
            onClick={() => onChange(line.id, { qty: Math.max(0, Number(line.qty || 0) + 5) })}
          >
            +5
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-full border border-neutral-300 bg-white/70 text-xs hover:bg-white"
            onClick={() => onChange(line.id, { qty: Math.max(0, Number(line.qty || 0) + 10) })}
          >
            +10
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-full border border-neutral-300 bg-white/70 text-xs hover:bg-white"
            onClick={() => onRemove(line.id)}
            title="Remove"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500">
            {lineProduct?.collection ? `${lineProduct.collection} • ` : ""}{lineProduct?.texture || ""}{lineProduct?.color ? ` • ${lineProduct.color}` : ""}
          </p>
          <p className="text-sm text-neutral-800 mt-1">
            <span className="text-neutral-500">Retail:</span> {money(retailUnit)}&nbsp; &nbsp;
            <span className="text-neutral-500">5+:</span> {money(unit5)}&nbsp; &nbsp;
            <span className="text-neutral-500">10+:</span> {money(unit10)}
          </p>
        </div>

        <div className="text-sm text-neutral-800">
          <span className="text-neutral-500">Line retail:</span> {money((line.qty || 0) * retailUnit)}
        </div>
      </div>
    </div>
  );
}
