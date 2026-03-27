import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const LAST_UPDATED = "December 30, 2025";

export default function Returns() {
  return (
    <>
      <SEO
        title="Shipping & Returns Policy — Domestic & International"
        description="Eminence Hair shipping rates, delivery timelines, international options, and our return and exchange policy for wigs, bundles, and closures."
      />

      <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-light tracking-wide">Returns & Exchanges</h1>
            <p className="text-sm text-neutral-600">Last updated: {LAST_UPDATED}</p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              At Eminence, every order is handled with care and intention. Due to the hygienic nature
              of hair products, <span className="font-medium">all sales are final</span> unless otherwise
              stated in writing.
            </p>
          </header>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-xl font-medium">Damaged, defective, or incorrect orders</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              If your order arrives damaged, defective, or incorrect, please contact us within
              <span className="font-medium"> 48 hours of delivery</span> at:
            </p>
            <p className="text-sm">
              <a
                className="underline hover:text-neutral-900"
                href="mailto:support@eminenceluxuryhair.com"
              >
                support@eminenceluxuryhair.com
              </a>
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Include your order number, clear photos of the issue, and the original packaging (if applicable).
              Approved claims will be resolved through a replacement or store credit, at our discretion and as
              permitted by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">Final sale items</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Custom, made-to-order, worn, altered, installed, colored, chemically processed, or lace-cut items
              are final sale and are not eligible for return or exchange.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">Natural hair variance</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Our products are crafted from natural human hair. Variations in color, texture, density, and pattern
              are inherent and not considered defects. Product appearance may differ due to lighting, styling,
              packaging, shipping, handling, or care.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">Agreement</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              By purchasing from Eminence Hair, you acknowledge and agree to this policy and our{" "}
              <Link to="/terms" className="underline hover:text-neutral-900">
                Terms & Conditions
              </Link>
              {" "}and{" "}
              <Link to="/privacy" className="underline hover:text-neutral-900">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
