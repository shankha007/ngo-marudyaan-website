import Reveal from "./Reveal";

export default function SectionHeading({ kicker, title, sub, align = "center", light = false }) {
  const alignment = align === "left" ? "text-left" : "text-center mx-auto";
  return (
    <Reveal className={`max-w-2xl ${alignment}`}>
      {kicker && (
        <p
          className={`mb-3 text-xs font-semibold tracking-[0.18em] uppercase ${
            light ? "text-saffron-400" : "text-oasis-500"
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`font-display text-3xl leading-tight font-bold text-balance sm:text-4xl ${
          light ? "text-white" : "text-oasis-900"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-sand-200" : "text-oasis-800/75"}`}>
          {sub}
        </p>
      )}
      <span
        className={`mt-6 block h-1 w-16 rounded-full bg-saffron-500 ${
          align === "left" ? "" : "mx-auto"
        }`}
      />
    </Reveal>
  );
}
