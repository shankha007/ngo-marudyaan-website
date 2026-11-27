/* Search-engine details for index.html, from src/data/site.js.

   - Every "__SITE_URL__" in index.html becomes site.url (https://marudyaan.com)
     and every "__SITE_TAGLINE__" becomes site.tagline, so each is written in
     one place only.
   - Adds the organisation's details as JSON-LD (schema.org) — what Google
     uses for the site name and the knowledge panel beside search results.
     It is plain data, not a script that runs, so the Content-Security-Policy
     does not need its hash.

   - Fills each page's title, description, canonical link and link-preview
     tags (the "__PAGE_…__" placeholders) from src/data/pages.js, and at
     build time writes one HTML file per page (about.html, donate.html, …)
     plus 404.html. Netlify and Vercel serve each page its own file.

   public/robots.txt and public/sitemap.xml are static files and spell the
   domain out; the navigation test checks they match site.url. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pageTitle, pages } from "../src/data/pages.js";
import { site } from "../src/data/site.js";
import { strings } from "../src/i18n/strings.js";

const description =
  "NGO Marudyaan (মরুদ্যান) is a volunteer-run organisation in Kolkata working on education for children who cannot afford it, festivals for everyone and winter relief.";

export function structuredData() {
  const url = `${site.url}/`;
  const org = {
    "@type": "NGO",
    "@id": `${url}#organization`,
    name: site.name,
    alternateName: [site.nameBn, "Marudyaan"],
    url,
    logo: `${site.url}/images/logo.png`,
    image: `${site.url}/images/og-image.jpg`,
    description,
    slogan: site.tagline,
    foundingDate: "2017-08-24",
    email: site.contact.email,
    telephone: site.contact.phoneHref,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700056",
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Kolkata" },
      { "@type": "State", name: "West Bengal" },
    ],
    sameAs: Object.values(site.social).filter(Boolean),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name: site.name,
    alternateName: [site.nameBn, "Marudyaan"],
    inLanguage: ["en-IN", "bn-IN"],
    publisher: { "@id": `${url}#organization` },
  };
  return { "@context": "https://schema.org", "@graph": [org, website] };
}

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const englishTitle = (path) => pageTitle(path, (key) => strings.en[key]);

/* Fills index.html's __PAGE_*__ placeholders for one page. With
   notFound, the copy is for unknown addresses instead: no canonical link
   or og:url (an unknown address has none) and "noindex". */
export function withPageMeta(html, path, { notFound = false } = {}) {
  const title = notFound ? `404 — ${site.name}` : englishTitle(path);
  const url = site.url + path;
  let out = html
    .replaceAll("__PAGE_TITLE__", escapeHtml(title))
    .replaceAll("__PAGE_DESCRIPTION__", escapeHtml(pages[path].description))
    .replaceAll("__PAGE_URL__", escapeHtml(url));
  if (notFound) {
    out = out
      .replace(/\s*<link rel="canonical"[^>]*>/, "")
      .replace(/\s*<meta property="og:url"[^>]*>/, "")
      .replace(/(<meta name="robots" content=")[^"]*"/, '$1noindex, follow"');
  }
  if (/__PAGE_[A-Z]+__/.test(out)) throw new Error(`seo: a __PAGE_…__ placeholder in index.html was not filled for ${path}`);
  return out;
}

/* The file each page is served from (see public/_redirects). */
export const pageFile = (path) => (path === "/" ? "index.html" : `${path.slice(1)}.html`);

export function seoPlugin() {
  let command = "serve";
  return {
    name: "seo",
    configResolved(config) {
      command = config.command;
    },
    transformIndexHtml(html) {
      // "<" is escaped so no value can ever close the <script> tag early
      const json = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
      html = html
        .replaceAll("__SITE_URL__", site.url)
        .replaceAll("__SITE_TAGLINE__", site.tagline)
        .replace("</head>", `  <script type="application/ld+json">${json}</script>\n  </head>`);
      // `npm run dev` has one page shell for every address; the build fills
      // in each page's own copy below, once Vite has finished index.html
      return command === "build" ? html : withPageMeta(html, "/");
    },
    /* Build: write one copy of the finished page shell per page, each with
       its own title, description, canonical link and link-preview tags, so
       search engines and WhatsApp / Facebook previews see the right page
       without running any JavaScript. Plus 404.html for unknown addresses. */
    writeBundle({ dir }) {
      const shell = readFileSync(join(dir, "index.html"), "utf8");
      for (const path of Object.keys(pages)) {
        writeFileSync(join(dir, pageFile(path)), withPageMeta(shell, path));
      }
      writeFileSync(join(dir, "404.html"), withPageMeta(shell, "/", { notFound: true }));
    },
  };
}
