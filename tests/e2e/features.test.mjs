/* Features: gallery filters & lightbox, donate page (copy buttons, QR,
   WhatsApp link), both forms (validation + the email they open), FAQ,
   impact counters — plus warnings for placeholder content still on the site. */
import { bannerSlides } from "../../src/data/banner.js";
import { donationTiers, faqs, helpPrograms, programs, team, volunteerRoles } from "../../src/data/content.js";
import { projects } from "../../src/data/projects.js";
import { listProjectPhotos } from "../../scripts/project-photos.mjs";
import { site, stats } from "../../src/data/site.js";
import { strings } from "../../src/i18n/strings.js";
import { ROOT, captureSubmission, fileExists, galleryPhotos, galleryProjects, openPage, scrollLikeAUser } from "./lib.mjs";

export const title = "Features";

export default async function features({ browser, base, report }) {
  const en = strings.en;
  // which forms send via Web3Forms (they have a key) rather than the email app
  const direct = Object.fromEntries(["contact", "involved", "help"].map((f) => [f, Boolean(site.forms.keys[f])]));

  /* ================= gallery: projects.js vs the photo folders ================= */
  {
    const folders = listProjectPhotos(ROOT);
    const categoryIds = programs.map((p) => p.id);
    const issues = [];
    const ids = projects.map((p) => p.id);
    for (const id of ids.filter((id, i) => ids.indexOf(id) !== i)) issues.push(`project id "${id}" is listed twice`);
    for (const p of projects) {
      if (!folders[p.id]) issues.push(`"${p.id}" has no folder public/images/projects/${p.id}/`);
      else if (!folders[p.id].length) issues.push(`"${p.id}" folder has no photos`);
      if (!categoryIds.includes(p.category)) issues.push(`"${p.id}" category "${p.category}" is not one of ${categoryIds.join(", ")}`);
      if (!Number.isInteger(p.year)) issues.push(`"${p.id}" year should be a number, e.g. 2024`);
      if (!p.title?.en || !p.title?.bn) issues.push(`"${p.id}" needs an English and a Bengali title`);
      if (p.cover && folders[p.id] && !folders[p.id].includes(p.cover)) issues.push(`"${p.id}" cover "${p.cover}" is not in its folder`);
      for (const file of Object.keys(p.captions ?? {})) {
        if (folders[p.id] && !folders[p.id].includes(file)) issues.push(`"${p.id}" has a caption for "${file}", which is not in its folder`);
      }
    }
    for (const id of Object.keys(folders).filter((id) => !ids.includes(id))) issues.push(`folder public/images/projects/${id}/ is not listed in src/data/projects.js`);
    for (const p of programs.filter((p) => p.project && !ids.includes(p.project))) issues.push(`programme "${p.id}" points at unknown project "${p.project}"`);
    report.check(issues.length === 0, `gallery projects match their photo folders (${projects.length} projects, ${galleryPhotos.length} photos)`, issues.join("; "));
  }

  /* ================= gallery ================= */
  {
    const page = await openPage(browser, base);
    await page.goto(base + "/gallery", { waitUntil: "networkidle" });
    const categories = ["all", ...programs.map((p) => p.id).filter((c) => galleryProjects.some((p) => p.category === c))];
    const wrong = [];
    for (const c of categories) {
      const label = c === "all" ? en["gallery.all"] : en[`cat.${c}`];
      await page.getByRole("button", { name: label, exact: true }).click();
      await page.waitForTimeout(250);
      const shown = await page.locator("main [data-thumb]").count();
      const want = c === "all" ? galleryPhotos.length : galleryPhotos.filter((g) => g.project.category === c).length;
      if (shown !== want) wrong.push(`${label}: ${shown} shown, ${want} expected`);
    }
    report.check(wrong.length === 0, `gallery filters show the right photos (${categories.length} filters, ${galleryPhotos.length} photos)`, wrong.join("; "));

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
      c1 === galleryPhotos[0].caption.en && c2 === galleryPhotos[1].caption.en && c3 === c1 && !after.open && !after.scrollLocked,
      "lightbox: arrow keys move between photos, Escape closes and unlocks scrolling",
      `${JSON.stringify([c1, c2, c3])} ${JSON.stringify(after)}`,
    );
    await page.context().close();
  }

  /* ================= album links land on the album ================= */
  {
    const linked = programs.filter((p) => galleryProjects.some((g) => g.id === p.project));
    const missed = [];
    for (const viewport of ["mobile", "desktop"]) {
      const page = await openPage(browser, base, { viewport });
      for (const p of linked) {
        // straight from a shared link, and by clicking "See the photos" on About Us
        await page.goto(`${base}/gallery#${p.project}`, { waitUntil: "load" });
        await page.waitForTimeout(1500);
        const direct = await page.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, p.project);
        await page.goto(base + "/about", { waitUntil: "networkidle" });
        await page.locator(`a[href="/gallery#${p.project}"]`).click();
        await page.waitForTimeout(1500);
        const clicked = await page.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, p.project);
        for (const [how, top] of [["link", direct], ["click", clicked]]) {
          // just below the sticky header, not above the screen or far down it
          if (top < 0 || top > 250) missed.push(`${viewport} ${how} ${p.project}: album top at ${Math.round(top)}px`);
        }
      }
      await page.context().close();
    }
    report.check(missed.length === 0, `"See the photos" and shared album links land on the album (${linked.length} albums)`, missed.join("; "));
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
      const row = page.locator("[data-copy-row]", { has: page.getByText(label, { exact: true }) });
      const onScreen = await row.locator("[data-copy-value]").innerText();
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

    /* one-tap UPI links (upi://pay?...) — phones only, and only once switched on */
    const upi = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('main a[href^="upi:"]')].map((a) => ({ href: a.href, visible: a.offsetParent !== null })),
      );
    const links = await upi();
    if (!site.donation.upiButtons) {
      report.check(links.length === 0, "UPI pay buttons stay hidden while upiButtons is off (no payments to a placeholder ID)", JSON.stringify(links));
    } else {
      const params = links.map((l) => Object.fromEntries(new URLSearchParams(l.href.split("?")[1])));
      const amounts = params.map((p) => p.am).filter(Boolean);
      report.check(
        links.length === donationTiers.length + 1 &&
          params.every((p) => p.pa === site.donation.upiId && p.pn === site.donation.upiName && p.cu === "INR") &&
          donationTiers.every((d) => amounts.includes(d.amount.toFixed(2))),
        `UPI pay buttons pay ${site.donation.upiId}, one per amount (${donationTiers.map((d) => d.amount).join(", ")}) plus any amount`,
        JSON.stringify(params),
      );
      report.check(links.every((l) => !l.visible), "UPI pay buttons are hidden on a desktop (no UPI app to open)", JSON.stringify(links));
      const phone = await openPage(browser, base, { viewport: "mobile" });
      await phone.goto(base + "/donate", { waitUntil: "networkidle" });
      const onPhone = await phone.evaluate(() => [...document.querySelectorAll('main a[href^="upi:"]')].filter((a) => a.offsetParent !== null).length);
      report.check(onPhone === links.length, "UPI pay buttons show on a phone", `${onPhone} of ${links.length} visible`);
      await phone.context().close();
    }
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

    let mail = await captureSubmission(page, () => submit.click());
    let state = await page.evaluate(() => ({
      focusOnName: document.activeElement === document.querySelector("main form input[type=text]"),
      invalid: document.querySelectorAll("main form [aria-invalid=true]").length,
    }));
    report.check(!mail && (await err()) === t["contact.form.required"] && state.focusOnName && state.invalid === 2, `Contact (${L}): empty form shows our own message, marks the fields, focuses Name`, `${await err()} ${JSON.stringify(state)}`);

    await form.locator("input[type=text]").first().fill("Test Donor");
    await form.locator("textarea").fill("Hello & welcome — 100% test\nsecond line");
    await form.locator("input[type=email]").fill("donor@gmail");
    mail = await captureSubmission(page, () => submit.click());
    const focusOnEmail = await page.evaluate(() => document.activeElement.type === "email");
    report.check(!mail && (await err()) === t["form.email.invalid"] && focusOnEmail, `Contact (${L}): a mistyped email ("donor@gmail") is caught`, await err());

    await form.locator("input[type=email]").fill("donor@example.com");
    mail = await captureSubmission(page, () => submit.click());
    report.check(
      !!mail && (direct.contact ? mail.via === "web3forms" : mail.to === site.contact.email) &&
        mail.body.includes("Hello & welcome — 100% test\nsecond line") && (await err()) === "",
      direct.contact
        ? `Contact (${L}): a valid form is sent to Web3Forms with the message intact`
        : `Contact (${L}): a valid form opens an email to ${site.contact.email} with the message intact`,
      JSON.stringify(mail) || "nothing sent",
    );
    if (direct.contact) {
      const after = await page.evaluate(() => ({
        thanks: document.querySelector("main [role=status]").innerText,
        name: document.querySelector("main form input[type=text]").value,
      }));
      report.check(
        mail?.payload.email === "donor@example.com" && mail.payload.access_key === site.forms.keys.contact && after.thanks.includes(t["form.sent.title"]) && after.name === "",
        `Contact (${L}): after sending, it says thank you and clears the form (own access key; reply-to is the visitor's email)`,
        JSON.stringify(after),
      );
    }

    await page.goto(base + "/get-involved", { waitUntil: "networkidle" });
    const f2 = page.locator("main form");
    const send = () => captureSubmission(page, () => f2.locator("button[type=submit]").click());
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
    const body = mail?.body || "";
    const role = volunteerRoles[1].title.en;
    const p2 = mail?.payload;
    report.check(
      (direct.involved
        ? p2?.access_key === site.forms.keys.involved && p2?.name === "Volunteer" && p2?.Phone === "+91 98765 43210" && p2?.["Interested in"] === role
        : body.includes("Name: Volunteer") && body.includes("Phone: +91 98765 43210") && body.includes(`Interested in: ${role}`)) &&
        (await e2()) === "",
      direct.involved
        ? `Get Involved (${L}): with name + phone it sends Phone and "Interested in" as separate fields`
        : `Get Involved (${L}): with name + phone it opens an email including the phone and chosen role`,
      (direct.involved ? JSON.stringify(p2) : body.slice(0, 110)) || "nothing sent",
    );

    if (lang === "en") {
      const faq = page.locator("main button[aria-expanded]").first();
      await faq.click();
      report.check((await faq.getAttribute("aria-expanded")) === "true" && (await faq.innerText()).includes(faqs[0].q.en), "FAQ answers open on click");
    }
    /* ---- Request Help ---- */
    await page.goto(base + "/request-help", { waitUntil: "networkidle" });
    const f3 = page.locator("main form");
    const ask = () => captureSubmission(page, () => f3.locator("button[type=submit]").click());
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
    // with Web3Forms, answer this one with an error so the form stays filled and the fallbacks show
    mail = await captureSubmission(page, () => f3.locator("button[type=submit]").click(), { fail: direct.help });
    // the whole request as plain text: the email body, or (with Web3Forms) what the WhatsApp fallback carries
    const wa = await page.locator("main [role=status] a[href*='wa.me']").getAttribute("href").catch(() => null);
    const waText = wa ? decodeURIComponent(new URL(wa).searchParams.get("text") || "") : "";
    const hb = direct.help ? waText : mail?.body || "";
    const textOk =
      ["Phone / WhatsApp: 98765 43210", "Address: 12 Lake Road, Dum Dum, Kolkata 700056", "Number of people who need help: 4", "Children (under 14): 3", "Elderly (60+): 1",
        `- ${puja.needs[0].label.en}`, `- ${puja.needs[2].label.en}`, "Kids aged 4, 7 & 9 — sizes 24/28/30"].every((s) => hb.includes(s)) &&
      !hb.includes(puja.needs[1].label.en);
    const p3 = mail?.payload;
    const fieldsOk =
      !direct.help ||
      (p3?.access_key === site.forms.keys.help && p3?.name === "Help Seeker" && p3?.Drive === puja.title.en && p3?.["Phone / WhatsApp"] === "98765 43210" &&
        p3?.Address === "12 Lake Road, Dum Dum, Kolkata 700056" && p3?.["Number of people who need help"] === "4" &&
        p3?.["Children (under 14)"] === "3" && p3?.["Elderly (60+)"] === "1" &&
        p3?.["Help needed"] === `${puja.needs[0].label.en}, ${puja.needs[2].label.en}` &&
        p3?.message === "Kids aged 4, 7 & 9 — sizes 24/28/30");
    report.check(
      !!mail && (direct.help ? mail.via === "web3forms" : mail.to === site.contact.email) &&
        mail.subject === `Help request: ${puja.title.en} — Help Seeker (4 people)` && fieldsOk && (direct.help || textOk) && (await e3()) === "",
      direct.help
        ? `Request Help (${L}): a complete request is sent to Web3Forms with every detail as its own field, in English`
        : `Request Help (${L}): a complete request opens an email to ${site.contact.email} with every detail, in English`,
      JSON.stringify(mail) || "nothing sent",
    );
    report.check(
      !!wa && (direct.help ? textOk : waText === hb),
      direct.help
        ? `Request Help (${L}): if sending fails, a WhatsApp fallback carries the same details`
        : `Request Help (${L}): after sending, a WhatsApp fallback carries the same details`,
      wa || "no WhatsApp link",
    );
    if (direct.help) {
      const mailto = await page.locator("main [role=status] a[href^='mailto:']").getAttribute("href").catch(() => null);
      report.check(
        !!mailto && new URL(mailto).searchParams.get("body") === waText,
        `Request Help (${L}): if sending fails, an email fallback carries the same details`,
        mailto || "no email link",
      );
    }

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
    const shown = await page.evaluate(() => [...document.querySelectorAll("[data-stat]")].map((e) => e.textContent));
    const want = stats.map((s) => s.value.toLocaleString("en-IN") + s.suffix);
    report.check(want.every((w) => shown.includes(w)), `impact counters count up to ${want.join(", ")}`, `shown: ${shown.join(", ")}`);
    await page.context().close();
  }

  /* ================= placeholder content still on the site (warnings) ================= */
  const todo = [];
  if (!fileExists("public", "images", "donate-qr.png")) todo.push("QR code image — save it as public/images/donate-qr.png");
  if (/^0[0\s]*$/.test(site.donation.bank.accountNumber) || /0000000$/.test(site.donation.bank.ifsc)) todo.push("bank account number / IFSC (src/data/site.js)");
  if (site.donation.upiId === "marudyaan@upi") todo.push("UPI ID (src/data/site.js)");
  if (!site.donation.upiButtons) todo.push("one-tap UPI buttons are off — set upiButtons: true once the UPI ID is real (src/data/site.js)");
  const noKey = Object.keys(direct).filter((f) => !direct[f]);
  if (noKey.length) todo.push(`Web3Forms key missing for: ${noKey.join(", ")} — those forms open the visitor's email app (src/data/site.js)`);
  if (Object.values(site.registration).some((v) => /^X+$/.test(v))) todo.push("registration / PAN / 80G numbers (src/data/site.js)");
  if (team.some((m) => m.name.en === "Full Name")) todo.push("team names (src/data/content.js)");
  // the generated placeholder art is all .svg; real photos will be .jpg/.png/.webp
  const svgs = [
    ...bannerSlides.filter((s) => s.active !== false).map((s) => s.image),
    ...programs.filter((p) => !galleryProjects.some((g) => g.id === p.project)).map((p) => p.image),
  ].filter((src) => src.endsWith(".svg"));
  if (svgs.length) todo.push(`${svgs.length} placeholder images (banner, programmes) — replace with real photos`);
  for (const item of todo) report.warn(`placeholder still on the site: ${item}`);
  if (!todo.length) report.ok("no placeholder content detected");
}
