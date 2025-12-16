import React from "react";

export default function Privacy() {
  return (
    <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-light tracking-wide">Privacy Policy</h1>
          <p className="text-sm text-neutral-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-4">
          <p>
            This Privacy Policy describes how Eminence Hair LLC (“Eminence Hair,”
            “we,” “us,” or “our”) collects, uses, discloses, and safeguards your
            personal information when you visit or make a purchase from our
            website, create an account, interact with our services, or otherwise
            communicate with us (collectively, the “Site” or “Services”).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Personal Information We Collect</h2>

          <h3 className="font-medium">Information Collected Automatically</h3>
          <p>
            When you visit or interact with the Site, we automatically collect
            certain information about your device and usage. This may include IP
            address, browser type, device identifiers, operating system, time
            zone, referring URLs, pages viewed, mouse movements, session data,
            cookies, and similar tracking technologies.
          </p>
          <p>
            <strong>Purpose:</strong> Site functionality, analytics, security,
            fraud prevention, and marketing optimization.
          </p>

          <h3 className="font-medium">Order & Account Information</h3>
          <p>
            When you create an account or place an order, we collect information
            such as name, email address, phone number, billing and shipping
            address, payment details, order history, and account credentials.
          </p>
          <p>
            <strong>Purpose:</strong> Order fulfillment, payment processing,
            customer service, account management, fraud screening, and legal
            compliance.
          </p>

          <h3 className="font-medium">Customer Support Communications</h3>
          <p>
            Information you provide when contacting us, including emails,
            messages, attachments, or call records, may be retained to assist
            you and improve our Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Sharing Personal Information</h2>
          <p>
            We share personal information with trusted service providers only as
            necessary to operate our business. These may include:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Authentication & account providers (e.g., Supabase, OAuth)</li>
            <li>Payment processors and fraud prevention partners</li>
            <li>Shipping and fulfillment providers</li>
            <li>Analytics and advertising platforms (Google, Meta, etc.)</li>
            <li>Email and SMS platforms (e.g., Klaviyo, Mailchimp)</li>
          </ul>
          <p>
            We may also disclose information to comply with legal obligations,
            enforce our agreements, or protect our rights and customers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Behavioral Advertising</h2>
          <p>
            We may use cookies, pixels, and similar technologies to deliver
            personalized advertisements. You can opt out of certain targeted
            advertising through your browser settings or industry opt-out tools
            such as the Digital Advertising Alliance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Data Retention</h2>
          <p>
            We retain personal information only as long as necessary to fulfill
            the purposes outlined in this policy, comply with legal obligations,
            resolve disputes, and enforce agreements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical
            safeguards to protect your information. However, no system is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct,
            delete, or restrict the use of your personal information. To exercise
            these rights, contact us using the information below.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">International Users</h2>
          <p>
            Our Site is operated in the United States. If you access it from
            outside the U.S., you consent to the transfer and processing of your
            information in the U.S. and other jurisdictions where data protection
            laws may differ.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Contact</h2>
          <p>
            Eminence Luxury Hair LLC<br />
            Email: support@eminenceluxuryhair.com
          </p>
        </section>
      </div>
    </div>
  );
}
