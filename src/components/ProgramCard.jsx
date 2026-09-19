import { Link } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

export default function ProgramCard({ program }) {
  const { tr, t } = useLang();
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-oasis-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-oasis-200 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden bg-oasis-100">
        <img
          src={program.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {/* icon badge straddles the image edge — sits outside the clipped image box */}
      <span className="absolute top-[9.25rem] left-5 inline-flex rounded-2xl bg-white p-3 text-oasis-600 shadow-md ring-1 ring-oasis-100">
        <Icon name={program.icon} className="h-6 w-6" />
      </span>
      <div className="flex flex-1 flex-col p-5 pt-8">
        <h3 className="font-display text-xl font-semibold text-oasis-900">{tr(program.title)}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-oasis-800/75">
          {tr(program.summary)}
        </p>
        <Link
          to={`/our-work#${program.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-oasis-600 transition hover:text-oasis-800"
        >
          {t("cta.readMore")}
          <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
