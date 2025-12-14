import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import logoWordmark from "../assets/logo_wordmark.svg";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now we just show a success state – backend can be wired later.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-28 pb-20">
      {/* Hero + Layout Shell */}
      <section className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-goldGlow relative bg-charcoal">
        {/* Background – Soft Editorial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF7] via-[#FBF5EC] to-[#E8D8B9] opacity-90" />

        {/* Content */}
        <div className="relative grid md:grid-cols-[1.1fr,1fr] gap-10 px-8 md:px-12 py-12 md:py-16">
          {/* Left: Editorial copy + contact info */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="mb-8">
                <img
                  src={logoWordmark}
                  alt="Eminence Hair"
                  className="h-10 md:h-12 w-auto mb-4"
                />
                <p className="uppercase tracking-[0.28em] text-[10px] md:text-[11px] text-softGray">
                  Eminence Hair Boutique
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <h1 className="font-header text-3xl md:text-4xl tracking-tight">
                  We're here with{" "}
                  <span className="text-gold">absolute care.</span>
                </h1>
                <p className="font-body text-sm md:text-base text-softGray leading-relaxed">
                  Whether you&apos;re inquiring about a luxury custom piece,
                  an existing order, or editorial requests, our concierge team
                  will respond with the same attention to detail we give every strand.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm md:text-[15px] font-body">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-gold" />
                <div>
                  <p className="uppercase tracking-[0.22em] text-[10px] text-softGray">
                    Email
                  </p>
                  <p className="text-ivory">support@eminencehair.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-gold" />
                <div>
                  <p className="uppercase tracking-[0.22em] text-[10px] text-softGray">
                    Concierge
                  </p>
                  <p className="text-ivory">By appointment only</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold" />
                <div>
                  <p className="uppercase tracking-[0.22em] text-[10px] text-softGray">
                    Location
                  </p>
                  <p className="text-ivory">New York, NY</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form card */}
          <div className="bg-ivory/95 text-charcoal rounded-3xl px-6 md:px-7 py-7 md:py-8 backdrop-blur-sm border border-softGray/60">
            {!submitted ? (
              <>
                <h2 className="font-header text-xl md:text-2xl mb-1">
                  Contact Concierge
                </h2>
                <p className="font-body text-xs md:text-sm text-neutral-600 mb-5">
                  Share a few details below and we&apos;ll be in touch within 1–2 business days.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm font-body">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-neutral-300 focus:outline-none focus:border-gold/80 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-transparent border-b border-neutral-300 focus:outline-none focus:border-gold/80 py-1.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full bg-transparent border-b border-neutral-300 focus:outline-none focus:border-gold/80 py-1.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-transparent border-b border-neutral-300 focus:outline-none focus:border-gold/80 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                        Order Number (optional)
                      </label>
                      <input
                        type="text"
                        className="w-full bg-transparent border-b border-neutral-300 focus:outline-none focus:border-gold/80 py-1.5 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                      Reason for contacting
                    </label>
                    <select
                      className="w-full bg-transparent border-b border-neutral-300 focus:outline-none focus:border-gold/80 py-1.5 text-sm"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="general">General inquiry</option>
                      <option value="order">Order support</option>
                      <option value="returns">Returns / exchanges</option>
                      <option value="custom">Custom wig order</option>
                      <option value="wholesale">Wholesale inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="w-full bg-transparent border border-neutral-300 rounded-xl focus:outline-none focus:border-gold/80 px-3 py-2 text-sm resize-none"
                      placeholder="Share as much detail as you&apos;d like about your request."
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full md:w-auto inline-flex items-center justify-center px-7 py-2.5 rounded-full bg-gold text-charcoal text-xs md:text-sm font-medium tracking-[0.18em] uppercase hover:bg-gold/90 transition"
                  >
                    Send message
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col items-start justify-center gap-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  Thank you
                </p>
                <h2 className="font-header text-2xl md:text-3xl">
                  Your message has been received.
                </h2>
                <p className="font-body text-sm text-neutral-600 max-w-md">
                  Our concierge team will review your note and respond to the email provided.
                  For urgent order changes, please reply directly to your order confirmation email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-neutral-300 text-xs md:text-sm tracking-[0.18em] uppercase hover:border-gold/80 hover:text-gold transition"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
