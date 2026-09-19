/* The green banner strip at the top of every inner page. */
export default function PageHeader({ title, sub }) {
  return (
    <header className="relative overflow-hidden bg-oasis-800 pt-14 pb-16 sm:pt-20 sm:pb-24">
      {/* soft decorative shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-oasis-600/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-saffron-500/15 blur-3xl"
      />
      <div className="container-page relative">
        <h1 className="font-display text-4xl leading-tight font-bold text-balance text-white sm:text-5xl">
          {title}
        </h1>
        {sub && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sand-200">{sub}</p>}
      </div>
      {/* curved bottom edge */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-10 w-full text-sand-50"
      >
        <path fill="currentColor" d="M0 60V28c240 26 480 34 720 20s480-26 720-16v28Z" />
      </svg>
    </header>
  );
}
