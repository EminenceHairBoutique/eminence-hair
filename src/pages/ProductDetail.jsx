import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  Clock,
  AlertTriangle,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

// ✅ FIX: match Shop's named export pattern
import { products } from "../data/products";

import { useCart } from "../context/CartContext";
import ScanToVerify from "../components/ScanToVerify";
import ImageZoomModal from "../components/ImageZoomModal";
import SEO from "../components/SEO";
import CurrencyHint from "../components/CurrencyHint";
import ShippingRegions from "../components/ShippingRegions";
import VirtualPreviewModal from "../components/VirtualPreviewModal";
import { trackViewItem } from "../utils/track";
import { resolveProductImages } from "../utils/productMedia";
import { formatMoney } from "../utils/format";
import RelatedProducts from "../components/RelatedProducts";
import RecentlyViewed from "../components/RecentlyViewed";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

/* ---------------- BNPL config ---------------- */
const BNPL_MINIMUM = 50; // minimum price to show installment messaging
const BNPL_INSTALLMENTS = 4; // number of interest-free installments

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

  const images = resolveProductImages(product).slice(0, 6);
  const siteUrl = "https://www.eminenceluxuryhair.com";

  const availability = product.isPreorder
    ? "https://schema.org/PreOrder"
    : "https://schema.org/InStock";

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
  ];
  if (product.collectionSlug) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: product.collection,
      item: `${siteUrl}/collections/${product.collectionSlug}`,
    });
  }
  breadcrumbItems.push({
    "@type": "ListItem",
    position: breadcrumbItems.length + 1,
    name: product.displayName || product.name,
  });

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
      {
        "@type": "Product",
        name: product.displayName || product.name,
        description: product.description,
        sku: product.verificationCode,
        brand: { "@type": "Brand", name: "Eminence Hair Boutique" },
        image: images,
        category: product.type === "wig" ? "Wigs" : product.type === "bundle" ? "Hair Bundles" : "Hair Closures",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: Number(price || 0),
          url: typeof window !== "undefined" ? window.location.href : undefined,
          availability,
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Eminence Hair Boutique",
          },
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Third-Party Verified",
            value: "Independently inspected by accredited laboratory",
          },
          ...(product.texture ? [{
            "@type": "PropertyValue",
            name: "Texture",
            value: product.texture,
          }] : []),
          ...(product.collection ? [{
            "@type": "PropertyValue",
            name: "Collection",
            value: product.collection,
          }] : []),
        ],
      },
    ],
  };

  // Remove undefined fields (schema.org is picky)
  if (!data["@graph"][1].offers.url) delete data["@graph"][1].offers.url;

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
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm tracking-wide text-neutral-900">{title}</span>
        <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-neutral-600">{children}</div>}
    </div>
  );
}

function TrustItem({ icon, title, detail }) {
  const IconComp = icon;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-[#FBF6ED]/60 p-4">
      <IconComp className="w-4 h-4 mt-0.5 text-neutral-900" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{title}</p>
        <p className="text-xs text-neutral-700 mt-1 leading-snug">{detail}</p>
      </div>
    </div>
  );
}

function SpecTable({ product, selectedLength, selectedDensity, lace, capSize }) {
  if (!product) return null;

  const rows = [
    { label: "Category", value: product.type === "bundle" ? "Hair Bundle" : product.type === "closure" ? "Closure" : "HD Lace Wig" },
    { label: "Texture", value: product.texture || "—" },
    { label: "Color", value: product.color || "—" },
    { label: "Collection", value: product.collection || "—" },
    { label: "Length", value: selectedLength ? `${selectedLength}"` : "—" },
  ];

  if (product.type === "wig") {
    rows.push({ label: "Density", value: selectedDensity ? `${selectedDensity}%` : "—" });
    rows.push({ label: "Lace", value: lace || "—" });
    rows.push({ label: "Cap Size", value: capSize || "—" });
  }

  if (product.isPreorder) {
    rows.push({ label: "Ships From", value: product.shipsFrom || "Factory" });
    rows.push({ label: "Lead Time", value: product.leadTimeLabel || "10–14 business days" });
    rows.push({ label: "Quality Tier", value: product.qualityTier || "—" });
  }

  if (product.verificationCode) {
    rows.push({ label: "Verification", value: `Serial ${product.verificationCode}` });
  }

  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
      <div className="divide-y divide-neutral-200">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[0.9fr,1.1fr] gap-4 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">{r.label}</p>
            <p className="text-sm text-neutral-800">{r.value}</p>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-[#FBF6ED]/60">
        <p className="text-xs text-neutral-700">
          Need help selecting density, lace, or cap size? Book a{" "}
          <Link to="/private-consult" className="underline hover:text-neutral-900">
            private consult
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function RecommendedGrid({ current }) {
  const recs = useMemo(() => {
    if (!current) return [];

    const others = products.filter((p) => p.id !== current.id);

    const score = (p) => {
      let s = 0;
      // Prefer essentials (safe first choice)
      if (p.isEssential) s += 3;
      // Prefer same texture + same collection
      if (current.texture && p.texture && String(p.texture) === String(current.texture)) s += 2;
      if (current.collection && p.collection && String(p.collection) === String(current.collection)) s += 1;
      // Mix: if you're on a wig, show a few bundles; if on a bundle, show a few wigs
      if (current.type === "wig" && p.type === "bundle") s += 2;
      if (current.type === "bundle" && p.type === "wig") s += 2;
      // Same type gets a smaller boost
      if (p.type === current.type) s += 1;
      return s;
    };

    return others
      .map((p) => [p, score(p)])
      .sort(([, sA], [, sB]) => sB - sA)
      .slice(0, 6)
      .map(([p]) => p);
  }, [current]);

  if (!current || recs.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
            Complete the look
          </p>
          <h2 className="mt-2 text-2xl font-light font-display">
            Recommended pieces
          </h2>
        </div>
        <Link
          to="/shop"
          className="text-[11px] uppercase tracking-[0.22em] underline underline-offset-4 text-neutral-700"
        >
          Shop all
        </Link>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recs.map((p) => {
          const img = resolveProductImages(p)?.[0] || p.images?.[0];
          return (
            <Link
              key={p.id}
              to={`/products/${p.slug}`}
              className="group rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-md transition"
            >
            <div className="aspect-[4/5] overflow-hidden bg-white">
              <img
                src={img}
                alt={p.displayName || p.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                {p.type === "bundle" ? "Bundle" : p.type === "closure" ? "Closure" : "Wig"}
                {p.texture ? ` • ${p.texture}` : ""}
              </p>
              <p className="mt-2 text-sm text-neutral-900">
                {p.displayName || p.name}
              </p>
              {p.collection && (
                <p className="mt-1 text-xs text-neutral-600">{p.collection}</p>
              )}
            </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { recentIds, trackView } = useRecentlyViewed();

  // route-based "loading skeleton" feel
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 180);
    return () => clearTimeout(t);
  }, [slug]);

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  useEffect(() => {
    if (product?.id) trackView(product.id);
  }, [product?.id, trackView]);

  const isWig = product?.type === "wig";
  const isBundle = product?.type === "bundle";
  const isClosure = product?.type === "closure" || product?.type === "frontal";

  // Catalog product flags
  const hasCatalogTextures = product?.catalogType && Array.isArray(product?.textures) && product.textures.length > 0;
  const hasCatalogColors = product?.catalogType && Array.isArray(product?.colors) && product.colors.length > 0;
  const isHdClosure = product?.catalogType === "hd-closure";
  const isHdFrontal = product?.catalogType === "hd-frontal";

  // Luxury-safe: Only advertise customization where it makes sense.
  // Texture/reference items should not feel like bespoke orderables.
  const isCustomizable =
    isWig &&
    String(product?.collectionSlug || "")
      .toLowerCase()
      .trim() !== "textures";

  const images = useMemo(() => resolveProductImages(product), [product]);
  const isVideo = (src) => /\.(mp4|webm|mov|m4v)$/i.test(String(src || ""));

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  // ✅ preserve your existing option UX; now with sensible defaults
  const [length, setLength] = useState(product?.lengths?.[0] || null);
  const [density, setDensity] = useState(product?.densities?.[0] || null);
  const [lace, setLace] = useState(isWig ? "HD Lace" : null);
  const [capSize, setCapSize] = useState(isWig ? "Medium" : null);

  // Catalog-product specific option state
  const [catalogTexture, setCatalogTexture] = useState(product?.defaultTexture || product?.textures?.[0]?.key || null);
  const [catalogColor, setCatalogColor] = useState(product?.defaultColor || product?.colors?.[0]?.key || null);
  const [closureSize, setClosureSize] = useState(product?.defaultClosureSize || product?.closureSizes?.[0] || null);
  const [frontalSize, setFrontalSize] = useState(product?.defaultFrontalSize || product?.frontalSizes?.[0] || null);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    setLength(product?.lengths?.[0] ?? null);
    setDensity(product?.densities?.[0] ?? null);

    // Defaults that reduce friction (still fully editable)
    const wig = product?.type === "wig";
    setLace(wig ? "HD Lace" : null);
    setCapSize(wig ? "Medium" : null);

    // Reset catalog-specific options
    setCatalogTexture(product?.defaultTexture || product?.textures?.[0]?.key || null);
    setCatalogColor(product?.defaultColor || product?.colors?.[0]?.key || null);
    setClosureSize(product?.defaultClosureSize || product?.closureSizes?.[0] || null);
    setFrontalSize(product?.defaultFrontalSize || product?.frontalSizes?.[0] || null);
  }, [product?.slug, product?.lengths, product?.densities, product?.type, product?.defaultTexture, product?.textures, product?.defaultColor, product?.colors, product?.defaultClosureSize, product?.closureSizes, product?.defaultFrontalSize, product?.frontalSizes]);

  const [isCustom, setIsCustom] = useState(false);
  const [customNotes, setCustomNotes] = useState("");
  const [customColorTier, setCustomColorTier] = useState("AS_LISTED");

  // Reset custom-request fields when navigating between products
  useEffect(() => {
    setIsCustom(false);
    setCustomNotes("");
    setCustomColorTier("AS_LISTED");
  }, [product?.id]);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

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
        // Catalog products use a second argument for texture/color/size key
        let secondArg = undefined;
        if (product.catalogType === "hd-closure") secondArg = closureSize;
        else if (product.catalogType === "hd-frontal") secondArg = frontalSize;
        else if (Array.isArray(product.textures)) secondArg = catalogTexture;
        else if (Array.isArray(product.colors)) secondArg = catalogColor;

        const result = secondArg !== undefined
          ? Number(product.price(length, secondArg) || 0)
          : Number(product.price(length, density, lace) || 0);
        return Number.isFinite(result) ? result : Number(product.basePrice || 0);
      } catch {
        return Number(product.basePrice || 0);
      }
    }

    return Number(product.basePrice || 0);
  }, [product, length, density, lace, catalogTexture, catalogColor, closureSize, frontalSize]);

  const customColorSurcharge = useMemo(() => {
    if (!isCustom) return 0;
    const tier = customColorTier;
    if (!tier || tier === "AS_LISTED") return 0;
    const base = String(product?.color ?? "");
    // If the base product already matches the requested tier, no upcharge
    if (tier === base) return 0;
    if (tier === "1") return 20; // Jet Black premium
    if (tier === "613") return 120; // Blonde premium
    if (tier === "CUSTOM") return 160; // Custom color (burgundy/copper/ombre)
    if (tier === "1B") return base === "1B" ? 0 : 0;
    return 0;
  }, [isCustom, customColorTier, product?.color]);

  const price = basePrice + customColorSurcharge;

  // ✅ Must be declared before any early return to satisfy Rules of Hooks
  const handleAdd = useCallback(() => {
    // Build a human-readable label for catalog options
    const catalogTextureLabel = catalogTexture && product?.textures
      ? (product.textures.find((t) => t.key === catalogTexture)?.label || catalogTexture)
      : null;
    const catalogColorLabel = catalogColor && product?.colors
      ? (product.colors.find((c) => c.key === catalogColor)?.label || catalogColor)
      : null;
    const laceClosureSizeLabel = closureSize || frontalSize || null;

    const variantParts = [
      length != null ? `L${length}` : "",
      density != null ? `D${density}` : "",
      lace ? `Lace:${lace}` : "",
      capSize ? `Cap:${capSize}` : "",
      catalogTextureLabel ? `Texture:${catalogTextureLabel}` : "",
      catalogColorLabel ? `Color:${catalogColorLabel}` : "",
      laceClosureSizeLabel ? `Size:${laceClosureSizeLabel}` : "",
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
      // Catalog-specific options (preserved in cart)
      catalogTexture,
      catalogColor,
      closureSize,
      frontalSize,
      catalogTextureLabel,
      catalogColorLabel,
      isCustom,
      customNotes,
      customColorTier,
      price,
      image: images?.[0] || product.image || product.img,
      quantity: qty,
      variant: variantParts.join("|") || "standard",
      // Preorder fields (passed through for cart/checkout display)
      isPreorder: product.isPreorder ?? false,
      shipsFrom: product.shipsFrom ?? "Domestic",
      leadTimeDays: product.leadTimeDays ?? null,
      qualityTier: product.qualityTier ?? null,
    });
  }, [length, density, lace, capSize, catalogTexture, catalogColor, closureSize, frontalSize, isCustom, customNotes, customColorTier, price, product, images, qty, addToCart]);

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

  const closureSizeValid = !isHdClosure || (closureSize && (product.hdClosureValidSizes?.[length] || product.closureSizes || []).includes(closureSize));
  const frontalSizeValid = !isHdFrontal || (frontalSize && (product.hdFrontalValidSizes?.[length] || product.frontalSizes || []).includes(frontalSize));

  const canAdd =
    (isBundle && length) ||
    (isClosure && length && closureSizeValid && frontalSizeValid) ||
    (isWig && length && density && lace && capSize);

  const total = Number(price || 0) * Number(qty || 1);

  return (
    <>
      <SEO
        title={product.displayName || product.name}
        description={product.description}
        type="product"
        image={images?.[0]}
      />

      <div className="pt-28 pb-24 bg-[#FBF6ED]">
        <ProductStructuredData product={product} price={price} />

        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb navigation */}
          <nav className="mb-4 text-[11px] tracking-[0.12em] text-neutral-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link to="/" className="hover:text-neutral-800 transition">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/shop" className="hover:text-neutral-800 transition">Shop</Link></li>
              {product.collectionSlug && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link to={`/collections/${product.collectionSlug}`} className="hover:text-neutral-800 transition">
                      {product.collection}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-neutral-800">{product.displayName || product.name}</li>
            </ol>
          </nav>

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
            <div className="space-y-14">
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
                      {isVideo(img) ? (
                        <video
                          src={img}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          loop
                        />
                      ) : (
                        <img
                          src={img}
                          alt={`${product.displayName || product.name} image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* main image with QR + zoom */}
                <div className="relative flex-1 rounded-[2rem] overflow-hidden border bg-white group">
                  {isVideo(images[activeImage]) ? (
                    <video
                      src={images[activeImage]}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  ) : (
                    <Motion.img
                      src={images[activeImage]}
                      alt={`${product.displayName || product.name} main image`}
                      onClick={() => setZoomOpen(true)}
                      className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  )}

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
                        {isVideo(img) ? (
                          <video
                            src={img}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            loop
                          />
                        ) : (
                          <img
                            src={img}
                            alt={`${product.displayName || product.name} thumbnail ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
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

                {(isCustomizable || product.readyToShip) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {isCustomizable && (
                      <>
                        <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-neutral-700">
                          Customizable
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                          Atelier support available
                        </span>
                      </>
                    )}

                    {product.readyToShip && (
                      <span className="inline-flex items-center rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#F9F7F4]">
                        Ready to ship
                      </span>
                    )}
                  </div>
                )}

                {product.verificationCode && (
                  <p className="mt-2 text-[11px] tracking-[0.26em] uppercase text-neutral-500">
                    Serial · {product.verificationCode}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                  <span>Hand‑inspected</span>
                  <span className="text-neutral-300">•</span>
                  <span>Verified origin</span>
                  <span className="text-neutral-300">•</span>
                  <span>Concierge support</span>
                </div>

                {/* price */}
                <div className="mt-6">
                  <p className="text-2xl font-light">{formatMoney(price)}</p>
                  <CurrencyHint amountUSD={price} />
                  {isCustom && (
                    <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Crafted to order
                    </p>
                  )}
                  {price >= BNPL_MINIMUM && (
                    <p className="mt-1.5 text-[11px] text-neutral-500">
                      or {formatMoney(Math.ceil(price / BNPL_INSTALLMENTS))} × {BNPL_INSTALLMENTS} interest-free payments at checkout
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
                  {/* ── Catalog product: HD Closure size selector ── */}
                  {isHdClosure &&
                    (() => {
                      const allClosureSizes = product.closureSizes || [];
                      const validSizes = product.hdClosureValidSizes?.[length] || allClosureSizes;
                      const selectedClosureSize = validSizes.includes(closureSize)
                        ? closureSize
                        : validSizes[0] || "";

                      if (selectedClosureSize && closureSize !== selectedClosureSize) {
                        queueMicrotask(() => setClosureSize(selectedClosureSize));
                      }

                      return (
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-3">Closure Size</p>
                          <div className="flex flex-wrap gap-2">
                            {allClosureSizes.map((sz) => {
                              const isValid = validSizes.includes(sz);
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  disabled={!isValid}
                                  onClick={() => isValid && setClosureSize(sz)}
                                  className={`px-4 py-2 rounded-full text-xs border transition ${
                                    selectedClosureSize === sz
                                      ? "border-neutral-900 bg-neutral-900 text-white"
                                      : isValid
                                      ? "border-neutral-300 bg-white hover:border-neutral-500"
                                      : "border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  {/* ── Catalog product: HD Frontal size selector ── */}
                  {isHdFrontal &&
                    (() => {
                      const allFrontalSizes = product.frontalSizes || [];
                      const validSizes = product.hdFrontalValidSizes?.[length] || allFrontalSizes;
                      const selectedFrontalSize = validSizes.includes(frontalSize)
                        ? frontalSize
                        : validSizes[0] || "";

                      if (selectedFrontalSize && frontalSize !== selectedFrontalSize) {
                        queueMicrotask(() => setFrontalSize(selectedFrontalSize));
                      }

                      return (
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-3">Frontal Size</p>
                          <div className="flex flex-wrap gap-2">
                            {allFrontalSizes.map((sz) => {
                              const isValid = validSizes.includes(sz);
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  disabled={!isValid}
                                  onClick={() => isValid && setFrontalSize(sz)}
                                  className={`px-4 py-2 rounded-full text-xs border transition ${
                                    selectedFrontalSize === sz
                                      ? "border-neutral-900 bg-neutral-900 text-white"
                                      : isValid
                                      ? "border-neutral-300 bg-white hover:border-neutral-500"
                                      : "border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                  {/* ── Catalog product: texture selector ── */}
                  {hasCatalogTextures && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-3">Texture</p>
                      <div className="flex flex-wrap gap-2">
                        {product.textures.map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => setCatalogTexture(t.key)}
                            className={`px-3 py-2 rounded-full text-xs border transition ${
                              catalogTexture === t.key
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 bg-white hover:border-neutral-500"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Catalog product: color selector ── */}
                  {hasCatalogColors && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 mb-3">Color Group</p>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((c) => (
                          <button
                            key={c.key}
                            type="button"
                            onClick={() => setCatalogColor(c.key)}
                            className={`px-3 py-2 rounded-full text-xs border transition ${
                              catalogColor === c.key
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 bg-white hover:border-neutral-500"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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

                      {isCustom && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Custom density (%)</label>
                            <span className="text-[11px] text-neutral-500">e.g., 280</span>
                          </div>
                          <input
                            type="number"
                            min={130}
                            max={350}
                            step={10}
                            value={Number.isFinite(Number(density)) ? Number(density) : ""}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (v === "") return;
                              const n = Number(v);
                              if (Number.isFinite(n)) setDensity(n);
                            }}
                            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-300"
                            placeholder="280"
                          />
                          <p className="mt-2 text-[12px] text-neutral-500">Your price estimate updates automatically.</p>
                        </div>
                      )}

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
                          <div className="mt-3 space-y-3">
                            <div>
                              <label className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
                                Desired color (optional)
                              </label>
                              <select
                                value={customColorTier}
                                onChange={(e) => setCustomColorTier(e.target.value)}
                                className="mt-2 w-full rounded-lg border border-neutral-200 bg-white p-2 text-xs outline-none focus:border-neutral-300"
                              >
                                <option value="AS_LISTED">As listed ({String(product?.color ?? "") || "—"})</option>
                                <option value="1B">Natural 1B</option>
                                <option value="1">Jet Black #1</option>
                                <option value="613">613 Blonde</option>
                                <option value="CUSTOM">Custom Color (Burgundy / Copper / Ombre)</option>
                              </select>

                              {customColorSurcharge > 0 && (
                                <p className="mt-2 text-[12px] text-neutral-500">
                                  Includes a color premium of +{formatMoney(customColorSurcharge)}.
                                </p>
                              )}
                            </div>

                            <textarea
                              placeholder="Color requests, knots, fit, density above 250%, notes…"
                              value={customNotes}
                              onChange={(e) => setCustomNotes(e.target.value)}
                              className="w-full border rounded-lg p-2 text-xs"
                            />

                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                              Our atelier will confirm feasibility and any final adjustments before production.
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {product.isPreorder && (
                    <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#D4AF37] text-[#111] font-medium">
                          Pre-Order
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] border border-neutral-300 text-neutral-600">
                          Factory Drop-Ship
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {product.leadTimeLabel && (
                          <span className="block font-medium text-neutral-800 mb-1">
                            Estimated lead time: {product.leadTimeLabel}
                          </span>
                        )}
                      {product.preorderDisclaimer || "This item is fulfilled directly from our factory partner and is not part of current domestic inventory."}
                      </p>
                    </div>
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
                      {product.isPreorder ? "Pre-Order" : "Add to Bag"}
                    </button>
                  </div>

                  {/* Preorder info block */}
                  {product.isPreorder && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900 text-[#F9F7F4] text-[10px] uppercase tracking-[0.22em] px-3 py-1">
                          <Truck className="w-3 h-3" />
                          Factory Drop-Ship
                        </span>
                        {product.qualityTier && (
                          <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-[10px] uppercase tracking-[0.16em] px-3 py-1 text-neutral-700">
                            {product.qualityTier}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-amber-900">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>
                          Estimated dispatch:{" "}
                          <strong>
                            {product.leadTimeDays > 0
                              ? `${product.leadTimeDays} business days`
                              : "14–21 business days"}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          Tracking will be sent when shipped · Adult signature required
                        </span>
                      </div>

                      <div className="text-[11px] text-amber-800 leading-relaxed border-t border-amber-200 pt-3">
                        <p className="font-semibold uppercase tracking-[0.1em] mb-1.5">Non-Negotiables</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>All pre-order sales are <strong>final</strong>. No returns or exchanges.</li>
                          <li>Lead time is estimated — factory delays may occur.</li>
                          <li>Cannot be combined with domestic items at checkout.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {isCustomizable && (
                    <p className="-mt-2 text-xs text-neutral-500 leading-relaxed">
                      Custom available (fit, lace, knots, density).{" "}
                      <Link to="/custom-atelier" className="underline hover:text-neutral-900">
                        Build in Custom Atelier
                      </Link>
                      .
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-300 bg-white/50 hover:bg-white transition"
                    >
                      Preview on You (Beta)
                    </button>

                    <Link
                      to="/custom-atelier"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.22em] border border-neutral-900 hover:bg-neutral-900 hover:text-[#F9F7F4] transition"
                    >
                      Custom Atelier
                    </Link>
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

                  {product.isPreorder && (
                    <Accordion title="How Pre-Order Works">
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <span className="text-[#D4AF37] font-medium text-sm">1</span>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">Place your order</p>
                            <p className="text-xs text-neutral-600 mt-0.5">Your pre-order is confirmed and queued with our factory partner.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-[#D4AF37] font-medium text-sm">2</span>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">Factory prepares and dispatches</p>
                            <p className="text-xs text-neutral-600 mt-0.5">Your item is prepared and shipped directly from our atelier within the estimated lead time.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-[#D4AF37] font-medium text-sm">3</span>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">Tracking is sent once shipped</p>
                            <p className="text-xs text-neutral-600 mt-0.5">You'll receive a tracking number via email as soon as your order leaves the factory.</p>
                          </div>
                        </div>
                      </div>
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

                  <Accordion title="Specifications">
                    <SpecTable
                      product={product}
                      selectedLength={length}
                      selectedDensity={density}
                      lace={lace}
                      capSize={capSize}
                    />
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
                    <div className="mb-4">
                      <ShippingRegions compact />
                    </div>
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

              <RecommendedGrid current={product} />
              <RelatedProducts currentProduct={product} />
              <RecentlyViewed recentIds={recentIds} currentProductId={product?.id} />
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
                  {product.isPreorder ? "Pre-Order" : "Add to Bag"}
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

        <VirtualPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          product={product}
          initialColor={product?.color}
          initialTexture={product?.texture}
        />
      </div>

      {/* Sticky mobile CTA bar */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white/95 backdrop-blur border-t border-neutral-200 px-4 py-3 safe-area-pb"
        role="region"
        aria-label="Quick add to cart"
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{product.displayName || product.name}</p>
            <p className="text-xs text-neutral-600">{formatMoney(price)}</p>
          </div>
          <button
            disabled={!canAdd}
            onClick={handleAdd}
            className={`shrink-0 px-6 py-2.5 rounded-full text-[11px] uppercase tracking-[0.22em] ${
              canAdd
                ? "bg-black text-white"
                : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {product.isPreorder ? "Pre-Order" : "Add to Bag"}
          </button>
        </div>
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
