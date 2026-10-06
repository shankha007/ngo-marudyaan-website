/* The gallery as the site uses it: the projects in projects.js joined
   with the photos in public/images/projects/. Edit projects.js, not this. */
import photoMap from "virtual:project-photos";
import { buildGallery, projects } from "./projects";

export const galleryProjects = buildGallery(projects, photoMap);

/* All gallery photos, newest project first. */
export const galleryPhotos = galleryProjects.flatMap((p) => p.photos);

/* A project by id (e.g. for a programme's picture), or undefined. */
export const findProject = (id) => galleryProjects.find((p) => p.id === id);

/* A programme's picture: its project's cover photo if it has one,
   otherwise its own `image`. */
export const programImage = (program) => findProject(program.project)?.coverSrc ?? program.image;
