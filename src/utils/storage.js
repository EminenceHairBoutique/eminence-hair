// Safe wrappers for sessionStorage and localStorage.
// Direct access can throw SecurityError in some privacy/incognito modes.

export const safeSessionGet = (key) => {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSessionSet = (key, value) => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

export const safeLocalGet = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeLocalSet = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};
