import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const LAST_UPDATED = "December 30, 2025";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Terms & Conditions for Eminence Hair."
      />

      <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-light tracking-wide">Terms & Conditions</h1>
            <p className="text-sm text-neutral-600">Last updated: {LAST_UPDATED}</p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              These Terms & Conditions ("Terms") govern your access to and use of the Eminence
              Hair website, products, and services (collectively, the "Services"). By visiting,
              browsing, creating an account, or purchasing, you agree to these Terms.
            </p>
          </header>

          {/* QUICK LINKS */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500">Quick links</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <a className="underline underline-offset-4" href="#orders">
                Orders
              </a>
              <a className="underline underline-offset-4" href="#shipping">
                Shipping
              </a>
              <a className="underline underline-offset-4" href="#final-sale">
                Final sale
              </a>
              <a className="underline underline-offset-4" href="#product-variance">
                Natural variance
              </a>
              <a className="underline underline-offset-4" href="#liability">
                Liability
              </a>
              <a className="underline underline-offset-4" href="#privacy">
                Privacy
              </a>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">1) Who we are</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              The Services are operated by <span className="font-medium">Eminence Luxury Hair LLC</span>
              (doing business as "Eminence Hair"; "Eminence," "we," "us," or "our").
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">2) Eligibility</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              You must be at least the age of majority in your jurisdiction to use the Services.
              By using the Services, you represent that you meet this requirement.
            </p>
          </section>

          <section id="orders" className="space-y-4">
            <h2 className="text-xl font-medium">3) Orders, pricing & payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
              <li>
                <span className="font-medium">Product availability:</span> All orders are subject to
                acceptance and availability. We may limit quantities, cancel orders, or refuse
                service where permitted by law.
              </li>
              <li>
                <span className="font-medium">Pricing:</span> Prices can change without notice.
                If a price or listing error occurs, we may cancel and refund the affected order.
              </li>
              <li>
                <span className="font-medium">Taxes & shipping:</span> Taxes and shipping are
                calculated at checkout where applicable.
              </li>
              <li>
                <span className="font-medium">Payment processing:</span> Payments are processed by
                third-party payment providers (for example, Stripe). We do not store full payment
                card numbers on our servers.
              </li>
              <li>
                <span className="font-medium">Fraud screening:</span> We may use automated and manual
                tools to help prevent fraud and protect customers.
              </li>
            </ul>
          </section>

          <section id="shipping" className="space-y-4">
            <h2 className="text-xl font-medium">4) Shipping, delivery & risk of loss</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
              <li>
                <span className="font-medium">Timing:</span> Shipping timelines are estimates and can
                vary due to processing, carrier delays, weather, customs, or other events.
              </li>
              <li>
                <span className="font-medium">Address accuracy:</span> You are responsible for
                providing a complete and accurate shipping address.
              </li>
              <li>
                <span className="font-medium">Risk of loss:</span> Risk of loss passes to you upon
                the carrier's acceptance of the shipment, to the extent permitted by law.
              </li>
              <li>
                <span className="font-medium">International:</span> International orders may be
                subject to duties, taxes, and fees set by your jurisdiction.
              </li>
            </ul>
          </section>

          <section id="final-sale" className="space-y-4">
            <h2 className="text-xl font-medium">5) Final sale, hygiene standards & claims</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Due to the hygienic nature of hair products, <span className="font-medium">all sales are final</span>
              unless otherwise stated in writing. Please read our{" "}
              <Link to="/returns" className="underline hover:text-neutral-900">
                Returns & Exchanges Policy
              </Link>
              , which is incorporated into these Terms.
            </p>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-700 leading-relaxed">
                <span className="font-medium">Damaged or incorrect orders:</span> If your order
                arrives damaged, defective, or incorrect, contact us within <span className="font-medium">48 hours</span>
                of delivery with your order number and clear photos. If approved, we will resolve
                the claim with a replacement or store credit, at our discretion and as permitted by law.
              </p>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed">
              <span className="font-medium">Custom work:</span> Custom, made-to-order, altered,
              installed, colored, or lace-cut items are final sale.
            </p>
          </section>

          <section id="product-variance" className="space-y-4">
            <h2 className="text-xl font-medium">6) Product information & natural variance</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Our products are crafted from natural human hair. Variations in color, texture,
              density, wave pattern, and finish are inherent and not considered defects.
              Images are for reference and may vary due to lighting, styling, and handling.
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              For best results, follow our{" "}
              <Link to="/care" className="underline hover:text-neutral-900">
                Care Guide
              </Link>
              . Heat, chemical processing, adhesives, and installation methods can impact longevity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">7) Medical hair concierge information</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Any information provided on our Medical Hair Concierge page is general informational
              content only and is not tax, legal, insurance, or medical advice. Coverage for
              HSA/FSA or insurance reimbursement varies by plan and is not guaranteed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">8) Accounts</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              If you create an account, you are responsible for maintaining the confidentiality
              of your login credentials and for all activity under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">9) Intellectual property</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              The Services (including branding, text, graphics, images, product names, and design)
              are owned by Eminence or our licensors and are protected by intellectual property laws.
              You may not copy, reproduce, distribute, or exploit any portion of the Services without
              our prior written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">10) Prohibited use</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              You agree not to misuse the Services, attempt unauthorized access, interfere with
              security features, scrape content at scale, submit fraudulent requests, or violate
              any applicable laws or third-party rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">11) Third-party services & links</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              The Services may reference or link to third-party websites or services. We are not
              responsible for third-party content, policies, or practices. Use them at your own risk.
            </p>
          </section>

          <section id="liability" className="space-y-4">
            <h2 className="text-xl font-medium">12) Disclaimer of warranties</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              The Services and products are provided on an "as is" and "as available" basis.
              To the fullest extent permitted by law, we disclaim all warranties, express or implied,
              including implied warranties of merchantability, fitness for a particular purpose,
              and non-infringement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">13) Limitation of liability</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              To the fullest extent permitted by law, Eminence will not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from or related to the
              Services or products. Our total liability for any claim will not exceed the amount you
              paid for the product giving rise to the claim.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">14) Indemnification</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Eminence from any claims, losses,
              liabilities, and expenses (including reasonable attorneys' fees) arising from your
              use of the Services, your violation of these Terms, or your infringement of any
              third-party rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">15) Governing law</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              These Terms are governed by the laws of the U.S. state where Eminence Luxury Hair LLC
              maintains its principal place of business, without regard to conflict-of-law principles.
            </p>
          </section>

          <section id="privacy" className="space-y-4">
            <h2 className="text-xl font-medium">16) Privacy</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Our{" "}
              <Link to="/privacy" className="underline hover:text-neutral-900">
                Privacy Policy
              </Link>
              {" "}explains how we collect, use, and share information. Your browser-based preferences
              can be managed via{" "}
              <Link to="/privacy-choices" className="underline hover:text-neutral-900">
                Your Privacy Choices
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">17) Changes to these Terms</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              We may update these Terms from time to time. The "Last updated" date indicates when
              changes were made. Continued use of the Services after changes become effective
              constitutes acceptance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">18) Contact</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Email us at{" "}
              <a className="underline hover:text-neutral-900" href="mailto:support@eminenceluxuryhair.com">
                support@eminenceluxuryhair.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
