import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Button } from "./ui/button";

const COLORS = [
  { id: "1", label: "1 (Jet Black)", hex: "#0B0B0B" },
  { id: "1B", label: "1B (Natural Black)", hex: "#1B1B1B" },
  { id: "613", label: "613 (Blonde)", hex: "#E8D3A7" },
  { id: "Burgundy", label: "Burgundy", hex: "#5A0C2B" },
  { id: "Brown", label: "Brown", hex: "#5B3A29" },
  { id: "Silver", label: "Silver", hex: "#C9C9C9" },
  { id: "Orange", label: "Orange", hex: "#C05A1D" },
];

const TEXTURES = [
  { id: "Straight", label: "Straight" },
  { id: "LooseWave", label: "Loose Wave" },
  { id: "BodyWave", label: "Body Wave" },
  { id: "DeepWave", label: "Deep Wave" },
];

// A minimal, luxe-friendly silhouette overlay (SVG). This is intentionally subtle.
function HairSilhouette({ color = "#111", opacity = 0.33 }) {
  return (
    <svg
      viewBox="0 0 800 900"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={opacity * 0.8} />
          <stop offset="55%" stopColor={color} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.85} />
        </linearGradient>

        {/* Soft wave texture */}
        <pattern id="hairWaves" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M0,40 C20,10 60,10 80,40 C100,70 140,70 160,40"
            fill="none"
            stroke={color}
            strokeOpacity={opacity * 0.22}
            strokeWidth="6"
          />
        </pattern>
        <mask id="hairMask">
          <rect width="800" height="900" fill="white" />
        </mask>
      </defs>

      {/* Hair shape */}
      <path
        d="M400 80
           C315 80 250 120 220 190
           C195 250 205 320 185 380
           C160 460 125 520 135 610
           C150 735 255 850 400 850
           C545 850 650 735 665 610
           C675 520 640 460 615 380
           C595 320 605 250 580 190
           C550 120 485 80 400 80 Z"
        fill="url(#hairGrad)"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Subtle texture overlay */}
      <path
        d="M400 80
           C315 80 250 120 220 190
           C195 250 205 320 185 380
           C160 460 125 520 135 610
           C150 735 255 850 400 850
           C545 850 650 735 665 610
           C675 520 640 460 615 380
           C595 320 605 250 580 190
           C550 120 485 80 400 80 Z"
        fill="url(#hairWaves)"
        opacity="0.35"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}

export default function VirtualPreviewModal({
  open,
  onClose,
  product,
  initialColor,
  initialTexture,
}) {
  const fileRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [opacity, setOpacity] = useState(0.33);

  // --------- normalization (handles product codes, labels, and mixed strings) ---------
  const normalizeColorId = (input) => {
    if (!input) return null;
    const raw = String(input).trim();
    const normalizedInput = raw.toLowerCase();

    // Direct IDs
    if (["1", "1b", "613", "burgundy", "brown", "silver", "orange"].includes(normalizedInput)) {
      if (normalizedInput === "1") return "1";
      if (normalizedInput === "1b") return "1B";
      if (normalizedInput === "613") return "613";
      if (normalizedInput === "burgundy") return "Burgundy";
      if (normalizedInput === "brown") return "Brown";
      if (normalizedInput === "silver") return "Silver";
      if (normalizedInput === "orange") return "Orange";
    }

    // Common labels / phrases
    if (normalizedInput.includes("jet") || normalizedInput.includes("true black")) return "1";
    if (normalizedInput.includes("natural") && normalizedInput.includes("black")) return "1B";
    if (normalizedInput.includes("blonde") || normalizedInput.includes("613")) return "613";
    if (normalizedInput.includes("burgundy") || normalizedInput.includes("wine") || normalizedInput.includes("red")) return "Burgundy";
    if (normalizedInput.includes("brown") || normalizedInput.includes("22") || normalizedInput.includes("24") || normalizedInput.includes("27")) return "Brown";
    if (normalizedInput.includes("silver") || normalizedInput.includes("grey") || normalizedInput.includes("gray")) return "Silver";
    if (normalizedInput.includes("orange") || normalizedInput.includes("ginger") || normalizedInput.includes("copper")) return "Orange";

    // Try to extract an ID from the string (e.g. "1B (Natural Black)")
    const colorIdMatch = raw.match(/\b(1B|613|1|Burgundy|Brown|Silver|Orange)\b/i);
    if (colorIdMatch?.[1]) {
      const matchedColorId = colorIdMatch[1];
      if (String(matchedColorId).toUpperCase() === "1B") return "1B";
      if (String(matchedColorId) === "1") return "1";
      // Capitalize names
      if (["burgundy", "brown", "silver", "orange"].includes(String(matchedColorId).toLowerCase())) {
        const lowercasedColorId = String(matchedColorId).toLowerCase();
        return lowercasedColorId.charAt(0).toUpperCase() + lowercasedColorId.slice(1);
      }
      return matchedColorId;
    }

    // Parse from assetKey when present (wig_bodywave_1b)
    const ak = String(product?.assetKey || "").toLowerCase();
    const assetKeyColorMatch = ak.match(/_(1b|613|1|burgundy|brown|silver|orange)$/i);
    if (assetKeyColorMatch?.[1]) {
      const assetKeyColorId = assetKeyColorMatch[1];
      if (String(assetKeyColorId).toLowerCase() === "1b") return "1B";
      if (String(assetKeyColorId) === "1") return "1";
      if (String(assetKeyColorId) === "613") return "613";
      return String(assetKeyColorId).charAt(0).toUpperCase() + String(assetKeyColorId).slice(1);
    }
    return null;
  };

  const normalizeTextureId = (input) => {
    const raw = String(input || "").trim();
    const normalizedInput = raw.toLowerCase();

    // Direct IDs
    if (["straight", "loosewave", "bodywave", "deepwave"].includes(normalizedInput)) {
      if (normalizedInput === "straight") return "Straight";
      if (normalizedInput === "loosewave") return "LooseWave";
      if (normalizedInput === "bodywave") return "BodyWave";
      if (normalizedInput === "deepwave") return "DeepWave";
    }

    // Common variants
    if (normalizedInput.includes("straight")) return "Straight";
    if (normalizedInput.includes("loose") && normalizedInput.includes("wave")) return "LooseWave";
    if (normalizedInput.includes("body") && normalizedInput.includes("wave")) return "BodyWave";
    if (normalizedInput.includes("deep") && normalizedInput.includes("wave")) return "DeepWave";

    // Sometimes textures come in combined strings ("Curly / BodyWave / Straight compatible")
    if (normalizedInput.includes("bodywave")) return "BodyWave";
    if (normalizedInput.includes("loosewave")) return "LooseWave";
    if (normalizedInput.includes("deepwave")) return "DeepWave";

    // Parse from assetKey when present (wig_loosewave_burgundy)
    const ak = String(product?.assetKey || "").toLowerCase();
    const textureKeyMatch = ak.match(/^wig_([a-z]+wave|straight)/i);
    if (textureKeyMatch?.[1]) {
      const matchedTextureKey = textureKeyMatch[1];
      if (matchedTextureKey === "straight") return "Straight";
      if (matchedTextureKey === "loosewave") return "LooseWave";
      if (matchedTextureKey === "bodywave") return "BodyWave";
      if (matchedTextureKey === "deepwave") return "DeepWave";
    }
    return null;
  };

  const [color, setColor] = useState(() => normalizeColorId(initialColor) || "1B");
  const [texture, setTexture] = useState(() => normalizeTextureId(initialTexture) || "BodyWave");

  // Optional "notify me" fields (AR beta)
  const [notifyName, setNotifyName] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyStatus, setNotifyStatus] = useState({ state: "idle", msg: "" });

  const selectedColor = useMemo(
    () => COLORS.find((colorOption) => String(colorOption.id).toLowerCase() === String(color).toLowerCase()) || COLORS[1],
    [color]
  );

  useEffect(() => {
    // Reset when opened for a new PDP
    if (!open) return;
    setColor(normalizeColorId(initialColor) || "1B");
    setTexture(normalizeTextureId(initialTexture) || "BodyWave");
    setNotifyStatus({ state: "idle", msg: "" });
  }, [open, initialColor, initialTexture]);

  useEffect(() => {
    // Cleanup object URLs
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  if (!open) return null;

  const onPick = () => fileRef.current?.click();
  const onFile = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPhotoUrl(url);
  };

  const submitNotify = async () => {
    setNotifyStatus({ state: "loading", msg: "" });
    try {
      if (!notifyName || !notifyEmail) {
        throw new Error("Please add your name and email.");
      }
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ar_tryon_waitlist",
          payload: {
            fullName: notifyName,
            email: notifyEmail,
            product: product?.displayName || product?.name || "",
            texture,
            color,
            source: "virtual_preview_modal",
          },
        }),
      });
      if (!res.ok) {
        const responseText = await res.text();
        throw new Error(responseText || "Unable to submit.");
      }
      setNotifyStatus({ state: "success", msg: "You’re on the list. We’ll email you when AR Try‑On launches." });
      setNotifyName("");
      setNotifyEmail("");
    } catch (err) {
      setNotifyStatus({ state: "error", msg: err?.message || "Unable to submit." });
    }
  };

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Motion.div
          className="relative w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-neutral-700 hover:text-black hover:bg-white transition"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="grid lg:grid-cols-2">
            {/* Preview */}
            <div className="bg-[#FBF6ED] p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                Virtual preview <span className="text-neutral-400">(beta)</span>
              </p>
              <h3 className="mt-2 text-2xl font-light font-display text-neutral-900">
                Preview on you
              </h3>
              <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                Upload a selfie to preview a general silhouette + color impression. This is an approximation —
                lace realism and exact placement can vary.
              </p>

              <div className="mt-6 rounded-3xl border border-black/10 bg-white overflow-hidden">
                <div className="aspect-[4/5] relative bg-neutral-100">
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt="Uploaded preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <HairSilhouette color={selectedColor.hex} opacity={opacity} />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-white/90">
                          {TEXTURES.find((textureOption) => textureOption.id === texture)?.label || texture} • {selectedColor.label}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <p className="text-sm text-neutral-700">Upload a photo to begin.</p>
                      <p className="mt-2 text-xs text-neutral-500">
                        Best results: well-lit selfie, hair pulled back, face centered.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Overlay intensity</p>
                    <input
                      type="range"
                      min={0.12}
                      max={0.55}
                      step={0.01}
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="mt-2 w-[240px]"
                      aria-label="Overlay intensity"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFile}
                    />
                    <Button
                      variant="outline"
                      className="rounded-full text-xs tracking-[0.22em] uppercase"
                      onClick={onPick}
                    >
                      {photoUrl ? "Replace photo" : "Upload photo"}
                    </Button>
                    {photoUrl && (
                      <Button
                        variant="ghost"
                        className="rounded-full text-xs tracking-[0.22em] uppercase"
                        onClick={() => setPhotoUrl("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Choose your details</p>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-xs text-neutral-700 mb-2">Texture</p>
                  <div className="flex flex-wrap gap-2">
                    {TEXTURES.map((textureOption) => (
                      <button
                        key={textureOption.id}
                        type="button"
                        onClick={() => setTexture(textureOption.id)}
                        className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.22em] border transition ${
                          texture === textureOption.id
                            ? "bg-black text-white border-black"
                            : "border-neutral-300 hover:border-neutral-500"
                        }`}
                      >
                        {textureOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-neutral-700 mb-2">Color</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COLORS.map((colorOption) => (
                      <button
                        key={colorOption.id}
                        type="button"
                        onClick={() => setColor(colorOption.id)}
                        className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                          String(color).toLowerCase() === String(colorOption.id).toLowerCase()
                            ? "border-black"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10"
                          style={{ background: colorOption.hex }}
                          aria-hidden="true"
                        />
                        <span className="text-[11px] uppercase tracking-[0.22em] text-neutral-700">
                          {colorOption.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-[#FBF6ED]/50 p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Coming soon</p>
                  <h4 className="mt-2 text-lg font-light font-display">Full AR Try‑On</h4>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                    We’re testing advanced AR for more realistic placement and movement.
                    If you’d like early access, join the beta list.
                  </p>

                  <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    <input
                      value={notifyName}
                      onChange={(e) => setNotifyName(e.target.value)}
                      placeholder="Name"
                      className="w-full rounded-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <input
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Email"
                      type="email"
                      className="w-full rounded-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <Button
                      disabled={notifyStatus.state === "loading"}
                      onClick={submitNotify}
                      className="rounded-full text-xs tracking-[0.24em] uppercase"
                    >
                      {notifyStatus.state === "loading" ? "Submitting..." : "Notify me"}
                    </Button>
                    <p className="text-xs text-neutral-500">
                      No spam. One email when it’s ready.
                    </p>
                  </div>

                  {notifyStatus.state !== "idle" && (
                    <p
                      className={`mt-3 text-xs ${
                        notifyStatus.state === "success"
                          ? "text-emerald-700"
                          : notifyStatus.state === "error"
                          ? "text-red-700"
                          : "text-neutral-700"
                      }`}
                    >
                      {notifyStatus.msg}
                    </p>
                  )}
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-500">Want it made for you?</p>
                  <h4 className="mt-2 text-lg font-light font-display">Custom Atelier</h4>
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                    Select your ideal length, density, lace, and fit — we’ll confirm what’s achievable and craft it.
                  </p>
                  <div className="mt-4">
                    <a
                      href="/custom-atelier"
                      className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.26em] bg-black text-white hover:bg-black/90"
                    >
                      Build your custom wig
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
}
