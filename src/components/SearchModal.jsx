import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { products } from "../data/products";
import { resolveProductImages } from "../utils/productMedia";
import { norm } from "../utils/strings";

/**
 * SearchModal
 * Lightweight product search (name / texture / collection / color) with keyboard support.
 */
export default function SearchModal({ open, onClose }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const needle = norm(q);
    if (!needle) return [];

    const scored = products
      .map((p) => {
        const hay = norm(
          `${p.displayName || p.name} ${p.collection} ${p.collectionSlug} ${p.texture} ${p.color}`
        );

        if (!hay.includes(needle)) return null;

        // small scoring boost: matches in name first
        const nameHay = norm(p.displayName || p.name);
        const score = nameHay.includes(needle) ? 3 : 1;
        return { p, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.p);

    return scored;
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60]"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <Motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute left-1/2 top-20 w-[min(960px,92vw)] -translate-x-1/2 rounded-[2rem] bg-[#FBF6EE] border border-black/10 shadow-[0_24px_70px_rgba(10,10,10,0.35)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-5 border-b border-black/10">
              <Search className="w-4 h-4 text-neutral-700" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search wigs, bundles, textures, colorways…"
                className="flex-1 bg-transparent outline-none text-sm text-neutral-900 placeholder:text-neutral-500"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/60 transition"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              {!q ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <QuickLink title="Wigs" href="/shop/wigs" subtitle="HD lace units" onClick={onClose} />
                  <QuickLink title="Bundles" href="/shop/bundles" subtitle="Raw hair bundles" onClick={onClose} />
                  <QuickLink
                    title="Start Here"
                    href="/start-here"
                    subtitle="Find your match" 
                    onClick={onClose}
                  />
                </div>
              ) : results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-neutral-700">No matches found.</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    Try searching by texture (BodyWave), color (613), or collection (SEA).
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.slug}`}
                      onClick={onClose}
                      className="group rounded-2xl border border-black/10 bg-white/50 hover:bg-white transition overflow-hidden"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-white">
                        <img
                          src={resolveProductImages(p)?.[0]}
                          alt={p.displayName || p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          {p.type === "bundle" ? "Bundle" : p.type === "closure" ? "Closure" : "Wig"}
                          {p.texture ? ` • ${p.texture}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-neutral-900">
                          {p.displayName || p.name}
                        </p>
                        {p.collection && (
                          <p className="mt-1 text-xs text-neutral-600">{p.collection}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                Tip: search "body", "613", "deep wave", or "essentials".
              </p>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickLink({ title, subtitle, href, onClick }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="rounded-2xl border border-black/10 bg-white/40 hover:bg-white/70 transition p-5"
    >
      <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500">{title}</p>
      <p className="mt-2 text-sm text-neutral-900">{subtitle}</p>
      <p className="mt-4 text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700">
        Explore
      </p>
    </Link>
  );
}
