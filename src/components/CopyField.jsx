import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext";
import Icon from "./Icon";

/* A label + value row with a copy button — used for UPI and bank details.
   `compact`: copy without spaces. Account numbers read best grouped
   ("1234 5678 9012") but many banking apps reject pasted spaces. */
export default function CopyField({ label, value, mono = false, compact = false }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      const text = compact ? String(value).replace(/\s+/g, "") : String(value);
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* clipboard blocked — the value is visible on screen anyway */
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-oasis-100 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="text-xs tracking-wide text-oasis-800/60 uppercase">{label}</div>
        <div
          className={`mt-0.5 break-words text-oasis-900 ${
            mono ? "font-mono text-[15px] tracking-wide" : "font-medium"
          }`}
        >
          {value}
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          copied
            ? "border-oasis-300 bg-oasis-50 text-oasis-700"
            : "border-oasis-200 text-oasis-700 hover:border-oasis-400 hover:bg-oasis-50"
        }`}
      >
        <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
        {copied ? t("donate.copied") : t("donate.copy")}
      </button>
    </div>
  );
}
