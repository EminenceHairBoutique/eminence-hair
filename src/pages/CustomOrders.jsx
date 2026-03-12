// src/pages/CustomOrders.jsx — Custom Orders (New, Upgraded)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import {
  MAX_REFERENCE_IMAGES,
  MAX_ORIGINAL_MB,
  compressImageToBase64 as compressImageFile,
} from "../utils/imageProcessing";
import { formatBytes } from "../utils/format";

const inputBase =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25";

export default function CustomOrders() {
  const productTypes = useMemo(
    () => ["HD Lace Wig", "Closure Wig", "Bundles", "Closure/Frontal", "Color Service"],
    []
  );

  const textures = useMemo(
    () => [
      "Straight",
      "Body Wave",
      "Loose Wave",
      "Water Wave",
      "Deep Wave",
      "Curly",
    ],
    []
  );

  const referenceLabelOptions = useMemo(
    () => ["Inspiration", "Hairline", "Color", "Cut/Shape", "Texture", "Other"],
    []
  );

  const fileInputRef = useRef(null);
  const uploadsRef = useRef([]);
  const [referenceUploads, setReferenceUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    uploadsRef.current = referenceUploads;
  }, [referenceUploads]);

  useEffect(() => {
    return () => {
      uploadsRef.current?.forEach((u) => {
        if (u?.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    productType: "HD Lace Wig",
    collection: "SEA",
    texture: "Body Wave",
    length: "",
    density: "",
    lace: "HD Lace",
    capSize: "Medium",
    capCircumference: "",
    earToEar: "",
    frontToNape: "",
    parting: "Middle",
    color: "Natural (1B)",
    deadline: "",
    budget: "",
    notes: "",
    website: "", // honeypot
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const measurementLine = useMemo(() => {
    const parts = [];
    if (String(form.capCircumference || "").trim()) parts.push(`Circ ${form.capCircumference}in`);
    if (String(form.earToEar || "").trim()) parts.push(`Ear ${form.earToEar}in`);
    if (String(form.frontToNape || "").trim()) parts.push(`Nape ${form.frontToNape}in`);
    return parts.join(" • ");
  }, [form.capCircumference, form.earToEar, form.frontToNape]);

  const SummaryRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-900 font-medium text-right">
        {value ? value : "—"}
      </span>
    </div>
  );

  const addReferenceFiles = async (filesLike) => {
    const files = Array.from(filesLike || []);
    if (!files.length) return;

    setUploadError("");
    if (referenceUploads.length >= MAX_REFERENCE_IMAGES) {
      setUploadError(`You can upload up to ${MAX_REFERENCE_IMAGES} images.`);
      return;
    }

    setUploading(true);
    try {
      const remaining = MAX_REFERENCE_IMAGES - referenceUploads.length;
      const slice = files.slice(0, remaining);

      for (const f of slice) {
        if (!String(f?.type || "").startsWith("image/")) {
          setUploadError("Please upload image files only (JPG/PNG/WebP)."
          );
          continue;
        }
        if (f.size > MAX_ORIGINAL_MB * 1024 * 1024) {
          setUploadError(
            `"${f.name}" is too large. Please keep each image under ${MAX_ORIGINAL_MB}MB.`
          );
          continue;
        }
        const compressed = await compressImageFile(f);
        setReferenceUploads((prev) => [...prev, compressed]);
      }
    } catch (err) {
      setUploadError(
        err?.message || "Unable to process images. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeReference = (id) => {
    setReferenceUploads((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const setReferenceLabel = (id, label) => {
    setReferenceUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, label } : u))
    );
  };

  const moveReference = (id, direction) => {
    setReferenceUploads((prev) => {
      const idx = prev.findIndex((u) => u.id === id);
      if (idx < 0) return prev;
      const nextIdx = direction === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[idx];
      copy[idx] = copy[nextIdx];
      copy[nextIdx] = tmp;
      return copy;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      if (!form.fullName || !form.email) {
        throw new Error("Please include your name and email.");
      }

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom_order",
          payload: {
            ...form,
            referenceUploads: referenceUploads.map((u) => ({
              filename: u.filename,
              label: u.label || "",
              content: u.content,
              contentType: u.contentType,
              bytes: u.bytes,
            })),
          },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Unable to send request.");
      }

      setStatus({
        state: "success",
        message:
          "Request received. Our concierge will email you shortly with next steps.",
      });
      setForm((p) => ({ ...p, notes: "", budget: "" }));

      // Clear uploads
      setReferenceUploads((prev) => {
        prev?.forEach((u) => u?.previewUrl && URL.revokeObjectURL(u.previewUrl));
        return [];
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          eyebrow="Custom Orders"
          title="Couture, tailored to you."
          subtitle="Send a reference, choose your details, and let our atelier craft a piece that fits your lifestyle — and your camera roll."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_07.webp"
          ctas={[
            { label: "Private Consult", href: "/private-consult", variant: "ghost" },
            { label: "Shop Ready-to-Ship", href: "/shop", variant: "primary" },
          ]}
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* What we can do */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Lace + fit",
                d: "HD or transparent lace, cap sizing, and construction guidance for a clean melt and secure wear.",
              },
              {
                t: "Density + silhouette",
                d: "From natural movement to full glamour — we balance density so it looks rich without feeling heavy.",
              },
              {
                t: "Color services",
                d: "Highlights, toning, and curated blondes — with a maintenance plan that protects longevity.",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  {c.t}
                </p>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </section>

          {/* Process */}
          <section className="mt-14 rounded-3xl border border-black/5 bg-[#F3EFE8] p-8 md:p-10">
            <div className="grid lg:grid-cols-[1.05fr,0.95fr] gap-10 items-start">
              <div>
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-600">
                  The process
                </p>
                <h2 className="mt-2 text-2xl font-light font-display">
                  Clear steps. Elevated results.
                </h2>
                <p className="mt-3 text-sm text-neutral-800 leading-relaxed">
                  Inspired by luxury atelier workflows: we confirm details first, then craft — so your final piece matches the vision.
                </p>

                <ol className="mt-6 space-y-3 text-sm text-neutral-800 list-decimal list-inside">
                  <li>Submit your request (details + inspo notes).</li>
                  <li>Concierge reviews and confirms what’s achievable.</li>
                  <li>We provide a quote + timeline (and recommend a consult if needed).</li>
                  <li>Production begins after confirmation.</li>
                  <li>QC inspection + discreet luxury packaging.</li>
                </ol>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6">
                <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                  Important notes
                </p>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700 list-disc list-inside">
                  <li>
                    Custom/made‑to‑order services are <strong>final sale</strong>.
                  </li>
                  <li>
                    Lead times vary by service (texture availability, color complexity, and QC).
                  </li>
                  <li>
                    If you need help choosing, start with a <Link to="/private-consult" className="underline">private consult</Link>.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="mt-14">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                Submit a request
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-light font-display">
                Tell us what you want — we’ll translate it.
              </h2>
              <p className="mt-4 text-sm text-neutral-700">
                Share the essentials below. Concierge will email you with questions, confirmation, and next steps.
              </p>
            </div>

            <div className="mt-10 grid lg:grid-cols-[1fr,0.85fr] gap-10 items-start">
              <form
                onSubmit={onSubmit}
                className="bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm"
              >
              {/* honeypot */}
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={update("website")}
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Full name *</label>
                  <input
                    className={inputBase}
                    value={form.fullName}
                    onChange={update("fullName")}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Email *</label>
                  <input
                    className={inputBase}
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@email.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Phone</label>
                  <input
                    className={inputBase}
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="(optional)"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Location</label>
                  <input
                    className={inputBase}
                    value={form.location}
                    onChange={update("location")}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Product type</label>
                  <select className={inputBase} value={form.productType} onChange={update("productType")}
                  >
                    {productTypes.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Collection</label>
                  <select className={inputBase} value={form.collection} onChange={update("collection")}
                  >
                    {["SEA", "Burmese", "Eminence", "Lavish", "Straight", "613"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Texture</label>
                  <select className={inputBase} value={form.texture} onChange={update("texture")}
                  >
                    {textures.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Length (inches)</label>
                  <input
                    className={inputBase}
                    value={form.length}
                    onChange={update("length")}
                    placeholder='e.g., 22'
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Density (%)</label>
                  <input
                    className={inputBase}
                    value={form.density}
                    onChange={update("density")}
                    placeholder='e.g., 180 or 250'
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Lace</label>
                  <select className={inputBase} value={form.lace} onChange={update("lace")}
                  >
                    {["HD Lace", "Transparent Lace"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-black/5 bg-[#FBF6ED]/60 p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Measurements (optional)
                </p>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  If you know your measurements, add inches for a more precise fit. If you don’t, cap size is enough — we’ll confirm before production.
                </p>

                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-neutral-600">Circumference (in)</label>
                    <input
                      className={inputBase}
                      value={form.capCircumference}
                      onChange={update("capCircumference")}
                      placeholder='e.g., 22'
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Ear-to-ear (in)</label>
                    <input
                      className={inputBase}
                      value={form.earToEar}
                      onChange={update("earToEar")}
                      placeholder='e.g., 13'
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-600">Front-to-nape (in)</label>
                    <input
                      className={inputBase}
                      value={form.frontToNape}
                      onChange={update("frontToNape")}
                      placeholder='e.g., 14'
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-500">
                  Tip: use a soft tape measure. We can also help you measure during a consult.
                </p>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Cap size</label>
                  <select className={inputBase} value={form.capSize} onChange={update("capSize")}
                  >
                    {["Small", "Medium", "Large"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Parting</label>
                  <select className={inputBase} value={form.parting} onChange={update("parting")}
                  >
                    {["Middle", "Left", "Right", "Free Part"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Color</label>
                  <select className={inputBase} value={form.color} onChange={update("color")}
                  >
                    {[
                      "Natural (1B)",
                      "Natural Brown",
                      "613 Blonde",
                      "Custom Color (describe below)",
                    ].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-600">Needed by</label>
                  <input
                    className={inputBase}
                    value={form.deadline}
                    onChange={update("deadline")}
                    type="date"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600">Budget range</label>
                  <input
                    className={inputBase}
                    value={form.budget}
                    onChange={update("budget")}
                    placeholder="(optional)"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-neutral-600">
                  Notes / reference description
                </label>
                <textarea
                  className={inputBase + " min-h-[120px]"}
                  value={form.notes}
                  onChange={update("notes")}
                  placeholder="Describe your desired look, color placement, lace preference, and anything we should know."
                />
                <p className="mt-2 text-xs text-neutral-500">
                  Tip: Upload 1–3 photos (hairline close-up, overall silhouette, and color/texture inspiration) to help us match your vision.
                </p>
              </div>

              {/* Reference photos */}
              <div className="mt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-neutral-600">Reference photos (optional)</p>
                    <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                      Upload up to {MAX_REFERENCE_IMAGES} images. These are sent only to our concierge.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click?.()}
                    className="shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.22em] border border-black/15 hover:border-black/30 bg-white"
                    disabled={uploading}
                  >
                    {uploading ? "Processing…" : "Add photos"}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    e.target.value = "";
                    await addReferenceFiles(files);
                  }}
                />

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click?.()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click?.();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await addReferenceFiles(e.dataTransfer.files);
                  }}
                  className="mt-3 rounded-3xl border border-dashed border-black/20 bg-white/50 p-5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-black/30"
                >
                  <p className="text-sm text-neutral-800">Drag & drop images here, or click to upload.</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Best: inspiration screenshot(s), hairline close-up, and desired length/shape.
                  </p>
                </div>

                {uploadError && <p className="mt-2 text-xs text-red-700">{uploadError}</p>}

                {referenceUploads.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {referenceUploads.map((u, idx) => (
                      <div
                        key={u.id}
                        className="relative rounded-2xl overflow-hidden border border-black/10 bg-white"
                      >
                        <img
                          src={u.previewUrl}
                          alt="Reference upload"
                          className="h-28 w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <button
                          type="button"
                          onClick={() => removeReference(u.id)}
                          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 hover:bg-white border border-black/10 flex items-center justify-center"
                          aria-label="Remove image"
                          title="Remove"
                        >
                          <span className="text-lg leading-none">×</span>
                        </button>
                        <div className="px-3 py-2 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-600 truncate">
                                {u.filename}
                              </p>
                              <p className="text-[11px] text-neutral-500">
                                {formatBytes(u.bytes)}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveReference(u.id, "up")}
                                disabled={idx === 0}
                                className="h-8 w-8 rounded-full border border-black/10 bg-white/70 hover:bg-white disabled:opacity-40"
                                aria-label="Move image up"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveReference(u.id, "down")}
                                disabled={idx === referenceUploads.length - 1}
                                className="h-8 w-8 rounded-full border border-black/10 bg-white/70 hover:bg-white disabled:opacity-40"
                                aria-label="Move image down"
                                title="Move down"
                              >
                                ↓
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
                              Label
                            </label>
                            <select
                              value={u.label || "Inspiration"}
                              onChange={(e) => setReferenceLabel(u.id, e.target.value)}
                              className="mt-1 w-full px-3 py-2 rounded-2xl border border-black/10 bg-white/60 text-xs"
                            >
                              {referenceLabelOptions.map((l) => (
                                <option key={l} value={l}>
                                  {l}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* status */}
              {status.state !== "idle" && (
                <div
                  className={
                    "mt-6 rounded-2xl px-4 py-3 text-sm border " +
                    (status.state === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : status.state === "error"
                      ? "bg-red-50 border-red-200 text-red-900"
                      : "bg-neutral-50 border-black/10 text-neutral-700")
                  }
                >
                  {status.message || (status.state === "loading" ? "Sending…" : "")}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status.state === "loading"}
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90 disabled:opacity-60"
                >
                  {status.state === "loading" ? "Sending…" : "Submit request"}
                </button>

                <Link
                  to="/care"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                >
                  Read care guide
                </Link>
              </div>

              <p className="mt-5 text-xs text-neutral-500 leading-relaxed">
                By submitting, you agree to be contacted by Eminence Hair Concierge regarding your request. For policy details, review our <Link className="underline" to="/terms">Terms</Link> and <Link className="underline" to="/privacy">Privacy Policy</Link>.
              </p>
            </form>

            <aside className="space-y-6">
              <div className="sticky top-28 rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Your request
                </p>
                <p className="mt-2 text-sm text-neutral-800 leading-relaxed">
                  A live summary for concierge review.
                </p>

                <div className="mt-4 space-y-2">
                  <SummaryRow label="Product" value={form.productType} />
                  <SummaryRow label="Collection" value={form.collection} />
                  <SummaryRow label="Texture" value={form.texture} />
                  <SummaryRow label="Length" value={form.length ? `${form.length}"` : ""} />
                  <SummaryRow label="Density" value={form.density ? `${form.density}%` : ""} />
                  <SummaryRow label="Lace" value={form.lace} />
                  <SummaryRow label="Cap size" value={form.capSize} />
                  {measurementLine ? <SummaryRow label="Measurements" value={measurementLine} /> : null}
                  <SummaryRow label="Color" value={form.color} />
                  <SummaryRow label="Needed by" value={form.deadline} />
                  <SummaryRow label="Budget" value={form.budget} />
                  <SummaryRow label="Reference photos" value={`${referenceUploads.length}`} />
                </div>

                <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
                  We’ll respond by email with questions + a quote.
                </p>
              </div>

              <div className="rounded-3xl border border-black/5 bg-white p-6">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Need help choosing?
                </p>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                  Book a private consult and we’ll guide texture, density, and cap sizing before you submit.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    to="/private-consult"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                  >
                    Book a consult
                  </Link>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                  >
                    Shop ready-to-ship
                  </Link>
                </div>
              </div>
            </aside>
          </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
