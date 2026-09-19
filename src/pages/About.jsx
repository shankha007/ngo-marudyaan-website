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
    <span className="font-display text-2xl font-bold text-oasis-600">{letters || "M"}</span>
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
    { label: t("about.legal.pan"), value: site.registration.pan },
    { label: t("about.legal.80g"), value: site.registration.eightyG },
    { label: t("about.legal.founded"), value: site.registration.founded },
  ].filter((r) => r.value);

  return (
    <>
      <PageHeader title={t("about.title")} sub={t("about.sub")} />

      {/* mission + vision */}
      <section className="py-18 sm:py-22">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {[
            { icon: "sprout", title: t("about.mission.title"), body: t("about.mission.body") },
            { icon: "globe", title: t("about.vision.title"), body: t("about.vision.body") },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div className="h-full rounded-3xl border border-oasis-100 bg-white p-8 shadow-sm">
                <span className="inline-flex rounded-2xl bg-oasis-50 p-3 text-oasis-600">
                  <Icon name={card.icon} className="h-7 w-7" />
                </span>
                <h2 className="font-display mt-5 text-2xl font-bold text-oasis-900">
                  {card.title}
                </h2>
                <p className="mt-3 leading-relaxed text-oasis-800/80">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* values */}
      <section className="bg-sand-100 py-20">
        <div className="container-page">
          <SectionHeading title={t("about.values.title")} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.id} delay={i * 80}>
                <div className="h-full rounded-2xl border border-oasis-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex rounded-xl bg-saffron-500/10 p-2.5 text-saffron-600">
                    <Icon name="shield" className="h-5 w-5" />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-oasis-900">
                    {tr(v.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-oasis-800/75">{tr(v.text)}</p>
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
              className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-oasis-100 sm:left-1/2 sm:-translate-x-1/2"
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
                  className={`absolute top-1.5 left-2 h-4 w-4 rounded-full border-4 border-sand-50 bg-saffron-500 ${
                    i % 2 === 0 ? "sm:left-auto sm:-right-2" : "sm:-left-2"
                  }`}
                />
                <div className="font-display text-sm font-bold tracking-widest text-oasis-500">
                  {m.year}
                </div>
                <h3 className="font-display mt-1 text-xl font-semibold text-oasis-900">
                  {tr(m.title)}
                </h3>
                <p className="mt-2 leading-relaxed text-oasis-800/75">{tr(m.text)}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* team */}
      <section className="bg-sand-100 py-20">
        <div className="container-page">
          <SectionHeading title={t("about.team.title")} sub={t("about.team.sub")} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 80}>
                <div className="h-full rounded-2xl border border-oasis-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-oasis-50 ring-4 ring-oasis-100">
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
                  <h3 className="font-display mt-4 text-lg font-semibold text-oasis-900">
                    {tr(member.name)}
                  </h3>
                  <p className="mt-1 text-sm text-oasis-600">{tr(member.role)}</p>
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
            <dl className="overflow-hidden rounded-2xl border border-oasis-100 bg-white shadow-sm">
              {legalRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-wrap items-center justify-between gap-2 px-6 py-4 ${
                    i % 2 ? "bg-sand-50" : "bg-white"
                  }`}
                >
                  <dt className="text-sm text-oasis-800/70">{row.label}</dt>
                  <dd className="font-medium text-oasis-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
