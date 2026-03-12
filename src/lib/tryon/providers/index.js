/**
 * src/lib/tryon/providers/index.js
 *
 * Provider registry and factory for the Atelier Mirror try-on engine.
 *
 * ── Adding an enterprise provider (e.g. Banuba) ───────────────────────────────
 * 1. Create src/lib/tryon/providers/banubaProvider.js implementing ITryOnProvider
 * 2. Import it below and add it to `registry`
 * 3. Set VITE_TRYON_PROVIDER=banuba in .env (or .env.production)
 * No UI code needs to change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { mediapipeProvider } from './mediapipeProvider.js';
import { PROVIDER_NAMES } from './providerTypes.js';

// Registry: extend this when adding enterprise providers
const registry = {
  [PROVIDER_NAMES.MEDIAPIPE]: mediapipeProvider,
  // [PROVIDER_NAMES.BANUBA]: banubaProvider,     // uncomment to activate
  // [PROVIDER_NAMES.PERFECT_CORP]: pcProvider,   // uncomment to activate
};

/**
 * Resolve the active try-on provider.
 * Priority: explicit name argument → VITE_TRYON_PROVIDER env var → mediapipe
 *
 * @param {string} [name] - Optional provider key (see PROVIDER_NAMES)
 * @returns {import('./providerTypes.js').ITryOnProvider}
 */
export function getProvider(name) {
  const key =
    name ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TRYON_PROVIDER) ||
    PROVIDER_NAMES.MEDIAPIPE;
  return registry[key] ?? mediapipeProvider;
}

export { mediapipeProvider };
export { PROVIDER_NAMES, PROVIDER_MODES, validateProvider } from './providerTypes.js';

/** Convenience: the default (MediaPipe) provider instance. */
export const defaultProvider = mediapipeProvider;
