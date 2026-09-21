import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bannerSettings, bannerSlides } from "../data/banner";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* The home page banner. Content comes from src/data/banner.js —
   editing that file is all you need to change what appears here.

   Accessibility (WCAG 2.2.2 "Pause, Stop, Hide"): the slideshow
   - has a visible Pause/Play button,
   - starts paused for people whose device asks for reduced motion,
   - pauses while the mouse is over it or keyboard focus is inside it. */
export default function HeroBanner() {
  const { t, tr, lang } = useLang();
  const slides = useMemo(() => bannerSlides.filter((s) => s.active !== false), []);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(prefersReducedMotion);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const toggleRef = useRef(null);

  const count = slides.length;
  const go = useCallback((n) => setIndex(() => (n + count) % count), [count]);
  const rotating =
    bannerSettings.autoPlay && count > 1 && !userPaused && !hovered && !focusWithin;

  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), bannerSettings.intervalMs);
    return () => clearInterval(id);
  }, [rotating, count]);

  if (count === 0) return null;
  const slide = slides[index];
  const centred = slide.align === "center";
  const num = (n) => n.toLocaleString(lang === "bn" ? "bn-BD" : "en-IN");

  return (
    <section
      className="relative isolate overflow-hidden bg-oasis-900"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      /* focus on the Pause/Play button itself does not count — otherwise
         pressing "Play" would look broken, since focus is still on it */
      onFocus={(e) => setFocusWithin(e.target !== toggleRef.current)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
      }}
      aria-roledescription="carousel"
      aria-label={t("carousel.label")}
    >
      {/* Slides stacked, cross-fading */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <img
            src={s.image}
            alt=""
            className="h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* readability wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-oasis-900/92 via-oasis-900/70 to-oasis-900/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-oasis-900/70 to-transparent"
      />

      {/* announce slide changes the user causes, but stay quiet while it
          auto-rotates (constant announcements would be unbearable) */}
      <div
        aria-live={rotating ? "off" : "polite"}
        className={`container-page relative flex min-h-[78vh] flex-col justify-center py-20 sm:min-h-[80vh] ${
          centred ? "items-center text-center" : "items-start"
        }`}
      >
        <div key={slide.id} className={`max-w-2xl ${centred ? "mx-auto" : ""}`}>
          <p className="reveal is-visible mb-4 inline-flex items-center gap-2 rounded-full bg-saffron-500/15 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] text-saffron-400 uppercase ring-1 ring-saffron-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron-400" />
            {tr(slide.kicker)}
          </p>
          <h1
            className="reveal is-visible font-display text-4xl leading-[1.12] font-bold text-balance text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            {tr(slide.title)}
          </h1>
          <p
            className="reveal is-visible mt-5 max-w-xl text-lg leading-relaxed text-sand-200"
            style={{ animationDelay: "180ms" }}
          >
            {tr(slide.subtitle)}
          </p>
          <div
            className={`reveal is-visible mt-9 flex flex-wrap gap-3 ${centred ? "justify-center" : ""}`}
            style={{ animationDelay: "270ms" }}
          >
            {slide.primaryCta && (
              <Link
                to={slide.primaryCta.to}
                className="group inline-flex items-center gap-2 rounded-full bg-saffron-500 px-7 py-3.5 font-semibold text-oasis-900 shadow-lg shadow-saffron-500/20 transition hover:bg-saffron-400"
              >
                {tr(slide.primaryCta.label)}
                <Icon
                  name="arrowRight"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}
            {slide.secondaryCta && (
              <Link
                to={slide.secondaryCta.to}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/10"
              >
                {tr(slide.secondaryCta.label)}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* controls — kept on the LEFT: Netlify's injected badge occupies the
          bottom-right corner of the screen and would cover arrows placed there */}
      {count > 1 && (
        <div className="container-page relative pb-8">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                ref={toggleRef}
                type="button"
                onClick={() => {
                  // an explicit "Play" should start rotating right away,
                  // even though the mouse is over the banner
                  if (userPaused) setHovered(false);
                  setUserPaused((p) => !p);
                }}
                aria-label={userPaused ? t("carousel.play") : t("carousel.pause")}
                className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
              >
                <Icon name={userPaused ? "play" : "pause"} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label={t("carousel.prev")}
                className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
              >
                <Icon name="chevronLeft" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label={t("carousel.next")}
                className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
              >
                <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
            {/* each dot is a 24px-tall button (comfortable tap target);
                the thin bar inside is only the visual */}
            <div className="flex gap-1">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${t("carousel.goto")} ${num(i + 1)}`}
                  aria-current={i === index}
                  className="group flex h-6 min-w-6 items-center justify-center px-0.5"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      i === index
                        ? "w-10 bg-saffron-500"
                        : "w-5 bg-white/40 group-hover:bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* curved bottom edge */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 70"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-12 w-full text-sand-50"
      >
        <path fill="currentColor" d="M0 70V34c240 28 480 36 720 22s480-28 720-18v32Z" />
      </svg>
    </section>
  );
}
