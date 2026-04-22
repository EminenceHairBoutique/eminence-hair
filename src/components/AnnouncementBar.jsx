import React from "react";
import { Link } from "react-router-dom";
import { MICROCOPY } from "../config/brand";

/**
 * AnnouncementBar
 * Slim, luxury-style top bar used to reinforce trust signals without clutter.
 */
export default function AnnouncementBar() {
  const items = [
    { label: MICROCOPY.authenticityLabel, href: "/authenticity" },
    { label: MICROCOPY.consultLabel, href: "/private-consult" },
    { label: "Care Guide", href: "/care" },
  ];

  return (
    <div className="w-full bg-[#111] text-[#FBF6EE] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/80">
          {MICROCOPY.shippingLabel}
        </p>

        <div className="hidden sm:flex items-center gap-3 text-[11px] uppercase tracking-[0.22em]">
          {items.map((it, idx) => (
            <React.Fragment key={it.href}>
              <Link
                to={it.href}
                className="text-white/80 hover:text-white transition"
              >
                {it.label}
              </Link>
              {idx < items.length - 1 && <span className="text-white/30">•</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="hidden md:block text-[11px] uppercase tracking-[0.22em] text-white/70">
          {MICROCOPY.secureCheckout}
        </div>
      </div>
    </div>
  );
}
