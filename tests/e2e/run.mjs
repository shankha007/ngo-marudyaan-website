/* End-to-end test runner.

   npm test                 build the site, serve it locally, run every suite
   npm run test:live        run against the live Netlify site
   npm run test:quick       fewer screen sizes/languages (about 2 minutes)

   Options (after --):  --only=smoke,features   --base=https://…   --no-build
   Env: CHROME_PATH=… to use a specific browser, HEADED=1 to watch it run. */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, createReporter, launchBrowser } from "./lib.mjs";

const LIVE_URL = process.env.LIVE_URL || "https://ngo-marudyaan.netlify.app";
const SUITES = ["smoke", "navigation", "features", "a11y", "netlify-badge"];

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

const live = flag("live") || (option("base") || "").includes("netlify.app");
const quick = flag("quick") || !!process.env.QUICK;
const only = option("only")?.split(",").map((s) => s.trim());
const selected = only ? SUITES.filter((s) => only.includes(s)) : SUITES;
if (only && selected.length !== only.length) {
  console.error(`Unknown suite in --only. Available: ${SUITES.join(", ")}`);
  process.exit(2);
}

const vite = join(ROOT, "node_modules", "vite", "bin", "vite.js");
const run = (cmdArgs) =>
  new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [vite, ...cmdArgs], { cwd: ROOT, stdio: "inherit" });
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`vite ${cmdArgs[0]} exited with ${code}`))));
  });
const freePort = () =>
  new Promise((resolve) => {
    const s = createServer().listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
async function waitFor(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`server at ${url} did not start`);
}

let server = null;
let base = option("base") || (live ? LIVE_URL : null);
const started = Date.now();
const report = createReporter();
let browser = null;

try {
  if (!base) {
    if (!flag("no-build")) {
      console.log("Building the site…");
      await run(["build", "--logLevel", "warn"]);
    }
    const port = await freePort();
    server = spawn(process.execPath, [vite, "preview", "--port", String(port), "--strictPort"], { cwd: ROOT, stdio: "ignore" });
    base = `http://localhost:${port}`;
    await waitFor(base);
  }
  base = base.replace(/\/$/, "");
  console.log(`Testing ${base}${quick ? " (quick)" : ""} — suites: ${selected.join(", ")}`);

  browser = await launchBrowser();
  for (const name of selected) {
    const mod = await import(pathToFileURL(join(ROOT, "tests", "e2e", `${name}.test.mjs`)).href);
    report.suite(mod.title || name);
    try {
      await mod.default({ browser, base, live, quick, report });
    } catch (err) {
      report.fail(`suite "${name}" stopped with an error`, String(err?.message || err).split("\n")[0]);
    }
  }
} catch (err) {
  report.fail("test run could not start", String(err?.message || err));
} finally {
  await browser?.close().catch(() => {});
  server?.kill();
}

const secs = Math.round((Date.now() - started) / 1000);
console.log(`\n${"─".repeat(60)}`);
console.log(`${report.passed} passed, ${report.failed.length} failed, ${report.warnings.length} warnings  (${Math.floor(secs / 60)}m ${secs % 60}s)`);
if (report.failed.length) {
  console.log("\nFailed:");
  for (const f of report.failed) console.log(`  ✗ ${f}`);
  console.log("\nScreenshots of failing pages (if any): tests/e2e/output/");
}
if (report.warnings.length) {
  console.log("\nWarnings (do not fail the run):");
  for (const w of report.warnings) console.log(`  ⚠ ${w}`);
}
process.exit(report.failed.length ? 1 : 0);
