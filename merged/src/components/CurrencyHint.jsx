import React, { useMemo } from "react";
import {
  detectPreferredCurrency,
  formatApproxCurrencyFromUSD,
  FX_LAST_UPDATED,
} from "../utils/locale";

/**
 * CurrencyHint
 * Display-only currency approximation to reduce friction for UK/EU shoppers.
 * - Does NOT change checkout currency (Stripe remains USD unless you enable multi-currency later)
 * - Uses conservative fixed FX rates in src/utils/locale.js
 */
export default function CurrencyHint({ amountUSD, className = "" }) {
  const currency = useMemo(() => detectPreferredCurrency(), []);
  const hint = useMemo(
    () => formatApproxCurrencyFromUSD(amountUSD, currency),
    [amountUSD, currency]
  );

  // Only show for non-USD
  if (!hint) return null;

  return (
    <p className={`mt-1 text-[11px] tracking-[0.18em] uppercase text-neutral-500 ${className}`}>
      {hint} <span className="text-neutral-400">({currency}, approx • {FX_LAST_UPDATED})</span>
    </p>
  );
}
