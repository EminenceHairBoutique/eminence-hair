// src/utils/modalCoordinator.js
// Single-source-of-truth for mutually exclusive promotional modals.

const SUPPRESSED_PATHS = [
  /^\/checkout/, /^\/cart/, /^\/success/, /^\/cancel/,
  /^\/account/, /^\/partners\/portal/, /^\/admin/, /^\/atelier\//,
];

const listeners = new Set();
let current = null;          // { id, priority }
let lastClosedAt = 0;
const MIN_GAP_MS = 15000;    // minimum seconds between one modal closing and another opening

function isSuppressed() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  return SUPPRESSED_PATHS.some(rx => rx.test(path));
}

export function canOpen(_id, _priority) {
  if (isSuppressed()) return false;
  if (current) return false;
  if (Date.now() - lastClosedAt < MIN_GAP_MS) return false;
  return true;
}

export function requestOpen(id, priority) {
  if (!canOpen(id, priority)) return false;
  current = { id, priority };
  listeners.forEach(fn => fn({ type: 'open', id }));
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

export const MODAL_PRIORITIES = {
  [MODAL_IDS.COOKIE]: 1000,
  [MODAL_IDS.DISCOUNT]: 500,
  [MODAL_IDS.EMAIL]: 100,
};
