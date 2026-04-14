// In-memory consent fallback for environments where localStorage is blocked
// (e.g. Safari Private Browsing). Consumers should check this store when
// localStorage returns null.

const consentMemory = {
  necessary: false,
  analytics: false,
  marketing: false,
};

export function setConsentMemory(values) {
  consentMemory.necessary = Boolean(values?.necessary);
  consentMemory.analytics = Boolean(values?.analytics);
  consentMemory.marketing = Boolean(values?.marketing);
}

export function getConsentMemory() {
  return { ...consentMemory };
}
