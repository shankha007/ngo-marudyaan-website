import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { strings } from "./strings";

const STORAGE_KEY = "marudyaan-lang";
const LanguageContext = createContext(null);

function readInitialLang() {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "bn") return saved;
  } catch {
    /* private mode / storage blocked — fall through */
  }
  const nav = window.navigator?.language || "";
  return nav.toLowerCase().startsWith("bn") ? "bn" : "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  /* UI label lookup: t("nav.home") */
  const t = useCallback(
    (key) => strings[lang]?.[key] ?? strings.en[key] ?? key,
    [lang],
  );

  /* Content lookup for { en, bn } objects: tr(program.title) */
  const tr = useCallback(
    (field) => {
      if (field == null) return "";
      if (typeof field === "string") return field;
      return field[lang] ?? field.en ?? "";
    },
    [lang],
  );

  const toggle = useCallback(() => setLang((l) => (l === "en" ? "bn" : "en")), []);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t, tr }),
    [lang, toggle, t, tr],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
