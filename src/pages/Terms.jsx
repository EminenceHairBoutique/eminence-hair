import React from "react";

export default function Terms() {
  return (
    <div className="pt-28 pb-24 bg-neutral-50 text-neutral-900">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-light tracking-wide">
            Terms & Conditions
          </h1>
          <p className="text-sm text-neutral-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-4">
          <p>
            By accessing, browsing, or using this website, you acknowledge that you have
            read, understood, and agree to be bound by these Terms & Conditions, our
            Privacy Policy, and our Returns & Exchanges Policy.
          </p>
        </section>

        <section className="space-y-4">
          <p>
            These Terms and Conditions ("Terms") govern your use of the Eminence
            Hair website and services. By accessing or purchasing from our Site,
            you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Eligibility</h2>
          <p>
            You must be at least the age of majority in your jurisdiction to use
            our Services. By using the Site, you represent that you meet this
            requirement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Products & Natural Variance</h2>
          <p>
            Our products are crafted from natural human hair. Variations in color,
            texture, density, pattern, and finish are inherent and not considered
            defects. Product images are provided for reference only and may differ
            due to lighting, packaging, handling, shipping, maintenance, or
            individual care methods.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Orders & Payments</h2>
          <p>
            All orders are subject to acceptance and availability. We reserve
            the right to cancel or refuse any order due to suspected fraud,
            pricing errors, or inventory issues. Payment is required in full at
            checkout.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Shipping & Risk of Loss</h2>
          <p>
            Shipping times are estimates only. Risk of loss passes to you upon
            delivery to the carrier. We are not responsible for delays caused by
            carriers, customs, or external events.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Returns & Final Sale Items</h2>
          <p>
            Custom products, worn items, altered items, and sale items are final
            sale unless otherwise stated. Lace cutting, installation, coloring,
            or modification voids eligibility for return.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Prohibited Use</h2>
          <p>
            You may not misuse the Site, engage in fraudulent activity, violate
            laws, interfere with security features, or infringe intellectual
            property rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">
            Disclaimer & Limitation of Liability
          </h2>
          <p>
            The Site and products are provided “as is.” To the fullest extent
            permitted by law, Eminence Hair shall not be liable for indirect,
            incidental, or consequential damages. Liability shall not exceed the
            amount paid for the product.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Eminence Hair from any
            claims arising out of your use of the Site or violation of these
            Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States, without
            regard to conflict of law principles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">International Users</h2>
          <p>
            Where applicable, we process personal data in accordance with applicable
            data protection laws, including the GDPR and UK GDPR.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Agreement to Terms</h2>
          <p>
            By purchasing any product from Eminence Hair, you acknowledge that you have read,
            understood, and agreed to these Terms & Conditions, including our Returns &
            Exchanges Policy and Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Site
            constitutes acceptance of any changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-medium">Contact</h2>
          <p>Email: support@eminenceluxuryhair.com</p>
        </section>
      </div>
    </div>
  );
}
