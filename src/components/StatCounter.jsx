import { useEffect, useRef, useState } from "react";

/* Counts up from 0 to `value` the first time it scrolls into view. */
export default function StatCounter({ value, suffix = "", label }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const duration = 1400;
        const start = performance.now();
        let frame;
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(Math.round(value * eased));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        node._cancel = () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      node._cancel?.();
    };
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-bold text-saffron-400 sm:text-5xl">
        {shown.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-sand-200/80">{label}</div>
    </div>
  );
}
