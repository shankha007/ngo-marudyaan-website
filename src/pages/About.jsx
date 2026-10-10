import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Photo from "../components/Photo";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { WorkCardCompact } from "../components/WorkCard";
import { arrow, btn, size } from "../components/ui";
import { programs, team, values } from "../data/content";
import { findProject, programImage } from "../data/gallery";
import { sortedPastWorks } from "../data/pastWorks";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

function Initials({ name }) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span className="font-display text-2xl font-bold text-oasis-800">{letters || "M"}</span>
  );
}

/* One programme: photo on one side, details on the other (sides
   alternate). Arriving at /about#food scrolls here — handled centrally
   in <ScrollToTop>. */
function Programme({ program: p, index: i }) {
  const { t, tr } = useLang();
  const past = sortedPastWorks.filter((w) => w.category === p.id);
  return (
    <section
      id={p.id}
      className={`scroll-mt-36 py-14 sm:py-20 ${i % 2 ? "mx-2 rounded-4xl bg-surface-2 sm:mx-3 sm:rounded-5xl" : ""}`}
    >
      <div className={`container-page grid items-center gap-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
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
          <h3 className="font-display mt-5 text-4xl leading-tight font-bold text-ink sm:text-5xl">{tr(p.title)}</h3>
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
          {past.length > 0 && (
            <div className="mt-7">
              <h4 className="text-xs font-bold tracking-[0.14em] text-ink-3 uppercase">{t("work.past")}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {past.map((w) => (
                  <li key={w.id}>
                    <Link
                      to={`/past-works#${w.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink transition hover:border-ink"
                    >
                      <Icon name="clock" className="h-3.5 w-3.5 text-brand-ink" />
                      {tr(w.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
  );
}

export default function About() {
  const { t, tr } = useLang();
  usePageMeta(
    `${t("about.title")} — ${site.name}`,
    "Who NGO Marudyaan is and what it does: its mission, values and programmes in food, education, health camps, winter relief and festivals, plus its team and registration details.",
  );

  const legalRows = [
    { label: t("about.legal.regNo"), value: site.registration.regNo },
    { label: t("about.legal.act"), value: site.registration.regAct },
    { label: t("about.legal.regDate"), value: site.registration.regDate },
    { label: t("about.legal.pan"), value: site.registration.pan },
    { label: t("about.legal.80g"), value: site.registration.eightyG },
    { label: t("about.legal.founded"), value: site.registration.founded },
  ].filter((r) => r.value);

  const steps = [1, 2, 3, 4, 5].map((n) => ({
    n,
    title: t(`work.how.s${n}.t`),
    body: t(`work.how.s${n}.b`),
  }));

  return (
    <>
      <PageHeader title={t("about.title")} sub={t("about.sub")} />

      {/* mission + vision */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { icon: "sprout", title: t("about.mission.title"), body: t("about.mission.body"), look: "bg-lime-400 text-oasis-900", tile: "bg-oasis-900 text-lime-300", text: "text-oasis-900/80" },
            { icon: "globe", title: t("about.vision.title"), body: t("about.vision.body"), look: "bg-night text-white", tile: "bg-lime-400 text-oasis-900", text: "text-white/75" },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div className={`h-full rounded-4xl p-7 sm:p-10 ${card.look}`}>
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.tile}`}>
                  <Icon name={card.icon} className="h-7 w-7" />
                </span>
                <h2 className="font-display mt-6 text-3xl font-bold sm:text-4xl">{card.title}</h2>
                <p className={`mt-4 text-lg leading-relaxed ${card.text}`}>{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* values */}
      <section className="mx-2 rounded-4xl bg-surface-2 py-20 sm:mx-3 sm:rounded-5xl">
        <div className="container-page">
          <SectionHeading title={t("about.values.title")} />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <div className="h-full rounded-3xl border border-line bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                      <Icon name="shield" className="h-5 w-5" />
                    </span>
                    <span aria-hidden="true" className="font-display text-3xl font-bold text-line-strong">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-ink">
                    {tr(v.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{tr(v.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* what we do: one section per programme (this was the Our Work page) */}
      <div id="our-work" className="scroll-mt-28 pt-20 sm:pt-24">
        <div className="container-page">
          <SectionHeading kicker={t("home.work.kicker")} title={t("work.title")} sub={t("work.sub")} />
        </div>

        {/* quick jump chips — stick under the header while you scroll the programmes */}
        <div className="sticky top-[4.75rem] z-30 mt-8 sm:top-[5rem]">
          <div className="container-page flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-center">
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

        <div className="pt-6 pb-10 sm:pb-14">
          {programs.map((p, i) => (
            <Programme key={p.id} program={p} index={i} />
          ))}
        </div>
      </div>

      {/* how a drive happens */}
      <section className="mx-2 rounded-4xl bg-night py-20 sm:mx-3 sm:rounded-5xl sm:py-24">
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

      {/* the latest few works, with a link to all of them */}
      <section className="pt-20 sm:pt-24">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading align="left" kicker={t("about.recent.kicker")} title={t("about.recent.title")} />
            <Link to="/past-works" className={`${btn.outline} ${size.md} shrink-0`}>
              {t("about.recent.all")}
              <Icon name="arrowRight" className={arrow} />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {sortedPastWorks.slice(0, 3).map((w, i) => (
              <Reveal key={w.id} delay={i * 80}>
                <WorkCardCompact work={w} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* team */}
      <section className="mx-2 rounded-4xl bg-surface-2 py-20 sm:mx-3 sm:rounded-5xl">
        <div className="container-page">
          <SectionHeading title={t("about.team.title")} sub={t("about.team.sub")} />
          {/* Flex rather than grid so a short last row sits in the middle. */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
            {team.map((member, i) => (
              <Reveal
                key={member.id}
                delay={i * 80}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
              >
                <div className="h-full rounded-3xl border border-line bg-surface p-4 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full sm:h-24 sm:w-24 bg-lime-200 ring-4 ring-lime-400/50">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={tr(member.name)}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Initials name={tr(member.name)} />
                    )}
                  </div>
                  <h3 className="font-display mt-3 text-base font-semibold text-balance text-ink sm:mt-4 sm:text-lg">
                    {tr(member.name)}
                  </h3>
                  <p className="mt-1 text-sm text-brand-ink">{tr(member.role)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* legal / transparency */}
      <section className="py-20">
        <div className="container-page">
          <SectionHeading title={t("about.legal.title")} sub={t("about.legal.note")} />
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <dl className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
              {legalRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-6 sm:py-4 ${
                    i % 2 ? "bg-canvas" : "bg-surface"
                  }`}
                >
                  {/* stacked on phones so every row looks the same, even when a long
                      value (the Act's name) would not fit beside its label */}
                  <dt className="shrink-0 text-sm text-ink-2">{row.label}</dt>
                  <dd className="font-medium text-ink sm:text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
