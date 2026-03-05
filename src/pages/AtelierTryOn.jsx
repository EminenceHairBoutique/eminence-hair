/**
 * AtelierTryOn.jsx
 * /atelier/try-on
 *
 * Virtual wig try-on using MediaPipe FaceLandmarker (lazy-loaded).
 * Users can upload a photo or use webcam, then see a wig overlay positioned
 * on their face. Manual sliders provide fallback adjustment.
 *
 * Dependencies loaded dynamically (not bundled):
 *   @mediapipe/tasks-vision  — only imported on this route
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { products } from "../data/products";
import { getOverlay, DEFAULT_ADJUSTMENTS } from "../data/tryonOverlays";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

// ─── Constants ───────────────────────────────────────────────────────────────

const WIG_PRODUCTS = (products || []).filter((p) => p.type === "wig");

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm";

// ─── Utility ─────────────────────────────────────────────────────────────────

async function loadFaceLandmarker() {
  const { FaceLandmarker, FilesetResolver } =
    await import(/* @vite-ignore */ "@mediapipe/tasks-vision");

  const vision = await FilesetResolver.forVisionTasks(WASM_BASE);

  const landmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `${WASM_BASE}/../face_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: "IMAGE",
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });

  return { FaceLandmarker, landmarker };
}

/**
 * Draw the hair overlay onto a canvas, positioned relative to face landmarks.
 * Falls back to manual adjustments if no face was detected.
 *
 * landmarks: normalized [x,y,z] array (MediaPipe face mesh, 478 points)
 * Landmark indices used:
 *   10  = forehead center top
 *   152 = chin bottom
 *   234 = left cheek
 *   454 = right cheek
 */
function drawOverlay(
  ctx,
  imgEl,
  overlayEl,
  landmarks,
  adjustments,
  canvasW,
  canvasH
) {
  // Draw source photo
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(imgEl, 0, 0, canvasW, canvasH);

  const adj = { ...DEFAULT_ADJUSTMENTS, ...(adjustments || {}) };

  let drawX, drawY, drawW, drawH;

  if (landmarks && landmarks.length > 0) {
    // Use face geometry to position overlay
    const lms = landmarks[0]?.landmarks || landmarks[0] || [];

    const pt = (idx) => ({
      x: (lms[idx]?.x ?? 0.5) * canvasW,
      y: (lms[idx]?.y ?? 0.5) * canvasH,
    });

    const forehead = pt(10);
    const chin = pt(152);
    const leftCheek = pt(234);
    const rightCheek = pt(454);

    const faceH = chin.y - forehead.y;
    const faceW = rightCheek.x - leftCheek.x;
    const faceCX = (leftCheek.x + rightCheek.x) / 2;

    // Hair width ≈ face width * 2.2 scaled by user adj
    drawW = faceW * 2.2 * adj.scale;
    drawH = drawW * 1.35; // approximate wig aspect ratio

    // Center horizontally on face, top at forehead offset
    drawX = faceCX - drawW / 2 + adj.offsetX * canvasW;
    drawY = forehead.y - faceH * 0.55 + adj.offsetY * canvasH;
  } else {
    // No face detected — use manual mode
    const cx = canvasW / 2 + adj.offsetX * canvasW;
    const cy = canvasH * 0.38 + adj.offsetY * canvasH;
    drawW = canvasW * 0.75 * adj.scale;
    drawH = drawW * 1.35;
    drawX = cx - drawW / 2;
    drawY = cy - drawH * 0.42;
  }

  if (overlayEl && overlayEl.complete && overlayEl.naturalWidth > 0) {
    // Draw transparent PNG overlay with optional rotation
    ctx.save();
    ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
    ctx.rotate((adj.rotation * Math.PI) / 180);
    ctx.drawImage(overlayEl, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  } else {
    // Placeholder: styled text label instead of missing image
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#4a2d1a";
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;
    ctx.font = `bold ${Math.round(drawW / 14)}px Georgia, serif`;
    ctx.fillStyle = "#7a4a28";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦ Eminence Hair ✦", drawX + drawW / 2, drawY + drawH / 2);
    ctx.restore();
  }
}

// ─── AdjustmentSlider ─────────────────────────────────────────────────────────

function AdjSlider({ label, value, min, max, step, onChange }) {
  return (
    <label className="block">
      <div className="flex justify-between text-[11px] text-neutral-500 mb-1">
        <span className="uppercase tracking-wider">{label}</span>
        <span>{Number(value).toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-black"
      />
    </label>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AtelierTryOn() {
  const { user } = useUser();

  // Product selection
  const [selectedProductId, setSelectedProductId] = useState(
    WIG_PRODUCTS[0]?.id || ""
  );
  const overlay = getOverlay(selectedProductId);

  // Adjustments state
  const [adj, setAdj] = useState({ ...DEFAULT_ADJUSTMENTS });
  const setAdjKey = (k) => (v) => setAdj((p) => ({ ...p, [k]: v }));

  // Source photo
  const [srcDataUrl, setSrcDataUrl] = useState(null);
  const [faceLandmarks, setFaceLandmarks] = useState(null);

  // Overlay image element
  const [overlayImgEl, setOverlayImgEl] = useState(null);

  // MediaPipe state
  const [mpStatus, setMpStatus] = useState("idle"); // idle | loading | ready | error
  const landmarkerRef = useRef(null);

  // Canvas
  const canvasRef = useRef(null);
  const srcImgRef = useRef(null);

  // Session / Save state
  const [sessionId, setSessionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sentToConcierge, setSentToConcierge] = useState(false);
  const [err, setErr] = useState("");

  // Webcam
  const [camActive, setCamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // ── Load overlay image when product changes ───────────────────────────────
  useEffect(() => {
    if (!overlay.src) {
      setOverlayImgEl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = overlay.src;
    img.onload = () => setOverlayImgEl(img);
    img.onerror = () => setOverlayImgEl(null);
  }, [overlay.src]);

  // Reset adjustments when product changes.
  // overlay is derived from selectedProductId so including overlay.defaults would
  // create an unstable reference cycle; selectedProductId is the correct dep here.
  useEffect(() => {
    setAdj({ ...DEFAULT_ADJUSTMENTS, ...(overlay.defaults || {}) });
  }, [selectedProductId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load MediaPipe lazily ─────────────────────────────────────────────────
  const ensureLandmarker = useCallback(async () => {
    if (landmarkerRef.current) return landmarkerRef.current;
    setMpStatus("loading");
    try {
      const { landmarker } = await loadFaceLandmarker();
      landmarkerRef.current = landmarker;
      setMpStatus("ready");
      return landmarker;
    } catch (e) {
      console.warn("FaceLandmarker load failed:", e);
      setMpStatus("error");
      return null;
    }
  }, []);

  // ── Detect face landmarks in current srcImgRef ────────────────────────────
  const detectFace = useCallback(async (imgEl) => {
    const lm = await ensureLandmarker();
    if (!lm || !imgEl) return null;
    try {
      const result = lm.detect(imgEl);
      return result?.faceLandmarks?.length > 0 ? result.faceLandmarks : null;
    } catch (e) {
      console.warn("detect:", e);
      return null;
    }
  }, [ensureLandmarker]);

  // ── Re-render canvas whenever inputs change ───────────────────────────────
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const imgEl = srcImgRef.current;
    if (!canvas || !imgEl || !srcDataUrl) return;

    const ctx = canvas.getContext("2d");
    drawOverlay(ctx, imgEl, overlayImgEl, faceLandmarks, adj, canvas.width, canvas.height);
  }, [srcDataUrl, overlayImgEl, faceLandmarks, adj]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // ── Handle source image load ──────────────────────────────────────────────
  const onSrcImgLoad = useCallback(
    async (imgEl) => {
      if (!imgEl) return;
      const canvas = canvasRef.current;
      if (canvas) {
        // Scale canvas to image aspect, max 720px wide
        const maxW = 720;
        const scale = Math.min(1, maxW / imgEl.naturalWidth);
        canvas.width = Math.round(imgEl.naturalWidth * scale);
        canvas.height = Math.round(imgEl.naturalHeight * scale);
      }
      const lms = await detectFace(imgEl);
      setFaceLandmarks(lms);
    },
    [detectFace]
  );

  // ── File upload handler ───────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSrcDataUrl(ev.target.result);
      setFaceLandmarks(null);
      setSaved(false);
      setSentToConcierge(false);
    };
    reader.readAsDataURL(file);
  };

  // Sync srcImgRef after srcDataUrl changes
  useEffect(() => {
    if (!srcDataUrl) return;
    const img = new Image();
    img.onload = () => {
      srcImgRef.current = img;
      onSrcImgLoad(img);
    };
    img.src = srcDataUrl;
  }, [srcDataUrl, onSrcImgLoad]);

  // ── Webcam capture ────────────────────────────────────────────────────────
  const startCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCamActive(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setErr("Camera access denied.");
    }
  };

  const captureFromCam = () => {
    const video = videoRef.current;
    if (!video) return;
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = video.videoWidth;
    tmpCanvas.height = video.videoHeight;
    tmpCanvas.getContext("2d").drawImage(video, 0, 0);
    setSrcDataUrl(tmpCanvas.toDataURL("image/jpeg", 0.9));
    stopCam();
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamActive(false);
  };

  useEffect(() => () => stopCam(), []); // cleanup on unmount

  // ── Create session ────────────────────────────────────────────────────────
  const createSession = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/atelier/tryon/create", {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId: selectedProductId,
          productName: overlay.label,
          overlayKey: selectedProductId,
          adjustments: adj,
        }),
      });
      if (!res.ok) throw new Error("Session create failed");
      const { sessionId: sid } = await res.json();
      setSessionId(sid);
      return sid;
    } catch (e) {
      console.warn("createSession:", e);
      return null;
    }
  };

  // ── Save result ───────────────────────────────────────────────────────────
  const saveResult = async (sendToConcierge = false) => {
    setErr("");
    setSaving(true);
    try {
      const sid = sessionId || (await createSession());
      if (!sid) throw new Error("Could not create session.");

      // Export canvas as data URL and convert to blob
      const canvas = canvasRef.current;
      const resultDataUrl = canvas ? canvas.toDataURL("image/jpeg", 0.88) : null;

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/atelier/tryon/save", {
        method: "POST",
        headers,
        body: JSON.stringify({
          sessionId: sid,
          resultUrl: resultDataUrl,
          adjustments: adj,
          sendToConcierge,
        }),
      });
      if (!res.ok) throw new Error("Save failed");

      if (sendToConcierge) setSentToConcierge(true);
      else setSaved(true);
    } catch (e) {
      setErr(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <SEO
        title="Virtual Try-On — Atelier"
        description="Try on Eminence Hair wigs virtually using AI face detection. Upload a photo and see how you look."
        canonical="/atelier/try-on"
      />

      <div className="pt-28 pb-20 bg-[radial-gradient(ellipse_at_top,_#FBF5EC,_#F4EBDF,_#F7F1E7)] text-neutral-900 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500">Eminence Atelier</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-light">Virtual Try-On</h1>
            <p className="mt-3 text-sm text-neutral-600 max-w-2xl leading-relaxed">
              Upload a photo or use your camera to see how our wigs look on you.
              AI face detection positions the overlay automatically — use the sliders to fine-tune.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,320px] gap-6">
            {/* ── Canvas area ─────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_18px_40px_rgba(15,10,5,0.16)] overflow-hidden">
              {srcDataUrl ? (
                <canvas
                  ref={canvasRef}
                  className="w-full block"
                  style={{ maxHeight: "70vh", objectFit: "contain" }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 min-h-[380px] text-center">
                  <div className="text-4xl mb-4">✦</div>
                  <p className="text-sm text-neutral-500 mb-6">
                    Upload a clear front-facing photo to begin your virtual try-on.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <label className="cursor-pointer px-5 py-2.5 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition">
                      Upload photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={startCam}
                      className="px-5 py-2.5 rounded-full border border-black/20 text-[11px] uppercase tracking-[0.22em] hover:border-black/40 transition"
                    >
                      Use camera
                    </button>
                  </div>
                </div>
              )}

              {/* Webcam preview */}
              {camActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl p-6 max-w-lg w-full mx-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full rounded-2xl"
                    />
                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={captureFromCam}
                        className="flex-1 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em]"
                      >
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopCam}
                        className="px-5 py-3 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {srcDataUrl && (
                <div className="border-t border-neutral-100 px-6 py-4 flex flex-wrap gap-3 items-center">
                  <label className="cursor-pointer px-4 py-2 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition">
                    Change photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                  <button
                    type="button"
                    onClick={startCam}
                    className="px-4 py-2 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition"
                  >
                    Use camera
                  </button>

                  {mpStatus === "loading" && (
                    <span className="text-xs text-neutral-400">Loading AI…</span>
                  )}
                  {mpStatus === "error" && (
                    <span className="text-xs text-amber-600">AI unavailable — using manual mode</span>
                  )}
                  {faceLandmarks && (
                    <span className="text-xs text-green-700">✓ Face detected</span>
                  )}
                  {!faceLandmarks && srcDataUrl && mpStatus !== "loading" && (
                    <span className="text-xs text-neutral-400">No face detected — use sliders to adjust</span>
                  )}
                </div>
              )}
            </div>

            {/* ── Controls sidebar ─────────────────────────────────────────── */}
            <div className="space-y-4">
              {/* Product select */}
              <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.10)] p-6">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-3">Select wig style</p>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                >
                  {WIG_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName || p.name}
                    </option>
                  ))}
                </select>

                {overlay.src ? (
                  <p className="mt-2 text-xs text-green-700">✓ Overlay available</p>
                ) : (
                  <p className="mt-2 text-xs text-neutral-400">
                    Overlay image coming soon — placeholder shown.
                  </p>
                )}
              </div>

              {/* Manual adjustments */}
              <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.10)] p-6">
                <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-4">Adjust placement</p>
                <div className="space-y-4">
                  <AdjSlider label="Scale" value={adj.scale} min={0.4} max={2.5} step={0.01} onChange={setAdjKey("scale")} />
                  <AdjSlider label="Horizontal" value={adj.offsetX} min={-0.4} max={0.4} step={0.01} onChange={setAdjKey("offsetX")} />
                  <AdjSlider label="Vertical" value={adj.offsetY} min={-0.4} max={0.4} step={0.01} onChange={setAdjKey("offsetY")} />
                  <AdjSlider label="Rotation" value={adj.rotation} min={-30} max={30} step={0.5} onChange={setAdjKey("rotation")} />
                  <button
                    type="button"
                    onClick={() => setAdj({ ...DEFAULT_ADJUSTMENTS, ...(overlay.defaults || {}) })}
                    className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-black transition"
                  >
                    Reset adjustments
                  </button>
                </div>
              </div>

              {/* Save / Concierge */}
              {srcDataUrl && (
                <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.10)] p-6 space-y-3">
                  <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">Save / Share</p>

                  {err && <p className="text-xs text-red-600">{err}</p>}
                  {saved && <p className="text-xs text-green-700">✓ Session saved.</p>}
                  {sentToConcierge && (
                    <p className="text-xs text-green-700">
                      ✓ Sent to concierge! We'll be in touch soon.
                    </p>
                  )}

                  {!saved && !sentToConcierge && (
                    <>
                      <button
                        type="button"
                        onClick={() => saveResult(false)}
                        disabled={saving}
                        className="w-full py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 disabled:opacity-50 transition"
                      >
                        {saving ? "Saving…" : "Save session"}
                      </button>

                      <button
                        type="button"
                        onClick={() => saveResult(true)}
                        disabled={saving}
                        className="w-full py-3 rounded-full border border-black/20 text-[11px] uppercase tracking-[0.22em] hover:border-black/40 disabled:opacity-50 transition"
                      >
                        {saving ? "Sending…" : "Send to Concierge"}
                      </button>

                      {!user && (
                        <p className="text-[10px] text-neutral-400 text-center">
                          <Link to="/account" className="underline">Sign in</Link> to save sessions to your account.
                        </p>
                      )}
                    </>
                  )}

                  {(saved || sentToConcierge) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSaved(false);
                        setSentToConcierge(false);
                        setSessionId(null);
                      }}
                      className="w-full py-3 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition"
                    >
                      Try another style
                    </button>
                  )}
                </div>
              )}

              {/* Links */}
              <div className="text-center space-y-2">
                <Link
                  to="/shop"
                  className="block text-[10px] uppercase tracking-wider text-neutral-400 hover:text-black transition"
                >
                  Browse all wigs →
                </Link>
                <Link
                  to="/custom-atelier"
                  className="block text-[10px] uppercase tracking-wider text-neutral-400 hover:text-black transition"
                >
                  Custom atelier order →
                </Link>
              </div>
            </div>
          </div>

          {/* Info note */}
          <p className="mt-8 text-[11px] text-neutral-400 text-center max-w-lg mx-auto leading-relaxed">
            Virtual try-on is a visual guide only. Actual hair texture, density, and colour may vary.
            For a professional consultation, use <em>Send to Concierge</em> above.
          </p>
        </div>
      </div>
    </>
  );
}
