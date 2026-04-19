import React from "react";
import { Link, useLocation } from "react-router-dom";

const LABELS = {
  shop: "Shop",
  collections: "Collections",
  products: "Products",
  about: "About",
  journal: "Journal",
  faqs: "FAQs",
  care: "Care Guide",
  contact: "Client Services",
  gallery: "Gallery",
  authenticity: "Authenticity",
  partners: "Partners",
  account: "Account",
  checkout: "Checkout",
  cart: "Cart",
  installers: "Installers",
  "for-professionals": "For Professionals",
  "custom-atelier": "Custom Atelier",
  "custom-orders": "Custom Orders",
  "private-consult": "Private Consult",
  "medical-hair": "Medical Hair",
  "ready-to-ship": "Ready to Ship",
  atelier: "Atelier",
  privacy: "Privacy",
  terms: "Terms",
  returns: "Returns",
  "privacy-choices": "Privacy Choices",
};

function humanize(segment) {
  return (
    LABELS[segment] ||
    segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function Breadcrumbs({ current }) {
  const location = useLocation();

  // Don't render on homepage
  if (location.pathname === "/") return null;

  const segments = location.pathname
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    const label = isLast && current ? current : humanize(seg);
    return { path, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-6xl mx-auto px-6 pt-24 pb-2"
    >
      <ol className="flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
        <li>
          <Link to="/" className="hover:text-neutral-900 transition">
            Home
          </Link>
        </li>
        {crumbs.map(({ path, label, isLast }) => (
          <li key={path} className="flex items-center gap-1">
            <span className="text-neutral-400 mx-1">/</span>
            {isLast ? (
              <span className="text-neutral-700" aria-current="page">
                {label}
              </span>
            ) : (
              <Link to={path} className="hover:text-neutral-900 transition">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
