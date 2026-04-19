// src/utils/modalCoordinator.js
// Single-source-of-truth for mutually exclusive promotional modals.

export const SUPPRESSED_PATHS = [
  /^\/checkout/, /^\/cart/, /^\/success/, /^\/cancel/,
  /^\/account/, /^\/partners\/portal/, /^\/admin/, /^\/atelier\//,
];

const listeners = new Set();
let current = null;          // { id }
let lastClosedAt = 0;
const MIN_GAP_MS = 15000;    // 15 seconds between one modal closing and another opening

function isSuppressed() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  return SUPPRESSED_PATHS.some(rx => rx.test(path));
}

export function canOpen() {
  if (isSuppressed()) return false;
  if (current) return false;
  if (Date.now() - lastClosedAt < MIN_GAP_MS) return false;
  return true;
}

export function requestOpen(id) {
  if (!canOpen()) return false;
  current = { id };
  listeners.forEach(fn => { try { fn({ type: 'open', id }); } catch (_e) { /* listener error isolated */ } });
  return true;
}

export function close(id) {
  if (current?.id !== id) return;
  current = null;
  lastClosedAt = Date.now();
  listeners.forEach(fn => fn({ type: 'close', id }));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const MODAL_IDS = {
  COOKIE: 'cookie',
  DISCOUNT: 'discount',
  EMAIL: 'email',
};
