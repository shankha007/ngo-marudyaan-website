import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon";
import Photo from "../components/Photo";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { programs } from "../data/content";
import { galleryProjects, preloadPhoto } from "../data/gallery";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import useFocusTrap from "../hooks/useFocusTrap";
import usePageMeta from "../hooks/usePageMeta";

/* How wide a photo is on screen, so the browser downloads the right size:
   thumbnails sit 2 / 3 / 4 to a row; the lightbox is at most 896px wide. */
const THUMB_SIZES = "(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";
const LIGHTBOX_SIZES = "(min-width: 896px) 896px, 100vw";

/* Filter buttons: "All", then each programme category that has a project
   in it (in the order the programmes are listed on the site). */
const categories = ["all", ...programs.map((p) => p.id).filter((c) => galleryProjects.some((p) => p.category === c))];

export default function Gallery() {
  const { t, tr } = useLang();
  const [filter, setFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  usePageMeta(
    `${t("gallery.title")} — ${site.name}`,
    "Photo albums from NGO Marudyaan's projects, year by year: cyclone relief in the Sundarbans, a micro library for children, Puja gifts and more.",
  );

  const shownProjects = useMemo(
    () => (filter === "all" ? galleryProjects : galleryProjects.filter((p) => p.category === filter)),
    [filter],
  );
  /* every photo on screen, in order, each knowing its project — the
     lightbox steps through this list, across albums */
  const items = useMemo(
    () => shownProjects.flatMap((project) => project.photos.map((photo) => ({ ...photo, project }))),
    [shownProjects],
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

  /* While a photo is open, fetch its neighbours so ← / → feel instant. */
  useEffect(() => {
    if (openIndex === null || items.length < 2) return;
    for (const d of [1, -1]) preloadPhoto(items[(openIndex + d + items.length) % items.length].src, LIGHTBOX_SIZES);
  }, [openIndex, items]);

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

          {/* albums */}
          {items.length === 0 ? (
            <p className="mt-16 text-center text-oasis-800/60">{t("gallery.empty")}</p>
          ) : (
            shownProjects.map((project) => {
              const first = items.findIndex((it) => it.project === project);
              return (
                <section key={project.id} id={project.id} aria-labelledby={`${project.id}-title`} className="mt-14 scroll-mt-24">
                  <Reveal>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-saffron-500/15 px-3 py-1 font-semibold text-saffron-700">
                        {project.year}
                      </span>
                      <span className="rounded-full bg-oasis-50 px-3 py-1 font-medium text-oasis-700">
                        {t(`cat.${project.category}`)}
                      </span>
                      <span className="text-oasis-800/60">
                        {t("gallery.photos").replace("{n}", project.photos.length)}
                      </span>
                    </div>
                    <h2 id={`${project.id}-title`} className="font-display mt-3 text-2xl font-bold text-oasis-900 sm:text-3xl">
                      {tr(project.title)}
                    </h2>
                    {project.summary && (
                      <p className="mt-2 max-w-3xl leading-relaxed text-oasis-800/75">{tr(project.summary)}</p>
                    )}
                  </Reveal>
                  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {project.photos.map((photo, j) => {
                      const i = first + j;
                      return (
                        <Reveal key={photo.id} delay={(j % 8) * 50}>
                          <button
                            type="button"
                            onClick={() => setOpenIndex(i)}
                            data-thumb={i}
                            className="group relative block w-full overflow-hidden rounded-2xl bg-oasis-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-oasis-700 focus-visible:ring-offset-2"
                          >
                            <Photo
                              src={photo.src}
                              alt={tr(photo.caption)}
                              sizes={THUMB_SIZES}
                              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-oasis-900/85 via-oasis-900/10 to-transparent p-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                              {tr(photo.caption)}
                            </span>
                          </button>
                        </Reveal>
                      );
                    })}
                  </div>
                </section>
              );
            })
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
            <Photo
              key={active.id}
              src={active.src}
              alt={tr(active.caption)}
              sizes={LIGHTBOX_SIZES}
              priority
              className="mx-auto max-h-[72vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-sand-200">
              <span className="font-medium">{tr(active.caption)}</span>
              <span className="mt-1 block text-sm text-sand-200/80">
                {tr(active.project.title)} · {active.project.year}
              </span>
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
