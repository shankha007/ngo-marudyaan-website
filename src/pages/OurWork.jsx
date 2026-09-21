import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { programs } from "../data/content";
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

      {/* quick jump chips */}
      <div className="container-page -mt-4 pt-10">
        <div className="flex flex-wrap gap-2">
          {programs.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-oasis-200 bg-white px-4 py-2 text-sm font-medium text-oasis-700 transition hover:border-oasis-500 hover:bg-oasis-50"
            >
              <Icon name={p.icon} className="h-4 w-4" />
              {tr(p.title)}
            </a>
          ))}
        </div>
      </div>

      {/* programme detail blocks */}
      <div className="py-16">
        {programs.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            className={`scroll-mt-24 py-14 ${i % 2 ? "bg-sand-100" : ""}`}
          >
            <div
              className={`container-page grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={90}>
                <div className="flex items-center gap-4">
                  <span className="inline-flex shrink-0 rounded-2xl bg-oasis-50 p-3 text-oasis-600">
                    <Icon name={p.icon} className="h-7 w-7" />
                  </span>
                  <h2 className="font-display text-3xl font-bold text-oasis-900">{tr(p.title)}</h2>
                </div>
                <p className="mt-3 text-lg leading-relaxed text-oasis-800/80">{tr(p.summary)}</p>
                <ul className="mt-6 space-y-3">
                  {tr(p.details).map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-1 shrink-0 self-start rounded-full bg-saffron-500/15 p-1 text-saffron-600">
                        <Icon name="check" className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-relaxed text-oasis-800/80">{d}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/donate"
                    className="rounded-full bg-oasis-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-oasis-600"
                  >
                    {t("cta.donate")}
                  </Link>
                  <Link
                    to="/get-involved"
                    className="rounded-full border border-oasis-300 px-6 py-3 text-sm font-semibold text-oasis-700 transition hover:border-oasis-600 hover:bg-oasis-50"
                  >
                    {t("cta.volunteer")}
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      {/* how a drive happens */}
      <section className="bg-oasis-900 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading light title={t("work.how.title")} />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="font-display inline-flex h-10 w-10 items-center justify-center rounded-full bg-saffron-500 font-bold text-oasis-900">
                    {s.n}
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sand-200/75">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
