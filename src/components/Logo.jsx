/* Placeholder logo mark: a sprout over water — the "oasis" idea.
   TODO: if you have an official logo, save it as public/images/logo.png
   and replace the <svg> below with:
     <img src="/images/logo.png" alt="NGO Marudyaan" className={className} /> */

export default function Logo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="NGO Marudyaan">
      <circle cx="32" cy="32" r="32" fill="var(--color-oasis-700)" />
      <path
        d="M32 47V30"
        stroke="var(--color-saffron-400)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M32 32c0-7 5.6-12.6 12.6-12.6C44.6 26.4 39 32 32 32Z"
        fill="var(--color-oasis-300)"
      />
      <path
        d="M32 36c0-6-4.8-10.8-10.8-10.8C21.2 31.2 26 36 32 36Z"
        fill="var(--color-oasis-400)"
      />
      <path
        d="M14 50c4-3 7-3 11 0s7 3 11 0 7-3 11 0"
        stroke="var(--color-sand-100)"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
