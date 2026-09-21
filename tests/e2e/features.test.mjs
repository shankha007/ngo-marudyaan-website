/* Features: gallery filters & lightbox, donate page (copy buttons, QR,
   WhatsApp link), both forms (validation + the email they open), FAQ,
   impact counters — plus warnings for placeholder content still on the site. */
import { bannerSlides } from "../../src/data/banner.js";
import { faqs, galleryItems, programs, team, volunteerRoles } from "../../src/data/content.js";
import { site, stats } from "../../src/data/site.js";
import { strings } from "../../src/i18n/strings.js";
import { captureMailto, fileExists, openPage, scrollLikeAUser } from "./lib.mjs";

export const title = "Features";

export default async function features({ browser, base, report }) {
  const en = strings.en;

  /* ================= gallery ================= */
  {
    const page = await openPage(browser, base);
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    const categories = ["all", ...new Set(galleryItems.map((g) => g.category))];
    const wrong = [];
    for (const c of categories) {
      const label = c === "all" ? en["gallery.all"] : en[`cat.${c}`];
      await page.getByRole("button", { name: label, exact: true }).click();
      await page.waitForTimeout(250);
      const shown = await page.locator("main [data-thumb]").count();
      const want = c === "all" ? galleryItems.length : galleryItems.filter((g) => g.category === c).length;
      if (shown !== want) wrong.push(`${label}: ${shown} shown, ${want} expected`);
    }
    report.check(wrong.length === 0, `gallery filters show the right photos (${categories.length} filters, ${galleryItems.length} photos)`, wrong.join("; "));

    await page.getByRole("button", { name: en["gallery.all"], exact: true }).click();
    await page.locator("[data-thumb='0']").click();
    await page.waitForTimeout(300);
    const caption = () => page.locator("[role=dialog] figcaption span").first().innerText();
    const c1 = await caption();
    await page.keyboard.press("ArrowRight");
    const c2 = await caption();
    await page.keyboard.press("ArrowLeft");
    const c3 = await caption();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({
      open: [...document.querySelectorAll("[role=dialog]")].some((d) => d.querySelector("figure")),
      scrollLocked: document.body.style.overflow === "hidden",
    }));
    report.check(
      c1 === galleryItems[0].caption.en && c2 === galleryItems[1].caption.en && c3 === c1 && !after.open && !after.scrollLocked,
      "lightbox: arrow keys move between photos, Escape closes and unlocks scrolling",
      `${JSON.stringify([c1, c2, c3])} ${JSON.stringify(after)}`,
    );
    await page.context().close();
  }

  /* ================= donate ================= */
  {
    const page = await openPage(browser, base);
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(base).origin });
    await page.goto(base + "/donate", { waitUntil: "networkidle" });
    const b = site.donation.bank;
    // [label, displayed value, value that should land on the clipboard]
    const rows = [
      [en["donate.upi.label"], site.donation.upiId, site.donation.upiId.replace(/\s+/g, "")],
      [en["donate.bank.accountName"], b.accountName, b.accountName],
      [en["donate.bank.accountNumber"], b.accountNumber, b.accountNumber.replace(/\s+/g, "")],
      [en["donate.bank.bankName"], b.bankName, b.bankName],
      [en["donate.bank.branch"], b.branch, b.branch],
      [en["donate.bank.ifsc"], b.ifsc, b.ifsc.replace(/\s+/g, "")],
      [en["donate.bank.accountType"], b.accountType, b.accountType],
    ];
    const wrong = [];
    for (const [label, shown, copied] of rows) {
      const row = page.locator("div.flex.items-center.justify-between", { has: page.getByText(label, { exact: true }) });
      const onScreen = await row.locator("div.min-w-0 > div").nth(1).innerText();
      await row.getByRole("button").click();
      await page.waitForTimeout(80);
      const clip = await page.evaluate(() => navigator.clipboard.readText());
      const feedback = await row.getByRole("button").innerText();
      if (onScreen !== shown || clip !== copied || !feedback.includes(en["donate.copied"])) {
        wrong.push(`${label}: shows "${onScreen}", copied "${clip}" (want "${copied}"), button "${feedback}"`);
      }
    }
    report.check(wrong.length === 0, `all ${rows.length} Copy buttons copy the right value (account no./IFSC/UPI without spaces)`, wrong.join("; "));

    const wa = await page.evaluate(() => [...document.querySelectorAll("main a")].map((a) => a.href).find((h) => h.startsWith("https://wa.me/")));
    report.check(/^https:\/\/wa\.me\/\d{10,15}(\?|$)/.test(wa || ""), "WhatsApp links are well-formed", wa);

    const qrOnDisk = fileExists("public", "images", "donate-qr.png");
    const qr = await page.evaluate(() => {
      const img = document.querySelector('main img[src*="donate-qr"]');
      return { img: !!img, loaded: !!img && img.naturalWidth > 0, placeholder: !img };
    });
    if (qrOnDisk) report.check(qr.loaded, "donation QR code image loads");
    else report.check(qr.placeholder, "without a QR image, the Donate page shows the “not added yet” box instead of a broken image");
    await page.context().close();
  }

  /* ================= forms ================= */
  for (const lang of ["en", "bn"]) {
    const t = strings[lang];
    const L = lang === "en" ? "English" : "Bengali";
    const page = await openPage(browser, base, { lang });

    await page.goto(base + "/contact", { waitUntil: "networkidle" });
    const form = page.locator("main form");
    const submit = form.locator("button[type=submit]");
    const err = () => page.locator("#contact-error").innerText();

    let mail = await captureMailto(page, () => submit.click());
    let state = await page.evaluate(() => ({
      focusOnName: document.activeElement === document.querySelector("main form input[type=text]"),
      invalid: document.querySelectorAll("main form [aria-invalid=true]").length,
    }));
    report.check(!mail && (await err()) === t["contact.form.required"] && state.focusOnName && state.invalid === 2, `Contact (${L}): empty form shows our own message, marks the fields, focuses Name`, `${await err()} ${JSON.stringify(state)}`);

    await form.locator("input[type=text]").first().fill("Test Donor");
    await form.locator("textarea").fill("Hello & welcome — 100% test\nsecond line");
    await form.locator("input[type=email]").fill("donor@gmail");
    mail = await captureMailto(page, () => submit.click());
    const focusOnEmail = await page.evaluate(() => document.activeElement.type === "email");
    report.check(!mail && (await err()) === t["form.email.invalid"] && focusOnEmail, `Contact (${L}): a mistyped email ("donor@gmail") is caught`, await err());

    await form.locator("input[type=email]").fill("donor@example.com");
    mail = await captureMailto(page, () => submit.click());
    const u = mail ? new URL(mail) : null;
    report.check(
      !!u && u.pathname === site.contact.email && u.searchParams.get("body").includes("Hello & welcome — 100% test\nsecond line") && (await err()) === "",
      `Contact (${L}): a valid form opens an email to ${site.contact.email} with the message intact`,
      mail || "no email opened",
    );

    await page.goto(base + "/get-involved", { waitUntil: "networkidle" });
    const f2 = page.locator("main form");
    const send = () => captureMailto(page, () => f2.locator("button[type=submit]").click());
    const e2 = () => page.locator("#involved-error").innerText();
    const focused = () => page.evaluate(() => document.activeElement.type);
    const marked = () => page.evaluate(() => [...document.querySelectorAll("main form [aria-invalid=true]")].map((e) => e.type));

    mail = await send();
    report.check(
      !mail && (await e2()) === t["involved.form.required"] && (await focused()) === "text" && (await marked()).join() === "text,tel",
      `Get Involved (${L}): empty form asks for name AND phone, marks both, focuses Name`,
      `"${await e2()}" marked=${await marked()}`,
    );

    await f2.locator("input[type=text]").fill("Volunteer");
    mail = await send();
    report.check(!mail && (await e2()) === t["involved.form.required"] && (await focused()) === "tel", `Get Involved (${L}): a name without a phone number is not sent; focus moves to Phone`, `"${await e2()}" focus=${await focused()}`);

    await f2.locator("input[type=tel]").fill("12345");
    mail = await send();
    report.check(!mail && (await e2()) === t["form.phone.invalid"] && (await focused()) === "tel", `Get Involved (${L}): a too-short phone number ("12345") is caught`, `"${await e2()}"`);

    await f2.locator("input[type=tel]").fill("+91 98765 43210");
    await f2.locator("select").selectOption({ index: 1 });
    mail = await send();
    const body = mail ? new URL(mail).searchParams.get("body") : "";
    const role = volunteerRoles[1].title.en;
    report.check(
      body.includes("Name: Volunteer") && body.includes("Phone: +91 98765 43210") && body.includes(`Interested in: ${role}`) && (await e2()) === "",
      `Get Involved (${L}): with name + phone it opens an email including the phone and chosen role`,
      body.slice(0, 110) || "no email opened",
    );

    if (lang === "en") {
      const faq = page.locator("main button[aria-expanded]").first();
      await faq.click();
      report.check((await faq.getAttribute("aria-expanded")) === "true" && (await faq.innerText()).includes(faqs[0].q.en), "FAQ answers open on click");
    }
    report.check(page.errors.page.length === 0, `no JavaScript errors on the forms (${L})`, page.errors.page.join("; "));
    await page.context().close();
  }

  /* ================= impact counters ================= */
  {
    const page = await openPage(browser, base);
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await scrollLikeAUser(page);
    const shown = await page.evaluate(() => [...document.querySelectorAll(".font-display.text-saffron-400")].map((e) => e.textContent));
    const want = stats.map((s) => s.value.toLocaleString("en-IN") + s.suffix);
    report.check(want.every((w) => shown.includes(w)), `impact counters count up to ${want.join(", ")}`, `shown: ${shown.join(", ")}`);
    await page.context().close();
  }

  /* ================= placeholder content still on the site (warnings) ================= */
  const todo = [];
  if (!fileExists("public", "images", "donate-qr.png")) todo.push("QR code image — save it as public/images/donate-qr.png");
  if (/^0[0\s]*$/.test(site.donation.bank.accountNumber) || /0000000$/.test(site.donation.bank.ifsc)) todo.push("bank account number / IFSC (src/data/site.js)");
  if (site.donation.upiId === "marudyaan@upi") todo.push("UPI ID (src/data/site.js)");
  if (Object.values(site.registration).some((v) => /^X+$/.test(v))) todo.push("registration / PAN / 80G numbers (src/data/site.js)");
  if (team.some((m) => m.name.en === "Full Name")) todo.push("team names (src/data/content.js)");
  // the generated placeholder art is all .svg; real photos will be .jpg/.png/.webp
  const svgs = [
    ...bannerSlides.filter((s) => s.active !== false).map((s) => s.image),
    ...galleryItems.map((g) => g.src),
    ...programs.map((p) => p.image),
  ].filter((src) => src.endsWith(".svg"));
  if (svgs.length) todo.push(`${svgs.length} placeholder images (banner, gallery, programmes) — replace with real photos`);
  for (const item of todo) report.warn(`placeholder still on the site: ${item}`);
  if (!todo.length) report.ok("no placeholder content detected");
}
