import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

/* The banner at the top of every inner page: a dark rounded panel with
   soft glows, a small "kicker" label and the page title. */
export default function PageHeader({ title, sub, kicker }) {
  const { lang } = useLang();
  return (
    <div className="px-2 pt-2 sm:px-3 sm:pt-3">
      <header className="relative isolate overflow-hidden rounded-4xl bg-night pt-16 pb-14 sm:rounded-5xl sm:pt-24 sm:pb-20">
        {/* soft decorative glows + dotted texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-20 -z-10 h-96 w-96 rounded-full bg-oasis-500/45 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-96 w-96 rounded-full bg-lime-400/20 blur-3xl"
        />
        <div aria-hidden="true" className="bg-dots pointer-events-none absolute inset-0 -z-10 text-white opacity-40" />

        <div className="container-page relative">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-lime-300 uppercase backdrop-blur">
            <Icon name="sparkle" filled className="h-3.5 w-3.5" />
            {kicker || (lang === "bn" ? site.nameBn : site.name)}
          </p>
          <h1 className="font-display max-w-4xl text-4xl leading-[1.05] font-bold text-balance text-white sm:text-6xl">
            {title}
          </h1>
          {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{sub}</p>}
        </div>
      </header>
    </div>
  );
}
