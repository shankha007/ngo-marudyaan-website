import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Icon from "../components/Icon";
import ProgramCard from "../components/ProgramCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import StatCounter from "../components/StatCounter";
import { galleryItems, programs, testimonials, values } from "../data/content";
import { site, stats } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function Home() {
  const { t, tr } = useLang();
  usePageMeta(
    `${site.name} — ${site.tagline}`,
    "NGO Marudyaan is a volunteer-run organisation in Kolkata working on food, education, health, winter relief and livelihood support.",
  );

  const previewPhotos = galleryItems.slice(0, 6);

  return (
    <>
      <HeroBanner />

      {/* --- impact numbers ------------------------------------------- */}
      <section className="bg-oasis-800 py-14">
        <div className="container-page">
          <Reveal className="text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {t("home.stats.title")}
            </h2>
            <p className="mt-2 text-sm text-sand-200/70">{t("home.stats.note")}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <StatCounter value={s.value} suffix={s.suffix} label={t(`stat.${s.id}`)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- who we are ----------------------------------------------- */}
      <section className="py-20 sm:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/images/about-main.svg"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="animate-float-slow absolute -right-2 -bottom-8 hidden rounded-2xl bg-white p-5 shadow-xl ring-1 ring-oasis-100 sm:block">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-oasis-50 p-2.5 text-oasis-600">
                  <Icon name="sprout" className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-lg font-bold text-oasis-900">
                    {site.registration.founded}
                  </div>
                  <div className="text-xs text-oasis-800/60">{t("about.legal.founded")}</div>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              kicker={t("home.mission.kicker")}
              title={t("home.mission.title")}
            />
            <p className="mt-6 text-lg leading-relaxed text-oasis-800/80">
              {t("home.mission.body")}
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v.id} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 self-start rounded-full bg-oasis-50 p-1.5 text-oasis-600">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold text-oasis-900">{tr(v.title)}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-oasis-800/70">{tr(v.text)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-oasis-700 px-6 py-3 font-semibold text-white transition hover:bg-oasis-600"
            >
              {t("cta.learnMore")}
              <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- what we do ------------------------------------------------ */}
      <section className="bg-sand-100 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            kicker={t("home.work.kicker")}
            title={t("home.work.title")}
            sub={t("home.work.sub")}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProgramCard program={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- gallery preview ------------------------------------------- */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading kicker={t("home.gallery.kicker")} title={t("home.gallery.title")} />
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
            {previewPhotos.map((photo, i) => (
              <Reveal
                key={photo.id}
                delay={i * 60}
                className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <figure className="group relative h-full overflow-hidden rounded-2xl bg-oasis-100">
                  <img
                    src={photo.src}
                    alt={tr(photo.caption)}
                    loading="lazy"
                    className="h-full min-h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-oasis-900/85 to-transparent p-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {tr(photo.caption)}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-oasis-300 px-6 py-3 font-semibold text-oasis-700 transition hover:border-oasis-600 hover:bg-oasis-50"
            >
              {t("cta.viewAll")}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- voices ---------------------------------------------------- */}
      <section className="bg-sand-100 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading kicker={t("home.voices.kicker")} title={t("home.voices.title")} />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((v, i) => (
              <Reveal key={v.id} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-2xl border border-oasis-100 bg-white p-7 shadow-sm">
                  <Icon name="quote" filled className="h-8 w-8 text-saffron-400" />
                  <blockquote className="mt-4 flex-1 leading-relaxed text-oasis-900/85">
                    {tr(v.quote)}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-oasis-100 pt-4 text-sm font-semibold text-oasis-600">
                    {tr(v.author)}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- closing call to action ------------------------------------ */}
      <section className="relative overflow-hidden bg-oasis-900 py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-24 h-80 w-80 rounded-full bg-oasis-600/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-saffron-500/15 blur-3xl"
        />
        <div className="container-page relative text-center">
          <Reveal>
            <h2 className="font-display mx-auto max-w-2xl text-3xl leading-tight font-bold text-balance text-white sm:text-4xl">
              {t("home.cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-sand-200/85">{t("home.cta.body")}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/donate"
                className="group inline-flex items-center gap-2 rounded-full bg-saffron-500 px-8 py-3.5 font-semibold text-oasis-900 shadow-lg shadow-saffron-500/20 transition hover:bg-saffron-400"
              >
                {t("cta.donate")}
                <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-8 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                {t("cta.volunteer")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
