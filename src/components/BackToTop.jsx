import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

export default function BackToTop() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  /* On phones the button sits over the content column, so it only shows
     while the visitor scrolls back up (or reaches the footer) and gets out
     of the way while they read downwards. Wider screens have room in the
     margin, so there it simply shows once the page is scrolled. */
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 639px)");
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 120;
      setShow(y > 600 && (!narrow.matches || y < lastY || atBottom));
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("misc.backToTop")}
      // while faded out it must not be a keyboard stop or a screen-reader item
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      /* bottom-LEFT: Netlify injects its "Powered by Netlify" badge in the
         bottom-right corner above everything, which would swallow clicks */
      className={`fixed bottom-4 left-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink/85 text-canvas shadow-lift ring-1 ring-canvas/25 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 sm:bottom-5 sm:left-5 sm:h-12 sm:w-12 sm:bg-ink ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <Icon name="arrowUp" className="h-5 w-5" />
    </button>
  );
}
