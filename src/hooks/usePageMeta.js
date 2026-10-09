import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../data/site";

/* Finds <meta>/<link> in <head> by `selector`, creating it from `attrs` if missing. */
function headTag(tagName, selector, attrs) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement(tagName);
    for (const [k, v] of Object.entries(attrs)) tag.setAttribute(k, v);
    document.head.appendChild(tag);
  }
  return tag;
}
const setMeta = (attr, key, content) =>
  headTag("meta", `meta[${attr}="${key}"]`, { [attr]: key }).setAttribute("content", content);

/* Sets each page's title, description and search-engine details:
   - the canonical link and og:url: this page's address on site.url, with no
     query string or trailing slash, so /about/ and /about?utm_source=… count
     as the one page /about;
   - og:title / og:description, so a shared link previews the right page;
   - `noindex` (the 404 page) asks search engines to leave the page out.
   (A front-end-only site has no server rendering, so this runs on mount;
   Google runs the page's JavaScript and reads the updated tags.) */
export default function usePageMeta(title, description, { noindex = false } = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }

    const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const url = site.url + path;
    const canonical = headTag("link", 'link[rel="canonical"]', { rel: "canonical" });
    if (noindex) canonical.remove();
    else canonical.setAttribute("href", url);
    setMeta("property", "og:url", url);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
  }, [title, description, pathname, noindex]);
}
