/* Makes public/images/og-image.jpg — the 1200×630 picture Facebook,
   WhatsApp and X show when someone shares a link to the site.
   (They cannot show SVG, so this has to be a JPG or PNG.)

   Run:  npm run og-image
   Needs Chrome or Edge installed, like the tests. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { site } from "../src/data/site.js";
import { launchBrowser, ROOT } from "../tests/e2e/lib.mjs";

const OUT = join(ROOT, "public", "images", "og-image.jpg");
const logo = readFileSync(join(ROOT, "public", "images", "logo.png")).toString("base64");

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&family=Inter:wght@500;600&family=Noto+Sans+Bengali:wght@600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative;
         background: linear-gradient(160deg, #0c2c1d 0%, #12402a 45%, #2c8455 100%);
         font-family: Inter, sans-serif; color: #f8f1e2; }
  svg.scene { position: absolute; inset: 0; }
  .text { position: absolute; left: 80px; top: 64px; width: 760px; }
  .logo { width: 132px; height: 132px; border-radius: 50%; background: #fff; display: block; }
  h1 { font-family: "Baloo 2", sans-serif; font-size: 84px; line-height: 1; color: #fff; margin-top: 30px; }
  .bn { font-family: "Noto Sans Bengali", sans-serif; font-size: 40px; color: #fbbf4a; margin-top: 10px; }
  .tag { font-size: 30px; font-weight: 600; margin-top: 22px; color: #fff; }
  .work { font-size: 22px; font-weight: 500; margin-top: 14px; color: #d5ebdd; }
  .url { position: absolute; left: 80px; bottom: 24px; font-size: 22px; font-weight: 600; color: #0c2c1d; }
</style></head>
<body>
  <svg class="scene" viewBox="0 0 1200 630">
    <circle cx="960" cy="170" r="150" fill="#fbbf4a" opacity="0.16"/>
    <circle cx="960" cy="170" r="88" fill="#fbbf4a" opacity="0.92"/>
    <path d="M0 520 Q 300 470 600 510 T 1200 490 L1200 630 L0 630 Z" fill="#e3cda2"/>
    <path d="M0 575 Q 400 540 800 570 T 1200 560 L1200 630 L0 630 Z" fill="#c9a86e" opacity="0.8"/>
    <g stroke="#12402a" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.5">
      <path d="M1010 500 V 300"/>
      <path d="M1010 318 q 84 -60 156 -26"/><path d="M1010 318 q -84 -60 -156 -26"/>
      <path d="M1010 340 q 60 14 120 54"/><path d="M1010 340 q -60 14 -120 54"/>
    </g>
  </svg>
  <div class="text">
    <img class="logo" src="data:image/png;base64,${logo}" alt="">
    <h1>${site.name}</h1>
    <div class="bn">${site.nameBn} · ${site.taglineBn}</div>
    <div class="tag">${site.tagline} — Kolkata</div>
    <div class="work">Food · Education · Health camps · Winter relief · Livelihood</div>
  </div>
  <div class="url">ngo-marudyaan.netlify.app</div>
</body></html>`;

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: OUT, type: "jpeg", quality: 88 });
await browser.close();
console.log(`Saved ${OUT}`);
