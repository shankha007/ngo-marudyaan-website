/* Small inline icon set — no icon library needed.
   Usage: <Icon name="heart" className="h-5 w-5" /> */

const paths = {
  bowl: (
    <>
      <path d="M3 11h18a9 9 0 0 1-9 9 9 9 0 0 1-9-9Z" />
      <path d="M8 7c0-1.5 1-2 1-3M12 7c0-1.5 1-2 1-3M16 7c0-1.5 1-2 1-3" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />
    </>
  ),
  heart: <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" />,
  blanket: (
    <>
      <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
      <path d="M8 4v12M12 4v12M16 4v12" />
    </>
  ),
  gift: (
    <>
      <path d="M3 10h18v3H3zM5 13h14v7H5zM12 10v10" />
      <path d="M12 10s-1-4-3.5-4S6 9 8 10M12 10s1-4 3.5-4S18 9 16 10" />
    </>
  ),
  hands: (
    <>
      <path d="M8 13V6a1.5 1.5 0 0 1 3 0v6M11 12V5a1.5 1.5 0 0 1 3 0v7" />
      <path d="M14 12V7a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6H9a5 5 0 0 1-4-2l-2-3 1.6-1.2a2 2 0 0 1 2.6.3L8 16" />
    </>
  ),
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4l-4.3 1.3 1.3-4.2A8.5 8.5 0 1 1 20.5 11.8Z" />
      <path d="M9.1 8.5c.35-.07.7.11.83.44l.6 1.5c.1.26.04.56-.16.76l-.6.6a5.7 5.7 0 0 0 2.4 2.4l.6-.6c.2-.2.5-.26.76-.16l1.5.6c.33.13.51.48.44.83-.2.94-1.06 1.6-2.02 1.5a7.5 7.5 0 0 1-6.35-6.35c-.1-.96.56-1.82 1.5-2.02Z" />
    </>
  ),
  facebook: (
    <path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14a3.5 3.5 0 0 0-3.5 3.5v2H8.5V12h2v9H14v-9h2.2l.5-3.5Z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5Z" />
    </>
  ),
  arrowRight: <path d="M5 12h13m-5-6 6 6-6 6" />,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  check: <path d="m5 13 4 4 10-10" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a1 1 0 0 1 1-1h9" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  chevronLeft: <path d="m14 6-6 6 6 6" />,
  chevronRight: <path d="m10 6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  quote: (
    <path d="M9 7c-2.8 0-4.5 2-4.5 4.5S6 16 8 16c-.3 1.4-1.4 2.4-3 3 4 0 7-3.4 7-8.2C12 8.3 10.8 7 9 7Zm9 0c-2.8 0-4.5 2-4.5 4.5S15 16 17 16c-.3 1.4-1.4 2.4-3 3 4 0 7-3.4 7-8.2C21 8.3 19.8 7 18 7Z" />
  ),
  sprout: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
      <path d="M12 16c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4.3 3 7.7 7 9 4-1.3 7-4.7 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6M17 14.4a6 6 0 0 1 4 5.6" />
    </>
  ),
};

export default function Icon({ name, className = "h-6 w-6", filled = false, ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {d}
    </svg>
  );
}
