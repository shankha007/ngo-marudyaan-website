import { Link } from "react-router-dom";
import { programImage } from "../data/gallery";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";
import Photo from "./Photo";

/* One programme as a photo card. The whole card is a link (via the
   stretched "Read more" link), so it is easy to tap on a phone.
   `feature`: the larger card at the start of the home page grid. */
export default function ProgramCard({ program, feature = false }) {
  const { tr, t } = useLang();
  return (
    <article
      className={`group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-4xl bg-night text-white ${
        feature ? "min-h-96 sm:min-h-[28rem]" : "min-h-80"
      }`}
    >
      <Photo
        src={programImage(program)}
        sizes={
          feature
            ? "(min-width: 1280px) 820px, (min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
            : "(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        }
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-night/0"
      />

      <span className="absolute top-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400 text-oasis-900 shadow-lg">
        <Icon name={program.icon} className="h-5 w-5" />
      </span>
      <span
        aria-hidden="true"
        className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-oasis-900"
      >
        <Icon name="arrowUpRight" className="h-4 w-4" />
      </span>

      <div className="p-6">
        <h3 className={`font-display font-bold ${feature ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
          {tr(program.title)}
        </h3>
        <p className={`mt-2 leading-relaxed text-white/80 ${feature ? "max-w-xl" : "text-sm"}`}>
          {tr(program.summary)}
        </p>
        <Link
          to={`/our-work#${program.id}`}
          className="mt-3 -mb-2 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-lime-300 after:absolute after:inset-0 after:content-['']"
        >
          {t("cta.readMore")}
          <Icon name="arrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
