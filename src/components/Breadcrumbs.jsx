import React from "react";
import { Link, useLocation } from "react-router-dom";

const labelMap = {
  shop: "Shop",
  products: "Products",
  collections: "Collections",
  journal: "Journal",
  about: "About",
  contact: "Contact",
  faqs: "FAQs",
  care: "Care",
  gallery: "Gallery",
  account: "Account",
  cart: "Cart",
  checkout: "Checkout",
  partners: "Partners",
  stylists: "Stylists",
  creators: "Creators",
  portal: "Portal",
  consultation: "Consultation",
  authenticity: "Authenticity",
  privacy: "Privacy",
  terms: "Terms",
  returns: "Returns",
  installers: "Installers",
  verify: "Verify",
  atelier: "Atelier",
  admin: "Admin",
  "start-here": "Start Here",
  "ready-to-ship": "Ready to Ship",
  "custom-orders": "Custom Orders",
  "custom-atelier": "Custom Atelier",
  "custom-wig": "Custom Wig",
  "medical-hair": "Medical Hair",
  "private-consult": "Private Consult",
  "privacy-choices": "Privacy Choices",
  "for-professionals": "For Professionals",
  "try-on": "Try On",
  mirror: "Mirror",
  preorder: "Preorder",
};

function toReadable(segment) {
  if (labelMap[segment]) return labelMap[segment];
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-6xl mx-auto px-6 pt-4 pb-1"
    >
      <ol className="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-[0.22em]">
        <li>
          <Link to="/" className="text-neutral-400 hover:text-gold transition-colors">
            Home
          </Link>
        </li>
        {segments.map((segment, i) => {
          const path = "/" + segments.slice(0, i + 1).join("/");
          const isLast = i === segments.length - 1;

          return (
            <li key={path} className="flex items-center gap-1">
              <span className="text-neutral-300" aria-hidden="true">/</span>
              {isLast ? (
                <span className="text-neutral-600" aria-current="page">
                  {toReadable(segment)}
                </span>
              ) : (
                <Link
                  to={path}
                  className="text-neutral-400 hover:text-gold transition-colors"
                >
                  {toReadable(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
