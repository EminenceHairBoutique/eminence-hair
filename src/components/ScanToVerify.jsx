import { Link } from "react-router-dom";
import ThirdPartyVerifiedBadge from "./ThirdPartyVerifiedBadge";

export default function ScanToVerify({ code }) {
  if (!code) return null;

  return (
    <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-5">
      <div className="flex items-start gap-4">
        <ThirdPartyVerifiedBadge className="h-8 w-auto flex-shrink-0" />

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">
            Authenticity
          </p>

          <p className="text-sm text-neutral-700">
            This product has been independently verified by a third-party laboratory.
          </p>

          <Link
            to={`/verify?code=${code}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-neutral-900 hover:opacity-70"
          >
            Scan / Verify authenticity →
          </Link>
        </div>
      </div>
    </div>
  );
}
