import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Keyboard focus management for overlays (mobile menu, photo lightbox).
   While `active`:
     - focus moves into the container (to `initialFocusRef`, else the first
       focusable element), so screen-reader users land in the overlay;
     - Tab / Shift+Tab wrap around inside it instead of wandering onto the
       page hidden behind;
   When it deactivates, focus goes back to `returnFocus()` if given, else to
   whatever had focus when it opened (usually the button that opened it). */
export default function useFocusTrap(active, containerRef, { initialFocusRef, returnFocus } = {}) {
  const openerRef = useRef(null);
  const returnFocusRef = useRef(returnFocus);
  useEffect(() => {
    returnFocusRef.current = returnFocus;
  });

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    openerRef.current = document.activeElement;

    const focusables = () =>
      [...container.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
      );

    const first = initialFocusRef?.current || focusables()[0];
    first?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const current = document.activeElement;
      if (!container.contains(current)) {
        e.preventDefault();
        firstEl.focus();
      } else if (e.shiftKey && current === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && current === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const target = returnFocusRef.current?.() || openerRef.current;
      if (target && document.contains(target)) target.focus({ preventScroll: true });
    };
  }, [active, containerRef, initialFocusRef]);
}
