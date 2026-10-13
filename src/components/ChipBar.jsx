import { useEffect, useRef, useState } from "react";

/* A row of chips that sticks under the header and scrolls sideways when it
   does not fit (About, Past Works, Gallery). An edge fades out while there
   is more to scroll that way, so a cut-off chip reads as "swipe for more",
   and the active chip (aria-current / aria-pressed) is scrolled into view.
   `label` makes it a <nav>; `active` is whatever identifies the active chip. */
export default function ChipBar({ label, active, className = "", rowClassName = "", children }) {
  const ref = useRef(null);
  const [fade, setFade] = useState({ left: false, right: false });

  useEffect(() => {
    const row = ref.current;
    const update = () =>
      setFade({
        left: row.scrollLeft > 4,
        right: row.scrollLeft + row.clientWidth < row.scrollWidth - 4,
      });
    update();
    row.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver === "function" ? new ResizeObserver(update) : null;
    ro?.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    const row = ref.current;
    const chip = row.querySelector('[aria-current="true"], [aria-pressed="true"]');
    if (!chip || row.scrollWidth <= row.clientWidth) return;
    const r = row.getBoundingClientRect();
    const c = chip.getBoundingClientRect();
    row.scrollTo({ left: row.scrollLeft + c.left - r.left - (r.width - c.width) / 2, behavior: "smooth" });
  }, [active]);

  const edge = "2.5rem";
  const mask =
    fade.left || fade.right
      ? `linear-gradient(to right, ${fade.left ? `transparent, black ${edge}` : "black"}, ${
          fade.right ? `black calc(100% - ${edge}), transparent` : "black"
        })`
      : undefined;

  const Row = label ? "nav" : "div";
  return (
    <div className={`sticky top-[4.75rem] z-30 sm:top-[5rem] ${className}`}>
      <Row
        ref={ref}
        aria-label={label}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className={`container-page flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${rowClassName}`}
      >
        {children}
      </Row>
    </div>
  );
}
