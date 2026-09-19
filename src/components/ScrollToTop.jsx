import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Controls scroll position on navigation, in one place:
   - "/gallery"        → jump to the top of the page
   - "/our-work#food"  → scroll down to that section
   Keeping both cases here avoids a page's own anchor-scrolling effect
   racing against this one. */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        // one frame so the newly routed page has been laid out
        const frame = requestAnimationFrame(() =>
          target.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
        return () => cancelAnimationFrame(frame);
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
