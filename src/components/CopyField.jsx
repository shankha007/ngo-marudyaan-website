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
    <div
      data-copy-row
      className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line py-3.5 last:border-b-0"
    >
      <div className="min-w-0">
        <div className="text-xs font-semibold tracking-wide text-ink-3 uppercase">{label}</div>
        <div
          data-copy-value
          className={`mt-0.5 break-words text-ink ${mono ? "font-mono text-[15px] tracking-wide" : "font-medium"}`}
        >
          {value}
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
          copied
            ? "bg-brand text-on-brand"
            : "border border-line-strong text-ink hover:border-ink"
        }`}
      >
        <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
        {copied ? t("donate.copied") : t("donate.copy")}
      </button>
    </div>
  );
}
