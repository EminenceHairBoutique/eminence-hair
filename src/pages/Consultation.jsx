import React from "react";
import { Link } from "react-router-dom";

export default function Consultation() {
  const calendlyUrl =
    import.meta.env.VITE_CALENDLY_URL ||
    "https://calendly.com/"; // set VITE_CALENDLY_URL in Vercel / .env

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
            Video Consultation
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            Let’s match you to the perfect piece — together.
          </h1>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            Book a private video consultation for wigs, installs, medical-grade solutions, or
            custom atelier requests. We’ll confirm fit, density, lace, and shipping timelines.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/medical-hair"
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
            >
              Medical Hair
            </Link>
            <Link
              to="/custom-atelier"
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
            >
              Custom Atelier
            </Link>
            <Link
              to="/private-consult"
              className="rounded-full border border-neutral-200 px-5 py-2 text-sm font-medium"
            >
              Private Consult
            </Link>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-neutral-200">
          <iframe
            title="Book a consultation"
            src={calendlyUrl}
            className="h-[760px] w-full"
            frameBorder="0"
          />
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          If the scheduler doesn’t load, open it directly:{" "}
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            {calendlyUrl}
          </a>
        </p>
      </div>
    </div>
  );
}
