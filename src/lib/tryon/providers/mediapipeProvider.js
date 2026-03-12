/**
 * src/lib/tryon/providers/mediapipeProvider.js
 *
 * MediaPipe FaceLandmarker implementation of the ITryOnProvider interface.
 * Loaded lazily (dynamic import) so the heavy WASM bundle does not inflate
 * the main chunk.
 *
 * Landmark indices (MediaPipe 478-point face mesh):
 *   10  = forehead center top
 *   152 = chin bottom
 *   234 = left cheek  (viewer's perspective)
 *   454 = right cheek
 *   33  = left eye outer corner
 *   263 = right eye outer corner
 */

import { DEFAULT_ADJUSTMENTS } from '../../../data/tryonOverlays.js';
import { PROVIDER_NAMES, PROVIDER_MODES } from './providerTypes.js';

// CDN base for WASM assets (matches existing AtelierTryOn.jsx pattern)
const WASM_BASE =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm';

// Temporal smoothing weight for live mode (0 = instant, 1 = frozen)
const ALPHA = 0.35;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ema(prev, next) {
  if (prev == null) return next;
  return ALPHA * prev + (1 - ALPHA) * next;
}

function emaPoint(prev, next) {
  if (!prev) return { ...next };
  return { x: ema(prev.x, next.x), y: ema(prev.y, next.y) };
}

/**
 * Extract structured FaceMetrics from a raw MediaPipe landmark array.
 * @param {Array<{x:number,y:number,z:number}>} lms - 478-point array
 * @returns {import('./providerTypes.js').FaceMetrics}
 */
function extractMetrics(lms) {
  const pt = (i) => ({ x: lms[i]?.x ?? 0.5, y: lms[i]?.y ?? 0.5 });

  const foreheadCenter = pt(10);
  const chinCenter = pt(152);
  const leftCheek = pt(234);
  const rightCheek = pt(454);
  const leftEye = pt(33);
  const rightEye = pt(263);

  const faceWidth = rightCheek.x - leftCheek.x;
  const faceHeight = chinCenter.y - foreheadCenter.y;
  const faceCX = (leftCheek.x + rightCheek.x) / 2;
  const faceCY = (foreheadCenter.y + chinCenter.y) / 2;

  // Head tilt: horizontal angle between eye corners
  const eyeDX = rightEye.x - leftEye.x;
  const eyeDY = rightEye.y - leftEye.y;
  const headTilt = (Math.atan2(eyeDY, eyeDX) * 180) / Math.PI;

  // Rough face-shape classification
  const ratio = faceHeight / (faceWidth || 0.001);
  let faceShape = 'oval';
  if (ratio > 1.5) faceShape = 'long';
  else if (ratio < 1.0) faceShape = 'round';
  else if (faceWidth > 0.35) faceShape = 'square';
  else if (foreheadCenter.x - leftCheek.x > 0.1) faceShape = 'heart';

  return {
    landmarks: lms,
    foreheadCenter,
    chinCenter,
    leftCheek,
    rightCheek,
    faceCX,
    faceCY,
    faceWidth,
    faceHeight,
    headTilt,
    faceShape,
  };
}

/**
 * Apply EMA smoothing to consecutive FaceMetrics readings (live mode only).
 * Only the derived scalar values are smoothed; the full landmark array is
 * passed through as-is for performance.
 */
function smoothMetrics(prev, next) {
  if (!prev) return { ...next };
  return {
    ...next,
    foreheadCenter: emaPoint(prev.foreheadCenter, next.foreheadCenter),
    chinCenter: emaPoint(prev.chinCenter, next.chinCenter),
    leftCheek: emaPoint(prev.leftCheek, next.leftCheek),
    rightCheek: emaPoint(prev.rightCheek, next.rightCheek),
    faceCX: ema(prev.faceCX, next.faceCX),
    faceCY: ema(prev.faceCY, next.faceCY),
    faceWidth: ema(prev.faceWidth, next.faceWidth),
    faceHeight: ema(prev.faceHeight, next.faceHeight),
    headTilt: ema(prev.headTilt, next.headTilt),
  };
}

/**
 * Core canvas renderer.
 * Draws source image then wig overlay positioned by face metrics (or manual
 * centre-of-frame when no face is detected).
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLImageElement|HTMLVideoElement} sourceEl
 * @param {HTMLImageElement|null} overlayEl
 * @param {import('./providerTypes.js').FaceMetrics|null} metrics
 * @param {import('./providerTypes.js').TryOnAdjustments} adj
 * @param {number} canvasW
 * @param {number} canvasH
 */
function renderWithMetrics(ctx, sourceEl, overlayEl, metrics, adj, canvasW, canvasH) {
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(sourceEl, 0, 0, canvasW, canvasH);

  const a = { ...DEFAULT_ADJUSTMENTS, ...(adj || {}) };

  let drawX, drawY, drawW, drawH, angle;

  if (metrics) {
    const faceW = metrics.faceWidth * canvasW;
    const faceH = metrics.faceHeight * canvasH;
    const faceCX = metrics.faceCX * canvasW;
    const foreheadY = metrics.foreheadCenter.y * canvasH;

    drawW = faceW * 2.2 * a.scale;
    drawH = drawW * 1.35;
    drawX = faceCX - drawW / 2 + a.offsetX * canvasW;
    drawY = foreheadY - faceH * 0.55 + a.offsetY * canvasH;
    angle = ((metrics.headTilt + a.rotation) * Math.PI) / 180;
  } else {
    // Manual / no-face mode
    const cx = canvasW / 2 + a.offsetX * canvasW;
    const cy = canvasH * 0.38 + a.offsetY * canvasH;
    drawW = canvasW * 0.75 * a.scale;
    drawH = drawW * 1.35;
    drawX = cx - drawW / 2;
    drawY = cy - drawH * 0.42;
    angle = (a.rotation * Math.PI) / 180;
  }

  if (overlayEl && overlayEl.complete && overlayEl.naturalWidth > 0) {
    ctx.save();
    ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
    ctx.rotate(angle);
    ctx.drawImage(overlayEl, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  } else {
    // Placeholder watermark when no overlay image is available
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#4a2d1a';
    ctx.fillRect(drawX, drawY, drawW, drawH);
    ctx.globalAlpha = 1;
    ctx.font = `bold ${Math.round(drawW / 14)}px Georgia, serif`;
    ctx.fillStyle = '#7a4a28';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ Eminence Hair ✦', drawX + drawW / 2, drawY + drawH / 2);
    ctx.restore();
  }
}

// ─── Module-level state ────────────────────────────────────────────────────────
// Singleton pattern: only one landmarker instance is created per page lifecycle.

let _landmarker = null;
let _initialized = false;
let _currentRunningMode = 'IMAGE';
let _smoothedState = null;

// ─── Provider ─────────────────────────────────────────────────────────────────

export const mediapipeProvider = {
  name: PROVIDER_NAMES.MEDIAPIPE,
  mode: PROVIDER_MODES.CLIENT,

  /**
   * Initialize MediaPipe FaceLandmarker.
   * Safe to call multiple times – subsequent calls are no-ops.
   */
  async initialize() {
    if (_initialized && _landmarker) return;

    const { FaceLandmarker, FilesetResolver } = await import(
      /* @vite-ignore */ '@mediapipe/tasks-vision'
    );

    const vision = await FilesetResolver.forVisionTasks(WASM_BASE);

    _landmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `${WASM_BASE}/../face_landmarker.task`,
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    });

    _currentRunningMode = 'IMAGE';
    _initialized = true;
    _smoothedState = null;
  },

  /** Release the landmarker and reset state. */
  dispose() {
    if (_landmarker) {
      try {
        _landmarker.close();
      } catch (_) {
        // ignore
      }
      _landmarker = null;
    }
    _initialized = false;
    _smoothedState = null;
  },

  /**
   * Detect face landmarks from an image or video element.
   *
   * @param {HTMLImageElement|HTMLVideoElement} imageEl
   * @param {{ smooth?: boolean }} opts  - Pass smooth:true in live mode
   * @returns {Promise<import('./providerTypes.js').FaceMetrics|null>}
   */
  async detectFace(imageEl, { smooth = false } = {}) {
    if (!_landmarker) return null;

    try {
      let result;
      const isVideo = imageEl.tagName === 'VIDEO';

      if (isVideo) {
        if (_currentRunningMode !== 'VIDEO') {
          await _landmarker.setOptions({ runningMode: 'VIDEO' });
          _currentRunningMode = 'VIDEO';
        }
        result = _landmarker.detectForVideo(imageEl, performance.now());
      } else {
        if (_currentRunningMode !== 'IMAGE') {
          await _landmarker.setOptions({ runningMode: 'IMAGE' });
          _currentRunningMode = 'IMAGE';
        }
        result = _landmarker.detect(imageEl);
      }

      const lms = result?.faceLandmarks?.[0];
      if (!lms || lms.length === 0) {
        _smoothedState = null;
        return null;
      }

      const raw = extractMetrics(lms);

      if (smooth) {
        _smoothedState = smoothMetrics(_smoothedState, raw);
        return _smoothedState;
      }

      return raw;
    } catch (_err) {
      return null;
    }
  },

  /**
   * Render source image/video + wig overlay onto a canvas.
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {HTMLImageElement|HTMLVideoElement} sourceEl
   * @param {HTMLImageElement|null} overlayEl
   * @param {import('./providerTypes.js').FaceMetrics|null} metrics
   * @param {import('./providerTypes.js').TryOnAdjustments} adjustments
   * @param {number} canvasW
   * @param {number} canvasH
   */
  renderOverlay(ctx, sourceEl, overlayEl, metrics, adjustments, canvasW, canvasH) {
    renderWithMetrics(ctx, sourceEl, overlayEl, metrics, adjustments, canvasW, canvasH);
  },

  /** Reset temporal smoothing (call when switching products or modes). */
  resetSmoothing() {
    _smoothedState = null;
  },
};
