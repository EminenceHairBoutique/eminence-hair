import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Minus,
  Plus,
  ChevronDown,
  Check,
} from "lucide-react";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import ScanToVerify from "../components/ScanToVerify";

/* ---------------- helpers ---------------- */
const formatMoney = (n) =>
  `$${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const ratingValue = 4.8;
const ratingCount = 182;

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
        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-neutral-600">
          {children}
        </div>
      )}
    </div>
  );
}

/* ---------------- page ---------------- */
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const product = useMemo(
    () => products.find((p) => p.slug === slug),
    [slug]
  );

  const isWig = product?.type === "wig";
  const isBundle = product?.type === "bundle";
  const isClosure = product?.type === "closure";

  const images = product?.images || [];

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [length, setLength] = useState(product?.lengths?.[0] || null);
  const [density, setDensity] = useState(product?.densities?.[0] || null);
  const [lace, setLace] = useState(null);
  const [capSize, setCapSize] = useState(null);

  /* ---- custom wig ---- */
  const [isCustom, setIsCustom] = useState(false);
  const [customNotes, setCustomNotes] = useState("");

  const price = useMemo(() => {
    if (!product) return 0;
    if (typeof product.price === "function") {
      return product.price(length, density);
    }
    return product.basePrice || 0;
  }, [product, length, density]);

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
    addToCart(
      {
        ...product,
        selectedLength: length,
        selectedDensity: density,
        laceType: lace,
        capSize,
        isCustom,
        customNotes,
        price,
        image: images[0],
      },
      qty
    );
    openCart?.(true);
  }

  return (
    <div className="pt-28 pb-24 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-neutral-600 mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-12 gap-12">

          {/* images */}
          <div className="lg:col-span-7 flex gap-4">
            <div className="hidden md:flex flex-col gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border ${
                    i === activeImage
                      ? "border-neutral-900"
                      : "border-neutral-200"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex-1 rounded-[2rem] overflow-hidden border bg-white">
              <img
                src={images[activeImage]}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* details */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] border p-7">

            <p className="text-xs tracking-[0.25em] text-neutral-500 uppercase">
              {product.collection}
            </p>

            <h1 className="mt-2 text-3xl font-light">{product.name}</h1>

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

            {/* options */}
            <div className="mt-8 space-y-6">

              {/* length */}
              {product.lengths && (
                <OptionGroup
                  label="Length"
                  values={product.lengths}
                  value={length}
                  onChange={setLength}
                  suffix='"'
                />
              )}

              {/* wig-only */}
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

                  {/* custom wig */}
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

              {/* quantity + add */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-full">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3"
                  >
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

              {/* 🔐 Scan to Verify — ADDITIVE ONLY */}
              <ScanToVerify code={product.verificationCode} />

            </div>

            {/* accordions */}
            <div className="mt-10">
              <Accordion title="Product Description">
                {product.description}
              </Accordion>
              <Accordion title="Hair Care">
                Use sulfate-free products. Air-dry when possible.
              </Accordion>
              <Accordion title="Shipping & Returns">
                Ships within 2–3 business days. Custom wigs are final sale.
              </Accordion>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- reusable options ---------------- */
function OptionGroup({ label, values, value, onChange, suffix = "" }) {
  return (
    <div>
      <p className="text-xs mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`px-4 py-1.5 text-[12px] rounded-full border ${
              v === value
                ? "bg-black text-white border-black"
                : "border-neutral-300"
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
