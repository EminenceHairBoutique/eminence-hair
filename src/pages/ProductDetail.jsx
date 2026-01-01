import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Minus,
  Plus,
  ChevronDown,
  Check,
  QrCode,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

// ✅ FIX: match Shop's named export pattern
import { products } from "../data/products";

import { useCart } from "../context/CartContext";
import ScanToVerify from "../components/ScanToVerify";
import ImageZoomModal from "../components/ImageZoomModal";
import SEO from "../components/SEO";
import { trackViewItem } from "../utils/track";

/* ---------------- helpers ---------------- */
const formatMoney = (n) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const ratingValue = 4.8;
const ratingCount = 182;

/* ---------------- collection PDP copy ---------------- */
function EssentialLaceCopy({ product }) {
  const isEssential =
    (product?.collection || "").toLowerCase().includes("essential") ||
    (product?.displayName || "").toLowerCase().includes("essential lace") ||
    (product?.name || "").toLowerCase().includes("essential lace");

  if (!isEssential) return null;

  return (
    <div className="space-y-6 text-sm leading-relaxed text-neutral-600">
      <div>
        <p className="text-neutral-900 font-medium mb-2">A refined introduction to realism.</p>
        <p>
          Confidence begins with feeling natural. The Eminence Essential Lace Wig is thoughtfully
          designed for women seeking discreet, realistic hair without unnecessary complexity.
          Whether you're new to wigs, navigating hair thinning or medical hair loss, or simply
          prefer a clean, polished look — Essential Lace offers balance, comfort, and confidence
          you can trust.
        </p>
        <p className="mt-3">This is where realism starts.</p>
      </div>

      <div>
        <p className="text-neutral-900 font-medium mb-2">Key Benefits</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Soft Swiss lace for a natural hairline</li>
          <li>Lightweight, breathable cap construction</li>
          <li>Refined density for everyday wear</li>
          <li>Designed for first-time wig wearers and sensitive scalps</li>
          <li>Premium human hair with natural movement</li>
        </ul>
      </div>

      <div>
        <p className="text-neutral-900 font-medium mb-2">Construction Details</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Swiss lace front for a seamless hairline</li>
          <li>Carefully balanced density to avoid bulk or heaviness</li>
          <li>Adjustable cap designed for comfort and secure wear</li>
          <li>Breathable structure suitable for extended daily use</li>
        </ul>
        <p className="mt-3">
          Every element is chosen to feel light, natural, and intuitive — never overwhelming.
        </p>
      </div>

      <div>
        <p className="text-neutral-900 font-medium mb-2">Hair Quality</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Cuticle-aligned strands for reduced tangling</li>
          <li>No heavy silicone coatings</li>
          <li>Minimal processing to preserve natural texture</li>
          <li>Can be heat styled within care guidelines</li>
        </ul>
        <p className="mt-3">The result is hair that blends naturally — and behaves the way you expect.</p>
      </div>

      <div>
        <p className="text-neutral-900 font-medium mb-2">Who This Wig Is For</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>First-time wig wearers</li>
          <li>Women experiencing hair thinning or mild hair loss</li>
          <li>Medical hair loss clients seeking comfort and discretion</li>
          <li>Everyday professionals who prefer understated realism</li>
        </ul>
      </div>

      <div>
        <p className="text-neutral-900 font-medium mb-2">Confidence &amp; Support</p>
        <p>
          For clients experiencing medical hair loss, we can provide documentation suitable for
          cranial prosthesis reimbursement upon request.
        </p>
        <p className="mt-3">
          If you're unsure where to begin, our team offers private virtual consultations to help you
          choose the right length, density, and lace option — without pressure or confusion.
        </p>
      </div>

      <div>
        <p className="text-neutral-900 font-medium mb-2">Care &amp; Longevity</p>
        <p>
          With proper care, your Essential Lace wig is designed for consistent, reliable wear.
          We include gentle care guidelines, washing &amp; styling instructions, and long-term
          maintenance tips.
        </p>
      </div>

      <div className="pt-1">
        <p className="text-neutral-900 font-medium">
          There is nothing "basic" about feeling secure in your appearance.
        </p>
        <p className="mt-2">
          Eminence Essential Lace is designed to look natural, feel comfortable, and restore
          confidence — quietly.
        </p>
      </div>
    </div>
  );
}

/* ---------------- structured data ---------------- */
function ProductStructuredData({ product, price }) {
  if (!product) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.displayName || product.name,
    description: product.description,
    sku: product.verificationCode,
    brand: { "@type": "Brand", name: "Eminence Hair" },
    image: product.images?.slice(0, 6) || [],
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: Number(price || 0),
      url: typeof window !== "undefined" ? window.location.href : undefined,
    },    additionalProperty: {
      "@type": "PropertyValue",
      name: "Third-Party Verified",
      value: "Independently inspected by accredited laboratory",
    },
  };

  // Remove undefined fields (schema.org is picky)
  if (!data.offers.url) delete data.offers.url;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ---------------- accordion ---------------- */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-neutral-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm tracking-wide text-neutral-900">{title}</span>
        <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-neutral-600">{children}</div>}
    </div>
  );
}

function TrustItem({ icon: Icon, title, detail }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-[#FBF6ED]/60 p-4">
      <Icon className="w-4 h-4 mt-0.5 text-neutral-900" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{title}</p>
        <p className="text-xs text-neutral-700 mt-1 leading-snug">{detail}</p>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // route-based "loading skeleton" feel
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, [slug]);

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  const isWig = product?.type === "wig";
  const isBundle = product?.type === "bundle";
  const isClosure = product?.type === "closure";

  const images = product?.images || [];

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  // ✅ preserve your existing option UX; now with sensible defaults
  const [length, setLength] = useState(product?.lengths?.[0] || null);
  const [density, setDensity] = useState(product?.densities?.[0] || null);
  const [lace, setLace] = useState(isWig ? "HD Lace" : null);
  const [capSize, setCapSize] = useState(isWig ? "Medium" : null);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    setLength(product?.lengths?.[0] ?? null);
    setDensity(product?.densities?.[0] ?? null);

    // Defaults that reduce friction (still fully editable)
    const wig = product?.type === "wig";
    setLace(wig ? "HD Lace" : null);
    setCapSize(wig ? "Medium" : null);
  }, [product?.slug, product?.lengths, product?.densities, product?.type]);

  const [isCustom, setIsCustom] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  const [zoomOpen, setZoomOpen] = useState(false);

  // Sticky mobile add-to-bag bar
  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  const basePrice = useMemo(() => {
    if (!product) return 0;

    if (typeof product.price === "function") {
      try {
        return Number(product.price(length, density, lace) || 0);
      } catch {
        return Number(product.basePrice || 0);
      }
    }

    return Number(product.basePrice || 0);
  }, [product, length, density, lace]);

  const price = basePrice;

  // ViewItem tracking (GA4 + Meta Pixel) — only fires after consent.
  useEffect(() => {
    if (!product) return;
    trackViewItem(product, { value: Number(price || 0) || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (!product) {
    return (
      <div className="pt-32 text-center">
        <p className="text-neutral-600">Product not found.</p>
      </div>
    );
  }

  const canAdd =
    (isBundle && length) ||
    (isClosure && length) ||
    (isWig && length && density && lace && capSize);

  function handleAdd() {
    const variantParts = [
      length != null ? `L${length}` : "",
      density != null ? `D${density}` : "",
      lace ? `Lace:${lace}` : "",
      capSize ? `Cap:${capSize}` : "",
      isCustom ? "Custom" : "",
    ].filter(Boolean);

    addToCart({
      ...product,
      length,
      density,
      lace,
      capSize,
      selectedLength: length,
      selectedDensity: density,
      laceType: lace,
      isCustom,
      customNotes,
      price,
      image: images[0],
      quantity: qty,
      variant: variantParts.join("|") || "standard",
    });
  }

  const total = Number(price || 0) * Number(qty || 1);

  return (
    <>
      <SEO
        title={product.displayName || product.name}
        description={product.description}
        type="product"
        image={product?.images?.[0]}
      />

      <div className="pt-28 pb-24 bg-[#FBF6ED]">
        <ProductStructuredData product={product} price={price} />

        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs text-neutral-600 mb-6"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {/* lightweight skeleton */}
          {pageLoading ? (
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <div className="h-[520px] rounded-[2rem] bg-black/10 animate-pulse" />
              </div>
              <div className="lg:col-span-5">
                <div className="h-[520px] rounded-[2rem] bg-black/10 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12">
              {/* images */}
              <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
                {/* thumbnails (desktop) */}
                <div className="hidden md:flex flex-col gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border ${
                        i === activeImage ? "border-neutral-900" : "border-neutral-200"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${product.displayName || product.name} image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* main image with QR + zoom */}
                <div className="relative flex-1 rounded-[2rem] overflow-hidden border bg-white group">
                  <Motion.img
                    src={images[activeImage]}
                    alt={`${product.displayName || product.name} main image`}
                    onClick={() => setZoomOpen(true)}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  {product.verificationCode && (
                    <Link
                      to={`/verify?code=${product.verificationCode}`}
                      className="absolute bottom-4 right-4 rounded-full bg-white/90 backdrop-blur p-3 border hover:bg-white"
                      aria-label="Scan to verify authenticity"
                    >
                      <QrCode className="w-5 h-5 text-neutral-900" />
                    </Link>
                  )}
                </div>

                {/* thumbnails (mobile) */}
                {images.length > 1 && (
                  <div className="md:hidden flex gap-3 overflow-x-auto pt-3 pb-1 -mx-1 px-1">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`shrink-0 w-20 h-24 rounded-2xl overflow-hidden border ${
                          i === activeImage ? "border-neutral-900" : "border-neutral-200"
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${product.displayName || product.name} thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* details */}
              <div className="lg:col-span-5 bg-white rounded-[2rem] border p-7">
                <p className="text-xs tracking-[0.25em] text-neutral-500 uppercase">
                  {product.collection}
                </p>

                <h1 className="mt-2 text-3xl font-light">{product.displayName || product.name}</h1>

                {product.verificationCode && (
                  <p className="mt-2 text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                    Serial · {product.verificationCode}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600">
                  ★ ★ ★ ★ ★ {ratingValue} / 5 ({ratingCount})
                </div>

                {/* price */}
                <div className="mt-6">
                  <p className="text-2xl font-light">{formatMoney(price)}</p>
                  {isCustom && (
                    <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Crafted to order
                    </p>
                  )}
                </div>

                {/* trust */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TrustItem
                    icon={ShieldCheck}
                    title="Verified"
                    detail="Each unit includes a scannable code for authenticity confirmation."
                  />
                  <TrustItem
                    icon={Truck}
                    title="Shipping"
                    detail="Ready-to-ship units leave within 2–3 business days. Custom varies."
                  />
                  <TrustItem
                    icon={RotateCcw}
                    title="Returns"
                    detail="See Returns & Exchanges policy. Custom/worn items are final sale."
                  />
                  <TrustItem
                    icon={MessageCircle}
                    title="Support"
                    detail="Prefer guidance? Book a private consult before purchasing."
                  />
                </div>

                {/* options */}
                <div className="mt-8 space-y-6">
                  {product.lengths && (
                    <OptionGroup
                      label="Length"
                      values={product.lengths}
                      value={length}
                      onChange={setLength}
                      suffix='"'
                    />
                  )}

                  {isWig && (
                    <>
                      <OptionGroup
                        label="Density"
                        values={product.densities}
                        value={density}
                        onChange={setDensity}
                        suffix="%"
                      />

                      <OptionGroup
                        label="Lace Type"
                        values={["HD Lace", "Transparent Lace"]}
                        value={lace}
                        onChange={setLace}
                      />

                      <OptionGroup
                        label="Cap Size"
                        values={["Small", "Medium", "Large"]}
                        value={capSize}
                        onChange={setCapSize}
                      />

                      <div className="border rounded-xl p-4">
                        <label className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isCustom}
                            onChange={(e) => setIsCustom(e.target.checked)}
                          />
                          Request a custom wig
                        </label>

                        {isCustom && (
                          <textarea
                            placeholder="Color requests, knots, fit, density above 250%, notes…"
                            value={customNotes}
                            onChange={(e) => setCustomNotes(e.target.value)}
                            className="mt-3 w-full border rounded-lg p-2 text-xs"
                          />
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-full">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3" aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="px-3" aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      disabled={!canAdd}
                      onClick={handleAdd}
                      className={`flex-1 py-2.5 rounded-full text-[12px] tracking-[0.22em] ${
                        canAdd
                          ? "bg-black text-white"
                          : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      }`}
                    >
                      Add to Bag
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/private-consult"
                      className="inline-block px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                    >
                      Private Consult
                    </Link>

                    <Link
                      to="/care"
                      className="inline-block px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/50 hover:bg-white transition"
                    >
                      Care Guide
                    </Link>
                  </div>

                  <ScanToVerify code={product.verificationCode} />
                </div>

                <div className="mt-10">
                  {/* Collection-specific PDP copy (Essential Lace only) */}
                  {((product?.collection || "").toLowerCase().includes("essential") ||
                    (product?.displayName || "").toLowerCase().includes("essential lace") ||
                    (product?.name || "").toLowerCase().includes("essential lace")) && (
                    <Accordion title="Essential Lace Details">
                      <EssentialLaceCopy product={product} />
                    </Accordion>
                  )}

                  <Accordion title="What’s Included">
                    <ul className="list-disc pl-5 space-y-1">
                      {isWig && (
                        <>
                          <li>HD lace unit (as selected)</li>
                          <li>Adjustable cap construction</li>
                          <li>Care + styling guidance</li>
                        </>
                      )}
                      {isBundle && (
                        <>
                          <li>Bundle (length as selected)</li>
                          <li>Care + styling guidance</li>
                        </>
                      )}
                      {isClosure && (
                        <>
                          <li>Closure (length as selected)</li>
                          <li>Care + styling guidance</li>
                        </>
                      )}
                    </ul>
                  </Accordion>

                  {/* Generic description */}
                  <Accordion title="Product Description">{product.description}</Accordion>

                  <Accordion title="Hair Care">
                    <p className="mb-2">
                      Use sulfate-free products. Air-dry when possible. For the full ritual and
                      texture-specific care, see our{" "}
                      <Link to="/care" className="underline hover:text-neutral-900">
                        Care Guide
                      </Link>
                      .
                    </p>
                  </Accordion>

                  <Accordion title="Shipping & Returns">
                    <p className="mb-2">
                      In-stock pieces typically ship within 2–3 business days. Custom pieces have
                      varying lead times. Due to the hygienic nature of hair products, all sales are
                      final unless otherwise stated in writing.
                    </p>
                    <p className="mb-2">
                      If your order arrives damaged or incorrect, contact us within <strong>48 hours</strong>
                      of delivery with your order number and clear photos.
                    </p>
                    <p className="mb-2">
                      Product appearance may vary due to natural hair characteristics.
                    </p>
                    <p>
                      By purchasing, you agree to our{" "}
                      <Link to="/returns" className="underline hover:text-neutral-900">
                        Returns & Exchanges Policy
                      </Link>{" "}
                      and{" "}
                      <Link to="/terms" className="underline hover:text-neutral-900">
                        Terms & Conditions
                      </Link>
                      .
                    </p>
                  </Accordion>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky mobile bar */}
        {sticky && (
          <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
            <div className="mx-auto max-w-7xl px-4 pb-4">
              <div className="rounded-2xl border bg-white/90 backdrop-blur shadow-[0_18px_40px_rgba(15,10,5,0.22)] p-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Total</p>
                  <p className="text-sm font-medium text-neutral-900 truncate">{formatMoney(total)}</p>
                </div>

                <button
                  disabled={!canAdd}
                  onClick={handleAdd}
                  className={`px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] ${
                    canAdd
                      ? "bg-neutral-900 text-[#F9F7F4] hover:bg-black"
                      : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zoom modal */}
        <ImageZoomModal
          src={images[activeImage]}
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
        />
      </div>
    </>
  );
}

/* ---------------- reusable options ---------------- */
function OptionGroup({ label, values, value, onChange, suffix = "" }) {
  if (!Array.isArray(values) || values.length === 0) return null;

  return (
    <div>
      <p className="text-xs mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`px-4 py-1.5 text-[12px] rounded-full border ${
              v === value ? "bg-black text-white border-black" : "border-neutral-300"
            }`}
          >
            {v}
            {suffix}
          </button>
        ))}
      </div>
    </div>
  );
}
