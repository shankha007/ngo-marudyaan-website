/* Search-engine details for index.html, from src/data/site.js.

   - Every "__SITE_URL__" in index.html becomes site.url (https://marudyaan.com)
     and every "__SITE_TAGLINE__" becomes site.tagline, so each is written in
     one place only.
   - Adds the organisation's details as JSON-LD (schema.org) — what Google
     uses for the site name and the knowledge panel beside search results.
     It is plain data, not a script that runs, so the Content-Security-Policy
     does not need its hash.

   public/robots.txt and public/sitemap.xml are static files and spell the
   domain out; the navigation test checks they match site.url. */
import { site } from "../src/data/site.js";

const description =
  "NGO Marudyaan (মরুদ্যান) is a volunteer-run organisation in Kolkata working on food, education, health camps, winter relief and women's livelihood.";

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

export function seoPlugin() {
  return {
    name: "seo",
    transformIndexHtml(html) {
      // "<" is escaped so no value can ever close the <script> tag early
      const json = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
      return html
        .replaceAll("__SITE_URL__", site.url)
        .replaceAll("__SITE_TAGLINE__", site.tagline)
        .replace("</head>", `  <script type="application/ld+json">${json}</script>\n  </head>`);
    },
  };
}
