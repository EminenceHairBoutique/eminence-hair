// src/utils/lazyWithRetry.js
// Drop-in replacement for React.lazy that retries failed imports before reloading.

import { lazy } from "react";

const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000;
const SESSION_FLAG = "eminence_chunk_retry";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function importWithRetry(importFn, attemptsLeft) {
  try {
    const module = await importFn();
    // Clear the flag on a successful load
    sessionStorage.removeItem(SESSION_FLAG);
    return module;
  } catch (err) {
    if (attemptsLeft <= 1) {
      // Final failure — reload once to get fresh chunks (if not already tried)
      if (!sessionStorage.getItem(SESSION_FLAG)) {
        sessionStorage.setItem(SESSION_FLAG, "1");
        window.location.reload();
      }
      throw err;
    }
    await wait(RETRY_DELAY_MS);
    return importWithRetry(importFn, attemptsLeft - 1);
  }
}

export function lazyWithRetry(importFn) {
  return lazy(() => importWithRetry(importFn, RETRY_COUNT));
}
