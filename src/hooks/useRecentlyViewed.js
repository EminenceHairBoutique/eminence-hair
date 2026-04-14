import { useState, useCallback } from "react";
import { safeLocalGet, safeLocalSet } from "../utils/storage";

const STORAGE_KEY = "eminence_recently_viewed";
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useState(() => {
    const raw = safeLocalGet(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const trackView = useCallback((productId) => {
    if (!productId) return;
    setRecentIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(
        0,
        MAX_ITEMS
      );
      safeLocalSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds, trackView };
}
