/* Copies photos from any folder into a gallery project.

   Run:  npm run add-photos -- "<folder with the photos>" <project id>
   e.g.  npm run add-photos -- "C:\Users\me\Downloads\Puja 2025" 2025-puja-drive

   • Photos go to public/images/projects/<project id>/ as 01.jpg, 02.jpg, …
     (after any photos already there, so it can add to an existing project).
   • Exact duplicates — of each other or of photos already in the project —
     are skipped.
   • Then add the project to src/data/projects.js if it isn't there yet. */
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { ROOT } from "../tests/e2e/lib.mjs";
import { PHOTO_EXTENSIONS, PROJECTS_DIR } from "./project-photos.mjs";

const [source, id] = process.argv.slice(2);
if (!source || !id) {
  console.error('Usage: npm run add-photos -- "<folder with the photos>" <project id>');
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error(`Project id "${id}" should be lower-case words joined by dashes, e.g. 2025-puja-drive`);
  process.exit(1);
}
if (!existsSync(source)) {
  console.error(`Folder not found: ${source}`);
  process.exit(1);
}

const dest = join(ROOT, ...PROJECTS_DIR, id);
mkdirSync(dest, { recursive: true });

const hash = (file) => createHash("sha1").update(readFileSync(file)).digest("hex");
const existing = readdirSync(dest).filter((f) => PHOTO_EXTENSIONS.test(f));
const seen = new Set(existing.map((f) => hash(join(dest, f))));
let next = existing.reduce((n, f) => Math.max(n, parseInt(f, 10) || 0), 0) + 1;

const incoming = readdirSync(source)
  .filter((f) => PHOTO_EXTENSIONS.test(f))
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

let added = 0;
let skipped = 0;
for (const file of incoming) {
  const from = join(source, file);
  const h = hash(from);
  if (seen.has(h)) {
    skipped++;
    console.log(`  skip  ${file}  (duplicate)`);
    continue;
  }
  seen.add(h);
  const ext = extname(file).toLowerCase().replace(".jpeg", ".jpg");
  const name = String(next++).padStart(2, "0") + ext;
  copyFileSync(from, join(dest, name));
  added++;
  console.log(`  add   ${file}  →  ${name}`);
}

console.log(`\n${added} photo(s) added to public/images/projects/${id}/${skipped ? `, ${skipped} duplicate(s) skipped` : ""}.`);
const config = join(ROOT, "src", "data", "projects.js");
const listed = existsSync(config) && readFileSync(config, "utf8").includes(`id: "${id}"`);
if (!listed) console.log(`Next: add a project with id: "${id}" to src/data/projects.js (copy an existing one).`);
