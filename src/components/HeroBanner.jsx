import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bannerSettings, bannerSlides } from "../data/banner";
import { stats } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import Photo from "./Photo";
import Icon from "./Icon";
import { arrow, btn, size } from "./ui";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const control =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/25";

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
  const volunteers = stats.find((s) => s.id === "volunteers");

  return (
    <section
      className="relative px-2 pt-2 sm:px-3 sm:pt-3"
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
      <div className="relative isolate overflow-hidden rounded-4xl bg-night sm:rounded-5xl">
        {/* Slides stacked, cross-fading; the visible one zooms in slowly */}
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Photo
              src={s.image}
              sizes="100vw"
              priority={i === 0}
              className={`h-full w-full object-cover transition-transform duration-[9000ms] ease-out motion-reduce:transition-none ${
                i === index ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}

        {/* readability wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-night/95 via-night/65 to-night/5"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/15 to-transparent"
        />

        {/* announce slide changes the user causes, but stay quiet while it
            auto-rotates (constant announcements would be unbearable) */}
        <div
          aria-live={rotating ? "off" : "polite"}
          className={`container-page relative flex min-h-[78svh] flex-col justify-end pt-20 pb-8 sm:min-h-[82svh] sm:pb-10 lg:pb-14 ${
            centred ? "items-center text-center" : "items-start"
          }`}
        >
          <div key={slide.id} className={`max-w-3xl ${centred ? "mx-auto" : ""}`}>
            <p className="reveal is-visible mb-5 inline-flex items-center gap-2 rounded-full bg-lime-400 px-3.5 py-1.5 text-xs font-bold tracking-[0.12em] text-oasis-900 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-oasis-700 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-oasis-700" />
              </span>
              {tr(slide.kicker)}
            </p>
            <h1
              className="reveal is-visible font-display text-[2.5rem] leading-[1.04] font-bold text-balance text-white sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "90ms" }}
            >
              {tr(slide.title)}
            </h1>
            <p
              className="reveal is-visible mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
              style={{ animationDelay: "180ms" }}
            >
              {tr(slide.subtitle)}
            </p>
            <div
              className={`reveal is-visible mt-8 flex flex-wrap gap-3 ${centred ? "justify-center" : ""}`}
              style={{ animationDelay: "270ms" }}
            >
              {slide.primaryCta && (
                <Link
                  to={slide.primaryCta.to}
                  className={`${slide.primaryCta.to === "/donate" ? btn.donate : btn.lime} ${size.lg}`}
                >
                  {tr(slide.primaryCta.label)}
                  <Icon name="arrowRight" className={arrow} />
                </Link>
              )}
              {slide.secondaryCta && (
                <Link to={slide.secondaryCta.to} className={`${btn.glass} ${size.lg}`}>
                  {tr(slide.secondaryCta.label)}
                </Link>
              )}
            </div>
          </div>

          {/* controls — kept on the LEFT: Netlify's injected badge occupies the
              bottom-right corner of the screen and would cover arrows placed there.
              On narrow phones the dots stack ABOVE the buttons: in one row the
              dots would reach into the badge's corner at the bottom right. */}
          {count > 1 && (
            <div className="mt-10 flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
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
                  className={control}
                >
                  <Icon name={userPaused ? "play" : "pause"} className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label={t("carousel.prev")}
                  className={control}
                >
                  <Icon name="chevronLeft" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label={t("carousel.next")}
                  className={control}
                >
                  <Icon name="chevronRight" className="h-4 w-4" />
                </button>
              </div>
              {/* each dot is a 32px-tall button (comfortable tap target);
                  the thin bar inside is only the visual */}
              <div className="flex gap-1">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`${t("carousel.goto")} ${num(i + 1)}`}
                    aria-current={i === index}
                    className="group flex h-8 min-w-8 items-center justify-center px-1"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-500 ${
                        i === index ? "w-12 bg-lime-400" : "w-5 bg-white/35 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* spinning badge + floating "crew" card — large screens only, decorative */}
        <div aria-hidden="true" className="pointer-events-none absolute top-16 right-10 hidden lg:block xl:right-16">
          <svg viewBox="0 0 200 200" className="h-36 w-36 animate-spin-slow text-white/85 xl:h-40 xl:w-40">
            <defs>
              <path id="hero-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            {/* the text goes round once: textLength stretches it to the circle's
                circumference (2π × 78 ≈ 490), so it neither overlaps nor leaves a gap */}
            <text className="fill-current font-display text-[15px] font-semibold uppercase">
              <textPath href="#hero-ring" textLength="488" lengthAdjust="spacing">
                {t("hero.ring")}
              </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-oasis-900">
            <Icon name="sprout" className="h-7 w-7" />
          </span>
        </div>
        {volunteers && (
          <div
            aria-hidden="true"
            className="animate-float-slow absolute right-16 bottom-14 hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 py-3 pr-5 pl-3 text-white shadow-2xl backdrop-blur-xl xl:flex"
          >
            <span className="flex -space-x-2.5">
              {[
                ["bg-lime-400", "heart"],
                ["bg-saffron-400", "book"],
                ["bg-coral-400", "bowl"],
              ].map(([bg, icon]) => (
                <span
                  key={icon}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-oasis-900 ring-2 ring-night ${bg}`}
                >
                  <Icon name={icon} className="h-4 w-4" />
                </span>
              ))}
            </span>
            <span className="max-w-44 text-sm leading-tight font-semibold">
              {t("hero.volunteers").replace("{n}", `${volunteers.value.toLocaleString("en-IN")}${volunteers.suffix}`)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
