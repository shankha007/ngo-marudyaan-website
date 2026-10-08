/* Security headers: one source of truth, checked on every build.

   The headers live in public/_headers (Netlify). This file
   - reads the "/*" block from it, so `npm run preview` and the tests are
     served exactly the headers the live site sends;
   - at build time, checks that every inline <script> in index.html is
     allowed by its sha256 hash in the Content-Security-Policy, and that
     vercel.json sends the same security headers. If not, the build stops
     with the exact text to paste, so a blocked script can never ship. */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* { "Content-Security-Policy": "…", … } from the "/*" block of public/_headers */
export function siteHeaders(root) {
  const lines = readFileSync(join(root, "public", "_headers"), "utf8").split(/\r?\n/);
  const headers = {};
  let inBlock = false;
  for (const line of lines) {
    if (/^\S/.test(line)) inBlock = line.trim() === "/*";
    else if (inBlock && line.includes(":")) {
      const at = line.indexOf(":");
      headers[line.slice(0, at).trim()] = line.slice(at + 1).trim();
    }
  }
  return headers;
}

const hashOf = (code) => `'sha256-${createHash("sha256").update(code, "utf8").digest("base64")}'`;

export function securityHeadersPlugin() {
  let root = process.cwd();
  return {
    name: "security-headers",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const headers = siteHeaders(root);
        const csp = headers["Content-Security-Policy"] || "";
        const problems = [];

        // every inline script (no src=) must be allowed by its hash
        for (const [, attrs, code] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
          if (/\bsrc=/.test(attrs) || !code.trim()) continue;
          const hash = hashOf(code);
          if (!csp.includes(hash)) {
            problems.push(`public/_headers: the Content-Security-Policy's script-src must list ${hash} (replace the old 'sha256-…' value)`);
          }
        }

        // vercel.json must send the same security headers
        const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
        const all = vercel.headers?.find((h) => h.source === "/(.*)")?.headers ?? [];
        for (const [key, value] of Object.entries(headers)) {
          const v = all.find((h) => h.key === key)?.value;
          if (v !== value) problems.push(`vercel.json: "${key}" must be exactly the value in public/_headers`);
        }

        if (problems.length) throw new Error(`Security headers are out of date:\n  - ${problems.join("\n  - ")}`);
        return html;
      },
    },
  };
}
