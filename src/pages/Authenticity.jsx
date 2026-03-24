import { useState } from "react";
import { X } from "lucide-react";
import ThirdPartyVerifiedBadge from "../components/ThirdPartyVerifiedBadge";
import SEO from "../components/SEO";

export default function Authenticity() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <SEO
        title="Hair Authenticity — Third-Party Lab Verified Quality"
        description="Every Eminence piece is independently inspected by a CNAS-accredited laboratory. Verify authenticity, view inspection reports, and scan your QR certificate."
      />
      <div className="pt-20 pb-20 bg-[#FBF6ED]">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-500 mb-4">
            Authenticity & Certification
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-6">
            Third-Party Verified.
            <br /> Transparently Sourced.
          </h1>
          <p className="max-w-2xl text-neutral-600 leading-relaxed">
            Every Eminence piece is independently inspected to verify composition,
            integrity, and quality. Our sourcing remains private — our standards do not.
          </p>
        </div>

        {/* CERTIFICATE DISPLAY */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_18px_40px_rgba(15,10,5,0.18)] mb-24">

          <p className="text-xs uppercase tracking-[0.32em] text-neutral-500 mb-6">
            Third-Party Inspection Report (Redacted)
          </p>

          {/* IMAGE */}
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setLightbox("/certificates/inspection-cover_redacted.webp")}
              className="group w-full"
            >
              <img
                src="/certificates/inspection-cover_redacted.webp"
                alt="Third-party hair inspection report"
                className="w-full rounded-2xl border border-neutral-200 shadow-lg transition group-hover:scale-[1.01]"
              />
            </button>

            <p className="mt-4 text-xs text-neutral-500 text-center">
              Issued by a CNAS / ILAC-MRA accredited laboratory · Report No. 202590222
            </p>
          </div>
          <div className="mt-6 flex justify-center">
  <ThirdPartyVerifiedBadge className="h-39" />
</div>


          {/* TRUST POINTS */}
          <div className="grid md:grid-cols-3 gap-10 mt-16 text-sm text-neutral-700">
            <div>
              <p className="uppercase tracking-[0.22em] text-xs text-neutral-500 mb-2">
                Accreditation
              </p>
              <p>CNAS · ILAC-MRA · CMA</p>
            </div>

            <div>
              <p className="uppercase tracking-[0.22em] text-xs text-neutral-500 mb-2">
                Inspection Result
              </p>
              <p>Verified as 100% Human Hair</p>
            </div>

            <div>
              <p className="uppercase tracking-[0.22em] text-xs text-neutral-500 mb-2">
                Standard
              </p>
              <p>FZ/T 01057.3-2007</p>
            </div>
          </div>
        </div>

        {/* ENGLISH TRANSLATION */}
        <details className="max-w-3xl mx-auto border border-neutral-300 rounded-[2rem] bg-white p-8 md:p-10 mb-24">
          <summary className="cursor-pointer text-sm uppercase tracking-[0.22em] text-neutral-700">
            View English Translation
          </summary>

          <div className="mt-8 text-sm text-neutral-700 leading-relaxed space-y-5">
            <p className="italic text-neutral-500">
              This English translation is provided for reference only.
              The original Chinese inspection report is the legally binding document.
            </p>

            <p><strong>Inspection Report No.:</strong> 202590222</p>

            <p><strong>Inspection Authority:</strong><br />
              National Hair Products and Hair Care Products Quality Inspection
              and Testing Center (Xuchang)
            </p>

            <p><strong>Accreditation:</strong><br />
              China National Accreditation Service (CNAS)<br />
              ILAC-MRA · CMA
            </p>

            <p><strong>Product:</strong> Human Hair</p>
            <p><strong>Specification:</strong> 100% Human Hair</p>

            <p><strong>Test Item:</strong> Human Hair Content</p>
            <p><strong>Test Standard:</strong> FZ/T 01057.3-2007</p>

            <p><strong>Inspection Result:</strong><br />
              The tested sample meets the inspection requirements and is verified
              as 100% human hair.
            </p>

            <p><strong>Conclusion:</strong><br />
              Based on inspection results and product labeling, the submitted
              sample complies with applicable quality standards.
            </p>

            <p><strong>Issue Date:</strong> March 07, 2025</p>
          </div>
        </details>

        {/* FUTURE VERIFICATION */}
        <div className="border border-neutral-300 rounded-[2rem] p-10 md:p-14 text-center bg-white">
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-500 mb-4">
            Coming Soon
          </p>
          <h3 className="text-2xl font-light mb-4 text-neutral-900">
            Digital Verification
          </h3>
          <p className="max-w-xl mx-auto text-neutral-600 leading-relaxed">
            QR-based authenticity verification and downloadable redacted certificates
            will be introduced to further protect our clients and our craft.
          </p>
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="relative max-w-5xl w-full bg-white rounded-[2rem] overflow-hidden">
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={lightbox}
              alt="Inspection certificate"
              className="w-full max-h-[85vh] object-contain bg-neutral-100"
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}
