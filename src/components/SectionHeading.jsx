import Reveal from "./Reveal";

/* Section title block: a small "kicker" chip, a big heading and an
   optional line underneath. `light` is for the always-dark sections. */
export default function SectionHeading({ kicker, title, sub, align = "center", light = false }) {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";
  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      {kicker && (
        <p
          className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-[0.14em] uppercase ${
            light ? "bg-white/10 text-lime-300" : "bg-brand-soft text-brand-ink"
          }`}
        >
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${light ? "bg-lime-300" : "bg-brand"}`} />
          {kicker}
        </p>
      )}
      <h2
        className={`font-display text-3xl leading-[1.08] font-bold text-balance sm:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/75" : "text-ink-2"}`}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}
