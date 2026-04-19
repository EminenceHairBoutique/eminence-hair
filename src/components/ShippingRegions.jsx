import React, { useMemo, useState } from "react";
import { detectRegionLabel } from "../utils/locale";

const REGIONS = [
  {
    key: "US/Canada",
    title: "US / Canada",
    eta: "3–5 business days",
    note: "Orders are processed in 2–3 business days. Tracking provided.",
  },
  {
    key: "UK/EU",
    title: "UK / EU",
    eta: "5–10 business days",
    note: "Duties/VAT may apply depending on destination. Carrier collection possible.",
  },
  {
    key: "Africa",
    title: "Africa",
    eta: "7–14 business days",
    note: "Delivery times vary by country. Duties/taxes may apply.",
  },
  {
    key: "South America",
    title: "South America",
    eta: "7–14 business days",
    note: "Delivery times vary by country. Duties/taxes may apply.",
  },
];

/**
 * ShippingRegions
 * Small, luxury-friendly shipping clarity module.
 * Safe to render inside PDP accordions.
 */
export default function ShippingRegions({ compact = false }) {
  const active = useMemo(() => detectRegionLabel(), []);
  const [openKey, setOpenKey] = useState(active);

  const rows = REGIONS.map((r) => ({
    ...r,
    active: r.key === active,
  }));

  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white overflow-hidden ${compact ? "" : ""}`}>
      <div className="px-4 py-3 bg-[#FBF6ED]/60">
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-600">
          International delivery estimates
        </p>
        <p className="mt-1 text-xs text-neutral-700">
          We ship worldwide. Times below are estimates <span className="text-neutral-500">(excluding processing)</span>.
        </p>
      </div>

      <div className="divide-y divide-neutral-200">
        {rows.map((r) => {
          const open = openKey === r.key;
          return (
            <div key={r.key}>
              <button
                type="button"
                onClick={() => setOpenKey((k) => (k === r.key ? null : r.key))}
                className="w-full text-left px-4 py-3 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-neutral-900">
                    {r.title}{" "}
                    {r.active && (
                      <span className="ml-2 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                        Your region
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-600">Estimated: {r.eta}</p>
                </div>
                <span className={`text-neutral-400 text-sm transition ${open ? "rotate-180" : ""}`}>▾</span>
              </button>

              {open && (
                <div className="px-4 pb-4 text-xs text-neutral-700 leading-relaxed">
                  <p>{r.note}</p>
                  <p className="mt-2 text-neutral-500">
                    Duties, VAT, and import taxes are not included in item price and may be collected by the carrier.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
