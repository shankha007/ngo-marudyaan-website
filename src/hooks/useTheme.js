import { useCallback, useSyncExternalStore } from "react";

/* Light / dark mode.
   The script in index.html sets <html data-theme> before the first paint.
   This hook reads it, lets the visitor switch, and remembers the choice.
   Until the visitor picks one, the site follows the device setting, even
   if it changes while the page is open (e.g. at sunset). */

const STORAGE_KEY = "marudyaan-theme";
const media = () =>
  typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

const current = () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

const listeners = new Set();
const notify = () => listeners.forEach((l) => l());

function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  notify();
}

function saved() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null; // storage blocked (private mode)
  }
}

function subscribe(listener) {
  listeners.add(listener);
  const mq = media();
  const onDevice = (e) => {
    if (!saved()) apply(e.matches ? "dark" : "light");
  };
  mq?.addEventListener?.("change", onDevice);
  return () => {
    listeners.delete(listener);
    mq?.removeEventListener?.("change", onDevice);
  };
}

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => "light");
  const toggle = useCallback(() => {
    const next = current() === "dark" ? "light" : "dark";
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* not remembered, but still switched for this visit */
    }
    apply(next);
  }, []);
  return { theme, toggle };
}
