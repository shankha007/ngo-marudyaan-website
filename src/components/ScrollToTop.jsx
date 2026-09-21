import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* The element a URL hash points at, or null. Uses getElementById rather
   than querySelector: a hash like "#2019" or "#a=b" is a perfectly valid
   URL but an invalid CSS selector, and querySelector would throw. */
function hashTarget(hash) {
  if (!hash || hash.length < 2) return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* malformed %-escape — fall back to the raw text */
  }
  return document.getElementById(id);
}

/* Controls scroll position on navigation, in one place:
   - "/gallery"        → jump to the top of the page
   - "/our-work#food"  → scroll down to that section
   Keeping both cases here avoids a page's own anchor-scrolling effect
   racing against this one. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hashTarget(hash);
    if (target) {
      // one frame so the newly routed page has been laid out
      const frame = requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
      return () => cancelAnimationFrame(frame);
    }
    // "instant", not "auto": index.css sets scroll-behavior: smooth, and "auto"
    // would inherit it — a new page would appear mid-way down, then glide up
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
