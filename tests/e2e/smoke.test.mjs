/* Every page × every screen size × both languages:
   no crashes, no failed requests, no broken images, nothing wider than the
   screen, no content stuck invisible, one <h1>, correct <html lang>.      */
import { VIEWPORTS, fileExists, openPage, realRoutes, resetErrors, screenshotOnFailure, scrollLikeAUser } from "./lib.mjs";

export const title = "Page sweep (all pages × screen sizes × languages)";

export default async function smoke({ browser, base, quick, report }) {
  const routes = [...realRoutes(), "/this-page-does-not-exist"];
  const viewports = quick ? ["mobile", "desktop"] : Object.keys(VIEWPORTS);
  const langs = quick ? ["en"] : ["en", "bn"];
  const qrExists = fileExists("public", "images", "donate-qr.png");

  for (const lang of langs) {
    for (const vp of viewports) {
      const page = await openPage(browser, base, { lang, viewport: vp });
      const problems = [];
      for (const route of routes) {
        resetErrors(page);
        await page.goto(base + route, { waitUntil: "networkidle" });
        await scrollLikeAUser(page);

        const r = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const insideClipped = (el) => {
            for (let p = el.parentElement; p; p = p.parentElement) {
              const s = getComputedStyle(p);
              if (/(hidden|clip)/.test(s.overflowX + s.overflow)) return true;
            }
            return false;
          };
          const wide = [];
          if (document.documentElement.scrollWidth > vw + 1) {
            for (const el of document.querySelectorAll("body *")) {
              const b = el.getBoundingClientRect();
              if (b.width && b.right > vw + 1 && !insideClipped(el)) wide.push(`<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 50)}">`);
            }
          }
          return {
            overflow: document.documentElement.scrollWidth > vw + 1 ? `${document.documentElement.scrollWidth}px in ${vw}px; ${wide.slice(0, 3).join(" ")}` : "",
            stuck: [...document.querySelectorAll(".reveal")]
              .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99)
              .map((e) => e.textContent.trim().slice(0, 40)),
            brokenImgs: [...document.images]
              .filter((i) => i.complete && i.naturalWidth === 0 && !i.src.includes("donate-qr"))
              .map((i) => i.getAttribute("src")),
            h1: document.querySelectorAll("h1").length,
            lang: document.documentElement.lang,
          };
        });

        const is404Page = route.includes("does-not-exist");
        // expected, not bugs: the 404 page's own status, and the QR image while it hasn't been added
        const expected = (u) => (is404Page && u.startsWith(base + route)) || (!qrExists && u.includes("donate-qr"));
        const http = page.errors.http.filter((h) => !expected(h.url));
        // "Failed to load resource" messages duplicate the request check above (which has the URL)
        const consoleErrs = page.errors.console.filter((m) => !m.startsWith("Failed to load resource"));

        const where = `${route} (${vp}, ${lang})`;
        if (page.errors.page.length) problems.push(`JS error on ${where}: ${page.errors.page[0]}`);
        if (consoleErrs.length) problems.push(`console error on ${where}: ${consoleErrs[0]}`);
        if (http.length) problems.push(`failed request on ${where}: ${http[0].status} ${http[0].url}`);
        if (r.brokenImgs.length) problems.push(`broken image on ${where}: ${r.brokenImgs.join(", ")}`);
        if (r.overflow) problems.push(`page wider than the screen on ${where}: ${r.overflow}`);
        if (r.stuck.length) problems.push(`content stuck invisible on ${where}: "${r.stuck[0]}"`);
        if (r.h1 !== 1) problems.push(`${r.h1} <h1> headings on ${where} (expected 1)`);
        if (r.lang !== lang) problems.push(`<html lang="${r.lang}"> on ${where} (expected "${lang}")`);
        if (problems.length && !page.__shot) {
          page.__shot = await screenshotOnFailure(page, `smoke-${vp}-${lang}${route}`);
        }
      }
      report.check(problems.length === 0, `${routes.length} pages clean at ${vp} (${VIEWPORTS[vp].width}px), ${lang === "en" ? "English" : "Bengali"}`, problems.slice(0, 5).join("\n      "));
      await page.context().close();
    }
  }
}
