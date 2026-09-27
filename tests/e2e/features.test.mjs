/* Features: gallery filters & lightbox, donate page (copy buttons, QR,
   WhatsApp link), both forms (validation + the email they open), FAQ,
   impact counters — plus warnings for placeholder content still on the site. */
import { bannerSlides } from "../../src/data/banner.js";
import { faqs, galleryItems, helpPrograms, programs, team, volunteerRoles } from "../../src/data/content.js";
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
    /* ---- Request Help ---- */
    await page.goto(base + "/request-help", { waitUntil: "networkidle" });
    const f3 = page.locator("main form");
    const ask = () => captureMailto(page, () => f3.locator("button[type=submit]").click());
    const e3 = () => page.locator("#help-error").innerText();
    const focusedName = () => page.evaluate(() => document.activeElement.name);
    const markedNames = () => page.evaluate(() => [...new Set([...document.querySelectorAll("main form [aria-invalid=true]")].map((e) => e.name))].join());

    mail = await ask();
    report.check(
      !mail && (await e3()) === t["help.err.program"] && (await focusedName()) === "program" && (await markedNames()) === "program,name,phone,address,total",
      `Request Help (${L}): empty form asks for the drive first and marks every required field`,
      `"${await e3()}" marked=${await markedNames()} focus=${await focusedName()}`,
    );

    const puja = helpPrograms[0];
    await f3.locator(`label:has(input[value=${puja.id}])`).click();
    await f3.locator("input[name=name]").fill("Help Seeker");
    await f3.locator("input[name=phone]").fill("98765 43210");
    await f3.locator("textarea[name=address]").fill("12 Lake Road, Dum Dum, Kolkata 700056");
    await f3.locator("input[name=total]").fill("4");
    await f3.locator("input[name=children]").fill("3");
    await f3.locator("input[name=children] >> xpath=../following-sibling::label//input").fill("2");
    mail = await ask();
    report.check(!mail && (await e3()) === t["help.err.breakdown"] && (await focusedName()) === "children", `Request Help (${L}): children + elderly more than the total is caught`, `"${await e3()}"`);

    await f3.locator("input[name=children] >> xpath=../following-sibling::label//input").fill("1");
    mail = await ask();
    report.check(!mail && (await e3()) === t["help.err.needs"] && (await focusedName()) === "needs", `Request Help (${L}): no kind of help chosen is caught`, `"${await e3()}"`);

    await f3.locator("input[name=needs]").nth(0).check();
    await f3.locator("input[name=needs]").nth(2).check();
    await f3.locator("textarea[name=details]").fill("Kids aged 4, 7 & 9 — sizes 24/28/30");
    mail = await ask();
    const hu = mail ? new URL(mail) : null;
    const hb = hu?.searchParams.get("body") || "";
    report.check(
      !!hu && hu.pathname === site.contact.email &&
        hu.searchParams.get("subject") === `Help request: ${puja.title.en} — Help Seeker (4 people)` &&
        ["Phone / WhatsApp: 98765 43210", "Address: 12 Lake Road, Dum Dum, Kolkata 700056", "Number of people who need help: 4", "Children (under 14): 3", "Elderly (60+): 1",
          `- ${puja.needs[0].label.en}`, `- ${puja.needs[2].label.en}`, "Kids aged 4, 7 & 9 — sizes 24/28/30"].every((s) => hb.includes(s)) &&
        !hb.includes(puja.needs[1].label.en) && (await e3()) === "",
      `Request Help (${L}): a complete request opens an email to ${site.contact.email} with every detail, in English`,
      mail || "no email opened",
    );
    const wa = await page.locator("main [role=status] a[href*='wa.me']").getAttribute("href").catch(() => null);
    report.check(!!wa && decodeURIComponent(new URL(wa).searchParams.get("text") || "") === hb, `Request Help (${L}): after sending, a WhatsApp fallback carries the same details`, wa || "no WhatsApp link");

    await f3.locator(`label:has(input[value=other])`).click();
    const cleared = await f3.locator("input[name=needs]").count();
    await f3.locator("textarea[name=details]").fill("");
    mail = await ask();
    report.check(
      cleared === 0 && !mail && (await e3()) === t["help.err.needs"] && (await focusedName()) === "details",
      `Request Help (${L}): "Something else" needs a written description`,
      `checkboxes=${cleared} "${await e3()}" focus=${await focusedName()}`,
    );

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
