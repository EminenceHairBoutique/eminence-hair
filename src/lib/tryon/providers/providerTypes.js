/**
 * src/lib/tryon/providers/providerTypes.js
 *
 * Type definitions and interface specification for the Atelier Mirror try-on
 * provider abstraction layer.
 *
 * A "provider" is an object implementing the ITryOnProvider interface.
 * Currently implemented: mediapipeProvider (free, client-side, no account needed).
 * Enterprise hook: Banuba, PerfectCorp, or similar can be plugged in via the
 * registry in index.js without changing any UI code.
 *
 * @typedef {Object} FaceMetrics
 * @property {Array<{x:number,y:number,z:number}>} landmarks  - Full 478-pt landmark array (normalized 0-1)
 * @property {{x:number,y:number}} foreheadCenter             - Normalized forehead anchor (pt 10)
 * @property {{x:number,y:number}} chinCenter                 - Normalized chin anchor (pt 152)
 * @property {{x:number,y:number}} leftCheek                  - Left cheek (pt 234)
 * @property {{x:number,y:number}} rightCheek                 - Right cheek (pt 454)
 * @property {number} faceCX                                  - Normalized horizontal face center
 * @property {number} faceCY                                  - Normalized vertical face center
 * @property {number} faceWidth                               - Normalized face width
 * @property {number} faceHeight                              - Normalized face height
 * @property {number} headTilt                                - Head tilt in degrees (+ = right)
 * @property {string} faceShape                               - "oval"|"round"|"square"|"long"|"heart"
 *
 * @typedef {Object} TryOnAdjustments
 * @property {number} scale     - Overlay size multiplier (default 1.0)
 * @property {number} offsetX   - Horizontal shift in normalized units (default 0)
 * @property {number} offsetY   - Vertical shift in normalized units (default 0)
 * @property {number} rotation  - Extra rotation in degrees (default 0)
 *
 * @typedef {Object} ITryOnProvider
 * @property {string}                  name         - Unique provider identifier
 * @property {'client'|'server'|'hybrid'} mode      - Processing mode
 * @property {() => Promise<void>}     initialize   - Load models / warm-up
 * @property {() => void}              dispose      - Release resources
 * @property {(el: HTMLImageElement|HTMLVideoElement, opts?: {smooth?:boolean}) => Promise<FaceMetrics|null>} detectFace
 * @property {(ctx: CanvasRenderingContext2D, source: HTMLImageElement|HTMLVideoElement, overlay: HTMLImageElement|null, metrics: FaceMetrics|null, adj: TryOnAdjustments, w: number, h: number) => void} renderOverlay
 * @property {() => void}              resetSmoothing - Reset temporal EMA state
 */

export const PROVIDER_NAMES = {
  MEDIAPIPE: 'mediapipe',
  BANUBA: 'banuba',           // enterprise – plug in later
  PERFECT_CORP: 'perfectcorp', // enterprise – plug in later
};

export const PROVIDER_MODES = {
  CLIENT: 'client',
  SERVER: 'server',
  HYBRID: 'hybrid',
};

/**
 * Validate that an object implements the ITryOnProvider interface.
 * @param {*} provider
 * @returns {boolean}
 */
export function validateProvider(provider) {
  const required = ['name', 'mode', 'initialize', 'dispose', 'detectFace', 'renderOverlay'];
  return required.every((key) => key in provider);
}
