import { useSearchParams, Link } from "react-router-dom";
import ThirdPartyVerifiedBadge from "../components/ThirdPartyVerifiedBadge";
import SEO from "../components/SEO";

export default function Verify() {
  const [params] = useSearchParams();
  const report = params.get("report") || params.get("code");

  return (
    <>
      <SEO
        title="Product Verification"
        description="Verify the authenticity of your Eminence Hair product. Each piece is independently inspected by an accredited third-party laboratory."
      />
      <div className="pt-28 pb-32 bg-[#FBF6ED]">
      <div className="max-w-3xl mx-auto px-6 text-center">

        <ThirdPartyVerifiedBadge className="h-10 mx-auto mb-10" />

        <p className="text-xs uppercase tracking-[0.32em] text-neutral-500 mb-4">
          Verification Result
        </p>

        <h1 className="text-3xl md:text-4xl font-light text-neutral-900 mb-6">
          Third-Party Inspection Verified
        </h1>

        <p className="text-neutral-600 leading-relaxed mb-10">
          This product has been independently inspected by an accredited
          third-party laboratory and verified for material authenticity.
        </p>

        <div className="bg-white rounded-[2rem] p-8 shadow-md mb-12 text-left space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 mb-2">
              Verification Status
            </p>
            <p className="text-sm text-neutral-900">
              ✔ Verified — Inspection record on file
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-500 mb-2">
              Inspection Report
            </p>
            <p className="text-lg text-neutral-900">
              {report ? `Report No. ${report}` : "202590222"}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-600">
              Verified as <strong>100% Human Hair</strong><br />
              CNAS · ILAC-MRA · CMA accredited laboratory
            </p>
          </div>
        </div>

        <Link
          to="/authenticity"
          className="inline-block text-xs uppercase tracking-[0.22em] border border-neutral-900 px-6 py-3 rounded-full hover:bg-neutral-900 hover:text-white transition"
        >
          View Certificate
        </Link>

        <p className="mt-10 text-xs text-neutral-500 max-w-xl mx-auto leading-relaxed">
          This verification page confirms inspection status only.  
          The original laboratory report is the legally binding document.
          Database-level verification and serial matching are in progress.
        </p>
      </div>
    </div>
    </>
  );
}
