import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { RTI_PACKAGES } from "../data/catalogPricing";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(n || 0)
  );

function getMinLength(p) {
  const lengths = p.lengths || p.lengthOptions || [];
  if (!Array.isArray(lengths) || lengths.length === 0) return null;
  return Math.min(...lengths.map((x) => Number(x)).filter((x) => Number.isFinite(x)));
}

function getStartingPrice(p) {
  const L = getMinLength(p);
  if (typeof p.price === "function" && L != null) {
    try {
      const v = Number(p.price(L) || 0);
      return Number.isFinite(v) ? v : 0;
    } catch {
      return 0;
    }
  }
  return Number(p.fromPrice ?? p.basePrice ?? p.price ?? 0);
}

function RtiCollectionSection({ collection, packages, onAddToCart }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
        {collection}
      </h3>
      <p className="mt-1 text-xs text-neutral-500">
        {packages[0]?.texture}
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">
                Bundle Set
              </th>
              <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">
                3-Bundle Set
              </th>
              <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">
                + 5×5 Closure
              </th>
              <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-neutral-500 font-medium">
                + 13×4 Frontal
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg, i) => (
              <RtiPackageRow
                key={pkg.id}
                pkg={pkg}
                even={i % 2 === 0}
                onAddToCart={onAddToCart}
              />
            ))}
          </tbody>
        </table>
      </div>

      {packages[0]?.isPreorderEligible && (
        <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">
          Eligible for luxury pre-order pricing (15% off closure/frontal packages).
        </p>
      )}
    </div>
  );
}

function RtiPackageRow({ pkg, even, onAddToCart }) {
  const [mode, setMode] = useState("bundles"); // "bundles" | "closure" | "frontal"

  const activePrice =
    mode === "closure"
      ? pkg.closure5x5
      : mode === "frontal"
      ? pkg.frontal13x4
      : pkg.bundlesPrice;

  const label =
    mode === "closure"
      ? `${pkg.collection} ${pkg.bundleSet} + 5×5 Closure`
      : mode === "frontal"
      ? `${pkg.collection} ${pkg.bundleSet} + 13×4 Frontal`
      : `${pkg.collection} ${pkg.bundleSet}`;

  const handleAdd = () => {
    onAddToCart(
      {
        id: `${pkg.id}-${mode}`,
        name: label,
        displayName: label,
        type: "bundle",
        price: activePrice,
        hideFromShop: true,
        images: [],
      },
      { quantity: 1 }
    );
  };

  return (
    <tr className={even ? "bg-neutral-50/50" : ""}>
      <td className="px-4 py-3 font-medium text-neutral-900 whitespace-nowrap">
        {pkg.bundleSet}″
      </td>
      <td className="px-4 py-3 text-right text-neutral-800">
        <button
          type="button"
          onClick={() => setMode("bundles")}
          className={`rounded-full px-3 py-1 text-xs border transition ${
            mode === "bundles"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-300 hover:border-neutral-500"
          }`}
        >
          {money(pkg.bundlesPrice)}
        </button>
      </td>
      <td className="px-4 py-3 text-right text-neutral-800">
        <button
          type="button"
          onClick={() => setMode("closure")}
          className={`rounded-full px-3 py-1 text-xs border transition ${
            mode === "closure"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-300 hover:border-neutral-500"
          }`}
        >
          {money(pkg.closure5x5)}
        </button>
      </td>
      <td className="px-4 py-3 text-right text-neutral-800">
        <button
          type="button"
          onClick={() => setMode("frontal")}
          className={`rounded-full px-3 py-1 text-xs border transition ${
            mode === "frontal"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-300 hover:border-neutral-500"
          }`}
        >
          {money(pkg.frontal13x4)}
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-full bg-neutral-900 text-white px-4 py-1.5 text-xs font-medium hover:bg-neutral-800 transition"
        >
          Add to bag
        </button>
      </td>
    </tr>
  );
}

export default function ReadyToShip() {
  const { addToCart } = useCart();

  const ready = useMemo(
    () => products.filter((p) => Boolean(p.readyToShip)),
    []
  );

  const bundleStraight = ready.find((p) => p.id === "bundles-natural-straight");
  const bundleBodyWave = ready.find((p) => p.id === "bundles-natural-body-wave");
  const bundle613BodyWave = ready.find((p) => p.id === "bundles-613-body-wave");
  const closure4x4 = ready.find((p) => p.id === "closure-4x4");
  const closure5x5 = ready.find((p) => p.id === "closure-5x5");
  const frontal13x4 = ready.find((p) => p.id === "frontal-13x4");

  // Install sets (single SKU)
  const setStraight141618 = ready.find((p) => p.id === "install-set-straight-141618");
  const setBodyWave141618 = ready.find((p) => p.id === "install-set-bodywave-141618");
  const setStraight141618Closure = ready.find(
    (p) => p.id === "install-set-straight-141618-closure4x4"
  );
  const setBodyWave141618Closure = ready.find(
    (p) => p.id === "install-set-bodywave-141618-closure4x4"
  );
  const setStraight161820Frontal = ready.find(
    (p) => p.id === "install-set-straight-161820-frontal13x4"
  );
  const setBodyWave161820Frontal = ready.find(
    (p) => p.id === "install-set-bodywave-161820-frontal13x4"
  );

  const [bundleTexture, setBundleTexture] = useState("Straight");
  const [bundleColor, setBundleColor] = useState("1B");
  const [bundleLength, setBundleLength] = useState(16);

  const activeBundleProduct = useMemo(() => {
    if (bundleColor === "613") return bundle613BodyWave;
    return bundleTexture === "BodyWave" ? bundleBodyWave : bundleStraight;
  }, [bundleTexture, bundleColor, bundleStraight, bundleBodyWave, bundle613BodyWave]);

  const availableLengths = useMemo(() => {
    const L = activeBundleProduct?.lengths || [];
    return Array.isArray(L) ? L : [];
  }, [activeBundleProduct]);

  const addSingleBundle = () => {
    if (!activeBundleProduct) return;
    addToCart(activeBundleProduct, { length: bundleLength, quantity: 1 });
  };

  const addDeal = (deal) => {
    const isBW = bundleTexture === "BodyWave";

    const product =
      deal === "0"
        ? isBW
          ? setBodyWave141618
          : setStraight141618
        : deal === "A"
        ? isBW
          ? setBodyWave141618Closure
          : setStraight141618Closure
        : deal === "B"
        ? isBW
          ? setBodyWave161820Frontal
          : setStraight161820Frontal
        : null;

    if (!product) return;
    addToCart(product, { quantity: 1 });
  };

  return (
    <>
      <SEO
        title="Ready-to-Ship Wigs & Bundles — Fast 2–3 Day Dispatch"
        description="Shop in-stock Eminence wigs and bundles ready for 2–3 day dispatch. No wait times — luxury raw hair prepared for immediate shipping."
      />
      <div className="bg-[#0B0B0C] text-white">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
            Ready-to-Ship Edit
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            Your quickest route to an Eminence install.
          </h1>
          <p className="mt-4 text-white/70 leading-relaxed">
            These curated essentials are prepared for fast dispatch — ideal for last-minute
            installs, travel, or stylists who need premium hair on a timeline. (Everything else
            on the site remains available for custom production.)
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium"
            >
              Shop everything
            </Link>
            <Link
              to="/custom-atelier"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white"
            >
              Custom Atelier
            </Link>
            <Link
              to="/private-consult"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white"
            >
              Book a consultation
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium">Fast dispatch</p>
            <p className="mt-2 text-sm text-white/70">
              Typically ships in 2–3 business days (U.S.), with tracking.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium">Install-ready quality</p>
            <p className="mt-2 text-sm text-white/70">
              Same Eminence standards — soft, refined, and made to wear beautifully.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-medium">Need it styled?</p>
            <p className="mt-2 text-sm text-white/70">
              Use the Custom Atelier for knots, parting, density, or color.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white text-black">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Bundles (Ready-to-Ship)</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Choose a texture + length and add bundles instantly.
              </p>
            </div>
            <Link to="/shop/bundles" className="text-sm font-medium underline underline-offset-4">
              Browse bundles
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-neutral-200 p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Step 1
              </p>
              <p className="mt-2 font-medium">Texture</p>

              <div className="mt-4 flex gap-2">
                {[
                  { key: "Straight", label: "Straight" },
                  { key: "BodyWave", label: "Body Wave" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setBundleTexture(t.key)}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      bundleTexture === t.key
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <p className="mt-5 font-medium">Color</p>
              <div className="mt-3 flex gap-2">
                {[
                  { key: "1B", label: "Natural 1B" },
                  { key: "613", label: "613 Blonde" },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setBundleColor(c.key)}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      bundleColor === c.key
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {bundleColor === "613" && (
                <p className="mt-3 text-xs text-neutral-600">
                  613 is currently offered in Body Wave.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-neutral-200 p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Step 2
              </p>
              <p className="mt-2 font-medium">Length</p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {availableLengths.map((L) => (
                  <button
                    key={L}
                    onClick={() => setBundleLength(L)}
                    className={`rounded-2xl border px-3 py-3 text-sm ${
                      bundleLength === L
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {L}"
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-4">
                <p className="text-xs text-neutral-600">Estimated price</p>
                <p className="mt-1 text-xl font-semibold">
                  {activeBundleProduct ? money(activeBundleProduct.price(bundleLength)) : "—"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Step 3
              </p>
              <p className="mt-2 font-medium">Add to bag</p>

              <button
                onClick={addSingleBundle}
                className="mt-4 w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white"
                disabled={!activeBundleProduct}
              >
                Add bundle to bag
              </button>

              <p className="mt-3 text-xs text-neutral-600">
                Want a full install? Scroll down for bundle + closure/frontal sets.
              </p>

              <div className="mt-6">
                <p className="text-xs text-neutral-500 uppercase tracking-[0.18em]">
                  Starting at
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {activeBundleProduct ? money(getStartingPrice(activeBundleProduct)) : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Closures & Frontals</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Pair your bundles with a premium lace piece.
                </p>
              </div>
              <Link to="/shop/closures" className="text-sm font-medium underline underline-offset-4">
                Browse closures
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[closure4x4, closure5x5, frontal13x4].filter(Boolean).map((p) => (
                <div key={p.id} className="rounded-3xl border border-neutral-200 p-6">
                  <p className="text-sm font-medium">{p.displayName || p.name}</p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Starting at {money(getStartingPrice(p))}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.lengths.map((L) => (
                      <button
                        key={L}
                        onClick={() => addToCart(p, { length: L, quantity: 1 })}
                        className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-black"
                      >
                        Add {L}"
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-3xl border border-neutral-200 bg-black text-white p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                  Conversion Deals
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  Install-ready sets — added to bag in one click.
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Each set is added as a single item (one clean line in your bag). Need swaps or a
                  different lace piece? Our concierge can build a custom set.
                </p>
              </div>

              <div className="flex gap-2">
                {[
                  { key: "Straight", label: "Straight" },
                  { key: "BodyWave", label: "Body Wave" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setBundleTexture(t.key)}
                    className={`rounded-full px-4 py-2 text-sm border ${
                      bundleTexture === t.key
                        ? "border-white bg-white text-black"
                        : "border-white/25 bg-white/10 text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <button
                onClick={() => addDeal("0")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left hover:bg-white/10"
              >
                <p className="text-sm font-medium">3 Bundles</p>
                <p className="mt-1 text-sm text-white/70">Set: 14" / 16" / 18"</p>
                <p className="mt-3 text-xs text-white/60">
                  Set price:{" "}
                  {bundleTexture === "BodyWave"
                    ? setBodyWave141618
                      ? money(getStartingPrice(setBodyWave141618))
                      : "—"
                    : setStraight141618
                    ? money(getStartingPrice(setStraight141618))
                    : "—"}
                </p>
              </button>

              <button
                onClick={() => addDeal("A")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left hover:bg-white/10"
              >
                <p className="text-sm font-medium">3 Bundles + 4×4 Closure</p>
                <p className="mt-1 text-sm text-white/70">Set: 14" / 16" / 18" + 16" closure</p>
                <p className="mt-3 text-xs text-white/60">
                  Set price:{" "}
                  {bundleTexture === "BodyWave"
                    ? setBodyWave141618Closure
                      ? money(getStartingPrice(setBodyWave141618Closure))
                      : "—"
                    : setStraight141618Closure
                    ? money(getStartingPrice(setStraight141618Closure))
                    : "—"}
                </p>
              </button>

              <button
                onClick={() => addDeal("B")}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left hover:bg-white/10"
              >
                <p className="text-sm font-medium">3 Bundles + 13×4 Frontal</p>
                <p className="mt-1 text-sm text-white/70">Set: 16" / 18" / 20" + 18" frontal</p>
                <p className="mt-3 text-xs text-white/60">
                  Set price:{" "}
                  {bundleTexture === "BodyWave"
                    ? setBodyWave161820Frontal
                      ? money(getStartingPrice(setBodyWave161820Frontal))
                      : "—"
                    : setStraight161820Frontal
                    ? money(getStartingPrice(setStraight161820Frontal))
                    : "—"}
                </p>
              </button>
            </div>

            <p className="mt-6 text-xs text-white/60">
              Need a different set (or a 5×5 closure)? Use{" "}
              <Link to="/private-consult" className="underline underline-offset-4">
                Private Consult
              </Link>{" "}
              and we’ll build it for you.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#FBF6ED] text-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">
              Ready-to-Install
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Catalog Install Packages
            </h2>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-2xl">
              Pre-configured bundle sets from every collection — with optional 5×5 closure or
              13×4 frontal included. Tap a price to select your package type, then add to bag.
            </p>
          </div>

          {Object.entries(
            RTI_PACKAGES.reduce((acc, pkg) => {
              if (!acc[pkg.collection]) acc[pkg.collection] = [];
              acc[pkg.collection].push(pkg);
              return acc;
            }, {})
          ).map(([collection, pkgs]) => (
            <RtiCollectionSection
              key={collection}
              collection={collection}
              packages={pkgs}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-2xl">
          <h3 className="text-2xl font-semibold tracking-tight">Need a wig fast?</h3>
          <p className="mt-3 text-white/70 text-sm leading-relaxed">
            Our ready-to-ship wig inventory changes quickly. If you’re on a deadline, book a
            consultation and we’ll confirm what can dispatch immediately.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/medical-hair"
              className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium"
            >
              Medical Hair Solutions
            </Link>
            <Link
              to="/private-consult"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white"
            >
              Private Consult
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
