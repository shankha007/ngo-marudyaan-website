import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Icon from "../components/Icon";
import Photo from "../components/Photo";
import ProgramCard from "../components/ProgramCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import StatCounter from "../components/StatCounter";
import { arrow, btn, card, size } from "../components/ui";
import { programs, testimonials, values } from "../data/content";
import { findProject, galleryProjects } from "../data/gallery";
import { site, stats } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

/* colour of each impact tile, in the order of `stats` in site.js */
const statTiles = [
  { tile: "bg-lime-400 text-oasis-900", label: "text-oasis-900/75" },
  { tile: "bg-night text-white", label: "text-white/70" },
  { tile: "bg-saffron-400 text-oasis-900", label: "text-oasis-900/75" },
  { tile: "border border-line bg-surface text-ink", label: "text-ink-2" },
];

/* colour of each testimonial card, in turn */
const voiceTiles = [
  "border border-line bg-surface",
  "bg-lime-400 text-oasis-900",
  "bg-night text-white",
];

/* Moving strip of programme names under the banner (decoration only:
   the same names are listed as cards further down the page). */
function Marquee() {
  const { tr } = useLang();
  const names = programs.map((p) => tr(p.title));
  // two identical runs side by side; the strip slides by exactly one run
  const run = (key) => (
    <div key={key} className="flex shrink-0 items-center">
      {names.map((n) => (
        <span key={n} className="flex items-center">
          <span className="px-6 font-display text-xl font-semibold whitespace-nowrap sm:text-2xl">{n}</span>
          <Icon name="sparkle" filled className="h-5 w-5 shrink-0" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="overflow-hidden py-8 sm:py-10">
      <div className="-mx-4 -rotate-1 bg-lime-400 py-3.5 text-oasis-900">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map(run)}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, tr, lang } = useLang();
  usePageMeta(
    `${site.name} — ${site.tagline}`,
    "NGO Marudyaan is a volunteer-run organisation in Kolkata working on food, education, health, winter relief and livelihood support.",
  );

  /* Gallery preview: each project's cover (newest first), then their
     other photos in turn, up to 6. */
  const previewPhotos = [
    ...galleryProjects.map((p) => ({ ...p.photos.find((ph) => ph.src === p.coverSrc), project: p })),
    ...galleryProjects.flatMap((p) => p.photos.filter((ph) => ph.src !== p.coverSrc).map((ph) => ({ ...ph, project: p }))),
  ].slice(0, 6);

  /* the big card in the "what we do" grid: the first programme with real
     project photos (placeholder drawings look odd that large) */
  const featured = programs.find((p) => findProject(p.project)) ?? programs[0];
  const workCards = [featured, ...programs.filter((p) => p !== featured)];

  const perks = ["home.join.perk1", "home.join.perk2", "home.join.perk3"];

  return (
    <>
      <HeroBanner />
      <Marquee />

      {/* --- tagline ---------------------------------------------------- */}
      <section className="pb-16 sm:pb-20">
        <Reveal className="container-page text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-brand-ink uppercase">
            <Icon name="sprout" className="h-4 w-4" />
            {t("home.tagline.kicker")}
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-4xl text-4xl leading-[1.08] font-bold text-balance text-ink sm:text-6xl">
            <span aria-hidden="true" className="text-brand">“</span>
            {lang === "bn" ? site.taglineBn : site.tagline}
            <span aria-hidden="true" className="text-brand">”</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{t("home.tagline.body")}</p>
        </Reveal>
      </section>

      {/* --- impact numbers (bento) ------------------------------------ */}
      <section className="pb-20 sm:pb-24">
        <div className="container-page grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Reveal className="col-span-2 flex flex-col justify-between rounded-4xl bg-brand-soft p-7 sm:p-9 lg:row-span-2">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-on-brand">
                <Icon name="sprout" className="h-6 w-6" />
              </span>
              <h2 className="font-display mt-4 max-w-md text-3xl leading-[1.08] font-bold text-balance text-ink sm:text-5xl">
                {t("home.stats.title")}
              </h2>
            </div>
            <p className="mt-8 text-sm text-ink-2">{t("home.stats.note")}</p>
          </Reveal>
          {stats.map((s, i) => {
            const look = statTiles[i % statTiles.length];
            return (
              <Reveal key={s.id} delay={i * 90} className={`rounded-4xl p-6 sm:p-7 ${look.tile}`}>
                <StatCounter
                  value={s.value}
                  suffix={s.suffix}
                  label={t(`stat.${s.id}`)}
                  className="text-4xl sm:text-5xl"
                  labelClassName={look.label}
                />
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* --- who we are ----------------------------------------------- */}
      <section className="pb-20 sm:pb-28">
        <div className="container-page grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-xl pb-10 sm:pb-14">
            <div className="overflow-hidden rounded-4xl shadow-lift">
              <Photo
                src="/images/projects/2022-sharodiya-sahosathi/03.jpg"
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 90vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-0 w-[46%] rotate-3 overflow-hidden rounded-3xl border-4 border-canvas shadow-lift">
              <Photo
                src="/images/projects/2021-micro-library/07.jpg"
                sizes="(min-width: 1024px) 260px, 45vw"
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="animate-float-slow absolute top-6 -left-2 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-5 shadow-lift sm:-left-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-oasis-900">
                <Icon name="sprout" className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-base font-bold text-ink">{site.registration.founded}</div>
                <div className="text-xs text-ink-2">{t("about.legal.founded")}</div>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading align="left" kicker={t("home.mission.kicker")} title={t("home.mission.title")} />
            <p className="mt-6 text-lg leading-relaxed text-ink-2">{t("home.mission.body")}</p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v.id} className={`flex gap-3 p-4 ${card} rounded-2xl`}>
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full bg-brand text-on-brand">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{tr(v.title)}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{tr(v.text)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/about" className={`mt-9 ${btn.primary} ${size.lg}`}>
              {t("cta.learnMore")}
              <Icon name="arrowRight" className={arrow} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- what we do (bento) ----------------------------------------- */}
      <section className="pb-20 sm:pb-28">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading align="left" kicker={t("home.work.kicker")} title={t("home.work.title")} sub={t("home.work.sub")} />
            <Link to="/our-work" className={`${btn.outline} ${size.md} shrink-0`}>
              {t("home.work.all")}
              <Icon name="arrowRight" className={arrow} />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workCards.map((p, i) => (
              <Reveal
                key={p.id}
                delay={(i % 3) * 70}
                className={i === 0 ? "sm:col-span-2 lg:row-span-2" : "sm:last:col-span-2 lg:last:col-span-1"}
              >
                <ProgramCard program={p} feature={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- join the crew --------------------------------------------- */}
      <section className="px-2 pb-20 sm:px-3 sm:pb-28">
        <div className="relative isolate overflow-hidden rounded-4xl bg-night py-16 text-white sm:rounded-5xl sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -left-24 -z-10 h-96 w-96 rounded-full bg-oasis-500/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -bottom-32 -z-10 h-96 w-96 rounded-full bg-lime-400/20 blur-3xl"
          />
          <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading light align="left" kicker={t("home.join.kicker")} title={t("home.join.title")} sub={t("home.join.body")} />
              <ul className="mt-8 flex flex-wrap gap-2">
                {perks.map((k) => (
                  <li
                    key={k}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium"
                  >
                    <Icon name="check" className="h-4 w-4 text-lime-300" />
                    {t(k)}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/get-involved" className={`${btn.lime} ${size.lg}`}>
                  {t("cta.volunteer")}
                  <Icon name="arrowRight" className={arrow} />
                </Link>
                <a
                  href={`https://wa.me/${site.contact.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn.glass} ${size.lg}`}
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
            <Reveal delay={100} className="relative mx-auto w-full max-w-lg">
              <div className="overflow-hidden rounded-4xl -rotate-2 border border-white/10 shadow-2xl">
                <Photo
                  src="/images/projects/2020-cyclone-relief/04.jpg"
                  sizes="(min-width: 1024px) 512px, 90vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-3 w-[42%] rotate-6 overflow-hidden rounded-3xl border-4 border-night shadow-2xl sm:-left-8">
                <Photo
                  src="/images/projects/2020-cyclone-relief/01.jpg"
                  sizes="(min-width: 1024px) 220px, 40vw"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- gallery preview ------------------------------------------- */}
      <section className="pb-20 sm:pb-28">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading align="left" kicker={t("home.gallery.kicker")} title={t("home.gallery.title")} />
            <Link to="/gallery" className={`${btn.outline} ${size.md} shrink-0`}>
              {t("cta.viewAll")}
              <Icon name="arrowRight" className={arrow} />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {previewPhotos.map((photo, i) => (
              <Reveal
                key={photo.id}
                delay={i * 60}
                className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <Link
                  to={`/gallery#${photo.project.id}`}
                  className="group relative block h-full overflow-hidden rounded-3xl bg-surface-2"
                >
                  <Photo
                    src={photo.src}
                    alt={tr(photo.caption)}
                    sizes={
                      i === 0
                        ? "(min-width: 1280px) 820px, (min-width: 768px) 66vw, 50vw"
                        : "(min-width: 1280px) 400px, (min-width: 768px) 33vw, 50vw"
                    }
                    className="h-full min-h-40 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-x-2 bottom-2 translate-y-2 rounded-2xl bg-night/70 px-3 py-2 text-xs font-medium text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {tr(photo.project.title)} · {photo.project.year}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- voices ---------------------------------------------------- */}
      <section className="pb-20 sm:pb-28">
        <div className="container-page">
          <SectionHeading kicker={t("home.voices.kicker")} title={t("home.voices.title")} />
          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {testimonials.map((v, i) => {
              const look = voiceTiles[i % voiceTiles.length];
              const onDark = look.includes("bg-night");
              const onLime = look.includes("bg-lime");
              return (
                <Reveal key={v.id} delay={i * 90}>
                  <figure className={`flex h-full flex-col rounded-4xl p-7 sm:p-8 ${look}`}>
                    <Icon
                      name="quote"
                      filled
                      className={`h-9 w-9 ${onDark ? "text-lime-400" : onLime ? "text-oasis-900" : "text-brand"}`}
                    />
                    <blockquote
                      className={`mt-5 flex-1 text-lg leading-relaxed ${
                        onDark ? "text-white/85" : onLime ? "text-oasis-900" : "text-ink"
                      }`}
                    >
                      {tr(v.quote)}
                    </blockquote>
                    <figcaption
                      className={`mt-6 border-t pt-4 text-sm font-semibold ${
                        onDark ? "border-white/15 text-lime-300" : onLime ? "border-oasis-900/15 text-oasis-900" : "border-line text-brand-ink"
                      }`}
                    >
                      {tr(v.author)}
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
