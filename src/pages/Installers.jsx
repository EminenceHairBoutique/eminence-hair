import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import PageHero from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";

const PLACEHOLDER = "/assets/eminence_product_display.webp";

function StylistCard({ stylist }) {
  const {
    full_name,
    business_name,
    city,
    country,
    booking_url,
    specialties,
    avatar_url,
  } = stylist;

  const specs = Array.isArray(specialties)
    ? specialties
    : typeof specialties === "string"
    ? specialties.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <article className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
      <div className="aspect-[4/3] bg-[#F5EFE6] overflow-hidden">
        <img
          src={avatar_url || PLACEHOLDER}
          alt={full_name || business_name || "Stylist"}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="text-base font-medium text-neutral-900 leading-snug">
          {full_name || business_name || "Independent Stylist"}
        </h3>
        {business_name && full_name && (
          <p className="text-xs text-neutral-500 mt-0.5">{business_name}</p>
        )}
        {(city || country) && (
          <p className="text-xs text-neutral-400 mt-1">
            {[city, country].filter(Boolean).join(", ")}
          </p>
        )}
        {specs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {specs.slice(0, 4).map((s) => (
              <span
                key={s}
                className="inline-block text-[10px] uppercase tracking-wider text-neutral-600 bg-[#F5EFE6] border border-black/[0.06] rounded-full px-2.5 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        {booking_url && (
          <a
            href={booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block text-center text-[11px] uppercase tracking-[0.22em] border border-black/20 text-neutral-900 rounded-full py-2.5 px-4 hover:border-black/50 transition"
          >
            Book Now
          </a>
        )}
      </div>
    </article>
  );
}

export default function Installers() {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Fetch approved partner_applications where the stylist has opted into the directory.
        const { data, error: err } = await supabase
          .from("partner_applications")
          .select(
            "id, full_name, business_name, city, country, booking_url, specialties, avatar_url"
          )
          .eq("status", "approved")
          .eq("directory_opt_in", true)
          .order("full_name", { ascending: true });

        if (err) throw err;
        setStylists(data || []);
      } catch (e) {
        console.error("Installers: failed to load stylists", e);
        setError("Could not load directory. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = stylists.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (s.full_name || "").toLowerCase().includes(q) ||
      (s.business_name || "").toLowerCase().includes(q) ||
      (s.city || "").toLowerCase().includes(q) ||
      (s.country || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <SEO
        title="Find a Certified Installer — Eminence Hair Boutique"
        description="Book a certified Eminence Hair Boutique installer near you. Our approved stylist partners are trained in HD lace, raw hair installs, and luxury finishing."
        path="/installers"
      />

      <PageHero
        eyebrow="Partner Directory"
        title="Find a Certified Installer"
        subtitle="Every stylist listed here is an approved Eminence partner — trained in HD lace installs, raw hair care, and luxury finishing techniques."
        align="center"
        ctas={[
          { label: "Become a Partner", href: "/partners/stylists", variant: "ghost" },
        ]}
      />

      <section className="bg-[#FBF6EE] min-h-screen pb-24">
        <div className="max-w-6xl mx-auto px-6 pt-12">
          {/* Search */}
          <div className="max-w-md mx-auto mb-10">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or city…"
              aria-label="Search stylists"
              className="w-full border border-black/15 rounded-full px-5 py-3 text-sm text-neutral-800 bg-white placeholder:text-neutral-400 outline-none focus:border-black/40 transition"
            />
          </div>

          {/* States */}
          {loading && (
            <p className="text-center text-sm text-neutral-500 py-16">Loading directory…</p>
          )}

          {!loading && error && (
            <p className="text-center text-sm text-red-500 py-16">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-sm mb-4">
                {search ? "No stylists match your search." : "No approved stylists in the directory yet."}
              </p>
              <Link
                to="/partners/stylists"
                className="inline-flex items-center justify-center text-[11px] uppercase tracking-[0.26em] border border-black/20 text-neutral-900 rounded-full px-6 py-2.5 hover:border-black/50 transition"
              >
                Apply as a Stylist Partner
              </Link>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <StylistCard key={s.id} stylist={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
