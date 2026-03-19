import React from "react";
import { Link } from "react-router-dom";
import { MICROCOPY } from "../config/brand";

/**
 * AnnouncementBar
 * Slim, luxury-style top bar used to reinforce trust signals without clutter.
 */
export default function AnnouncementBar() {
  const items = [
    { label: "Verified Origin", href: "/authenticity" },
    { label: "Private Consult", href: "/private-consult" },
    { label: "Care Guide", href: "/care" },
  ];

  return (
    <div className="w-full bg-[#111] text-[#FBF6EE] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.26em] text-white/70 shrink-0">
          {MICROCOPY.shippingLabel}
        </p>

        <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-[0.24em]">
          {items.map((it, idx) => (
            <React.Fragment key={it.href}>
              <Link
                to={it.href}
                className="text-white/65 hover:text-white/90 transition"
              >
                {it.label}
              </Link>
              {idx < items.length - 1 && <span className="text-white/20">·</span>}
            </React.Fragment>
          ))}
        </div>

        <p className="hidden lg:block text-[10px] uppercase tracking-[0.24em] text-white/60 shrink-0">
          {MICROCOPY.secureCheckout}
        </p>
      </div>
    </div>
  );
}
