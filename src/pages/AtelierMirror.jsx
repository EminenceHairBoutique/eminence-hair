/**
 * AtelierMirror.jsx
 * /atelier/mirror
 *
 * Atelier Mirror — luxury AI wig try-on system.
 *
 * Three modes:
 *  1. Quick Preview  – upload photo → face detection → wig overlay → refine
 *  2. Live Mirror    – webcam + real-time RAF loop with temporal smoothing
 *  3. Concierge Review – saved looks, compare up to 3, send to concierge
 *
 * Architecture:
 *  - Provider abstraction: src/lib/tryon/providers/ (swap MediaPipe → Banuba without UI changes)
 *  - All face processing is client-side (privacy-first)
 *  - Saved looks persisted to localStorage + Supabase (if logged in)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import SEO from "../components/SEO";
import { products } from "../data/products";
import { getOverlay, DEFAULT_ADJUSTMENTS } from "../data/tryonOverlays";
import { getProvider } from "../lib/tryon/providers/index.js";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const WIG_PRODUCTS = (products || []).filter((p) => p.type === "wig");
const PROVIDER = getProvider(); // resolves to mediapipeProvider by default
const MAX_SAVED_LOOKS = 20;
const COMPARE_LIMIT = 3;
const LS_KEY = "em_atelier_looks";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadSavedLooks() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistLooks(looks) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(looks.slice(0, MAX_SAVED_LOOKS)));
  } catch {
    // quota exceeded – silently skip
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function ModeTab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.22em] transition ${
        active
          ? "bg-black text-white"
          : "border border-neutral-300 text-neutral-500 hover:border-neutral-500 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

/** Before / After compare slider using CSS clip-path */
function CompareSlider({ beforeDataUrl, afterDataUrl, width, height }) {
  const [pos, setPos] = useState(50); // percentage
  const containerRef = useRef(null);
  const dragging = useRef(false);

  function clampPos(x) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
  }

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (dragging.current) setPos(clampPos(e.clientX));
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  if (!beforeDataUrl || !afterDataUrl) return null;

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-2xl"
      style={{ width, height }}
    >
      {/* Before (base photo) */}
      <img
        src={beforeDataUrl}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* After (with overlay) – clipped to the right of the handle */}
      <img
        src={afterDataUrl}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        draggable={false}
      />
      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{ left: `${pos}%`, transform: "translateX(-50%)", cursor: "ew-resize" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="w-0.5 h-full bg-white/60 pointer-events-none" />
        <div className="absolute bg-white rounded-full shadow-lg w-8 h-8 flex items-center justify-center pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8H1m0 0l2-2m-2 2l2 2M11 8h4m0 0l-2-2m2 2l-2 2" stroke="#1B1B1B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-3 text-[11px] uppercase tracking-wider text-white bg-black/40 px-2 py-0.5 rounded-full">Before</span>
      <span className="absolute top-2 right-3 text-[11px] uppercase tracking-wider text-white bg-black/40 px-2 py-0.5 rounded-full">After</span>
    </div>
  );
}

/** Saved look thumbnail card */
function LookCard({ look, selected, onSelect, onRemove }) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition ${
        selected ? "border-black" : "border-transparent"
      }`}
      onClick={() => onSelect(look.id)}
    >
      <img
        src={look.resultDataUrl}
        alt={look.productName}
        className="w-full aspect-[3/4] object-cover"
      />
      {selected && (
        <div className="absolute top-2 left-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px]">
          ✓
        </div>
      )}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(look.id); }}
        className="absolute top-2 right-2 bg-white/80 rounded-full w-5 h-5 text-[11px] flex items-center justify-center hover:bg-white transition"
        aria-label="Remove look"
      >
        ×
      </button>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-[11px] uppercase tracking-wider truncate">{look.productName}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AtelierMirror() {
  const { user } = useUser();

  // ── Mode ────────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState("quick"); // "quick" | "live" | "review"

  // ── Product / Overlay ────────────────────────────────────────────────────────
  const [selectedProductId, setSelectedProductId] = useState(WIG_PRODUCTS[0]?.id || "");
  const overlay = getOverlay(selectedProductId);

  // ── Adjustments ─────────────────────────────────────────────────────────────
  const [adj, setAdj] = useState({ ...DEFAULT_ADJUSTMENTS });
  const setAdjKey = (k) => (v) => setAdj((p) => ({ ...p, [k]: v }));

  // ── Quick Preview state ──────────────────────────────────────────────────────
  const [srcDataUrl, setSrcDataUrl] = useState(null);
  const [faceLandmarks, setFaceLandmarks] = useState(null);
  const [resultDataUrl, setResultDataUrl] = useState(null);
  const [mpStatus, setMpStatus] = useState("idle"); // idle|loading|ready|error
  const [camActive, setCamActive] = useState(false);

  // ── Live Mirror state ────────────────────────────────────────────────────────
  const [liveActive, setLiveActive] = useState(false);
  const [liveCaptured, setLiveCaptured] = useState(null); // { srcDataUrl, resultDataUrl }

  // ── Compare slider ──────────────────────────────────────────────────────────
  const [showCompare, setShowCompare] = useState(false);

  // ── Saved looks ─────────────────────────────────────────────────────────────
  const [savedLooks, setSavedLooks] = useState(loadSavedLooks);
  const [compareIds, setCompareIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [conciergeStatus, setConciergeStatus] = useState("idle"); // idle|sending|sent|error

  // ── Error ───────────────────────────────────────────────────────────────────
  const [err, setErr] = useState("");

  // ── Refs ────────────────────────────────────────────────────────────────────
  const canvasRef = useRef(null);
  const srcImgRef = useRef(null);
  const overlayImgRef = useRef(null);
  const videoRef = useRef(null);
  const liveCanvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const metricsRef = useRef(null); // latest smoothed metrics for live mode

  // ─── Load overlay image when product changes ──────────────────────────────
  useEffect(() => {
    setAdj({ ...DEFAULT_ADJUSTMENTS, ...(overlay.defaults || {}) });
    PROVIDER.resetSmoothing?.();

    if (!overlay.src) {
      overlayImgRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      overlayImgRef.current = img;
    };
    img.onerror = () => {
      overlayImgRef.current = null;
    };
    img.src = overlay.src;
  }, [selectedProductId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Initialize MediaPipe lazily when photo or live mode is active ────────
  const ensureProvider = useCallback(async () => {
    if (mpStatus === "ready" || mpStatus === "loading") return;
    setMpStatus("loading");
    try {
      await PROVIDER.initialize();
      setMpStatus("ready");
    } catch (e) {
      console.warn("MediaPipe init failed:", e);
      setMpStatus("error");
    }
  }, [mpStatus]);

  // ─── Detect face in a loaded <img> element ────────────────────────────────
  const detectAndDraw = useCallback(async () => {
    const canvas = canvasRef.current;
    const imgEl = srcImgRef.current;
    if (!canvas || !imgEl) return;

    const ctx = canvas.getContext("2d");
    let metrics = null;

    if (mpStatus === "ready") {
      metrics = await PROVIDER.detectFace(imgEl, { smooth: false });
      setFaceLandmarks(metrics);
    }

    PROVIDER.renderOverlay(ctx, imgEl, overlayImgRef.current, metrics, adj, canvas.width, canvas.height);
    setResultDataUrl(canvas.toDataURL("image/jpeg", 0.92));
  }, [mpStatus, adj]);

  // Re-draw when adjustments change
  useEffect(() => {
    if (srcDataUrl && mpStatus === "ready") {
      detectAndDraw();
    } else if (srcDataUrl && srcImgRef.current && canvasRef.current) {
      // Draw without detection (provider not ready)
      const ctx = canvasRef.current.getContext("2d");
      PROVIDER.renderOverlay(ctx, srcImgRef.current, overlayImgRef.current, faceLandmarks, adj, canvasRef.current.width, canvasRef.current.height);
      setResultDataUrl(canvasRef.current.toDataURL("image/jpeg", 0.92));
    }
  }, [adj, selectedProductId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handle photo upload ──────────────────────────────────────────────────
  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr("");
    setSaved(false);
    setResultDataUrl(null);
    setFaceLandmarks(null);
    setShowCompare(false);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setSrcDataUrl(dataUrl);

      const img = new Image();
      img.onload = async () => {
        srcImgRef.current = img;

        // Fit canvas to image
        const canvas = canvasRef.current;
        if (!canvas) return;
        const maxW = 640;
        const scale = Math.min(1, maxW / img.naturalWidth);
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);

        await ensureProvider();

        if (mpStatus === "ready" || PROVIDER._initialized) {
          const metrics = await PROVIDER.detectFace(img, { smooth: false });
          setFaceLandmarks(metrics);
          const ctx = canvas.getContext("2d");
          PROVIDER.renderOverlay(ctx, img, overlayImgRef.current, metrics, adj, canvas.width, canvas.height);
        } else {
          const ctx = canvas.getContext("2d");
          PROVIDER.renderOverlay(ctx, img, overlayImgRef.current, null, adj, canvas.width, canvas.height);
        }
        setResultDataUrl(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [adj, ensureProvider, mpStatus]);

  // ─── Webcam capture (Quick Preview mode) ────────────────────────────────
  const startCam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamActive(true);
    } catch (_e) {
      setErr("Camera access denied. Please allow camera in browser settings.");
    }
  }, []);

  const stopCam = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamActive(false);
  }, []);

  const captureFromCam = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setSrcDataUrl(dataUrl);

    const img = new Image();
    img.onload = async () => {
      srcImgRef.current = img;
      await ensureProvider();
      const metrics = await PROVIDER.detectFace(img, { smooth: false });
      setFaceLandmarks(metrics);
      PROVIDER.renderOverlay(ctx, img, overlayImgRef.current, metrics, adj, canvas.width, canvas.height);
      setResultDataUrl(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = dataUrl;

    stopCam();
  }, [adj, ensureProvider, stopCam]);

  // ─── Live Mirror RAF loop ─────────────────────────────────────────────────
  const startLiveMirror = useCallback(async () => {
    setErr("");
    setLiveCaptured(null);
    PROVIDER.resetSmoothing?.();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;

      await ensureProvider();

      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();

      const canvas = liveCanvasRef.current;

      const drawFrame = async () => {
        if (!streamRef.current) return;
        if (video.readyState >= 2) {
          if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth || 640;
          if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext("2d");
          const metrics = await PROVIDER.detectFace(video, { smooth: true });
          metricsRef.current = metrics;
          PROVIDER.renderOverlay(ctx, video, overlayImgRef.current, metrics, adj, canvas.width, canvas.height);
        }
        rafRef.current = requestAnimationFrame(drawFrame);
      };

      rafRef.current = requestAnimationFrame(drawFrame);
      setLiveActive(true);
    } catch (_e) {
      setErr("Camera access denied. Please allow camera in browser settings.");
    }
  }, [adj, ensureProvider]);

  const stopLiveMirror = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLiveActive(false);
  }, []);

  const captureLiveFrame = useCallback(() => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;

    // Capture result (with overlay)
    const resultUrl = canvas.toDataURL("image/jpeg", 0.92);

    // Capture source (without overlay) — re-draw just the video frame
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    const tmpCtx = tmpCanvas.getContext("2d");
    const video = videoRef.current;
    if (video) tmpCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const srcUrl = tmpCanvas.toDataURL("image/jpeg", 0.92);

    setLiveCaptured({ srcDataUrl: srcUrl, resultDataUrl: resultUrl });
    stopLiveMirror();
  }, [stopLiveMirror]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      PROVIDER.dispose();
    };
  }, []);

  // Reset live state when leaving live mode
  useEffect(() => {
    if (mode !== "live" && liveActive) {
      stopLiveMirror();
    }
  }, [mode, liveActive, stopLiveMirror]);

  // ─── Save current look to local state + localStorage ─────────────────────
  const saveLook = useCallback(async () => {
    const result = resultDataUrl || liveCaptured?.resultDataUrl;
    const src = srcDataUrl || liveCaptured?.srcDataUrl;
    if (!result) return;

    setSaving(true);
    setErr("");

    const product = WIG_PRODUCTS.find((p) => p.id === selectedProductId);
    const look = {
      id: typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `look-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      productId: selectedProductId,
      productName: product?.displayName || product?.name || selectedProductId,
      srcDataUrl: src || null,
      resultDataUrl: result,
      adjustments: { ...adj },
      savedAt: new Date().toISOString(),
    };

    // Try to persist to Supabase
    try {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      const createRes = await fetch("/api/atelier/tryon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          productId: selectedProductId,
          productName: look.productName,
          overlayKey: selectedProductId,
          adjustments: adj,
        }),
      });

      if (createRes.ok) {
        const { sessionId } = await createRes.json();
        look.sessionId = sessionId;
      }
    } catch (_e) {
      // Non-fatal — still save locally
    }

    setSavedLooks((prev) => {
      const next = [look, ...prev].slice(0, MAX_SAVED_LOOKS);
      persistLooks(next);
      return next;
    });

    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }, [resultDataUrl, liveCaptured, srcDataUrl, selectedProductId, adj]);

  // ─── Toggle compare selection ─────────────────────────────────────────────
  const toggleCompare = useCallback((id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_LIMIT) return prev;
      return [...prev, id];
    });
  }, []);

  const removeLook = useCallback((id) => {
    setSavedLooks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      persistLooks(next);
      return next;
    });
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }, []);

  // ─── Send to Concierge ────────────────────────────────────────────────────
  const sendToConcierge = useCallback(async (sessionId, resultUrl, productId) => {
    setConciergeStatus("sending");
    setErr("");

    try {
      const { data: session } = await supabase.auth.getSession();
      const accessToken = session?.session?.access_token;

      const res = await fetch("/api/atelier/tryon/concierge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          sessionId: sessionId || null,
          productId,
          resultUrl: resultUrl || null,
          adjustments: adj,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }

      setConciergeStatus("sent");
    } catch (e) {
      setErr(e.message || "Could not send to concierge. Please try again.");
      setConciergeStatus("error");
    }
  }, [adj]);

  // ─── Compared looks ───────────────────────────────────────────────────────
  const compareLooks = savedLooks.filter((l) => compareIds.includes(l.id));

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="Atelier Mirror – Virtual Wig Try-On | Eminence Hair"
        description="Try on luxury wigs in real time with the Eminence Atelier Mirror. Upload a photo or use your webcam to preview your perfect look. Save favourites and consult with our concierge."
      />

      <div className="min-h-screen bg-ivory pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Hero header ──────────────────────────────────────────────── */}
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-400 mb-3">
              Eminence Atelier
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-charcoal mb-4">
              Atelier Mirror
            </h1>
            <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
              Preview our luxury wigs on your own photo or in real time.
              Save looks, compare styles, and consult with your personal concierge.
            </p>
          </Motion.div>

          {/* ── Mode tabs ─────────────────────────────────────────────────── */}
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            <ModeTab label="Quick Preview" active={mode === "quick"} onClick={() => setMode("quick")} />
            <ModeTab label="Live Mirror" active={mode === "live"} onClick={() => setMode("live")} />
            <ModeTab label="Concierge Review" active={mode === "review"} onClick={() => setMode("review")} />
          </div>

          <AnimatePresence mode="wait">
            {/* ════════════════════════════════════════════════════════════ */}
            {/* QUICK PREVIEW MODE                                           */}
            {/* ════════════════════════════════════════════════════════════ */}
            {mode === "quick" && (
              <Motion.div
                key="quick"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6"
              >
                {/* Canvas panel */}
                <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] overflow-hidden">

                  {/* Canvas / placeholder */}
                  <div className="relative bg-softGray/30 min-h-[360px] flex items-center justify-center">
                    {!srcDataUrl && (
                      <div className="text-center px-8 py-12">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="10" r="3" />
                            <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
                          </svg>
                        </div>
                        <p className="text-[13px] text-neutral-500 mb-6 leading-relaxed">
                          Upload a clear, well-lit front-facing photo<br />to preview wigs on your face.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="cursor-pointer px-6 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition">
                            Upload photo
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </label>
                          <button
                            type="button"
                            onClick={startCam}
                            className="px-5 py-3 rounded-full border border-black/20 text-[11px] uppercase tracking-[0.22em] hover:border-black/40 transition"
                          >
                            Use camera
                          </button>
                        </div>
                      </div>
                    )}

                    <canvas
                      ref={canvasRef}
                      className={`max-w-full max-h-[520px] rounded-2xl ${srcDataUrl ? "block" : "hidden"}`}
                      style={{ display: srcDataUrl ? undefined : "none" }}
                    />
                  </div>

                  {/* Status bar */}
                  {srcDataUrl && (
                    <div className="border-t border-neutral-100 px-5 py-3 flex flex-wrap gap-3 items-center text-[11px]">
                      <label className="cursor-pointer px-4 py-2 rounded-full border border-neutral-300 uppercase tracking-[0.18em] hover:border-neutral-500 transition">
                        Change photo
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                      <button
                        type="button"
                        onClick={startCam}
                        className="px-4 py-2 rounded-full border border-neutral-300 uppercase tracking-[0.18em] hover:border-neutral-500 transition"
                      >
                        Use camera
                      </button>
                      {mpStatus === "loading" && <span className="text-neutral-400">Loading AI…</span>}
                      {mpStatus === "error" && <span className="text-amber-600">AI unavailable — use sliders to adjust</span>}
                      {faceLandmarks && <span className="text-green-700">✓ Face detected · {faceLandmarks.faceShape}</span>}
                      {!faceLandmarks && mpStatus !== "loading" && srcDataUrl && (
                        <span className="text-neutral-400">No face detected — use sliders to adjust</span>
                      )}
                    </div>
                  )}

                  {/* Before/After compare */}
                  {srcDataUrl && resultDataUrl && (
                    <div className="border-t border-neutral-100 px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setShowCompare((v) => !v)}
                        className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-black transition"
                      >
                        {showCompare ? "Hide compare" : "Before / After compare ↕"}
                      </button>
                      {showCompare && (
                        <div className="mt-4">
                          <CompareSlider
                            beforeDataUrl={srcDataUrl}
                            afterDataUrl={resultDataUrl}
                            width="100%"
                            height={320}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Controls sidebar */}
                <div className="space-y-4">

                  {/* Product selector */}
                  <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-3">
                      Select wig style
                    </p>
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
                    {!overlay.src && (
                      <p className="mt-2 text-[11px] text-neutral-400">
                        Overlay image coming soon — placeholder shown.
                      </p>
                    )}
                    {overlay.src && (
                      <p className="mt-2 text-[11px] text-green-700">✓ Overlay available</p>
                    )}
                  </div>

                  {/* Adjustment sliders */}
                  <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-4">
                      Adjust placement
                    </p>
                    <div className="space-y-4">
                      <AdjSlider label="Scale" value={adj.scale} min={0.4} max={2.5} step={0.01} onChange={setAdjKey("scale")} />
                      <AdjSlider label="Horizontal" value={adj.offsetX} min={-0.4} max={0.4} step={0.01} onChange={setAdjKey("offsetX")} />
                      <AdjSlider label="Vertical" value={adj.offsetY} min={-0.4} max={0.4} step={0.01} onChange={setAdjKey("offsetY")} />
                      <AdjSlider label="Rotation" value={adj.rotation} min={-30} max={30} step={0.5} onChange={setAdjKey("rotation")} />
                      <button
                        type="button"
                        onClick={() => setAdj({ ...DEFAULT_ADJUSTMENTS, ...(overlay.defaults || {}) })}
                        className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-black transition"
                      >
                        Reset adjustments
                      </button>
                    </div>
                  </div>

                  {/* Save / Concierge */}
                  {srcDataUrl && (
                    <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6 space-y-3">
                      <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-2">
                        Save &amp; share
                      </p>
                      {err && <p className="text-xs text-red-600">{err}</p>}
                      {saved && <p className="text-xs text-green-700">✓ Look saved to your collection.</p>}
                      {conciergeStatus === "sent" && (
                        <p className="text-xs text-green-700">✓ Sent to concierge — we'll be in touch soon.</p>
                      )}

                      <button
                        type="button"
                        onClick={saveLook}
                        disabled={saving || !resultDataUrl}
                        className="w-full py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 disabled:opacity-40 transition"
                      >
                        {saving ? "Saving…" : "Save this look"}
                      </button>

                      <button
                        type="button"
                        onClick={() => sendToConcierge(null, resultDataUrl, selectedProductId)}
                        disabled={conciergeStatus === "sending" || !resultDataUrl}
                        className="w-full py-3 rounded-full border border-black/20 text-[11px] uppercase tracking-[0.22em] hover:border-black/40 disabled:opacity-40 transition"
                      >
                        {conciergeStatus === "sending" ? "Sending…" : "Send to Concierge"}
                      </button>

                      {resultDataUrl && (
                        <a
                          href={resultDataUrl}
                          download="eminence-look.jpg"
                          className="block w-full py-3 rounded-full border border-neutral-200 text-[11px] uppercase tracking-[0.22em] text-center text-neutral-500 hover:border-neutral-400 hover:text-black transition"
                        >
                          Download preview
                        </a>
                      )}

                      {!user && (
                        <p className="text-[11px] text-neutral-400 text-center pt-1">
                          <Link to="/account" className="underline">Sign in</Link> to save looks to your profile.
                        </p>
                      )}

                      {selectedProductId && (
                        <Link
                          to={`/products/${selectedProductId}`}
                          className="block text-center text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-black transition pt-1"
                        >
                          Shop this look →
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Navigation links */}
                  <div className="text-center space-y-2 pt-2">
                    <Link to="/shop" className="block text-[11px] uppercase tracking-wider text-neutral-400 hover:text-black transition">
                      Browse all wigs →
                    </Link>
                    <Link to="/custom-atelier" className="block text-[11px] uppercase tracking-wider text-neutral-400 hover:text-black transition">
                      Custom atelier order →
                    </Link>
                  </div>
                </div>
              </Motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════ */}
            {/* LIVE MIRROR MODE                                             */}
            {/* ════════════════════════════════════════════════════════════ */}
            {mode === "live" && (
              <Motion.div
                key="live"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6"
              >
                {/* Live canvas panel */}
                <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] overflow-hidden">
                  <div className="relative bg-softGray/30 min-h-[400px] flex items-center justify-center">

                    {/* Hidden video element used as RAF source */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="hidden"
                    />

                    {/* Live canvas */}
                    <canvas
                      ref={liveCanvasRef}
                      className={`max-w-full max-h-[520px] rounded-2xl ${liveActive ? "block" : "hidden"}`}
                    />

                    {/* Captured still */}
                    {liveCaptured && !liveActive && (
                      <img
                        src={liveCaptured.resultDataUrl}
                        alt="Captured look"
                        className="max-w-full max-h-[520px] rounded-2xl object-contain"
                      />
                    )}

                    {/* Start prompt */}
                    {!liveActive && !liveCaptured && (
                      <div className="text-center px-8 py-12">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
                            <path d="M15.5 8.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                            <rect x="3" y="6" width="18" height="13" rx="2" />
                            <path d="m15 2 1.5 2H21v2" />
                          </svg>
                        </div>
                        <p className="text-[13px] text-neutral-500 mb-6 leading-relaxed">
                          Use your front camera for a real-time wig preview<br />
                          with automatic face tracking.
                        </p>
                        <button
                          type="button"
                          onClick={startLiveMirror}
                          className="px-8 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition"
                        >
                          Start live mirror
                        </button>
                        {mpStatus === "error" && (
                          <p className="mt-3 text-xs text-amber-600">AI unavailable — overlay will be centered</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Live controls bar */}
                  {liveActive && (
                    <div className="border-t border-neutral-100 px-5 py-3 flex gap-3 items-center">
                      <button
                        type="button"
                        onClick={captureLiveFrame}
                        className="px-6 py-2.5 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition"
                      >
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopLiveMirror}
                        className="px-5 py-2.5 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition"
                      >
                        Stop
                      </button>
                      <span className="text-[11px] text-neutral-400 ml-auto">
                        {mpStatus === "loading" && "Loading AI…"}
                        {mpStatus === "ready" && "AI active"}
                        {mpStatus === "error" && "Manual mode"}
                      </span>
                    </div>
                  )}

                  {/* Post-capture controls */}
                  {liveCaptured && !liveActive && (
                    <div className="border-t border-neutral-100 px-5 py-3 flex flex-wrap gap-3 items-center">
                      <button
                        type="button"
                        onClick={() => { setLiveCaptured(null); startLiveMirror(); }}
                        className="px-5 py-2.5 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition"
                      >
                        Retake
                      </button>
                      <button
                        type="button"
                        onClick={saveLook}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 disabled:opacity-40 transition"
                      >
                        {saving ? "Saving…" : "Save look"}
                      </button>
                      {saved && <span className="text-xs text-green-700">✓ Saved</span>}
                      <button
                        type="button"
                        onClick={() => sendToConcierge(null, liveCaptured.resultDataUrl, selectedProductId)}
                        disabled={conciergeStatus === "sending"}
                        className="px-5 py-2.5 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 disabled:opacity-40 transition"
                      >
                        {conciergeStatus === "sending" ? "Sending…" : "Consult concierge"}
                      </button>
                      {conciergeStatus === "sent" && <span className="text-xs text-green-700">✓ Sent</span>}
                    </div>
                  )}

                  {/* Before/After for captured live look */}
                  {liveCaptured && (
                    <div className="border-t border-neutral-100 px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setShowCompare((v) => !v)}
                        className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-black transition"
                      >
                        {showCompare ? "Hide compare" : "Before / After compare ↕"}
                      </button>
                      {showCompare && (
                        <div className="mt-4">
                          <CompareSlider
                            beforeDataUrl={liveCaptured.srcDataUrl}
                            afterDataUrl={liveCaptured.resultDataUrl}
                            width="100%"
                            height={320}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Product selector */}
                  <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-3">Wig style</p>
                    <select
                      value={selectedProductId}
                      onChange={(e) => { setSelectedProductId(e.target.value); PROVIDER.resetSmoothing?.(); }}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-300 bg-white/80 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      {WIG_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>{p.displayName || p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Adjustments */}
                  <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-4">Adjust</p>
                    <div className="space-y-4">
                      <AdjSlider label="Scale" value={adj.scale} min={0.4} max={2.5} step={0.01} onChange={setAdjKey("scale")} />
                      <AdjSlider label="Horizontal" value={adj.offsetX} min={-0.4} max={0.4} step={0.01} onChange={setAdjKey("offsetX")} />
                      <AdjSlider label="Vertical" value={adj.offsetY} min={-0.4} max={0.4} step={0.01} onChange={setAdjKey("offsetY")} />
                      <AdjSlider label="Rotation" value={adj.rotation} min={-30} max={30} step={0.5} onChange={setAdjKey("rotation")} />
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6">
                    <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-3">Tips</p>
                    <ul className="space-y-2 text-[12px] text-neutral-500 leading-relaxed">
                      <li>• Face the camera directly, in good light</li>
                      <li>• Pull back your hair for the best fit</li>
                      <li>• Use sliders to fine-tune placement</li>
                      <li>• Capture and save your favourite looks</li>
                    </ul>
                  </div>
                </div>
              </Motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════ */}
            {/* CONCIERGE REVIEW MODE                                        */}
            {/* ════════════════════════════════════════════════════════════ */}
            {mode === "review" && (
              <Motion.div
                key="review"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {savedLooks.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400">
                        <path d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0Z" />
                      </svg>
                    </div>
                    <p className="text-neutral-500 text-sm mb-6">
                      No saved looks yet. Try Quick Preview or Live Mirror to create your first look.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => setMode("quick")}
                        className="px-6 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition"
                      >
                        Quick Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("live")}
                        className="px-6 py-3 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition"
                      >
                        Live Mirror
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h2 className="font-display text-2xl text-charcoal">
                          Your Saved Looks
                        </h2>
                        <p className="text-neutral-400 text-[12px] mt-1">
                          {savedLooks.length} look{savedLooks.length !== 1 ? "s" : ""} saved
                          {compareIds.length > 0 && ` · ${compareIds.length} selected for comparison`}
                        </p>
                      </div>

                      {compareIds.length >= 2 && (
                        <button
                          type="button"
                          onClick={() => setCompareIds([])}
                          className="text-[11px] uppercase tracking-wider text-neutral-400 hover:text-black transition"
                        >
                          Clear compare
                        </button>
                      )}
                    </div>

                    {/* Compare panel */}
                    {compareIds.length >= 2 && (
                      <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-6">
                        <p className="text-[11px] tracking-[0.26em] uppercase text-neutral-500 mb-4">
                          Comparing {compareLooks.length} looks
                        </p>
                        <div className={`grid gap-4 ${compareLooks.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                          {compareLooks.map((look) => (
                            <div key={look.id} className="rounded-2xl overflow-hidden">
                              <img
                                src={look.resultDataUrl}
                                alt={look.productName}
                                className="w-full aspect-[3/4] object-cover"
                              />
                              <div className="pt-2 text-center">
                                <p className="text-[11px] uppercase tracking-wider text-charcoal">{look.productName}</p>
                                <Link
                                  to={`/products/${look.productId}`}
                                  className="text-[11px] text-neutral-400 hover:text-black transition"
                                >
                                  Shop this look →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Send comparison to concierge */}
                        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                          {err && <p className="text-xs text-red-600 mb-3">{err}</p>}
                          {conciergeStatus === "sent" ? (
                            <p className="text-xs text-green-700">✓ Sent to your concierge — we'll be in touch.</p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => sendToConcierge(null, compareLooks[0]?.resultDataUrl, compareLooks[0]?.productId)}
                              disabled={conciergeStatus === "sending"}
                              className="px-8 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 disabled:opacity-40 transition"
                            >
                              {conciergeStatus === "sending" ? "Sending…" : "Send these looks to my Concierge"}
                            </button>
                          )}
                          <p className="mt-2 text-[11px] text-neutral-400">
                            Your personal Eminence concierge will review and guide your selection.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Instruction */}
                    {compareIds.length < 2 && (
                      <p className="text-[12px] text-neutral-400 text-center">
                        {compareIds.length === 0
                          ? `Select up to ${COMPARE_LIMIT} looks to compare side-by-side.`
                          : "Select one more look to start comparing."}
                      </p>
                    )}

                    {/* Grid of saved looks */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {savedLooks.map((look) => (
                        <LookCard
                          key={look.id}
                          look={look}
                          selected={compareIds.includes(look.id)}
                          onSelect={toggleCompare}
                          onRemove={removeLook}
                        />
                      ))}
                    </div>

                    {/* Concierge CTA */}
                    <div className="rounded-3xl border border-white/70 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,10,5,0.08)] p-8 text-center">
                      <p className="font-display text-2xl text-charcoal mb-2">Personal Consultation</p>
                      <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                        Not sure which look is right for you? Our concierge team will review your saved looks
                        and guide you to your perfect style.
                      </p>
                      <Link
                        to="/private-consult"
                        className="inline-block px-8 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition"
                      >
                        Book a private consultation
                      </Link>
                    </div>
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>

          {/* ── Footer disclaimer ──────────────────────────────────────── */}
          <p className="mt-10 text-[11px] text-neutral-400 text-center max-w-lg mx-auto leading-relaxed">
            Virtual try-on is a visual guide only. Actual hair texture, density, and colour may vary.
            For a professional consultation, use <em>Send to Concierge</em> or{" "}
            <Link to="/private-consult" className="underline">book a session</Link>.
          </p>
        </div>
      </div>

      {/* Webcam capture modal (Quick Preview) */}
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
                className="flex-1 py-3 rounded-full bg-black text-white text-[11px] uppercase tracking-[0.22em] hover:bg-neutral-800 transition"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={stopCam}
                className="px-5 py-3 rounded-full border border-neutral-300 text-[11px] uppercase tracking-[0.22em] hover:border-neutral-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
