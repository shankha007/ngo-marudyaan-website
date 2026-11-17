import PageHeader from "../components/PageHeader";
import { privacyIntro, privacySections, privacyUpdated } from "../data/privacy";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function Privacy() {
  const { t, tr } = useLang();
  usePageMeta(
    `${t("privacy.title")} — ${site.name}`,
    "How NGO Marudyaan collects, uses and protects the personal information you share through this website.",
  );

  const fill = (text) =>
    text.replaceAll("{email}", site.contact.email).replaceAll("{phone}", site.contact.phone);

  return (
    <>
      <PageHeader title={t("privacy.title")} kicker={t("privacy.kicker")} />

      <section className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <p className="text-sm text-ink-3">
            {t("privacy.updated")} {tr(privacyUpdated)}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">{tr(privacyIntro)}</p>

          {privacySections.map((s) => (
            <div key={s.id} id={s.id} className="mt-10 scroll-mt-28">
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{tr(s.title)}</h2>
              {s.body?.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-ink-2">
                  {fill(tr(p))}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-2 marker:text-brand">
                  {s.list.map((item, i) => (
                    <li key={i}>{fill(tr(item))}</li>
                  ))}
                </ul>
              )}
              {s.after?.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-ink-2">
                  {fill(tr(p))}
                </p>
              ))}
            </div>
          ))}

          <div className="mt-12 rounded-3xl border border-line bg-surface p-6 text-ink-2">
            <p className="font-semibold text-ink">{site.name}</p>
            <p className="mt-1 text-sm leading-relaxed">
              {t("privacy.reg")} {site.registration.regNo}
              <br />
              {site.contact.addressLines.join(", ")}
              <br />
              <a href={`mailto:${site.contact.email}`} className="font-medium text-brand-ink underline underline-offset-2">
                {site.contact.email}
              </a>
              {" · "}
              <a href={`tel:${site.contact.phoneHref}`} className="font-medium text-brand-ink underline underline-offset-2">
                {site.contact.phone}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
