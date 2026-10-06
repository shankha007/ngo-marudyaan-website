/* The gallery as the site uses it: the projects in projects.js joined
   with the photos in public/images/projects/. Edit projects.js, not this. */
import photoMap from "virtual:project-photos";
import { buildGallery, projectPhotoSrc, projects } from "./projects";

export const galleryProjects = buildGallery(projects, photoMap);

/* All gallery photos, newest project first. */
export const galleryPhotos = galleryProjects.flatMap((p) => p.photos);

/* A project by id (e.g. for a programme's picture), or undefined. */
export const findProject = (id) => galleryProjects.find((p) => p.id === id);

/* A programme's picture: its project's cover photo if it has one,
   otherwise its own `image`. */
export const programImage = (program) => findProject(program.project)?.coverSrc ?? program.image;

/* Size, blurred preview and WebP copies for any photo under
   /images/projects/ — whether or not its project is listed — so a banner
   or programme that points at a project photo loads the small copies too. */
const imageInfo = new Map(
  Object.entries(photoMap).flatMap(([id, photos]) => photos.map((p) => [projectPhotoSrc(id, p.file), p])),
);
export const photoInfo = (src) => imageInfo.get(src);

/* "a-400.webp 400w, a-800.webp 800w, …" for <img srcset>. */
export const srcSetFor = (info) => info.srcset.map(([url, w]) => `${url} ${w}w`).join(", ");

/* Starts downloading a photo before it is shown (e.g. the next photo in
   the lightbox), at the size `sizes` would pick. */
export function preloadPhoto(src, sizes = "100vw") {
  const info = photoInfo(src);
  const img = new Image();
  if (info) {
    img.sizes = sizes;
    img.srcset = srcSetFor(info);
  }
  img.src = src;
}
