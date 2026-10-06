/* Shared helpers for the end-to-end tests.
   Tests read expected values from the site's own data files (src/data,
   src/i18n), so they keep passing when you replace the placeholder content. */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { listProjectPhotos } from "../../scripts/project-photos.mjs";
import { buildGallery, projects } from "../../src/data/projects.js";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const OUTPUT_DIR = join(ROOT, "tests", "e2e", "output");

export const VIEWPORTS = {
  mobile: { width: 375, height: 812, isMobile: true, hasTouch: true },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
};

/* Real page paths, read from public/_redirects (the lines that return 200). */
export function realRoutes() {
  const text = readFileSync(join(ROOT, "public", "_redirects"), "utf8");
  const paths = text
    .split("\n")
    .map((l) => l.trim().split(/\s+/))
    .filter((p) => p.length >= 3 && p[0].startsWith("/") && p[2] === "200")
    .map((p) => p[0]);
  return ["/", ...paths];
}

/* Page paths listed in public/sitemap.xml. */
export function sitemapRoutes() {
  const text = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");
  return [...text.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
}

/* Paths declared in <Route path="..."> in src/App.jsx (excluding the "*" catch-all). */
export function appRoutes() {
  const text = readFileSync(join(ROOT, "src", "App.jsx"), "utf8");
  return [...text.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== "*");
}

export const fileExists = (...parts) => existsSync(join(ROOT, ...parts));

/* The gallery exactly as the site builds it: projects.js + the photo folders.
   `photos` is every photo in page order, each with its project. */
export const galleryProjects = buildGallery(projects, listProjectPhotos(ROOT));
export const galleryPhotos = galleryProjects.flatMap((p) => p.photos.map((ph) => ({ ...ph, project: p })));

/* ---------- browser ---------- */
export async function launchBrowser() {
  const headless = !process.env.HEADED;
  if (process.env.CHROME_PATH) return chromium.launch({ headless, executablePath: process.env.CHROME_PATH });
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ headless, channel });
    } catch {
      /* try the next installed browser */
    }
  }
  throw new Error(
    "Could not find Google Chrome or Microsoft Edge. Install Chrome, or set CHROME_PATH to a Chromium-based browser.",
  );
}

/* Netlify injects its own scripts (the badge, /.netlify/scripts/hud) on the
   live site. They are not part of our code, and a request that is cut off
   when a test moves to the next page should not fail the run. */
const isNetlifyOwn = (url) => {
  try {
    return new URL(url).pathname.startsWith("/.netlify/");
  } catch {
    return false;
  }
};

/* A page with the site's language pre-selected (once, so reloads keep the
   visitor's own choice) and error collectors attached. */
export async function openPage(browser, base, { lang = "en", viewport = "desktop", contextOptions = {} } = {}) {
  const vp = typeof viewport === "string" ? VIEWPORTS[viewport] : viewport;
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.isMobile,
    hasTouch: !!vp.hasTouch,
    ...contextOptions,
  });
  await context.addInitScript((l) => {
    try {
      if (!sessionStorage.getItem("__e2eSeeded")) {
        localStorage.setItem("marudyaan-lang", l);
        sessionStorage.setItem("__e2eSeeded", "1");
      }
    } catch {
      /* storage blocked */
    }
  }, lang);
  const page = await context.newPage();
  page.errors = { page: [], console: [], http: [] };
  page.on("pageerror", (e) => page.errors.page.push(String(e.message || e)));
  page.on("console", (m) => m.type() === "error" && page.errors.console.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && !isNetlifyOwn(r.url()) && page.errors.http.push({ status: r.status(), url: r.url() }));
  page.on("requestfailed", (r) => {
    if (!r.url().startsWith("data:") && !isNetlifyOwn(r.url())) page.errors.http.push({ status: "failed", url: r.url() });
  });
  page.base = base;
  return page;
}

export const resetErrors = (page) => {
  page.errors.page.length = 0;
  page.errors.console.length = 0;
  page.errors.http.length = 0;
};

/* Scroll to the bottom with the mouse wheel, the way a visitor does.
   (Instant scrollTo jumps can skip past scroll-reveal animations.) */
export async function scrollLikeAUser(page) {
  const vp = page.viewportSize();
  await page.mouse.move(vp.width / 2, vp.height / 2);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(35);
  }
  await page.waitForTimeout(1200);
}

/* Same address as WEB3FORMS_URL in src/utils/sendForm.js. */
export const WEB3FORMS_URL = "https://api.web3forms.com/submit";

/* The forms either open the visitor's email app (a mailto: link) or, with a
   Web3Forms key in site.js, post to Web3Forms. Capture whichever happens.
   The Web3Forms call is answered here — success, or an error with fail: true —
   so tests never send real email.
   Returns { via: "email" | "web3forms", to, subject, body } or null. */
export async function captureSubmission(page, action, { fail = false } = {}) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.enable");
  let sent = null;
  cdp.on("Page.frameRequestedNavigation", (e) => {
    if (!e.url.startsWith("mailto:")) return;
    const u = new URL(e.url);
    sent = { via: "email", to: u.pathname, subject: u.searchParams.get("subject"), body: u.searchParams.get("body") };
  });
  const answer = async (route) => {
    const p = route.request().postDataJSON();
    sent = { via: "web3forms", to: "web3forms", subject: p.subject, body: p.message, payload: p };
    await route.fulfill(
      fail
        ? { status: 500, json: { success: false, message: "test failure" } }
        : { status: 200, json: { success: true, message: "Email sent successfully!" } },
    );
  };
  await page.route(WEB3FORMS_URL, answer);
  await action();
  await page.waitForTimeout(500);
  await page.unroute(WEB3FORMS_URL, answer);
  await cdp.detach().catch(() => {});
  return sent;
}

export async function screenshotOnFailure(page, name) {
  try {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    const file = join(OUTPUT_DIR, `${name.replace(/[^a-z0-9-]+/gi, "_")}.png`);
    await page.screenshot({ path: file, fullPage: false });
    return file;
  } catch {
    return null;
  }
}

/* ---------- reporting ---------- */
export function createReporter() {
  const r = { passed: 0, failed: [], warnings: [] };
  r.suite = (name) => console.log(`\n▶ ${name}`);
  r.ok = (msg) => {
    r.passed++;
    console.log(`  ✓ ${msg}`);
  };
  r.fail = (msg, detail = "") => {
    r.failed.push(msg);
    console.log(`  ✗ ${msg}${detail ? `\n      ${detail}` : ""}`);
  };
  r.warn = (msg) => {
    r.warnings.push(msg);
    console.log(`  ⚠ ${msg}`);
  };
  r.skip = (msg) => console.log(`  – skipped: ${msg}`);
  r.check = (cond, msg, detail = "") => (cond ? r.ok(msg) : r.fail(msg, detail));
  return r;
}
