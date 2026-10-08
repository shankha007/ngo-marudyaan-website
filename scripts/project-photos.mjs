/* Finds and prepares the photos for each project in the gallery.

   Every project has its own folder:  public/images/projects/<project id>/
   Whatever pictures are in that folder are shown, in file-name order.
   So adding a photo is just dropping a file in — no code to change.

   For fast pages, each photo is also turned into smaller WebP copies
   (400, 800 and 1600 px wide) and a tiny blurred preview, so a phone
   downloads a ~30 KB thumbnail instead of the full photo. This happens
   automatically in `npm run dev` and `npm run build` — the originals in
   the folder are never changed.

   Used by vite.config.js (which hands the photo list to the site as the
   "virtual:project-photos" module) and by the tests. */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const PHOTO_EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;
export const PROJECTS_DIR = ["public", "images", "projects"];
export const VARIANT_WIDTHS = [400, 800, 1600];
const VARIANT_DIR = "_w"; // /images/projects/<id>/_w/<name>-<width>-<hash>.webp
const BLUR_WIDTH = 16;

const byName = (a, b) => a.localeCompare(b, "en", { numeric: true });

/* { "2021-micro-library": ["01.jpg", "02.jpg", …], … } */
export function listProjectPhotos(root) {
  const dir = join(root, ...PROJECTS_DIR);
  if (!existsSync(dir)) return {};
  const out = {};
  for (const entry of readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    out[entry.name] = readdirSync(join(dir, entry.name))
      .filter((f) => PHOTO_EXTENSIONS.test(f))
      .sort(byName);
  }
  return out;
}

/* ---------- responsive copies ---------- */

const loadSharp = async () => (await import("sharp")).default;

/* Size, blurred preview and WebP copies of one photo. The result is cached
   by the photo's content in node_modules/.cache, so unchanged photos are
   never processed twice. */
async function describePhoto(root, id, file) {
  const path = join(root, ...PROJECTS_DIR, id, file);
  const data = readFileSync(path);
  const hash = createHash("sha1").update(data).digest("hex").slice(0, 10);
  const cacheDir = join(root, "node_modules", ".cache", "project-photos");
  const metaFile = join(cacheDir, `${hash}.json`);
  let meta;
  if (existsSync(metaFile)) {
    meta = JSON.parse(readFileSync(metaFile, "utf8"));
  } else {
    const sharp = await loadSharp();
    const { width, height } = await sharp(data).rotate().metadata().then((m) =>
      // EXIF orientations 5–8 are portrait photos stored sideways
      (m.orientation ?? 1) >= 5 ? { width: m.height, height: m.width } : m,
    );
    const blur = await sharp(data).rotate().resize(BLUR_WIDTH).blur(1).webp({ quality: 40 }).toBuffer();
    meta = { width, height, blur: `data:image/webp;base64,${blur.toString("base64")}` };
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(metaFile, JSON.stringify(meta));
  }
  // never upscale: widths above the original collapse to the original width
  const widths = [...new Set(VARIANT_WIDTHS.map((w) => Math.min(w, meta.width)))];
  const name = file.replace(/\.[^.]+$/, "");
  const variants = widths.map((w) => ({
    w,
    url: `/images/projects/${id}/${VARIANT_DIR}/${name}-${w}-${hash}.webp`,
    cacheFile: join(cacheDir, `${hash}-${w}.webp`),
    source: path,
  }));
  return { file, width: meta.width, height: meta.height, blur: meta.blur, variants };
}

async function makeVariant(v) {
  if (!existsSync(v.cacheFile)) {
    const sharp = await loadSharp();
    const out = await sharp(readFileSync(v.source)).rotate().resize(v.w).webp({ quality: 78 }).toBuffer();
    writeFileSync(v.cacheFile, out);
  }
  return readFileSync(v.cacheFile);
}

/* { [id]: [{ file, width, height, blur, variants: [{ w, url, … }] }] } */
export async function describeProjectPhotos(root) {
  const out = {};
  for (const [id, files] of Object.entries(listProjectPhotos(root))) {
    out[id] = [];
    for (const file of files) out[id].push(await describePhoto(root, id, file));
  }
  return out;
}

/* What the site gets: no file-system paths, just what <img> needs. */
const forBrowser = (described) =>
  Object.fromEntries(
    Object.entries(described).map(([id, photos]) => [
      id,
      photos.map(({ file, width, height, blur, variants }) => ({
        file,
        width,
        height,
        blur,
        srcset: variants.map((v) => [v.url, v.w]),
      })),
    ]),
  );

/* Vite plugin: `import photos from "virtual:project-photos"` gives the
   photo list with sizes, previews and WebP copies. In `npm run dev`,
   adding or removing a photo reloads the page. */
export function projectPhotosPlugin() {
  const ID = "virtual:project-photos";
  const RESOLVED = "\0" + ID;
  let root = process.cwd();
  let described = null;
  const describe = async () => (described ??= await describeProjectPhotos(root));
  return {
    name: "project-photos",
    configResolved(config) {
      root = config.root;
    },
    resolveId: (id) => (id === ID ? RESOLVED : null),
    async load(id) {
      if (id !== RESOLVED) return null;
      return `export default ${JSON.stringify(forBrowser(await describe()))};`;
    },
    /* Home page: start downloading the first banner photo straight away,
       instead of waiting for the site's JavaScript to load and ask for it.
       This only writes the photo's details into a <meta name="hero-preload">
       tag; the fixed script in index.html adds the preload on "/" alone, so
       other pages don't download a banner they never show. (Keeping that
       script fixed lets the Content-Security-Policy allow it by its hash.) */
    async transformIndexHtml() {
      const banner = await import(pathToFileURL(join(root, "src", "data", "banner.js")).href + `?t=${Date.now()}`);
      const first = banner.bannerSlides.find((s) => s.active !== false);
      if (!first) return;
      const [, id, file] = first.image.match(/^\/images\/projects\/([^/]+)\/([^/]+)$/) ?? [];
      const photo = id && (await describe())[id]?.find((p) => p.file === file);
      const link = {
        rel: "preload",
        as: "image",
        href: first.image,
        fetchPriority: "high",
        ...(photo && { imageSrcset: photo.variants.map((v) => `${v.url} ${v.w}w`).join(", "), imageSizes: "100vw" }),
      };
      return [{ tag: "meta", attrs: { name: "hero-preload", content: JSON.stringify(link) }, injectTo: "head-prepend" }];
    },
    /* build: write every WebP copy into dist/ */
    async generateBundle() {
      for (const photos of Object.values(await describe())) {
        for (const photo of photos) {
          for (const v of photo.variants) {
            this.emitFile({ type: "asset", fileName: v.url.slice(1), source: await makeVariant(v) });
          }
        }
      }
    },
    /* dev: make each WebP copy the first time it is asked for */
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = decodeURIComponent((req.url || "").split("?")[0]);
        if (!url.includes(`/${VARIANT_DIR}/`) || !url.startsWith("/images/projects/")) return next();
        try {
          const variant = Object.values(await describe())
            .flat()
            .flatMap((p) => p.variants)
            .find((v) => v.url === url);
          if (!variant) return next();
          res.setHeader("Content-Type", "image/webp");
          res.end(await makeVariant(variant));
        } catch (err) {
          next(err);
        }
      });

      const dir = join(root, ...PROJECTS_DIR);
      server.watcher.add(dir);
      const slashes = (p) => p.replace(/\\/g, "/");
      const onChange = (file) => {
        if (!slashes(file).startsWith(slashes(dir))) return;
        described = null;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      for (const event of ["add", "change", "unlink", "addDir", "unlinkDir"]) server.watcher.on(event, onChange);
    },
  };
}
