import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { X, Minus, Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

const formatMoney = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

function OptionGroup({ label, values, value, onChange, suffix = "" }) {
  if (!Array.isArray(values) || values.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`px-4 py-2 rounded-full text-[12px] border transition ${
              v === value
                ? "bg-black text-white border-black"
                : "border-neutral-300 bg-white hover:bg-neutral-50"
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

/**
 * QuickViewModal
 * A fast, luxe "peek" at a product without leaving the grid.
 * - Wigs: supports option selection + add to bag
 * - Bundles/Closures: quick add with length selection
 */
export default function QuickViewModal({ open, onClose, product }) {
  const { addToCart, openCart } = useCart();

  const isWig = product?.type === "wig";
  const isBundle = product?.type === "bundle";
  const isClosure = product?.type === "closure" || product?.type === "frontal";

  const images = product?.images || [];

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const [length, setLength] = useState(product?.lengths?.[0] ?? null);
  const [density, setDensity] = useState(product?.densities?.[0] ?? null);
  const [lace, setLace] = useState(
    isWig ? product?.laces?.[0] ?? "Transparent Lace" : null
  );
  const [capSize, setCapSize] = useState(isWig ? "Medium" : null);

  // Reset when opened / product changes
  useEffect(() => {
    if (!open) return;
    setActiveImage(0);
    setQty(1);
    setLength(product?.lengths?.[0] ?? null);
    setDensity(product?.densities?.[0] ?? null);
    setLace(product?.type === "wig" ? product?.laces?.[0] ?? "Transparent Lace" : null);
    setCapSize(product?.type === "wig" ? "Medium" : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const price = useMemo(() => {
    if (!product) return 0;

    if (typeof product.price === "function") {
      try {
        return Number(product.price(length, density, lace) || 0);
      } catch {
        // Fallback if product.price throws for unexpected args
        try {
          return Number(product.price(length) || 0);
        } catch {
          return Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0);
        }
      }
    }

    return Number(product.basePrice ?? product.fromPrice ?? product.price ?? 0);
  }, [product, length, density, lace]);

  const canAdd = useMemo(() => {
    if (!product) return false;
    if (isBundle || isClosure) return Boolean(length);
    if (isWig) return Boolean(length && density && lace && capSize);
    return true;
  }, [product, isBundle, isClosure, isWig, length, density, lace, capSize]);

  const total = Number(price || 0) * Number(qty || 1);

  const handleAdd = () => {
    if (!product || !canAdd) return;

    const variantParts = [
      length != null ? `L${length}` : "",
      density != null ? `D${density}` : "",
      lace ? `Lace:${lace}` : "",
      capSize ? `Cap:${capSize}` : "",
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
      price,
      image: images?.[0],
      quantity: qty,
      variant: variantParts.join("|") || "standard",
    });

    // Premium feel: confirm add by opening cart + closing modal
    openCart?.();
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && product && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80]"
          aria-modal="true"
          role="dialog"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close quick view"
            onClick={onClose}
          />

          <Motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute left-1/2 top-14 w-[min(1080px,94vw)] -translate-x-1/2 rounded-[2rem] bg-[#FBF6EE] border border-white/50 shadow-[0_28px_80px_rgba(10,10,10,0.40)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.26em] text-neutral-500">
                  Quick View
                </p>
                <p className="mt-1 text-sm text-neutral-900 truncate">
                  {product.displayName || product.name}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/60 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Images */}
                <div className="md:col-span-7">
                  <div className="rounded-[1.75rem] overflow-hidden border border-black/10 bg-white">
                    <img
                      src={images?.[activeImage] || images?.[0]}
                      alt={product.displayName || product.name}
                      className="w-full h-[420px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                      {images.slice(0, 8).map((img, i) => (
                        <button
                          key={img + i}
                          type="button"
                          onClick={() => setActiveImage(i)}
                          className={`shrink-0 w-20 h-24 rounded-2xl overflow-hidden border transition ${
                            i === activeImage
                              ? "border-neutral-900"
                              : "border-neutral-200 hover:border-neutral-400"
                          }`}
                          aria-label={`View image ${i + 1}`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="md:col-span-5">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-neutral-500">
                    {product.collection || "Eminence Hair"}
                  </p>
                  <h2 className="mt-2 text-2xl font-light text-neutral-900">
                    {product.displayName || product.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                    <span>{isWig ? "HD Lace Wig" : isBundle ? "Hair Bundle" : isClosure ? "Closure" : "Piece"}</span>
                    {product.texture ? (
                      <>
                        <span className="text-neutral-300">•</span>
                        <span>{product.texture}</span>
                      </>
                    ) : null}
                    {product.color ? (
                      <>
                        <span className="text-neutral-300">•</span>
                        <span>{product.color}</span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <p className="text-2xl font-light text-neutral-900">{formatMoney(price)}</p>
                    <p className="mt-1 text-xs text-neutral-600">
                      {isWig
                        ? "Price updates with length, density & lace."
                        : "Price updates with length."}
                    </p>
                  </div>

                  <div className="mt-7 space-y-5">
                    {Array.isArray(product.lengths) && product.lengths.length > 0 && (
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
                          values={product.densities || []}
                          value={density}
                          onChange={setDensity}
                          suffix="%"
                        />

                        <OptionGroup
                          label="Lace"
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
                      </>
                    )}

                    {/* Qty + CTA */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-neutral-300 rounded-full bg-white">
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="px-3 py-2"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm text-neutral-900">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty((q) => q + 1)}
                          className="px-3 py-2"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleAdd}
                        disabled={!canAdd}
                        className={`flex-1 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] transition ${
                          canAdd
                            ? "bg-neutral-900 text-[#F9F7F4] hover:bg-black"
                            : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                        }`}
                      >
                        Add to Bag
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                        Total: <span className="text-neutral-900">{formatMoney(total)}</span>
                      </p>
                      <p className="text-xs text-neutral-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified origin
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <Link
                        to={`/products/${product.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                      >
                        View details
                      </Link>

                      <Link
                        to="/private-consult"
                        onClick={onClose}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.26em] border border-neutral-300 bg-white/50 hover:bg-white transition"
                      >
                        Book consult
                      </Link>
                    </div>

                    {product.description ? (
                      <p className="pt-2 text-sm text-neutral-700 leading-relaxed">
                        {String(product.description).slice(0, 220)}
                        {String(product.description).length > 220 ? "…" : ""}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
