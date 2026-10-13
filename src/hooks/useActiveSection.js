import { useEffect, useState } from "react";

/* Which of the sections with these ids the visitor is reading: the last one
   whose top has scrolled up to just under the sticky header and chips
   (sections use scroll-mt-36, so a chip click lands it exactly there).
   null above the first one and once past the end of the last. */
const LINE = 150;

export default function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    const sections = key.split("|").map((id) => document.getElementById(id)).filter(Boolean);
    const update = () => {
      let current = null;
      for (const s of sections) if (s.getBoundingClientRect().top <= LINE) current = s;
      setActive(current && current.getBoundingClientRect().bottom > LINE ? current.id : null);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [key]);

  return active;
}
