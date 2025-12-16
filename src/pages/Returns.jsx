import React from "react";

export default function Returns() {
  return (
    <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-light tracking-wide">Returns & Exchanges</h1>
          <p className="text-sm text-neutral-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-4">
          <p>
            At Eminence Hair, every order is handled with care and intention.
            Due to the hygienic nature of our products, all sales are final.
          </p>
          <p>
            We do not accept returns or exchanges once an order has been delivered.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Damaged or Incorrect Orders</h2>
          <p>
            If your order arrives damaged, defective, or incorrect, please contact
            us within <strong>48 hours of delivery</strong> at:
          </p>
          <p className="font-medium">support@eminenceluxuryhair.com</p>
          <p>
            Please include your order number, clear photos of the issue, and the
            original packaging (if applicable).
          </p>
          <p>
            Approved claims will be resolved through a replacement or store credit,
            at our discretion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Final Sale Items</h2>
          <p>
            Custom, made-to-order, worn, altered, installed, colored, or lace-cut
            items are final sale and are not eligible for return or exchange.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Product Variations</h2>
          <p>
            Our products are crafted from natural human hair. Variations in color,
            texture, density, and pattern are inherent and not considered defects.
            Product appearance may differ due to lighting, packaging, shipping,
            handling, or care.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Agreement</h2>
          <p>
            By purchasing from Eminence Hair, you acknowledge and agree to this
            Returns & Exchanges Policy, as well as our Terms & Conditions and
            Privacy Policy.
          </p>
        </section>
      </div>
    </div>
  );
}