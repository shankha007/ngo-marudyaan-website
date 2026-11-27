/* ===================================================================
   PAGE TITLES & DESCRIPTIONS  —  what search engines and link
   previews (WhatsApp, Facebook) show for each page.
   -------------------------------------------------------------------
   Used twice:
   - in the browser, by each page (src/hooks/usePageMeta.js), so the
     title follows the chosen language;
   - at build time, by scripts/seo.mjs, which writes a copy of the page
     shell per page with these tags already in it (in English). Search
     engines and link previews read that copy before any JavaScript runs.
   When you add a page, add it here as well as in src/App.jsx,
   public/_redirects and public/sitemap.xml.
=================================================================== */
import { site } from "./site.js";

export const pages = {
  "/": {
    description:
      "NGO Marudyaan is a group of volunteers in Kolkata. We help children stay in school, bring new clothes to kids at festival time and hand out blankets in winter.",
  },
  "/about": {
    titleKey: "about.title",
    description:
      "Who NGO Marudyaan is and what it does: its mission, values and programmes in education for children, festivals for everyone and winter relief, plus its team and registration details.",
  },
  "/past-works": {
    titleKey: "works.title",
    description:
      "Every drive NGO Marudyaan has run since its first winter project in December 2017: relief, education, festival and winter drives across Kolkata and West Bengal.",
  },
  "/gallery": {
    titleKey: "gallery.title",
    description:
      "Photo albums from NGO Marudyaan's projects, year by year: cyclone relief in the Sundarbans, a micro library for children, Puja gifts and more.",
  },
  "/get-involved": {
    titleKey: "involved.title",
    description: "Volunteer, donate goods, lend a skill or partner with NGO Marudyaan in Kolkata.",
  },
  "/request-help": {
    titleKey: "help.title",
    description:
      "Ask NGO Marudyaan for help with schooling, Durga Puja clothes or winter blankets in Kolkata and West Bengal.",
  },
  "/donate": {
    titleKey: "donate.title",
    description:
      "Donate to NGO Marudyaan by UPI QR code or bank transfer. We confirm every donation, then send photos and a list of what was spent.",
  },
  "/contact": {
    titleKey: "contact.title",
    description: `Contact NGO Marudyaan, Kolkata — ${site.contact.phone}, ${site.contact.email}.`,
  },
  "/privacy": {
    titleKey: "privacy.title",
    description:
      "How NGO Marudyaan collects, uses and protects the personal information you share through this website.",
  },
};

/* The page's <title>. `t` turns a strings.js key into the current language. */
export function pageTitle(path, t) {
  const { titleKey } = pages[path];
  return titleKey ? `${t(titleKey)} — ${site.name}` : `${site.name} — ${site.tagline} | Kolkata`;
}

/* Title and description for one page, ready for usePageMeta. */
export const pageMeta = (path, t) => [pageTitle(path, t), pages[path].description];
