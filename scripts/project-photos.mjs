/* Finds the photos for each project in the gallery.

   Every project has its own folder:  public/images/projects/<project id>/
   Whatever pictures are in that folder are shown, in file-name order.
   So adding a photo is just dropping a file in — no code to change.

   Used by vite.config.js (which hands the list to the site as the
   "virtual:project-photos" module) and by the tests. */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const PHOTO_EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;
export const PROJECTS_DIR = ["public", "images", "projects"];

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

/* Vite plugin: `import photos from "virtual:project-photos"` gives the
   list above. In `npm run dev`, adding or removing a photo reloads the page. */
export function projectPhotosPlugin() {
  const ID = "virtual:project-photos";
  const RESOLVED = "\0" + ID;
  let root = process.cwd();
  return {
    name: "project-photos",
    configResolved(config) {
      root = config.root;
    },
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load: (id) => (id === RESOLVED ? `export default ${JSON.stringify(listProjectPhotos(root))};` : null),
    configureServer(server) {
      const dir = join(root, ...PROJECTS_DIR);
      server.watcher.add(dir);
      const slashes = (p) => p.replace(/\\/g, "/");
      const onChange = (file) => {
        if (!slashes(file).startsWith(slashes(dir))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", onChange);
      server.watcher.on("unlink", onChange);
      server.watcher.on("addDir", onChange);
      server.watcher.on("unlinkDir", onChange);
    },
  };
}
