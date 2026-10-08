/* Shared class names, so every button, card and form field on the site
   looks and behaves the same. Colours come from the tokens in index.css
   and switch automatically between light and dark mode. */

const btnBase =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out active:scale-[0.97] disabled:cursor-wait disabled:opacity-70";

export const btn = {
  /* main action on the page */
  primary: `${btnBase} bg-brand text-on-brand shadow-soft hover:bg-brand-hover`,
  /* giving money: always warm saffron */
  donate: `${btnBase} bg-saffron-500 text-oasis-900 shadow-[0_10px_30px_-10px_rgb(255_178_30/0.7)] hover:bg-saffron-400`,
  /* secondary, on the page background */
  outline: `${btnBase} border border-line-strong bg-surface text-ink hover:border-ink`,
  /* on photos and the always-dark sections */
  lime: `${btnBase} bg-lime-400 text-oasis-900 hover:bg-lime-300`,
  glass: `${btnBase} border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20`,
};

export const size = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/* small arrow that nudges right when its button is hovered */
export const arrow = "h-4 w-4 transition-transform duration-200 group-hover:translate-x-1";

export const card = "rounded-3xl border border-line bg-surface shadow-soft";
export const cardHover = "transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lift";

/* rounded icon tile */
export const iconTile = "inline-flex shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink";

export const field =
  "w-full rounded-2xl border border-line-strong bg-surface px-4 py-3 text-ink placeholder:text-ink-3 transition focus:border-brand focus:ring-4 focus:ring-brand/15 focus:outline-none focus-visible:outline-none aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/15";
export const fieldLabel = "mb-1.5 block text-sm font-semibold text-ink";

/* small rounded label, e.g. a year or category */
export const pill = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold";
