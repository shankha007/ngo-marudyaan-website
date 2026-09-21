import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { galleryItems } from "../data/content";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import useFocusTrap from "../hooks/useFocusTrap";
import usePageMeta from "../hooks/usePageMeta";

const categories = ["all", "food", "education", "health", "winter", "festival", "women"];

export default function Gallery() {
  const { t, tr } = useLang();
  const [filter, setFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  usePageMeta(
    `${t("gallery.title")} — ${site.name}`,
    "Photographs from NGO Marudyaan's food drives, health camps, school kit distributions and festival celebrations in Kolkata.",
  );

  const items = useMemo(
    () => (filter === "all" ? galleryItems : galleryItems.filter((g) => g.category === filter)),
    [filter],
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta) => setOpenIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  /* Keyboard focus: jump into the lightbox when it opens, keep Tab inside
     it, and on close return to the thumbnail of the photo last viewed. */
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastIndexRef = useRef(null);
  useEffect(() => {
    if (openIndex !== null) lastIndexRef.current = openIndex;
  }, [openIndex]);
  useFocusTrap(openIndex !== null, dialogRef, {
    initialFocusRef: closeBtnRef,
    returnFocus: () => document.querySelector(`[data-thumb="${lastIndexRef.current}"]`),
  });

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <PageHeader title={t("gallery.title")} sub={t("gallery.sub")} />

      <section className="py-14 sm:py-18">
        <div className="container-page">
          {/* filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setFilter(c);
                  setOpenIndex(null);
                }}
                aria-pressed={filter === c}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  filter === c
                    ? "bg-oasis-700 text-white shadow-sm"
                    : "border border-oasis-200 bg-white text-oasis-700 hover:border-oasis-500 hover:bg-oasis-50"
                }`}
              >
                {c === "all" ? t("gallery.all") : t(`cat.${c}`)}
              </button>
            ))}
          </div>

          {/* grid */}
          {items.length === 0 ? (
            <p className="mt-16 text-center text-oasis-800/60">{t("gallery.empty")}</p>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.map((photo, i) => (
                <Reveal key={photo.id} delay={(i % 8) * 50}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(i)}
                    data-thumb={i}
                    className="group relative block w-full overflow-hidden rounded-2xl bg-oasis-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-oasis-700 focus-visible:ring-offset-2"
                  >
                    <img
                      src={photo.src}
                      alt={tr(photo.caption)}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-end bg-gradient-to-t from-oasis-900/85 via-oasis-900/10 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {tr(photo.caption)}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* lightbox */}
      {active && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={tr(active.caption)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-oasis-900/95 p-4"
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label={t("gallery.close")}
            className="absolute top-4 right-4 rounded-full border border-white/25 p-2.5 text-white transition hover:bg-white/10"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label={t("gallery.prev")}
                className="absolute left-3 rounded-full border border-white/25 p-3 text-white transition hover:bg-white/10 sm:left-6"
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label={t("gallery.next")}
                className="absolute right-3 rounded-full border border-white/25 p-3 text-white transition hover:bg-white/10 sm:right-6"
              >
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </>
          )}

          <figure
            className="max-h-full w-full max-w-4xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={tr(active.caption)}
              className="mx-auto max-h-[72vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-sand-200">
              <span className="font-medium">{tr(active.caption)}</span>
              <span className="mt-1 block text-xs text-sand-200/60">
                {openIndex + 1} {t("gallery.counter")} {items.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
