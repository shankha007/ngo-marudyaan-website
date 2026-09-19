import { Link } from "react-router-dom";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";
import Logo from "./Logo";

const quickLinks = [
  { to: "/about", key: "nav.about" },
  { to: "/our-work", key: "nav.work" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/get-involved", key: "nav.involved" },
  { to: "/donate", key: "nav.donate" },
  { to: "/contact", key: "nav.contact" },
];

export default function Footer() {
  const { t } = useLang();
  const socials = [
    { key: "facebook", url: site.social.facebook, icon: "facebook", label: "Facebook" },
    { key: "instagram", url: site.social.instagram, icon: "instagram", label: "Instagram" },
    { key: "youtube", url: site.social.youtube, icon: "youtube", label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-oasis-900 text-sand-200">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-white">{site.name}</span>
              <span className="block text-xs text-oasis-200">{site.nameBn}</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sand-200/75">{t("footer.about")}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="rounded-full border border-white/15 p-2.5 text-sand-100 transition hover:border-saffron-500 hover:text-saffron-400"
                >
                  <Icon name={s.icon} filled={s.icon === "facebook"} className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">{t("footer.quick")}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sand-200/75 transition hover:text-saffron-400">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-sand-200/75">
            <li className="flex gap-3">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <span>{site.contact.addressLines.join(", ")}</span>
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <a href={`tel:${site.contact.phoneHref}`} className="hover:text-saffron-400">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <a
                href={`https://wa.me/${site.contact.whatsappHref}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-saffron-400"
              >
                {site.contact.whatsapp}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-saffron-400" />
              <a href={`mailto:${site.contact.email}`} className="break-all hover:text-saffron-400">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base font-semibold text-white">{t("cta.donate")}</h3>
          <p className="mt-4 text-sm leading-relaxed text-sand-200/75">{t("home.cta.body")}</p>
          <Link
            to="/donate"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-oasis-900 transition hover:bg-saffron-400"
          >
            {t("nav.donate")}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-sand-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} ({site.nameBn}). {t("footer.rights")}
          </p>
          <p>{t("footer.made")}</p>
        </div>
      </div>
    </footer>
  );
}
