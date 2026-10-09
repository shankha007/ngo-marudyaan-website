/* Performance: pictures load small, late and without jumps.
   - every gallery photo has small WebP copies, and they really are smaller
   - pages show those copies (not the full photos), lazy-loaded, with sizes
   - the top banner loads first, early, and only on the home page
   - the lightbox fetches the next photo before it is needed
   - fonts come from this site, not from Google
   - nothing on the page jumps while pictures load (layout shift)
   - on the live site, the copies are cached by browsers for a year */
import { join } from "node:path";
import { statSync } from "node:fs";
import { bannerSlides } from "../../src/data/banner.js";
import { PROJECTS_DIR } from "../../scripts/project-photos.mjs";
import { ROOT, galleryPhotos, openPage, scrollLikeAUser } from "./lib.mjs";

export const title = "Performance (images, fonts, layout shift)";

const isVariant = (url) => /\/images\/projects\/[^/]+\/_w\/[^/]+-\d+-[0-9a-f]+\.webp$/.test(new URL(url).pathname);

export default async function performance({ browser, base, live, report }) {
  /* ================= WebP copies exist and are smaller ================= */
  {
    const page = await openPage(browser, base, { viewport: "desktop" });
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    // the srcset of every thumbnail, read from the page itself
    const sets = await page.$$eval("main [data-thumb] img", (imgs) => imgs.map((i) => ({ src: i.getAttribute("src"), srcset: i.getAttribute("srcset") || "" })));
    const problems = [];
    let saved = 0;
    let original = 0;
    for (const { src, srcset } of sets) {
      const urls = srcset.split(",").map((s) => s.trim().split(" ")[0]).filter(Boolean);
      if (!urls.length) {
        problems.push(`${src}: no smaller copies`);
        continue;
      }
      const origBytes = statSync(join(ROOT, ...PROJECTS_DIR, ...src.split("/").slice(3))).size;
      const smallest = urls[0];
      const res = await page.request.get(base + smallest);
      const body = await res.body();
      if (!res.ok() || !res.headers()["content-type"]?.includes("image/webp")) problems.push(`${smallest}: ${res.status()} ${res.headers()["content-type"]}`);
      else if (body.length >= origBytes) problems.push(`${smallest} (${body.length} B) is not smaller than ${src} (${origBytes} B)`);
      original += origBytes;
      saved += origBytes - body.length;
    }
    report.check(
      sets.length === galleryPhotos.length && problems.length === 0,
      `every gallery photo has WebP copies, and the thumbnails are smaller (${Math.round((100 * saved) / Math.max(original, 1))}% less to download)`,
      `${sets.length}/${galleryPhotos.length} thumbnails; ${problems.slice(0, 3).join("; ")}`,
    );
    await page.context().close();
  }

  /* ================= pages show the small copies, lazily, without jumps ================= */
  for (const viewport of ["mobile", "desktop"]) {
    const page = await openPage(browser, base, { viewport });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const fontHosts = new Set();
    const fullPhotos = new Set();
    page.on("request", (r) => {
      const u = new URL(r.url());
      if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) fontHosts.add(u.hostname);
      if (r.resourceType() === "image" && /^\/images\/projects\/[^/]+\/[^/_][^/]*$/.test(u.pathname)) fullPhotos.add(u.pathname);
    });
    const problems = [];
    let cls = 0;
    for (const route of ["/", "/about", "/gallery"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await scrollLikeAUser(page);
      const imgs = await page.$$eval("main img, section img", (all) =>
        [...new Set(all)].map((i) => ({
          src: i.getAttribute("src"),
          current: i.currentSrc,
          loading: i.loading,
          priority: i.getAttribute("fetchpriority"),
          sized: i.hasAttribute("width") && i.hasAttribute("height"),
          shown: i.getBoundingClientRect().width,
          natural: i.naturalWidth,
        })),
      );
      const dpr = await page.evaluate(() => window.devicePixelRatio);
      for (const i of imgs.filter((i) => i.src?.startsWith("/images/projects/"))) {
        if (!isVariant(i.current)) problems.push(`${route}: ${i.src} loaded the full photo`);
        if (!i.sized) problems.push(`${route}: ${i.src} has no width/height`);
        if (i.priority !== "high" && i.loading !== "lazy") problems.push(`${route}: ${i.src} is not lazy-loaded`);
        // the copy chosen should not be far bigger than needed (allow for 2× screens and the next size up)
        if (i.shown && i.natural > i.shown * dpr * 2.2 && i.natural > 400) problems.push(`${route}: ${i.src} is ${i.natural}px wide but shown at ${Math.round(i.shown)}px`);
      }
      cls = Math.max(cls, await page.evaluate(() => window.__cls));
    }
    report.check(problems.length === 0, `${viewport}: Home, Our Work and Gallery show right-sized WebP copies, lazy-loaded, with width/height`, problems.slice(0, 4).join("; "));
    report.check(fullPhotos.size === 0, `${viewport}: no full-size photo is downloaded while browsing`, [...fullPhotos].slice(0, 3).join(", "));
    report.check(cls < 0.05, `${viewport}: pages don't jump while pictures load (layout shift ${cls.toFixed(3)}, limit 0.05)`);
    report.check(fontHosts.size === 0, `${viewport}: fonts are served from this site, not Google`, [...fontHosts].join(", "));
    await page.context().close();
  }

  /* ================= banner: first, early, home page only ================= */
  {
    const first = bannerSlides.find((s) => s.active !== false);
    const page = await openPage(browser, base, { viewport: "mobile" });
    const early = [];
    page.on("request", (r) => r.resourceType() === "image" && early.push(new URL(r.url()).pathname));
    await page.goto(base + "/", { waitUntil: "load" });
    const hero = await page.$eval("section[aria-roledescription=carousel] img", (i) => ({ loading: i.loading, priority: i.getAttribute("fetchpriority"), current: i.currentSrc }));
    const preload = await page.$$eval("link[rel=preload][as=image]", (ls) => ls.length);
    const heroFile = new URL(hero.current).pathname;
    report.check(
      hero.loading === "eager" && hero.priority === "high" && preload === 1 && early.indexOf(heroFile) === 0,
      "home: the banner photo is the first picture requested (preloaded, high priority)",
      `${JSON.stringify(hero)} preloads=${preload} order=${early.slice(0, 3).join(", ")} (slide image ${first?.image})`,
    );
    await page.goto(base + "/gallery", { waitUntil: "load" });
    const elsewhere = await page.$$eval("link[rel=preload][as=image]", (ls) => ls.length);
    report.check(elsewhere === 0, "other pages don't download the home banner");
    await page.context().close();
  }

  /* ================= lightbox fetches the next photo early ================= */
  if (galleryPhotos.length > 2) {
    const page = await openPage(browser, base, { viewport: "desktop" });
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    const fetched = new Set();
    page.on("request", (r) => fetched.add(new URL(r.url()).pathname));
    await page.locator("[data-thumb='0']").click();
    await page.waitForTimeout(800);
    const prefix = (p) => p.src.replace(/\/([^/]+)\.[^.]+$/, "/_w/$1-");
    const next = prefix(galleryPhotos[1]);
    const prev = prefix(galleryPhotos[galleryPhotos.length - 1]);
    const has = (pre) => [...fetched].some((u) => u.startsWith(pre));
    report.check(has(next) && has(prev), "lightbox: the next and previous photos are fetched before they are shown", [...fetched].join(", "));
    await page.context().close();
  }

  /* ================= live site: long browser caching ================= */
  if (live) {
    const page = await openPage(browser, base);
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    const variant = await page.$eval("main [data-thumb] img", (i) => i.currentSrc);
    const script = await page.$eval("script[type=module][src]", (s) => s.src);
    const cc = async (u) => (await page.request.get(u)).headers()["cache-control"] || "";
    const [a, b] = [await cc(variant), await cc(script)];
    report.check(/immutable/.test(a) && /immutable/.test(b), "live: photo copies and scripts are cached by browsers for a year", `photo: "${a}", script: "${b}"`);
    await page.context().close();
  } else {
    report.skip("cache headers only exist on Netlify (run npm run test:live)");
  }
}
