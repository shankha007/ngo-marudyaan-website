import { Link } from "react-router-dom";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";
import Logo from "./Logo";
import { arrow, btn, size } from "./ui";

const quickLinks = [
  { to: "/about", key: "nav.about" },
  { to: "/past-works", key: "nav.works" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/get-involved", key: "nav.involved" },
  { to: "/request-help", key: "nav.help" },
  { to: "/donate", key: "nav.donate" },
  { to: "/contact", key: "nav.contact" },
];

const footLink = "transition hover:text-lime-300";

export default function Footer() {
  const { t, lang } = useLang();
  const socials = [
    { key: "facebook", url: site.social.facebook, icon: "facebook", label: "Facebook" },
    { key: "instagram", url: site.social.instagram, icon: "instagram", label: "Instagram" },
    { key: "youtube", url: site.social.youtube, icon: "youtube", label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="relative isolate overflow-hidden rounded-4xl bg-night text-white/75 sm:rounded-5xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-oasis-500/30 blur-3xl"
        />

        {/* big call to action */}
        <div className="container-page flex flex-col items-start justify-between gap-8 border-b border-white/10 py-14 sm:py-16 lg:flex-row lg:items-end">
          <h2 className="font-display max-w-2xl text-4xl leading-[1.05] font-bold text-balance text-white sm:text-5xl">
            {t("home.cta.title")}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/donate" className={`${btn.donate} ${size.lg}`}>
              {t("nav.donate")}
              <Icon name="arrowRight" className={arrow} />
            </Link>
            <Link to="/get-involved" className={`${btn.glass} ${size.lg}`}>
              {t("cta.volunteer")}
            </Link>
          </div>
        </div>

        <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Logo className="h-14 w-14 shrink-0" />
              <span className="leading-tight">
                <span className="block font-display text-xl font-bold text-white">{site.name}</span>
                <span className="block text-sm text-lime-300">{lang === "bn" ? site.taglineBn : site.tagline}</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{t("footer.about")}</p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-lime-300 hover:bg-lime-300 hover:text-oasis-900"
                  >
                    <Icon name={s.icon} filled={s.icon === "facebook"} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-[0.14em] text-white/50 uppercase">{t("footer.quick")}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 text-sm lg:grid-cols-1">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={`inline-block py-1.5 ${footLink}`}>
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-xs font-bold tracking-[0.14em] text-white/50 uppercase">{t("footer.contact")}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                <span>{site.contact.addressLines.join(", ")}</span>
              </li>
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                <a href={`tel:${site.contact.phoneHref}`} className={`-my-1.5 py-1.5 ${footLink}`}>
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="whatsapp" className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                <a
                  href={`https://wa.me/${site.contact.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`-my-1.5 py-1.5 ${footLink}`}
                >
                  {site.contact.whatsapp}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-lime-300" />
                <a href={`mailto:${site.contact.email}`} className={`-my-1.5 py-1.5 break-all ${footLink}`}>
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          {/* pb-20 on phones keeps the last line clear of Netlify's corner badge */}
          <div className="container-page flex flex-col gap-2 py-6 pb-20 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
            <p>
              © {new Date().getFullYear()} {site.name} ({site.nameBn}). {t("footer.rights")}
            </p>
            <p>{t("footer.made")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
