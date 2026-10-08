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
const FIRST_SIZES = "(min-width: 1280px) 620px, (min-width: 1024px) 50vw, (min-width: 768px) 66vw, 100vw";
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

      <section className="pb-16 sm:pb-24">
        {/* filters — stick under the header while you scroll */}
        <div className="sticky top-[4.75rem] z-30 mt-4 sm:top-[5rem]">
          <div className="container-page flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setFilter(c);
                  setOpenIndex(null);
                }}
                aria-pressed={filter === c}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap shadow-soft backdrop-blur-xl transition ${
                  filter === c
                    ? "bg-ink text-canvas"
                    : "border border-line bg-surface/85 text-ink hover:border-ink"
                }`}
              >
                {c === "all" ? t("gallery.all") : t(`cat.${c}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="container-page">
          {/* albums */}
          {items.length === 0 ? (
            <p className="mt-16 text-center text-ink-3">{t("gallery.empty")}</p>
          ) : (
            shownProjects.map((project) => {
              const first = items.findIndex((it) => it.project === project);
              return (
                <section key={project.id} id={project.id} aria-labelledby={`${project.id}-title`} className="mt-12 scroll-mt-36 sm:mt-16">
                  <Reveal className="grid gap-x-8 gap-y-3 lg:grid-cols-[auto_1fr] lg:items-end">
                    <span
                      aria-hidden="true"
                      className="font-display text-6xl leading-none font-bold tracking-tighter text-transparent [-webkit-text-stroke:1.5px_var(--c-line-strong)] sm:text-8xl"
                    >
                      {project.year}
                    </span>
                    <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-lime-400 px-3 py-1 font-bold text-oasis-900">
                        {project.year}
                      </span>
                      <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-ink">
                        {t(`cat.${project.category}`)}
                      </span>
                      <span className="text-ink-3">
                        {t("gallery.photos").replace("{n}", project.photos.length)}
                      </span>
                    </div>
                    <h2 id={`${project.id}-title`} className="font-display mt-3 text-3xl leading-tight font-bold text-ink sm:text-4xl">
                      {tr(project.title)}
                    </h2>
                    {project.summary && (
                      <p className="mt-2 max-w-3xl leading-relaxed text-ink-2">{tr(project.summary)}</p>
                    )}
                    </div>
                  </Reveal>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {project.photos.map((photo, j) => {
                      const i = first + j;
                      return (
                        <Reveal key={photo.id} delay={(j % 8) * 50} className={j === 0 ? "col-span-2 row-span-2" : ""}>
                          <button
                            type="button"
                            onClick={() => setOpenIndex(i)}
                            data-thumb={i}
                            className="group relative block h-full w-full overflow-hidden rounded-3xl bg-surface-2"
                          >
                            <Photo
                              src={photo.src}
                              alt={tr(photo.caption)}
                              sizes={j === 0 ? FIRST_SIZES : THUMB_SIZES}
                              className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-night/85 via-night/10 to-transparent p-4 text-left text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-night/90 p-4 backdrop-blur-xl"
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label={t("gallery.close")}
            className="absolute top-4 right-4 rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/25"
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
                className="absolute left-3 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/25 sm:left-6"
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
                className="absolute right-3 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/25 sm:right-6"
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
              className="mx-auto max-h-[72vh] w-auto rounded-3xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-white/80">
              <span className="font-medium">{tr(active.caption)}</span>
              <span className="mt-1 block text-sm text-white/80">
                {tr(active.project.title)} · {active.project.year}
              </span>
              <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 tabular-nums">
                {openIndex + 1} {t("gallery.counter")} {items.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
