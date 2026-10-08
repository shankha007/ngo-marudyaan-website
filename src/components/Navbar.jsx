import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import { announcement } from "../data/banner";
import { site } from "../data/site";
import useFocusTrap from "../hooks/useFocusTrap";
import useTheme from "../hooks/useTheme";
import Icon from "./Icon";
import Logo from "./Logo";
import { btn, size } from "./ui";

const links = [
  { to: "/", key: "nav.home", end: true },
  { to: "/about", key: "nav.about" },
  { to: "/our-work", key: "nav.work" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/get-involved", key: "nav.involved" },
  { to: "/request-help", key: "nav.help" },
  { to: "/contact", key: "nav.contact" },
];

const langLabels = { en: { full: "English", short: "EN" }, bn: { full: "বাংলা", short: "বাং" } };

function LanguageToggle({ compact = false, className = "" }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full border border-line bg-surface-2 p-0.5 ${className}`}
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
          className={`min-h-8 rounded-full text-xs font-semibold transition ${
            compact ? "px-2 py-1.5 min-[360px]:px-2.5" : "px-3 py-1.5"
          } ${lang === code ? "bg-ink text-canvas shadow-sm" : "text-ink-2 hover:text-ink"}`}
        >
          {compact ? langLabels[code].short : langLabels[code].full}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle({ className = "" }) {
  const { t } = useLang();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("theme.light") : t("theme.dark")}
      title={dark ? t("theme.light") : t("theme.dark")}
      className={`h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition hover:rotate-12 hover:border-line-strong ${className || "inline-flex"}`}
    >
      <Icon name={dark ? "sun" : "moon"} className="h-[18px] w-[18px]" />
    </button>
  );
}

export default function Navbar() {
  const { t, tr } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);

  /* move focus into the open menu, keep Tab inside it, and hand focus back
     to the menu button when it closes */
  useFocusTrap(open, drawerRef);

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
    `rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition ${
      isActive ? "bg-brand-soft text-brand-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
    }`;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        {t("nav.skip")}
      </a>

      {announcement.active && (
        <div className="bg-night px-4 py-2.5 text-center text-sm text-white/85">
          <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-lime-400 px-2 py-0.5 align-middle text-[11px] font-bold tracking-wide text-oasis-900 uppercase">
            <Icon name="sparkle" className="h-3 w-3" filled />
            <span>{t("misc.new")}</span>
          </span>
          <span>{tr(announcement.text)}</span>{" "}
          <Link
            to={announcement.to}
            className="font-semibold text-lime-300 underline decoration-lime-300/40 underline-offset-4 transition hover:decoration-lime-300"
          >
            {tr(announcement.linkLabel)}
          </Link>
        </div>
      )}

      <header className="sticky top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3">
        <nav
          className={`container-page flex h-16 items-center justify-between gap-2 rounded-full border transition-all duration-300 sm:gap-3 ${
            scrolled
              ? "border-line bg-surface/80 shadow-soft backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label={site.name}>
            <Logo className="h-9 w-9 shrink-0 ring-2 ring-line sm:h-10 sm:w-10" />
            <span className="min-w-0 leading-none">
              <span className="block truncate font-display text-[15px] font-bold tracking-tight text-ink min-[360px]:text-base sm:text-lg">
                {site.name}
              </span>
              <span className="mt-0.5 block truncate text-[11px] font-medium text-ink-3">{site.nameBn}</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 xl:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
                {t(l.key)}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <ThemeToggle />
            <LanguageToggle />
            <Link to="/donate" className={`${btn.donate} ${size.sm} px-5`}>
              <Icon name="heart" className="h-4 w-4" filled />
              {t("nav.donate")}
            </Link>
          </div>

          {/* on phones the theme switch lives in the menu, leaving room for the name */}
          <div className="flex shrink-0 items-center gap-1 min-[360px]:gap-1.5 xl:hidden">
            <ThemeToggle className="hidden sm:inline-flex" />
            <LanguageToggle compact />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? t("nav.close") : t("nav.menu")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-canvas transition hover:opacity-90"
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      {/* `inert` while closed: the off-screen links then stay out of the tab
          order and the accessibility tree, without blocking the slide animation. */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? "" : "pointer-events-none"}`}
        inert={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-night/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu")}
          className={`absolute top-0 right-0 flex h-full w-[86%] max-w-sm flex-col overflow-hidden rounded-l-4xl bg-canvas transition-transform duration-500 ease-out-expo ${
            /* shadow only while open: when closed, the drawer sits just past
               the right edge and its shadow would show as a grey strip */
            open ? "translate-x-0 shadow-2xl" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <span className="font-display text-lg font-bold text-ink">{site.name}</span>
            <span className="ml-auto mr-2 sm:hidden">
              <ThemeToggle className="inline-flex" />
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("nav.close")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface-2"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {links.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `group flex items-baseline gap-3 rounded-2xl px-4 py-3 font-display text-2xl font-semibold tracking-tight transition ${
                    isActive ? "bg-brand-soft text-brand-ink" : "text-ink hover:bg-surface-2"
                  }`
                }
              >
                <span aria-hidden="true" className="font-sans text-xs font-semibold text-ink-3 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(l.key)}
              </NavLink>
            ))}
          </div>
          {/* pb-24 lifts these buttons clear of the "Powered by Netlify" badge,
              which Netlify pins to the bottom-right corner above everything */}
          <div className="border-t border-line p-4 pb-24">
            <Link to="/donate" className={`${btn.donate} ${size.lg} w-full`}>
              <Icon name="heart" className="h-4 w-4" filled />
              {t("nav.donate")}
            </Link>
            <a
              href={`https://wa.me/${site.contact.whatsappHref}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.outline} ${size.md} mt-3 w-full`}
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
