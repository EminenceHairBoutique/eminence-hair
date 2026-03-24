import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const LAST_UPDATED = "December 30, 2025";

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How Eminence Hair Boutique collects, uses, and protects your personal information. CCPA and privacy rights explained."
      />

      <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-light tracking-wide">Privacy Policy</h1>
            <p className="text-sm text-neutral-600">Last updated: {LAST_UPDATED}</p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              This Privacy Policy explains how <span className="font-medium">Eminence Luxury Hair LLC</span>
              (doing business as “Eminence Hair”; “we,” “us,” or “our”) collects, uses, and shares
              information when you visit our website, create an account, request a private consult,
              or make a purchase (collectively, the “Services”).
            </p>
          </header>

          {/* SUMMARY */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500">At a glance</p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
              <li>We collect information to process orders, provide support, and improve the site.</li>
              <li>Payments are processed by third-party providers (for example, Stripe).</li>
              <li>
                You can manage browser-based preferences via{" "}
                <Link to="/privacy-choices" className="underline hover:text-neutral-900">
                  Your Privacy Choices
                </Link>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">1) Information we collect</h2>

            <h3 className="font-medium">A. Information you provide</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
              <li>
                <span className="font-medium">Order & account details:</span> name, email, phone, billing/shipping
                address, order history, and account credentials.
              </li>
              <li>
                <span className="font-medium">Consultation & support:</span> messages you send, preferences you share,
                and details needed to assist you (for example, hair goals, styling preferences, fit notes).
              </li>
              <li>
                <span className="font-medium">Contact forms:</span> information you enter when you request a concierge
                consult or customer support.
              </li>
            </ul>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-700 leading-relaxed">
                Please do not submit highly sensitive information through our forms (for example, medical records).
                If you choose to share personal context related to hair loss, we use it only to support your request
                and deliver a discreet luxury experience.
              </p>
            </div>

            <h3 className="font-medium">B. Information collected automatically</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              When you use the Services, we may collect device and usage information such as IP address, browser type,
              pages viewed, approximate location (derived from IP), and similar diagnostic data. We use cookies and
              related technologies to remember preferences and, if enabled, measure site performance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">2) How we use information</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
              <li>Provide and improve the Services (including site performance and product experience).</li>
              <li>Process orders, payments, shipping, and customer support.</li>
              <li>Detect, prevent, and investigate fraud, abuse, and security incidents.</li>
              <li>Send transactional communications (order confirmations, service updates).</li>
              <li>
                Send marketing communications where permitted and where you choose to receive them (you can opt out at
                any time).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">3) Sharing information</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              We share information with service providers who help us run the business, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-700 leading-relaxed">
              <li>Payment processing (for example, Stripe)</li>
              <li>Order management and customer accounts (for example, Supabase)</li>
              <li>Email delivery for transactional messages (for example, Resend)</li>
              <li>Shipping, fraud prevention, and customer support tools</li>
              <li>
                Analytics and advertising providers (only if enabled through cookie preferences)
              </li>
            </ul>
            <p className="text-sm text-neutral-700 leading-relaxed">
              We may also disclose information to comply with law, enforce our agreements, protect rights, or in
              connection with a business transaction (such as a merger, acquisition, or asset sale).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">4) Cookies, analytics & your choices</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              You can manage non-essential cookies and similar technologies via{" "}
              <Link to="/privacy-choices" className="underline hover:text-neutral-900">
                Your Privacy Choices
              </Link>
              . If you disable analytics, we will not send analytics page-view events from this site.
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Some browsers and extensions support <span className="font-medium">Global Privacy Control (GPC)</span>.
              Where applicable, we treat GPC as a request to opt out of certain data sharing used for advertising.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">5) Data retention</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              We retain personal information for as long as reasonably necessary to fulfill the purposes described
              in this policy, including to comply with legal obligations, resolve disputes, and enforce agreements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">6) Security</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              We use reasonable administrative, technical, and physical safeguards designed to protect your
              information. No method of transmission or storage is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">7) Your privacy rights</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Depending on where you live, you may have rights to access, correct, delete, or obtain a copy of your
              personal information, and to opt out of certain processing (such as targeted advertising). To submit a
              request, contact us using the details below.
            </p>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-2">
              <p className="text-sm text-neutral-700 leading-relaxed">
                <span className="font-medium">California & certain U.S. state laws:</span> We do not sell personal
                information for money. However, some privacy laws define “sale”/“sharing” broadly to include certain
                advertising-related disclosures. You can opt out of such sharing by disabling Marketing in{" "}
                <Link to="/privacy-choices" className="underline hover:text-neutral-900">
                  Your Privacy Choices
                </Link>
                , enabling Global Privacy Control in your browser, and/or contacting us.
              </p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                You will not be required to create an account to submit a privacy request.
              </p>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed">
              We may need to verify your request before responding (for example, by confirming information associated
              with your account or order). You may also authorize an agent to submit a request on your behalf where
              permitted by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">8) International users</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              The Services are operated from the United States. If you access the Services from outside the U.S.,
              your information may be transferred to and processed in the U.S. and other jurisdictions where laws
              may differ.
            </p>
            <p className="text-sm text-neutral-700 leading-relaxed">
              For users in the EEA/UK, we generally process personal data to perform our contract with you (for
              example, to fulfill an order), to comply with legal obligations, and for legitimate interests (for
              example, security and fraud prevention). Where required, we rely on consent (for example, for certain
              cookies/marketing).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">9) Children</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              The Services are not directed to children under 13, and we do not knowingly collect personal
              information from children under 13. If you believe a child has provided us personal information,
              contact us so we can delete it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">10) Changes to this policy</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              We may update this Privacy Policy from time to time. The “Last updated” date shows when changes were
              made. Your continued use of the Services after updates become effective constitutes acceptance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">11) Contact</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Email: {" "}
              <a className="underline hover:text-neutral-900" href="mailto:support@eminenceluxuryhair.com">
                support@eminenceluxuryhair.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
