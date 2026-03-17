/**
 * lazyWithRetry — resilient React.lazy wrapper for Vite deployments.
 *
 * Problem: After a new deploy, Vite's hashed chunk filenames change. Browsers
 * with the old HTML cached will try to fetch stale chunk URLs that return 404.
 * React.lazy() permanently caches the rejected promise, so retrying from an
 * ErrorBoundary re-throws the same error indefinitely.
 *
 * Solution:
 *  1. Retry the import up to MAX_RETRIES times with an exponential back-off.
 *     The retries are handled INSIDE the promise passed to React.lazy, so
 *     React.lazy only ever sees a single promise that eventually resolves.
 *  2. If all retries fail, force a full page reload (clears stale chunks).
 *     A sessionStorage flag prevents an infinite reload loop.
 */

import { lazy } from "react";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

/**
 * Drop-in replacement for React.lazy() with automatic retry + page reload.
 *
 * @param {() => Promise<{default: React.ComponentType}>} importFn
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithRetry(importFn) {
  return lazy(() => {
    const RELOAD_KEY = "eminence_chunk_reload_attempted";

    const triggerReloadOrThrow = (err) => {
      if (
        typeof window !== "undefined" &&
        window.sessionStorage &&
        !window.sessionStorage.getItem(RELOAD_KEY)
      ) {
        window.sessionStorage.setItem(RELOAD_KEY, "1");
        window.location.reload();
        // Return a pending promise while reload is in progress.
        return new Promise(() => {});
      }

      // Reload already tried — propagate the error to the ErrorBoundary.
      throw err;
    };

    const doImport = (retriesLeft) =>
      importFn().catch((err) => {
        const message =
          err && typeof err.message === "string" ? err.message : "";

        const isChunkLoadError =
          message.includes("Loading chunk") ||
          message.includes("ChunkLoadError") ||
          message.includes("Failed to fetch dynamically imported module") ||
          message.includes("Importing a module script failed");

        // For stale deploy / chunk-load errors, retries are not helpful.
        if (isChunkLoadError) {
          return triggerReloadOrThrow(err);
        }

        if (retriesLeft > 0) {
          // Wait with exponential back-off, then retry the same import.
          const delay = RETRY_DELAY_MS * Math.pow(2, MAX_RETRIES - retriesLeft);
          return new Promise((resolve) =>
            setTimeout(() => resolve(doImport(retriesLeft - 1)), delay)
          );
        }

        // All retries exhausted — force a full page reload to clear stale
        // chunk assets. Use sessionStorage to prevent an infinite reload loop.
        return triggerReloadOrThrow(err);
      });

    return doImport(MAX_RETRIES);
  });
}
