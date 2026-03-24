// src/components/TrustStrip.jsx — Tasteful trust/social proof strip
import React from "react";
import { ShieldCheck, Microscope, Award, Truck } from "lucide-react";

const ITEMS = [
  {
    Icon: Microscope,
    label: "Third-Party Lab Verified",
    sub: "CNAS-accredited inspection",
  },
  {
    Icon: ShieldCheck,
    label: "Secure Checkout",
    sub: "Encrypted payments via Stripe",
  },
  {
    Icon: Award,
    label: "100% Raw Human Hair",
    sub: "Cambodian & Burmese origin",
  },
  {
    Icon: Truck,
    label: "Domestic & Intl Shipping",
    sub: "Discreet, tracked packaging",
  },
];

export default function TrustStrip() {
  return (
    <section
      className="border-t border-b border-neutral-200 bg-white py-5"
      aria-label="Trust and quality guarantees"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <item.Icon className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
              <p className="text-[11px] tracking-[0.18em] uppercase font-medium text-neutral-800">
                {item.label}
              </p>
              <p className="text-[10px] text-neutral-500">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
