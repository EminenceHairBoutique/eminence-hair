import { useEffect, useRef } from "react";

/**
 * Focus-trap hook for modal dialogs.
 * Traps Tab/Shift+Tab within the referenced element and closes on Escape.
 *
 * @param {React.RefObject} ref - ref to the dialog container
 * @param {boolean} enabled - whether the trap is active
 * @param {object} [options]
 * @param {Function} [options.onEscape] - callback when Escape is pressed
 */
export default function useFocusTrap(ref, enabled, options = {}) {
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Store the element that had focus before the trap activated
    previouslyFocused.current = document.activeElement;

    const el = ref.current;
    if (!el) return;

    // Focus the first focusable element inside the trap
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(el.querySelectorAll(focusableSelector)).filter(
        (node) => !node.closest("[aria-hidden=true]")
      );

    // Delay focus to allow render
    const initialFocusTimer = requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    });

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        options.onEscape?.();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      cancelAnimationFrame(initialFocusTimer);
      document.removeEventListener("keydown", onKeyDown, true);
      // Return focus to the triggering element
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    };
  }, [ref, enabled, options]);
}
