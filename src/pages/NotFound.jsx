import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function NotFound() {
  const { t } = useLang();
  usePageMeta(`404 — ${site.name}`);

  return (
    <section className="container-page flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <Logo className="h-16 w-16" />
      <p className="font-display mt-8 text-6xl font-bold text-oasis-200">404</p>
      <h1 className="font-display mt-3 text-3xl font-bold text-oasis-900">{t("nf.title")}</h1>
      <p className="mt-3 max-w-md text-oasis-800/70">{t("nf.body")}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-oasis-700 px-7 py-3.5 font-semibold text-white transition hover:bg-oasis-600"
      >
        <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
        {t("cta.back")}
      </Link>
    </section>
  );
}
