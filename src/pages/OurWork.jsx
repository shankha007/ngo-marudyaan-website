import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Photo from "../components/Photo";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { arrow, btn, size } from "../components/ui";
import { programs } from "../data/content";
import { findProject, programImage } from "../data/gallery";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function OurWork() {
  const { t, tr } = useLang();
  usePageMeta(
    `${t("work.title")} — ${site.name}`,
    "Food and nutrition, education, health camps, winter relief, festival drives and women's livelihood programmes run by NGO Marudyaan.",
  );

  /* Arriving at /our-work#food scrolls to that section — handled centrally
     in <ScrollToTop>, so there is no per-page anchor effect here. */

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    n,
    title: t(`work.how.s${n}.t`),
    body: t(`work.how.s${n}.b`),
  }));

  return (
    <>
      <PageHeader title={t("work.title")} sub={t("work.sub")} />

      {/* quick jump chips — stick under the header while you scroll */}
      <div className="sticky top-[4.75rem] z-30 mt-4 sm:top-[5rem]">
        <div className="container-page flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {programs.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface/85 px-4 py-2 text-sm font-semibold whitespace-nowrap text-ink shadow-soft backdrop-blur-xl transition hover:border-ink"
            >
              <Icon name={p.icon} className="h-4 w-4 text-brand-ink" />
              {tr(p.title)}
            </a>
          ))}
        </div>
      </div>

      {/* programme detail blocks */}
      <div className="py-10 sm:py-14">
        {programs.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            className={`scroll-mt-36 py-14 sm:py-20 ${i % 2 ? "mx-2 rounded-4xl bg-surface-2 sm:mx-3 sm:rounded-5xl" : ""}`}
          >
            <div
              className={`container-page grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <div className="overflow-hidden rounded-4xl shadow-lift">
                  <Photo
                    src={programImage(p)}
                    sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={90}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-oasis-900">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <span aria-hidden="true" className="font-display text-sm font-bold tracking-widest text-ink-3">
                    {String(i + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="font-display mt-5 text-4xl leading-tight font-bold text-ink sm:text-5xl">{tr(p.title)}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-2">{tr(p.summary)}</p>
                <ul className="mt-6 space-y-3">
                  {tr(p.details).map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center self-start rounded-full bg-brand text-on-brand">
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed text-ink-2">{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/donate" className={`${btn.donate} ${size.md}`}>
                    {t("cta.donate")}
                  </Link>
                  <Link to="/get-involved" className={`${btn.outline} ${size.md}`}>
                    {t("cta.volunteer")}
                  </Link>
                  {findProject(p.project) && (
                    <Link
                      to={`/gallery#${p.project}`}
                      className="group inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-brand-ink transition hover:text-ink"
                    >
                      {t("gallery.viewProject")}
                      <Icon name="arrowRight" className={arrow} />
                    </Link>
                  )}
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      {/* how a drive happens */}
      <section className="mx-2 mb-4 rounded-4xl bg-night py-20 sm:mx-3 sm:rounded-5xl sm:py-24">
        <div className="container-page">
          <SectionHeading light title={t("work.how.title")} />
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 80}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/40">
                  <span className="font-display inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400 text-lg font-bold text-oasis-900">
                    {s.n}
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
