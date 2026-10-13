import { Link } from "react-router-dom";
import { programs } from "../data/content";
import { findProject } from "../data/gallery";
import { formatWorkDate } from "../data/pastWorks";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";
import Photo from "./Photo";
import { arrow } from "./ui";

/* The work's photo: its album's cover, or — until photos are added —
   a tile with its programme's icon. */
function WorkPicture({ work, sizes, className }) {
  const { tr } = useLang();
  const album = findProject(work.project);
  const program = programs.find((p) => p.id === work.category);
  if (album) return <Photo src={album.coverSrc} sizes={sizes} className={`${className} object-cover`} />;
  return (
    <div className={`${className} relative isolate flex flex-col items-center justify-center gap-3 bg-brand-soft text-brand-ink`}>
      <div aria-hidden="true" className="bg-dots absolute inset-0 -z-10 opacity-30" />
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-lime-400 text-oasis-900 shadow-soft">
        <Icon name={program?.icon ?? "sprout"} className="h-8 w-8" />
      </span>
      {program && <span className="text-sm font-semibold">{tr(program.title)}</span>}
    </div>
  );
}

/* date · place line */
function WorkMeta({ work }) {
  const { tr, lang } = useLang();
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2">
      <span className="inline-flex items-center gap-1.5 font-semibold text-brand-ink">
        <Icon name="clock" className="h-4 w-4" />
        <time dateTime={work.date}>{formatWorkDate(work.date, lang)}</time>
      </span>
      {work.place && (
        <span className="inline-flex items-center gap-1.5">
          <Icon name="pin" className="h-4 w-4" />
          {tr(work.place)}
        </span>
      )}
    </p>
  );
}

/* A past work in full, on the Past Works page. */
export default function WorkCard({ work }) {
  const { tr, t, lang } = useLang();
  const album = findProject(work.project);
  const program = programs.find((p) => p.id === work.category);
  return (
    <article
      id={work.id}
      className="grid scroll-mt-36 overflow-hidden rounded-4xl border border-line bg-surface shadow-soft sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
    >
      {album ? (
        <WorkPicture
          work={work}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 40vw, 100vw"
          className="aspect-[16/10] w-full sm:aspect-auto sm:h-full sm:min-h-64"
        />
      ) : (
        /* no photos yet: on phones a big icon tile would only push the text
           down, so the programme shows as a small label instead */
        <div className="hidden sm:block">
          <WorkPicture work={work} className="h-full min-h-64 w-full" />
        </div>
      )}
      <div className="p-6 sm:p-8">
        {!album && program && (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink sm:hidden">
            <Icon name={program.icon} className="h-3.5 w-3.5" />
            <span>{tr(program.title)}</span>
          </span>
        )}
        <WorkMeta work={work} />
        <h3 className="font-display mt-3 text-2xl font-bold text-ink sm:text-3xl">{tr(work.title)}</h3>
        <p className="mt-3 leading-relaxed text-ink-2">{tr(work.summary)}</p>
        {work.highlights?.length > 0 && (
          <ul className="mt-5 space-y-3">
            {work.highlights.map((h) => (
              <li key={h.date + h.en} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center self-start rounded-full bg-brand text-on-brand">
                  <Icon name="check" className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed text-ink-2">
                  <time dateTime={h.date} className="font-semibold text-ink">
                    {formatWorkDate(h.date, lang)}:
                  </time>{" "}
                  {tr(h)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {album && (
          <Link
            to={`/gallery#${album.id}`}
            className="group mt-5 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-brand-ink transition hover:text-ink"
          >
            {t("gallery.viewProject")}
            <Icon name="arrowRight" className={arrow} />
          </Link>
        )}
      </div>
    </article>
  );
}
