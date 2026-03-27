import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { BRAND } from "../config/brand";
import SocialLinks from "./SocialLinks";

/**
 * MobileMenuDrawer
 * Full-screen mobile navigation for a clean, luxury experience.
 *
 * Goals:
 * - Covers the entire viewport (no background bleed)
 * - Locks body scroll while open
 * - Safe-area aware on iOS
 * - Accordion sections for fast access to categories
 */

function NavSection({
  id,
  title,
  openId,
  setOpenId,
  children,
}) {
  const open = openId === id;
  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 overflow-hidden">
      <button
        type="button"
        className="w-full px-4 py-4 flex items-center justify-between"
        onClick={() => setOpenId(open ? null : id)}
        aria-expanded={open}
      >
        <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="px-4 pb-4 grid gap-2">{children}</div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-xl border border-black/10 bg-white/70 hover:bg-white px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-neutral-800"
    >
      {children}
    </Link>
  );
}

export default function MobileMenuDrawer({ open, onClose, onSearch }) {
  const location = useLocation();
  const closeBtnRef = useRef(null);
  const [openSection, setOpenSection] = useState(null);

  // Close drawer on route change (extra safety)
  useEffect(() => {
    if (!open) return;
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  // Focus close button on open (nice UX for keyboard + screen readers)
  useEffect(() => {
    if (!open) return;
    setOpenSection(null);
    const t = setTimeout(() => closeBtnRef.current?.focus?.(), 50);
    return () => clearTimeout(t);
  }, [open]);

  const groups = useMemo(
    () => ({
      shop: [
        { label: "All Products", href: "/shop" },
        { label: "Ready-to-Ship", href: "/ready-to-ship" },
        { label: "Eminence Essentials", href: "/shop?collection=eminence-essentials" },
        { label: "HD Lace Wigs", href: "/shop/wigs" },
        { label: "Medical Grade Wigs", href: "/shop/medical" },
        { label: "Bundles", href: "/shop/bundles" },
        { label: "Closures & Frontals", href: "/shop/closures" },
      ],
      collections: [
        { label: "Eminence Collection", href: "/collections/eminence" },
        { label: "SEA Collection", href: "/collections/sea" },
        { label: "Burmese Collection", href: "/collections/burmese" },
        { label: "Lavish Collection", href: "/collections/lavish" },
        { label: "All Collections", href: "/collections" },
      ],
      services: [
        { label: "Custom Atelier", href: "/custom-atelier" },
        { label: "Medical Hair", href: "/medical-hair" },
        { label: "Private Consult", href: "/private-consult" },
        { label: "Authenticity", href: "/authenticity" },
        { label: "Care Guide", href: "/care" },
      ],
      partners: [
        { label: "Partner Program", href: "/partners" },
        { label: "Stylist Program", href: "/partners/stylists" },
        { label: "Creator Program", href: "/partners/creators" },
        { label: "Partner Portal", href: "/partner-portal" },
      ],
      about: [
        { label: "About Us", href: "/about" },
        { label: "Start Here", href: "/start-here" },
        { label: "FAQs", href: "/faqs" },
        { label: "Contact", href: "/contact" },
      ],
    }),
    []
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-[10000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <Motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <Motion.aside
            role="dialog"
            aria-modal="true"
            className="absolute inset-0 bg-[#FBF6EE] flex flex-col"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <Link to="/" onClick={onClose} className="leading-none">
                <p className="text-[13px] uppercase tracking-[0.28em] text-neutral-900">
                  {BRAND.name}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                  {BRAND.tagline}
                </p>
              </Link>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/70"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 flex-1 overflow-y-auto overscroll-contain">
              {/* Top actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onSearch?.();
                  }}
                  className="rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 bg-white/80 hover:bg-white"
                >
                  Search
                </button>
                <Link
                  to="/private-consult"
                  onClick={onClose}
                  className="rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white text-center"
                >
                  Consult
                </Link>
              </div>

              {/* Account */}
              <Link
                to="/account"
                onClick={onClose}
                className="mt-4 rounded-2xl border border-black/10 bg-white/70 hover:bg-white px-4 py-4 flex items-center justify-between"
              >
                <span className="text-[11px] uppercase tracking-[0.26em] text-neutral-900">
                  Account
                </span>
                <span className="text-neutral-500">→</span>
              </Link>

              {/* Sections */}
              <div className="mt-6 grid gap-3">
                <NavSection
                  id="shop"
                  title="Shop"
                  openId={openSection}
                  setOpenId={setOpenSection}
                >
                  {groups.shop.map((x) => (
                    <NavLink key={x.href} to={x.href} onClick={onClose}>
                      {x.label}
                    </NavLink>
                  ))}
                </NavSection>

                <NavSection
                  id="collections"
                  title="Collections"
                  openId={openSection}
                  setOpenId={setOpenSection}
                >
                  {groups.collections.map((x) => (
                    <NavLink key={x.href} to={x.href} onClick={onClose}>
                      {x.label}
                    </NavLink>
                  ))}
                </NavSection>

                <NavSection
                  id="services"
                  title="Services"
                  openId={openSection}
                  setOpenId={setOpenSection}
                >
                  {groups.services.map((x) => (
                    <NavLink key={x.href} to={x.href} onClick={onClose}>
                      {x.label}
                    </NavLink>
                  ))}
                </NavSection>

                <NavSection
                  id="partners"
                  title="Partners"
                  openId={openSection}
                  setOpenId={setOpenSection}
                >
                  {groups.partners.map((x) => (
                    <NavLink key={x.href} to={x.href} onClick={onClose}>
                      {x.label}
                    </NavLink>
                  ))}
                </NavSection>

                <NavSection
                  id="about"
                  title="About"
                  openId={openSection}
                  setOpenId={setOpenSection}
                >
                  {groups.about.map((x) => (
                    <NavLink key={x.href} to={x.href} onClick={onClose}>
                      {x.label}
                    </NavLink>
                  ))}
                </NavSection>
              </div>

              {/* Quick chips */}
              <div className="mt-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Quick Shop
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "Essentials", href: "/shop?collection=eminence-essentials" },
                    { label: "Wigs", href: "/shop/wigs" },
                    { label: "Bundles", href: "/shop/bundles" },
                    { label: "Medical", href: "/medical-hair" },
                    { label: "Authenticity", href: "/authenticity" },
                  ].map((x) => (
                    <Link
                      key={x.label}
                      to={x.href}
                      onClick={onClose}
                      className="rounded-full border border-black/10 bg-white/70 hover:bg-white px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-800"
                    >
                      {x.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-10 text-center text-[11px] text-neutral-500">
                <SocialLinks
                  variant="icon"
                  iconSize={18}
                  className="justify-center mb-4 gap-6"
                  linkClassName="text-neutral-500 hover:text-[#D4AF37]"
                />
                <span className="uppercase tracking-[0.22em]">Eminence Concierge</span>
                <div className="mt-2">Tap consult for private guidance.</div>
              </div>
            </div>
          </Motion.aside>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
