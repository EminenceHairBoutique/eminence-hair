// Safe wrappers around sessionStorage / localStorage.
// Returns null on SecurityError (private-browsing mode) instead of throwing.

export function safeSessionGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Silently fail in private-browsing mode where storage access is blocked.
  }
}

export function safeLocalGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeLocalSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silently fail in private-browsing mode where storage access is blocked.
  }
}
