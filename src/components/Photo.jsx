import { useState } from "react";
import { photoInfo, srcSetFor } from "../data/gallery";

/* An <img> that loads fast. For photos under /images/projects/ it adds:
   - the small WebP copies, so the browser downloads only the size it
     shows (`sizes` says how wide the picture is on screen);
   - the real width and height, so nothing jumps as it loads;
   - a blurred preview, shown until the photo arrives.
   Every picture is lazy-loaded unless `priority` is set (use that only
   for the first thing a visitor sees, like the top banner).
   Any other image (SVG placeholders, logos) is shown as a plain <img>. */
export default function Photo({ src, alt = "", sizes = "100vw", priority = false, style, ...rest }) {
  const info = photoInfo(src);
  const [loaded, setLoaded] = useState(false);

  const responsive = info && {
    srcSet: srcSetFor(info),
    sizes,
    width: info.width,
    height: info.height,
  };
  const preview = info &&
    !loaded && {
      backgroundImage: `url("${info.blur}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

  return (
    <img
      src={src}
      alt={alt}
      {...responsive}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      onLoad={() => setLoaded(true)}
      style={preview ? { ...preview, ...style } : style}
      {...rest}
    />
  );
}
