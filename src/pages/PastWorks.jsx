import { Link } from "react-router-dom";
import ChipBar from "../components/ChipBar";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import WorkCard from "../components/WorkCard";
import { arrow, btn, size } from "../components/ui";
import { sortedPastWorks, workYear } from "../data/pastWorks";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import useActiveSection from "../hooks/useActiveSection";
import usePageMeta from "../hooks/usePageMeta";

/* works grouped by year, newest year first */
const years = [...new Set(sortedPastWorks.map(workYear))].map((year) => ({
  year,
  works: sortedPastWorks.filter((w) => workYear(w) === year),
}));

export default function PastWorks() {
  const { t, lang } = useLang();
  const activeYear = useActiveSection(years.map(({ year }) => String(year)));
  usePageMeta(
    `${t("works.title")} — ${site.name}`,
    "Every drive NGO Marudyaan has run since its first winter project in December 2017: relief, education, festival and winter drives across Kolkata and West Bengal.",
  );
  const num = (y) => Number(y).toLocaleString(lang === "bn" ? "bn-BD" : "en-IN", { useGrouping: false });

  return (
    <>
      <PageHeader title={t("works.title")} sub={t("works.sub")} />

      {/* jump to a year — sticks under the header while you scroll */}
      <ChipBar label={t("works.years")} active={activeYear} className="mt-4">
        {years.map(({ year }) => {
          const on = activeYear === String(year);
          return (
            <a
              key={year}
              href={`#${year}`}
              aria-current={on || undefined}
              className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2.5 font-display text-sm font-bold tracking-wider shadow-soft backdrop-blur-xl transition ${
                on ? "border-ink bg-ink text-canvas" : "border-line bg-surface/85 text-ink hover:border-ink"
              }`}
            >
              {num(year)}
            </a>
          );
        })}
      </ChipBar>

      <div className="container-page py-12 sm:py-16">
        {years.map(({ year, works }) => (
          <section
            key={year}
            id={year}
            aria-labelledby={`year-${year}`}
            className="grid scroll-mt-36 gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10"
          >
            <h2
              id={`year-${year}`}
              className="font-display text-5xl leading-none font-bold text-brand-ink lg:sticky lg:top-40 lg:self-start lg:text-6xl"
            >
              {num(year)}
            </h2>
            <div className="space-y-6">
              {works.map((w, i) => (
                <Reveal key={w.id} delay={i * 80}>
                  <WorkCard work={w} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* what comes next */}
      <section className="mx-2 mb-4 rounded-4xl bg-night py-16 text-center sm:mx-3 sm:rounded-5xl sm:py-20">
        <Reveal className="container-page">
          <h2 className="font-display mx-auto max-w-2xl text-3xl leading-tight font-bold text-balance text-white sm:text-5xl">
            {t("works.next.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/75">{t("works.next.body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/donate" className={`${btn.donate} ${size.lg}`}>
              {t("cta.donate")}
              <Icon name="arrowRight" className={arrow} />
            </Link>
            <Link to="/get-involved" className={`${btn.glass} ${size.lg}`}>
              {t("cta.volunteer")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
