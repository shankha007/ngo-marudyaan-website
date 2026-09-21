/* Accessibility: pausable banner, keyboard focus in the mobile menu and the
   photo lightbox, skip link, Back-to-top, tap-target sizes, icon shapes,
   and no English-only labels left in Bengali mode.                        */
import { bannerSettings, bannerSlides } from "../../src/data/banner.js";
import { galleryItems } from "../../src/data/content.js";
import { strings } from "../../src/i18n/strings.js";
import { openPage, realRoutes } from "./lib.mjs";

export const title = "Accessibility";

const en = strings.en;
const WAIT = bannerSettings.intervalMs + 1100; // longer than one banner rotation

const focusInfo = (page) =>
  page.evaluate(() => {
    const a = document.activeElement;
    return {
      label: a.getAttribute("aria-label") || a.textContent.trim().slice(0, 30),
      inDialog: !!a.closest("[role=dialog]"),
      thumb: a.getAttribute("data-thumb"),
    };
  });

export default async function a11y({ browser, base, quick, report }) {
  /* ================= banner carousel ================= */
  const slides = bannerSlides.filter((s) => s.active !== false).length;
  if (slides < 2 || !bannerSettings.autoPlay) {
    report.skip(`banner rotation tests — ${slides} active slide(s), autoPlay ${bannerSettings.autoPlay}`);
  } else {
    const page = await openPage(browser, base);
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const h1 = () => page.locator("h1").innerText();
    const toggle = page.locator("section[aria-roledescription=carousel] button").first();
    const live = () => page.locator("section[aria-roledescription=carousel] [aria-live]").getAttribute("aria-live");

    report.check((await toggle.getAttribute("aria-label")) === en["carousel.pause"], "banner has a visible Pause button");
    report.check((await live()) === "off", "screen readers are not spammed while the banner auto-rotates");

    await toggle.focus();
    await page.keyboard.press("Enter");
    let before = await h1();
    await page.waitForTimeout(WAIT);
    report.check(
      (await h1()) === before && (await toggle.getAttribute("aria-label")) === en["carousel.play"] && (await live()) === "polite",
      "Pause (keyboard) stops the banner; button becomes Play; changes are announced",
    );
    await page.keyboard.press("Enter");
    before = await h1();
    await page.waitForTimeout(WAIT);
    report.check((await h1()) !== before, "Play resumes rotation even while focus is still on the button");

    await page.getByRole("button", { name: en["carousel.next"] }).focus();
    before = await h1();
    await page.waitForTimeout(WAIT);
    const heldWhileFocused = (await h1()) === before;
    await page.getByRole("button", { name: `${en["carousel.goto"]} ${slides}` }).focus();
    await page.keyboard.press("Tab");
    before = await h1();
    await page.waitForTimeout(WAIT);
    report.check(heldWhileFocused && (await h1()) !== before, "keyboard focus inside the banner pauses it; leaving resumes it");

    await toggle.click();
    before = await h1();
    await page.waitForTimeout(WAIT);
    const pausedByMouse = (await h1()) === before;
    await toggle.click();
    await page.locator("h1").click({ position: { x: 5, y: 5 } }); // pointer stays over the banner
    before = await h1();
    await page.waitForTimeout(WAIT);
    report.check(pausedByMouse && (await h1()) !== before, "mouse Pause works, and Play resumes even with the pointer over the banner");

    const sizes = await page
      .locator("section[aria-roledescription=carousel] button")
      .evaluateAll((bs) => bs.map((b) => [b.getAttribute("aria-label"), Math.round(b.getBoundingClientRect().width), Math.round(b.getBoundingClientRect().height)]));
    const small = sizes.filter(([, w, h]) => w < 24 || h < 24);
    report.check(small.length === 0, "banner buttons and dots are at least 24×24px", JSON.stringify(small));
    await page.context().close();

    const rm = await openPage(browser, base, { contextOptions: { reducedMotion: "reduce" } });
    await rm.goto(base + "/", { waitUntil: "networkidle" });
    const label = await rm.locator("section[aria-roledescription=carousel] button").first().getAttribute("aria-label");
    before = await rm.locator("h1").innerText();
    await rm.waitForTimeout(WAIT);
    report.check(label === en["carousel.play"] && (await rm.locator("h1").innerText()) === before, "banner stays still for visitors who prefer reduced motion");
    await rm.context().close();
  }

  /* ================= mobile menu ================= */
  {
    const page = await openPage(browser, base, { viewport: "mobile" });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const burger = page.locator("header button[aria-expanded]");
    await burger.click();
    await page.waitForTimeout(350);
    const opened = await focusInfo(page);

    let escaped = null;
    for (const key of [...Array(20).fill("Tab"), ...Array(20).fill("Shift+Tab")]) {
      await page.keyboard.press(key);
      const f = await focusInfo(page);
      if (!f.inDialog) {
        escaped = `${key} → "${f.label}"`;
        break;
      }
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
    const afterEsc = await focusInfo(page);
    const closed = await page.evaluate(() => !!document.querySelector("header ~ div [role=dialog]")?.closest("[inert]"));

    await burger.click();
    await page.waitForTimeout(350);
    await page.locator(`[role=dialog] button[aria-label="${en["nav.close"]}"]`).click();
    await page.waitForTimeout(350);
    const afterX = await focusInfo(page);

    report.check(opened.inDialog, "opening the mobile menu moves focus into it", `focus on "${opened.label}"`);
    report.check(!escaped, "Tab and Shift+Tab stay inside the open menu", escaped || "");
    report.check(closed && afterEsc.label === en["nav.menu"] && afterX.label === en["nav.menu"], "Escape and ✕ close the menu and return focus to the menu button", `after Escape: "${afterEsc.label}", after ✕: "${afterX.label}"`);
    await page.context().close();
  }

  /* ================= gallery lightbox ================= */
  {
    const page = await openPage(browser, base);
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    await page.locator("[data-thumb='1']").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const opened = await focusInfo(page);
    let escaped = null;
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const f = await focusInfo(page);
      if (!f.inDialog) {
        escaped = f.label;
        break;
      }
    }
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const closedTo = await focusInfo(page);
    const lightboxOpen = await page.evaluate(() => [...document.querySelectorAll("[role=dialog]")].some((d) => d.querySelector("figure")));

    report.check(opened.inDialog && opened.label === en["gallery.close"], "opening a photo moves focus to the lightbox's Close button", `focus on "${opened.label}"`);
    report.check(!escaped, "Tab stays inside the open lightbox", escaped ? `escaped to "${escaped}"` : "");
    const lastViewed = String((1 + 2) % galleryItems.length); // opened #1, then → →
    report.check(!lightboxOpen && closedTo.thumb === lastViewed, "Escape closes it and returns focus to the last photo viewed", `open=${lightboxOpen}, focus on thumb ${closedTo.thumb}, expected ${lastViewed}`);
    await page.context().close();
  }

  /* ================= skip link & Back-to-top ================= */
  {
    const page = await openPage(browser, base);
    await page.goto(base + "/contact", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    const skip = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), w: document.activeElement.getBoundingClientRect().width }));
    report.check(skip.text === en["nav.skip"] && skip.w > 20, "first Tab reveals the “Skip to main content” link", JSON.stringify(skip));

    let landedOnHidden = false;
    for (let i = 0; i < 80 && !landedOnHidden; i++) {
      await page.keyboard.press("Tab");
      landedOnHidden = await page.evaluate(
        (label) => document.activeElement.getAttribute("aria-label") === label && getComputedStyle(document.activeElement).opacity === "0",
        en["misc.backToTop"],
      );
    }
    report.check(!landedOnHidden, "hidden Back-to-top button is never a keyboard stop");
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: en["misc.backToTop"] }).click({ timeout: 3000 });
    await page.waitForTimeout(1200);
    report.check((await page.evaluate(() => scrollY)) < 5, "Back-to-top appears after scrolling and returns to the top");
    await page.context().close();
  }

  /* ================= icons keep their shape ================= */
  {
    const distorted = [];
    for (const vp of ["desktop", "mobile"]) {
      const page = await openPage(browser, base, { viewport: vp });
      for (const route of realRoutes()) {
        await page.goto(base + route, { waitUntil: "networkidle" });
        const found = await page.evaluate(() =>
          [...document.querySelectorAll("span, div")]
            .filter((el) => el.children.length === 1 && el.children[0].tagName === "svg" && getComputedStyle(el).backgroundColor !== "rgba(0, 0, 0, 0)")
            .map((el) => el.getBoundingClientRect())
            .filter((b) => b.width && (b.height / b.width > 1.3 || b.height / b.width < 0.77))
            .map((b) => `${Math.round(b.width)}×${Math.round(b.height)}`),
        );
        if (found.length) distorted.push(`${route} (${vp}): ${found.join(", ")}`);
      }
      await page.context().close();
    }
    report.check(distorted.length === 0, "icon badges stay round/square (none stretched by flexbox)", distorted.join("; "));
  }

  /* ================= required fields: visible * matches the real rule ================= */
  {
    const page = await openPage(browser, base);
    const mismatches = [];
    const marked = [];
    for (const route of ["/contact", "/get-involved"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      const fields = await page.evaluate(() =>
        [...document.querySelectorAll("main form label")].map((label) => {
          const control = label.querySelector("input, textarea, select");
          const star = [...label.querySelectorAll('span[aria-hidden="true"]')].some((s) => s.textContent.trim() === "*");
          return { name: label.textContent.replace("*", "").trim(), star, required: !!control?.required };
        }),
      );
      for (const f of fields) {
        if (f.star !== f.required) mismatches.push(`${route} "${f.name}": shows * ${f.star}, required ${f.required}`);
      }
      marked.push(`${route}: ${fields.filter((f) => f.star).map((f) => f.name).join(" + ")}`);
    }
    report.check(mismatches.length === 0, `required form fields show a * and no other field does (${marked.join("; ")})`, mismatches.join("; "));
    await page.context().close();
  }

  /* ================= Bengali mode: no English-only labels ================= */
  {
    const brand = new Set(["NGO Marudyaan", "English", "EN", "Facebook", "Instagram", "YouTube"]);
    const leaks = {};
    const page = await openPage(browser, base, { lang: "bn" });
    for (const route of quick ? ["/", "/donate"] : [...realRoutes(), "/no-such-page"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo(0, 2000));
      await page.waitForTimeout(400);
      if (route === "/gallery") {
        await page.locator("[data-thumb='0']").click();
        await page.waitForTimeout(300);
      }
      const found = await page.evaluate(() => {
        const out = new Set();
        for (const el of document.querySelectorAll("[aria-label], img[alt], [title]")) {
          if (el.closest("#nl-badge-frame")) continue; // Netlify's own badge
          for (const v of [el.getAttribute("aria-label"), el.tagName === "IMG" ? el.getAttribute("alt") : null, el.getAttribute("title")]) {
            if (v && /[A-Za-z]{3,}/.test(v) && !/[ঀ-৿]/.test(v)) out.add(v);
          }
        }
        return [...out];
      });
      const real = found.filter((v) => !brand.has(v));
      if (real.length) leaks[route] = real;
    }
    report.check(Object.keys(leaks).length === 0, "no English-only screen-reader labels or alt text in Bengali mode", JSON.stringify(leaks));
    await page.context().close();
  }
}
