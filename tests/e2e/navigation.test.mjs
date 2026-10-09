/* Routing, navigation, language switching, links with #fragments,
   search-engine tags, header layout, and (on Netlify) HTTP status codes.                    */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { programs } from "../../src/data/content.js";
import { site } from "../../src/data/site.js";
import { strings } from "../../src/i18n/strings.js";
import { ROOT, appRoutes, openPage, realRoutes, sitemapRoutes } from "./lib.mjs";

export const title = "Navigation & routing";

export default async function navigation({ browser, base, live, report }) {
  /* ---- every page in App.jsx is listed in public/_redirects (and vice versa) ---- */
  const inApp = appRoutes();
  const inRedirects = realRoutes();
  const missing = inApp.filter((p) => !inRedirects.includes(p));
  const extra = inRedirects.filter((p) => !inApp.includes(p));
  report.check(
    missing.length === 0 && extra.length === 0,
    `public/_redirects lists exactly the ${inApp.length} pages in src/App.jsx`,
    `${missing.length ? `add to _redirects: ${missing.join(", ")} (they would return 404 on Netlify). ` : ""}${extra.length ? `in _redirects but not in App.jsx: ${extra.join(", ")}` : ""}`,
  );

  /* ---- public/sitemap.xml lists the same pages, so search engines find them all ---- */
  const inSitemap = sitemapRoutes();
  const notMapped = inApp.filter((p) => !inSitemap.includes(p));
  const notPages = inSitemap.filter((p) => !inApp.includes(p));
  report.check(
    notMapped.length === 0 && notPages.length === 0,
    `public/sitemap.xml lists exactly the ${inApp.length} pages in src/App.jsx`,
    `${notMapped.length ? `add to sitemap.xml: ${notMapped.join(", ")}. ` : ""}${notPages.length ? `in sitemap.xml but not a page: ${notPages.join(", ")}` : ""}`,
  );

  /* ---- robots.txt and sitemap.xml point at the site's own domain (site.url) ---- */
  {
    const sitemap = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");
    const robots = readFileSync(join(ROOT, "public", "robots.txt"), "utf8");
    const foreign = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !u.startsWith(site.url + "/"));
    const robotsOk = robots.includes(`Sitemap: ${site.url}/sitemap.xml`);
    report.check(
      foreign.length === 0 && robotsOk,
      `sitemap.xml and robots.txt use ${site.url}`,
      `${foreign.length ? `sitemap.xml has: ${foreign.slice(0, 3).join(", ")}. ` : ""}${robotsOk ? "" : `robots.txt needs "Sitemap: ${site.url}/sitemap.xml"`}`,
    );
  }

  /* ---- every page names its own canonical address; the 404 page asks not to be indexed ---- */
  {
    const page = await openPage(browser, base);
    const wrong = [];
    for (const path of [...inRedirects, "/about/", "/gallery?utm_source=facebook"]) {
      await page.goto(base + path, { waitUntil: "networkidle" });
      const want = site.url + path.split("?")[0].replace(/(.)\/$/, "$1"); // no query, no trailing slash
      const r = await page.evaluate(() => ({
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        og: document.querySelector('meta[property="og:url"]')?.content,
        robots: document.querySelector('meta[name="robots"]')?.content,
      }));
      if (r.canonical !== want || r.og !== want || /noindex/.test(r.robots)) wrong.push(`${path}: canonical ${r.canonical}, og:url ${r.og}, robots ${r.robots}`);
    }
    await page.goto(base + "/no-such-page", { waitUntil: "networkidle" });
    const nf = await page.evaluate(() => ({
      canonical: !!document.querySelector('link[rel="canonical"]'),
      robots: document.querySelector('meta[name="robots"]')?.content,
    }));
    if (nf.canonical || !/noindex/.test(nf.robots)) wrong.push(`/no-such-page: canonical ${nf.canonical}, robots ${nf.robots}`);
    report.check(wrong.length === 0, `each page's canonical link and og:url are its ${site.url} address; 404 is noindex`, wrong.join("; "));

    /* the organisation's JSON-LD is valid JSON with the right address */
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const ld = await page.evaluate(() => {
      try {
        return JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || "null");
      } catch {
        return "invalid";
      }
    });
    const org = ld?.["@graph"]?.find((n) => n["@type"] === "NGO");
    report.check(org?.url === site.url + "/" && org?.name === site.name, "structured data (JSON-LD) describes the NGO at site.url", JSON.stringify(ld)?.slice(0, 120));
    await page.context().close();
  }

  /* ---- header links go to the right page, starting at the top ---- */
  {
    const page = await openPage(browser, base);
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const wrong = [];
    for (const path of [...inRedirects.filter((p) => p !== "/" && p !== "/donate"), "/"]) {
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.locator(`header nav a[href="${path}"]`).first().click();
      await page.waitForTimeout(350);
      const now = await page.evaluate(() => ({ path: location.pathname, y: Math.round(scrollY) }));
      if (now.path !== path || now.y > 5) wrong.push(`${path} → ${now.path} (scrolled ${now.y}px)`);
    }
    await page.locator('header a[href="/donate"]').first().click();
    await page.waitForTimeout(350);
    if (new URL(page.url()).pathname !== "/donate") wrong.push("Donate button");
    report.check(wrong.length === 0, "header links open the right page, scrolled to the top", wrong.join(", "));

    /* ---- language choice ---- */
    await page.locator("header").getByRole("button", { name: "বাংলা" }).first().click();
    await page.waitForTimeout(200);
    await page.reload({ waitUntil: "networkidle" });
    const after = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      about: document.querySelector('header nav a[href="/about"]').textContent.trim(),
    }));
    report.check(after.lang === "bn" && after.about === strings.bn["nav.about"], "Bengali choice is remembered after a reload", JSON.stringify(after));
    await page.context().close();
  }

  /* ---- links with #fragments: never crash, real sections still scroll ---- */
  {
    const crashes = [];
    for (const path of ["/#123", "/about#2019", "/gallery#a=b", "/#/", "/#%E0%A6", "/contact#"]) {
      const page = await openPage(browser, base);
      await page.goto(base + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const h1 = await page.locator("h1").first().innerText().catch(() => "");
      if (page.errors.page.length || !h1 || /Something went wrong/.test(h1)) crashes.push(`${path}: ${page.errors.page[0] || h1 || "blank page"}`);
      await page.context().close();
    }
    report.check(crashes.length === 0, "links with unusual #fragments (e.g. /about#2019) do not crash", crashes.join("; "));

    const page = await openPage(browser, base);
    const target = programs[programs.length - 1].id;
    await page.goto(`${base}/our-work#${target}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    const top1 = await page.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), target);
    report.check(top1 >= -20 && top1 <= 200, `/our-work#${target} lands on that programme`, `section top at ${top1}px`);

    await page.goto(base + "/", { waitUntil: "networkidle" });
    const second = programs[1].id;
    await page.locator(`a[href="/our-work#${second}"]`).click();
    await page.waitForTimeout(1600);
    const top2 = await page.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top), second);
    const headerBottom = await page.evaluate(() => Math.round(document.querySelector("header").getBoundingClientRect().bottom));
    report.check(top2 >= headerBottom - 2 && top2 <= 200, `Home "Read more" scrolls to #${second}, clear of the sticky header`, `section top ${top2}px, header bottom ${headerBottom}px`);
    await page.context().close();
  }

  /* ---- header fits at tight desktop widths (the full link row starts at 1280px;
          narrower screens use the menu button) ---- */
  {
    const bad = [];
    for (const lang of ["en", "bn"]) {
      for (const w of [1280, 1366, 1440]) {
        const page = await openPage(browser, base, { lang, viewport: { width: w, height: 800 } });
        await page.goto(base + "/", { waitUntil: "networkidle" });
        const r = await page.evaluate(() => {
          const nav = document.querySelector("header nav");
          const boxes = [...nav.children].filter((c) => getComputedStyle(c).display !== "none").map((k) => k.getBoundingClientRect());
          const overlap = boxes.some((b, i) => i > 0 && b.left < boxes[i - 1].right - 1);
          const wrapped = [...nav.querySelectorAll("a")].filter((a) => a.offsetParent && a.getBoundingClientRect().height > 44).map((a) => a.textContent.trim());
          return { overlap, wrapped, fits: nav.scrollWidth <= nav.clientWidth + 1 };
        });
        if (r.overlap || r.wrapped.length || !r.fits) bad.push(`${w}px ${lang}: overlap=${r.overlap} wrapped=${r.wrapped.join("/")}`);
        await page.context().close();
      }
    }
    report.check(bad.length === 0, "header fits on one line from 1280px up, both languages", bad.join("; "));
  }

  /* ---- HTTP status codes (the 404 rule lives in public/_redirects, so Netlify only) ---- */
  if (!live) {
    report.skip("HTTP status codes — only meaningful on Netlify (run npm run test:live)");
    return;
  }
  const expect = Object.fromEntries(inRedirects.map((p) => [p, 200]));
  Object.assign(expect, {
    "/about/": 200,
    "/gallery?utm_source=facebook": 200,
    "/favicon.png": 200,
    "/robots.txt": 200,
    "/sitemap.xml": 200,
    "/images/og-image.jpg": 200,
    "/no-such-page": 404,
    "/about/team": 404,
    "/images/no-such-image.png": 404,
  });
  const wrong = [];
  for (const [path, want] of Object.entries(expect)) {
    const res = await fetch(base + path, { redirect: "manual" });
    if (res.status !== want) wrong.push(`${path} → ${res.status} (want ${want})`);
  }
  report.check(wrong.length === 0, `HTTP status correct for ${Object.keys(expect).length} URLs (real pages 200, unknown 404)`, wrong.join(", "));
  const page = await openPage(browser, base);
  const res = await page.goto(base + "/no-such-page", { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").innerText();
  report.check(res.status() === 404 && h1 === strings.en["nf.title"], `unknown URL returns 404 and shows "${strings.en["nf.title"]}"`, `status ${res.status()}, h1 "${h1}"`);
  await page.context().close();
}
