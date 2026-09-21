/* Netlify injects a "Powered by Netlify" badge, fixed to the bottom-right
   corner above everything. None of our own controls may sit underneath it.
   Only meaningful on the live site — skipped when the badge is absent.   */
import { strings } from "../../src/i18n/strings.js";
import { openPage } from "./lib.mjs";

export const title = "Netlify badge does not cover our controls";

const SIZES = [
  ["desktop", 1440, 900], ["laptop", 1280, 720], ["tablet", 768, 1024],
  ["phone", 375, 812], ["small phone", 360, 640], ["iPhone SE", 320, 568],
  ["iPhone 14", 390, 844], ["Pixel", 412, 915], ["large phone", 430, 932],
];

/* Our controls whose centre point is covered by the badge. Faded-out,
   click-through controls are skipped: nothing can "cover" them. */
const covered = (page, menuOnly) =>
  page.evaluate((menuOnly) => {
    const frame = document.getElementById("nl-badge-frame");
    if (!frame) return null;
    const targets = [
      ...(menuOnly ? [] : document.querySelectorAll("section[aria-roledescription=carousel] button, button[aria-label]:not([aria-expanded])")),
      ...document.querySelectorAll("[role=dialog] a, [role=dialog] button"),
    ];
    const out = [];
    for (const el of targets) {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (!r.width || r.bottom < 0 || r.top > innerHeight || el.closest("[inert]")) continue;
      if (parseFloat(s.opacity) < 0.05 || s.pointerEvents === "none" || s.visibility === "hidden") continue;
      if (document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === frame) {
        out.push((el.getAttribute("aria-label") || el.textContent).trim().slice(0, 30));
      }
    }
    return out;
  }, menuOnly);

export default async function netlifyBadge({ browser, base, live, report }) {
  if (!live) {
    report.skip("the badge only exists on Netlify (run npm run test:live)");
    return;
  }
  for (const [name, width, height] of SIZES) {
    const phone = width < 768;
    const page = await openPage(browser, base, { viewport: { width, height, isMobile: phone, hasTouch: phone } });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const first = await covered(page, false);
    if (first === null) {
      report.skip(`no Netlify badge present at ${name}`);
      await page.context().close();
      continue;
    }
    const hits = first.map((c) => `on load: ${c}`);
    for (const y of [900, 2500, 1e6]) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(700);
      hits.push(...(await covered(page, false)).map((c) => `scrolled: ${c}`));
    }
    if (width < 1024) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator("header button[aria-expanded]").click();
      await page.waitForTimeout(500);
      hits.push(...(await covered(page, true)).map((c) => `menu open: ${c}`));
      await page.keyboard.press("Escape");
    }
    // and a real click on Back-to-top must work
    await page.evaluate(() => window.scrollTo(0, 1800));
    await page.waitForTimeout(700);
    let backToTop = true;
    try {
      await page.getByRole("button", { name: strings.en["misc.backToTop"] }).click({ timeout: 3000 });
      await page.waitForTimeout(1200);
      backToTop = (await page.evaluate(() => scrollY)) < 5;
    } catch {
      backToTop = false;
    }
    report.check(hits.length === 0 && backToTop, `${name} (${width}×${height}): badge covers none of our buttons`, [...new Set(hits)].join(" | ") + (backToTop ? "" : " | Back-to-top not clickable"));
    await page.context().close();
  }
}
