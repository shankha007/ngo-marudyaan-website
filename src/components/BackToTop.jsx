import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

export default function BackToTop() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
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
      className={`fixed bottom-5 left-5 z-40 rounded-full bg-oasis-700 p-3 text-white shadow-lg transition-all hover:bg-oasis-600 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <Icon name="arrowUp" className="h-5 w-5" />
    </button>
  );
}
