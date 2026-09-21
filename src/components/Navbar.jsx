import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { announcement } from "../data/banner";
import { site } from "../data/site";
import Icon from "./Icon";
import Logo from "./Logo";

const links = [
  { to: "/", key: "nav.home", end: true },
  { to: "/about", key: "nav.about" },
  { to: "/our-work", key: "nav.work" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/get-involved", key: "nav.involved" },
  { to: "/contact", key: "nav.contact" },
];

const langLabels = { en: { full: "English", short: "EN" }, bn: { full: "বাংলা", short: "বাং" } };

function LanguageToggle({ compact = false, className = "" }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full border border-oasis-200 bg-white/70 p-0.5 ${className}`}
      role="group"
      aria-label={t("lang.label")}
    >
      {["en", "bn"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          aria-label={langLabels[code].full}
          className={`rounded-full text-xs font-semibold transition ${
            compact ? "px-2.5 py-1" : "px-3 py-1"
          } ${
            lang === code
              ? "bg-oasis-600 text-white shadow-sm"
              : "text-oasis-700 hover:bg-oasis-50"
          }`}
        >
          {compact ? langLabels[code].short : langLabels[code].full}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { t, tr } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `relative rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? "text-oasis-700" : "text-oasis-900/70 hover:text-oasis-700"
    }`;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-oasis-700 focus:px-4 focus:py-2 focus:text-white"
      >
        {t("nav.skip")}
      </a>

      {announcement.active && (
        <div className="bg-oasis-800 px-4 py-2 text-center text-sm text-sand-100">
          <span>{tr(announcement.text)}</span>{" "}
          <Link
            to={announcement.to}
            className="font-semibold text-saffron-400 underline underline-offset-4 hover:text-saffron-500"
          >
            {tr(announcement.linkLabel)}
          </Link>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "border-b border-oasis-100 bg-sand-50/90 shadow-sm backdrop-blur"
            : "bg-sand-50"
        }`}
      >
        <nav className="container-page flex h-18 items-center justify-between gap-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={site.name}>
            <Logo className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-bold text-oasis-800 sm:text-lg">
                {site.name}
              </span>
              <span className="block truncate text-xs text-oasis-600">{site.nameBn}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {t(l.key)}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-saffron-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageToggle />
            <Link
              to="/donate"
              className="rounded-full bg-saffron-500 px-5 py-2.5 text-sm font-semibold text-oasis-900 shadow-sm transition hover:bg-saffron-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-oasis-700 focus-visible:ring-offset-2"
            >
              {t("nav.donate")}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <LanguageToggle compact />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? t("nav.close") : t("nav.menu")}
              className="rounded-lg p-2 text-oasis-800 transition hover:bg-oasis-50"
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      {/* `inert` while closed: the off-screen links then stay out of the tab
          order and the accessibility tree, without blocking the slide animation. */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        inert={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-oasis-900/50 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute top-0 right-0 flex h-full w-[82%] max-w-sm flex-col bg-sand-50 shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-oasis-100 px-5 py-4">
            <span className="font-display text-lg font-bold text-oasis-800">{site.name}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.close")}
              className="rounded-lg p-2 text-oasis-800 hover:bg-oasis-50"
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-medium transition ${
                    isActive ? "bg-oasis-50 text-oasis-700" : "text-oasis-900/80 hover:bg-oasis-50"
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
          </div>
          {/* pb-24 lifts these buttons clear of the "Powered by Netlify" badge,
              which Netlify pins to the bottom-right corner above everything */}
          <div className="border-t border-oasis-100 p-4 pb-24">
            <Link
              to="/donate"
              className="block rounded-full bg-saffron-500 px-5 py-3 text-center font-semibold text-oasis-900"
            >
              {t("nav.donate")}
            </Link>
            <a
              href={`https://wa.me/${site.contact.whatsappHref}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-oasis-200 px-5 py-3 text-sm font-medium text-oasis-700"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              {site.contact.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
