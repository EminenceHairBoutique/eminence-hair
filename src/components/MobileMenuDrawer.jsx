import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { BRAND } from "../config/brand";

/**
 * MobileMenuDrawer
 * A clean, premium mobile nav that keeps the desktop mega menu intact.
 */
export default function MobileMenuDrawer({ open, onClose, onSearch, sections }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <Motion.aside
            className="fixed top-0 left-0 bottom-0 z-[1000] w-[86%] max-w-sm bg-[#FBF6EE] border-r border-black/10 shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="px-5 py-5 border-b border-black/10 flex items-center justify-between">
              <Link to="/" onClick={onClose} className="leading-none">
                <p className="text-[13px] uppercase tracking-[0.28em] text-neutral-900">
                  {BRAND.name}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                  {BRAND.tagline}
                </p>
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/60"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onSearch}
                  className="flex-1 rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 bg-white/60 hover:bg-white"
                >
                  Search
                </button>
                <Link
                  to="/private-consult"
                  onClick={onClose}
                  className="flex-1 rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white text-center"
                >
                  Consult
                </Link>
              </div>

              <Link
                to="/account"
                onClick={onClose}
                className="mt-3 flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-4"
              >
                <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
                  Account
                </span>
                <ChevronRight size={16} className="text-neutral-500" />
              </Link>

              <div className="mt-6 grid gap-2">
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-4"
                >
                  <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
                    Shop
                  </span>
                  <ChevronRight size={16} className="text-neutral-500" />
                </Link>
                <Link
                  to="/collections"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-4"
                >
                  <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
                    Collections
                  </span>
                  <ChevronRight size={16} className="text-neutral-500" />
                </Link>
                <Link
                  to="/start-here"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-4"
                >
                  <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
                    Start Here
                  </span>
                  <ChevronRight size={16} className="text-neutral-500" />
                </Link>
                <Link
                  to="/about"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/50 px-4 py-4"
                >
                  <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
                    About Us
                  </span>
                  <ChevronRight size={16} className="text-neutral-500" />
                </Link>
              </div>

              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Quick shop
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { label: "Essentials", href: "/shop?collection=eminence-essentials" },
                    { label: "Wigs", href: "/shop/wigs" },
                    { label: "Bundles", href: "/shop/bundles" },
                    { label: "Authenticity", href: "/authenticity" },
                  ].map((x) => (
                    <Link
                      key={x.label}
                      to={x.href}
                      onClick={onClose}
                      className="rounded-2xl border border-black/10 bg-white/50 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-neutral-800 text-center"
                    >
                      {x.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Optional: render the desktop menu sections (collapsed) */}
              {Array.isArray(sections) && sections.length > 0 && (
                <div className="mt-8 space-y-6">
                  {sections.map((sec) => (
                    <div key={sec.title}>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                        {sec.title}
                      </p>
                      <div className="mt-2 grid gap-2">
                        {sec.items?.slice(0, 4)?.map((it) => (
                          <Link
                            key={it.href}
                            to={it.href}
                            onClick={onClose}
                            className="text-sm text-neutral-800 hover:text-neutral-950"
                          >
                            {it.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
