import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { milestones, team, values } from "../data/content";
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

export default function About() {
  const { t, tr } = useLang();
  usePageMeta(
    `${t("about.title")} — ${site.name}`,
    "The story, mission, values, team and registration details of NGO Marudyaan, Kolkata.",
  );

  const legalRows = [
    { label: t("about.legal.regNo"), value: site.registration.regNo },
    { label: t("about.legal.act"), value: site.registration.regAct },
    { label: t("about.legal.regDate"), value: site.registration.regDate },
    { label: t("about.legal.pan"), value: site.registration.pan },
    { label: t("about.legal.80g"), value: site.registration.eightyG },
    { label: t("about.legal.founded"), value: site.registration.founded },
  ].filter((r) => r.value);

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

      {/* timeline */}
      <section className="py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading title={t("about.story.title")} />
          <ol className="relative mx-auto mt-14 max-w-3xl">
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-gradient-to-b from-lime-400 via-brand to-line sm:left-1/2 sm:-translate-x-1/2"
            />
            {milestones.map((m, i) => (
              <Reveal
                as="li"
                key={m.year}
                delay={i * 80}
                className={`relative mb-10 pl-12 sm:w-1/2 sm:pl-0 ${
                  i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                }`}
              >
                <span
                  className={`absolute top-1.5 left-2 h-4 w-4 rounded-full border-4 border-canvas bg-lime-400 ring-2 ring-brand ${
                    i % 2 === 0 ? "sm:left-auto sm:-right-2" : "sm:-left-2"
                  }`}
                />
                <div className="inline-flex rounded-full bg-brand-soft px-3 py-0.5 font-display text-sm font-bold tracking-widest text-brand-ink">
                  {m.year}
                </div>
                <h3 className="font-display mt-1 text-xl font-semibold text-ink">
                  {tr(m.title)}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-2">{tr(m.text)}</p>
              </Reveal>
            ))}
          </ol>
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
