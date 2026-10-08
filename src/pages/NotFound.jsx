import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { btn, size } from "../components/ui";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function NotFound() {
  const { t } = useLang();
  usePageMeta(`404 — ${site.name}`);

  return (
    <section className="container-page flex min-h-[66vh] flex-col items-center justify-center py-20 text-center">
      <p
        aria-hidden="true"
        className="font-display bg-gradient-to-br from-brand to-lime-500 bg-clip-text text-[8rem] leading-none font-bold tracking-tighter text-transparent sm:text-[11rem]"
      >
        404
      </p>
      <h1 className="font-display mt-4 text-3xl font-bold text-ink sm:text-4xl">{t("nf.title")}</h1>
      <p className="mt-3 max-w-md text-ink-2">{t("nf.body")}</p>
      <Link to="/" className={`mt-8 ${btn.primary} ${size.lg}`}>
        <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
        {t("cta.back")}
      </Link>
    </section>
  );
}
