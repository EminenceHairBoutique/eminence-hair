import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import PageHero from "../components/PageHero";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";
import {
  MAX_REFERENCE_IMAGES,
  MAX_ORIGINAL_MB,
  compressImageToBlob as compressImageFile,
} from "../utils/imageProcessing";
import { formatBytes } from "../utils/format";
import SEO from "../components/SEO";
const inputBase =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25";

function Pill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.22em] border transition ${
        active
          ? "bg-black text-white border-black"
          : "border-neutral-300 hover:border-neutral-500"
      }`}
    >
      {children}
    </button>
  );
}

export default function CustomAtelier() {
  const { user } = useUser();

  const textures = useMemo(
    () => ["Straight", "Loose Wave", "Body Wave", "Deep Wave"],
    []
  );

  const colors = useMemo(
    () => [
      "1 (Jet Black)",
      "1B (Natural Black)",
      "Brown",
      "Burgundy",
      "613 Blonde",
      "Silver",
      "Orange",
    ],
    []
  );

  const referenceLabelOptions = useMemo(
    () => ["Inspiration", "Hairline", "Color", "Cut/Shape", "Texture", "Other"],
    []
  );

  const [step, setStep] = useState(1);

  // Groups uploads for this specific request (useful for email context + future cleanup).
  const uploadGroupId = useMemo(() => {
    return (
      (typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }, []);

  const fileInputRef = useRef(null);
  const uploadsRef = useRef([]);
  const [referenceUploads, setReferenceUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [form, setForm] = useState({
    // Contact
    fullName: "",
    email: "",
    phone: "",
    location: "",
    // Build
    productType: "Wig",
    texture: "Body Wave",
    color: "1B (Natural Black)",
    length: "20",
    density: "180",
    lace: "HD Lace",
    capSize: "Medium",
    capCircumference: "",
    earToEar: "",
    frontToNape: "",
    parting: "Middle",
    // Preferences
    wearFrequency: "Daily",
    heatStyling: "Sometimes",
    realismPriority: "Hairline realism",
    // Logistics
    deadline: "",
    budget: "",
    inspirationLink: "",
    notes: "",
    website: "", // honeypot
  });

  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    uploadsRef.current = referenceUploads;
  }, [referenceUploads]);

  useEffect(() => {
    return () => {
      // cleanup preview urls
      uploadsRef.current?.forEach((u) => {
        if (u?.previewUrl) URL.revokeObjectURL(u.previewUrl);
      });
    };
  }, []);

  const update = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const canNext = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return true;
    return true;
  }, [step]);

  const canSubmit = useMemo(() => {
    return Boolean(String(form.fullName || "").trim()) && Boolean(String(form.email || "").trim());
  }, [form.fullName, form.email]);

  const measurementLine = useMemo(() => {
    const parts = [];
    if (String(form.capCircumference || "").trim()) parts.push(`Circ ${form.capCircumference}in`);
    if (String(form.earToEar || "").trim()) parts.push(`Ear ${form.earToEar}in`);
    if (String(form.frontToNape || "").trim()) parts.push(`Nape ${form.frontToNape}in`);
    return parts.join(" • ");
  }, [form.capCircumference, form.earToEar, form.frontToNape]);

  const submit = async (e) => {
    e?.preventDefault?.();
    setStatus({ state: "loading", message: "" });

    try {
      if (!canSubmit) {
        throw new Error("Please include your name and email.");
      }

      if (referenceUploads.some((u) => u.uploading)) {
        throw new Error("Please wait for your reference photos to finish uploading.");
      }

      const secureUploads = referenceUploads
        .filter((u) => Boolean(u.path) && !u.error)
        .map((u) => ({
          filename: u.filename,
          label: u.label || "",
          bucket: u.bucket,
          path: u.path,
          contentType: u.contentType,
          bytes: u.bytes,
        }));

      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "custom_atelier",
          payload: {
            ...form,
            authUserId: user?.id || null,
            uploadGroupId,
            referenceUploads: secureUploads,
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
          "Request received. Our concierge will email you shortly to confirm details and timeline.",
      });
      setStep(1);
      setForm((p) => ({
        ...p,
        notes: "",
        budget: "",
        deadline: "",
        inspirationLink: "",
      }));

      // clear uploads
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

  const addReferenceFiles = async (filesLike) => {
    const files = Array.from(filesLike || []);
    if (!files.length) return;

    setUploadError("");

    // We intentionally require auth for uploads so they stay private and abuse-resistant.
    if (!user) {
      setUploadError(
        "To keep reference uploads private, please sign in to attach photos. You can still submit without photos."
      );
      return;
    }

    if (referenceUploads.length >= MAX_REFERENCE_IMAGES) {
      setUploadError(`You can upload up to ${MAX_REFERENCE_IMAGES} images.`);
      return;
    }

    setUploading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const accessToken = data?.session?.access_token;
      if (!accessToken) {
        throw new Error("Please sign in again to upload photos.");
      }

      const remaining = MAX_REFERENCE_IMAGES - referenceUploads.length;
      const slice = files.slice(0, remaining);

      for (const f of slice) {
        if (!String(f?.type || "").startsWith("image/")) {
          setUploadError("Please upload image files only (JPG/PNG/WebP).");
          continue;
        }
        if (f.size > MAX_ORIGINAL_MB * 1024 * 1024) {
          setUploadError(
            `"${f.name}" is too large. Please keep each image under ${MAX_ORIGINAL_MB}MB.`
          );
          continue;
        }

        // 1) Compress client-side for performance
        const compressed = await compressImageFile(f);
        const pending = {
          ...compressed,
          uploading: true,
          bucket: null,
          path: null,
          error: "",
        };

        setReferenceUploads((prev) => [...prev, pending]);

        try {
          // 2) Request a signed upload URL from the server (service role)
          const signRes = await fetch("/api/atelier/signed-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              filename: pending.filename,
              contentType: pending.contentType,
              size: pending.bytes,
              groupId: uploadGroupId,
            }),
          });

          if (!signRes.ok) {
            const txt = await signRes.text();
            throw new Error(txt || "Unable to start upload.");
          }

          const signed = await signRes.json();
          const bucket = signed?.bucket;
          const path = signed?.path;

          // 3) Upload via Supabase helper when available (fallback to PUT)
          const storage = supabase.storage.from(bucket);
          let uploadError = null;

          if (typeof storage.uploadToSignedUrl === "function" && signed?.token) {
            const { error } = await storage.uploadToSignedUrl(path, signed.token, pending.blob, {
              contentType: pending.contentType,
            });
            uploadError = error;
          } else if (signed?.signedUrl) {
            const putRes = await fetch(signed.signedUrl, {
              method: "PUT",
              headers: { "content-type": pending.contentType },
              body: pending.blob,
            });
            if (!putRes.ok) {
              uploadError = new Error("Upload failed.");
            }
          } else {
            uploadError = new Error("Signed upload response was missing required fields.");
          }

          if (uploadError) throw uploadError;

          setReferenceUploads((prev) =>
            prev.map((u) =>
              u.id === pending.id
                ? { ...u, uploading: false, bucket, path, blob: null, error: "" }
                : u
            )
          );
        } catch (innerErr) {
          setReferenceUploads((prev) =>
            prev.map((u) =>
              u.id === pending.id
                ? {
                    ...u,
                    uploading: false,
                    blob: null,
                    error: innerErr?.message || "Upload failed",
                  }
                : u
            )
          );
        }
      }
    } catch (err) {
      setUploadError(err?.message || "Unable to upload images. Please try again.");
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

  const StepHeader = () => (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
        Step {step} of 4
      </p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-2.5 w-2.5 rounded-full ${n <= step ? "bg-black" : "bg-black/10"}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );

  const SummaryRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-900 font-medium text-right">
        {value ? value : "—"}
      </span>
    </div>
  );

  return (
    <>
      <SEO
        title="Custom Atelier — Build Your Own Wig"
        description="Design your perfect wig — choose texture, color, length, lace, and fit. Our concierge confirms what's achievable and crafts your piece with precision."
      />
      <PageTransition>
      <div className="bg-[#F9F7F4] text-[#111]">
        <PageHero
          eyebrow="Custom Atelier"
          title="Build your own wig — guided, not overwhelming."
          subtitle="Choose your texture, color, length, lace, and fit. We’ll confirm what’s achievable and craft your piece with concierge precision."
          image="/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_07.webp"
          ctas={[
            { label: "Shop Ready-to-Ship", href: "/shop", variant: "ghost" },
            { label: "Private Consult", href: "/private-consult", variant: "primary" },
          ]}
          compact
        />

        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid lg:grid-cols-[1fr,0.9fr] gap-10 items-start">
            {/* Builder */}
            <form
              onSubmit={(e) => {
                if (step < 4) {
                  e.preventDefault();
                  if (canNext) setStep((s) => Math.min(4, s + 1));
                  return;
                }
                submit(e);
              }}
              className="rounded-3xl border border-black/10 bg-white p-6 md:p-8 shadow-sm"
            >
              <StepHeader />

              {/* honeypot */}
              <input
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={update("website")}
                className="hidden"
                aria-hidden="true"
              />

              {/* Step content */}
              <div className="mt-6">
                {step === 1 && (
                  <div>
                    <h2 className="text-xl font-light font-display">Start with the foundation</h2>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                      This creates your base request. We’ll confirm availability and propose the best construction for your goals.
                    </p>

                    <div className="mt-6 space-y-6">
                      <div>
                        <p className="text-xs text-neutral-600 mb-2">Product type</p>
                        <div className="flex flex-wrap gap-2">
                          <Pill active={form.productType === "Wig"} onClick={() => setForm((p) => ({ ...p, productType: "Wig" }))}>
                            Wig
                          </Pill>
                          <Pill
                            active={form.productType === "Bundles"}
                            onClick={() => setForm((p) => ({ ...p, productType: "Bundles" }))}
                          >
                            Bundles
                          </Pill>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-neutral-600">Texture</label>
                        <select className={inputBase} value={form.texture} onChange={update("texture")}>
                          {textures.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-neutral-600">Color</label>
                        <select className={inputBase} value={form.color} onChange={update("color")}>
                          {colors.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-light font-display">Length + fit</h2>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                      Choose your silhouette. For wigs, we’ll confirm lace and cap sizing for a secure, natural finish.
                    </p>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-neutral-600">Length (inches)</label>
                        <select className={inputBase} value={form.length} onChange={update("length")}>
                          {["12", "14", "16", "18", "20", "22", "24", "26", "28", "30"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-neutral-600">Density (wigs)</label>
                        <select className={inputBase} value={form.density} onChange={update("density")}>
                          {["150", "180", "210", "250"].map((v) => (
                            <option key={v} value={v}>
                              {v}%
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-neutral-500">Bundles ignore density — we’ll interpret volume by bundle count.</p>
                      </div>

                      <div>
                        <label className="text-xs text-neutral-600">Lace</label>
                        <select className={inputBase} value={form.lace} onChange={update("lace")}>
                          {["HD Lace", "Transparent Lace"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-neutral-600">Cap Size</label>
                        <select className={inputBase} value={form.capSize} onChange={update("capSize")}>
                          {["Small", "Medium", "Large"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs text-neutral-600">Preferred Parting</label>
                        <select className={inputBase} value={form.parting} onChange={update("parting")}>
                          {["Middle", "Left", "Right", "Free part"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Optional measurements */}
                      <div className="md:col-span-2 rounded-3xl border border-black/5 bg-[#FBF6ED]/60 p-5">
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
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-light font-display">Lifestyle preferences</h2>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                      These answers help us recommend the best longevity + maintenance plan for your piece.
                    </p>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-neutral-600">Wear frequency</label>
                        <select className={inputBase} value={form.wearFrequency} onChange={update("wearFrequency")}>
                          {["Daily", "3–4x/week", "Occasional", "Photos/Events"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600">Heat styling</label>
                        <select className={inputBase} value={form.heatStyling} onChange={update("heatStyling")}>
                          {["Rarely", "Sometimes", "Often"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-neutral-600">Top priority</label>
                        <select className={inputBase} value={form.realismPriority} onChange={update("realismPriority")}>
                          {["Hairline realism", "Low maintenance", "Maximum volume", "Natural movement"].map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Reference images */}
                      <div className="md:col-span-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-neutral-600">Reference photos (optional)</p>
                            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                              Upload up to {MAX_REFERENCE_IMAGES} images. These are sent only to our concierge to match your vision.
                            </p>
                          </div>

                          {user ? (
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click?.()}
                              className="shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.22em] border border-black/15 hover:border-black/30 bg-white"
                              disabled={uploading}
                            >
                              {uploading ? "Uploading…" : "Add photos"}
                            </button>
                          ) : (
                            <Link
                              to="/account"
                              className="shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.22em] border border-black/15 hover:border-black/30 bg-white"
                            >
                              Sign in to upload
                            </Link>
                          )}
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          disabled={!user}
                          onChange={async (e) => {
                            const files = e.target.files;
                            // reset input so the same file can be re-selected
                            e.target.value = "";
                            await addReferenceFiles(files);
                          }}
                        />

                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (!user) {
                              setUploadError(
                                "To keep uploads private, please sign in to upload reference photos."
                              );
                              return;
                            }
                            fileInputRef.current?.click?.();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              if (!user) {
                                setUploadError(
                                  "To keep uploads private, please sign in to upload reference photos."
                                );
                                return;
                              }
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
                          <p className="text-sm text-neutral-800">
                            {user ? (
                              <>
                                Drag & drop images here, or click <span className="underline">Add photos</span>.
                              </>
                            ) : (
                              <>Sign in to upload private reference photos.</>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {user
                              ? "Best: 1) hairline close-up, 2) overall length/shape, 3) color/texture inspiration."
                              : "You can still submit your request without photos."}
                          </p>
                        </div>

                        {uploadError && (
                          <p className="mt-2 text-xs text-red-700">{uploadError}</p>
                        )}

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

                                {u.uploading && (
                                  <div className="pointer-events-none absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-xs">Uploading…</span>
                                  </div>
                                )}

                                {!u.uploading && u.error && (
                                  <div className="pointer-events-none absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-xs">Upload failed</span>
                                  </div>
                                )}

                                {!u.uploading && !u.error && u.path && (
                                  <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white">
                                    Private
                                  </div>
                                )}

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
                                        disabled={idx === 0 || u.uploading}
                                        className="h-8 w-8 rounded-full border border-black/10 bg-white/70 hover:bg-white disabled:opacity-40"
                                        aria-label="Move image up"
                                        title="Move up"
                                      >
                                        ↑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => moveReference(u.id, "down")}
                                        disabled={idx === referenceUploads.length - 1 || u.uploading}
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
                                      disabled={u.uploading}
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

                      <div className="md:col-span-2">
                        <label className="text-xs text-neutral-600">Notes (optional)</label>
                        <textarea
                          className={inputBase + " min-h-[120px]"}
                          value={form.notes}
                          onChange={update("notes")}
                          placeholder="Fit concerns, hairline preference, knot bleaching, layered cut, etc."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-light font-display">Review + submit</h2>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                      Add contact details so our concierge can confirm availability, quote, and timeline.
                    </p>

                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-neutral-600">Full name *</label>
                        <input className={inputBase} value={form.fullName} onChange={update("fullName")} />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600">Email *</label>
                        <input className={inputBase} value={form.email} onChange={update("email")} type="email" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600">Phone (optional)</label>
                        <input className={inputBase} value={form.phone} onChange={update("phone")} />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600">Location (optional)</label>
                        <input className={inputBase} value={form.location} onChange={update("location")} placeholder="City, Country" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600">Deadline (optional)</label>
                        <input className={inputBase} value={form.deadline} onChange={update("deadline")} placeholder="e.g., March 15" />
                      </div>
                      <div>
                        <label className="text-xs text-neutral-600">Budget (optional)</label>
                        <input className={inputBase} value={form.budget} onChange={update("budget")} placeholder="e.g., $600–$900" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-neutral-600">Inspiration link (optional)</label>
                        <input className={inputBase} value={form.inspirationLink} onChange={update("inspirationLink")} placeholder="Instagram/TikTok/Pinterest URL" />
                      </div>
                    </div>

                    <div className="mt-8 rounded-3xl border border-black/5 bg-[#FBF6ED]/60 p-6">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Summary</p>
                      <p className="mt-3 text-sm text-neutral-800">
                        <strong>{form.productType}</strong> • {form.texture} • {form.color} • {form.length}" • {form.density}% • {form.lace} • {form.capSize}
                      </p>

                      {(form.capCircumference || form.earToEar || form.frontToNape) && (
                        <p className="mt-2 text-xs text-neutral-600">
                          Measurements:
                          {form.capCircumference ? (
                            <> <strong>Circ</strong> {form.capCircumference}in</>
                          ) : null}
                          {form.earToEar ? (
                            <> {form.capCircumference ? "•" : ""} <strong>Ear</strong> {form.earToEar}in</>
                          ) : null}
                          {form.frontToNape ? (
                            <> {(form.capCircumference || form.earToEar) ? "•" : ""} <strong>Nape</strong> {form.frontToNape}in</>
                          ) : null}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-neutral-600">
                        Reference photos: <strong>{referenceUploads.length}</strong>
                        {form.inspirationLink ? (
                          <>
                            {" "}• Inspiration link included
                          </>
                        ) : null}
                      </p>
                      <p className="mt-2 text-xs text-neutral-600">
                        Custom pieces are crafted to order and are <strong>final sale</strong>. We’ll confirm details before production.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] border border-black/15 hover:border-black/30"
                  disabled={step === 1 || status.state === "loading"}
                >
                  Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => canNext && setStep((s) => Math.min(4, s + 1))}
                    className="flex-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                    disabled={status.state === "loading"}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                    disabled={!canSubmit || status.state === "loading"}
                  >
                    {status.state === "loading" ? "Submitting..." : "Submit request"}
                  </button>
                )}
              </div>

              {status.state !== "idle" && (
                <p
                  className={`mt-4 text-sm ${
                    status.state === "success"
                      ? "text-emerald-700"
                      : status.state === "error"
                      ? "text-red-700"
                      : "text-neutral-700"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>

            {/* Right rail */}
            <aside className="rounded-3xl border border-black/10 bg-white/60 p-6 md:p-8 space-y-6">
              {/* Sticky build summary (desktop-first luxury UX) */}
              <div className="sticky top-28 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                  Your build
                </p>
                <p className="mt-2 text-sm text-neutral-800">
                  Live summary • <span className="text-neutral-500">Step {step}/4</span>
                </p>

                <div className="mt-4 space-y-2">
                  <SummaryRow label="Type" value={form.productType} />
                  <SummaryRow label="Texture" value={form.texture} />
                  <SummaryRow label="Color" value={form.color} />
                  <SummaryRow label="Length" value={form.length ? `${form.length}"` : ""} />
                  <SummaryRow label="Density" value={form.density ? `${form.density}%` : ""} />
                  <SummaryRow label="Lace" value={form.lace} />
                  <SummaryRow label="Cap size" value={form.capSize} />
                  {measurementLine ? <SummaryRow label="Measurements" value={measurementLine} /> : null}
                  <SummaryRow label="Reference photos" value={`${referenceUploads.length}`} />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Foundation", "Fit", "Preferences", "Review"].map((label, i) => {
                    const n = i + 1;
                    const active = n === step;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setStep(n)}
                        className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] border transition ${
                          active
                            ? "bg-black text-white border-black"
                            : "border-neutral-300 bg-white/60 hover:bg-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
                  Concierge will confirm availability, quote, and timeline via email.
                </p>
              </div>

              {/* How it works */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">How it works</p>
                <h3 className="mt-2 text-2xl font-light font-display">Atelier workflow</h3>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                  Luxury isn’t complicated — it’s precise. We confirm details first, then craft.
                </p>

                <ol className="mt-6 space-y-3 text-sm text-neutral-800 list-decimal list-inside">
                  <li>Submit your build request.</li>
                  <li>Concierge confirms availability + quote.</li>
                  <li>Production begins after confirmation.</li>
                  <li>QC inspection + discreet packaging.</li>
                </ol>

                <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Not sure?</p>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                    If you’re deciding between textures, densities, or cap sizes, start with a consult.
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

                <p className="mt-6 text-xs text-neutral-500 leading-relaxed">
                  Prefer a classic form? Use our{" "}
                  <Link to="/custom-orders" className="underline">
                    Custom Orders
                  </Link>
                  {" "}page.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
