/* Shared pieces for the three forms (Contact, Get Involved, Request Help):
   the submit button, the hidden spam trap, and the message shown after sending.
   Used with hooks/useFormSender.js. */
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { mailtoHref, whatsappHref } from "../utils/sendForm";
import { btn, size } from "./ui";

/* `direct`: this form sends straight to the inbox (useFormSender's `direct`) */
export function SubmitButton({ status, direct, label, labelDirect }) {
  const { t } = useLang();
  const sending = status === "sending";
  return (
    <button type="submit" disabled={sending} className={`mt-3 ${btn.primary} ${size.lg} w-full sm:w-auto`}>
      {sending ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        <Icon name="mail" className="h-4 w-4" />
      )}
      {sending ? t("form.sending") : t(direct ? labelDirect : label)}
    </button>
  );
}

/* Invisible to people; bots that fill in every box tick it and are ignored. */
export function Honeypot({ direct }) {
  if (!direct) return null;
  return (
    <input
      type="checkbox"
      name="botcheck"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="hidden"
    />
  );
}

const linkClass = `${btn.outline} ${size.sm}`;

/* What happened after Send. `sentKey` is the form's own "what happens next" line. */
export function SendResult({ status, message, sentKey }) {
  const { t } = useLang();
  let box = null;

  if (status === "sent") {
    box = (
      <div className="mt-6 flex gap-3 rounded-3xl border border-brand/30 bg-brand-soft p-5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
          <Icon name="check" className="h-4 w-4" />
        </span>
        <div>
          <p className="font-semibold text-ink">{t("form.sent.title")}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{t(sentKey)}</p>
        </div>
      </div>
    );
  } else if (status === "failed" && message) {
    box = (
      <div className="mt-6 rounded-3xl border border-saffron-500/50 bg-saffron-500/10 p-5">
        <p className="font-semibold text-ink">{t("form.failed.title")}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{t("form.failed.body")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={whatsappHref(message.body)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <Icon name="whatsapp" className="h-4 w-4" />
            {t("form.whatsapp")}
          </a>
          <a href={mailtoHref(message.subject, message.body)} className={linkClass}>
            <Icon name="mail" className="h-4 w-4" />
            {t("form.email")}
          </a>
        </div>
      </div>
    );
  } else if (status === "opened" && message) {
    // not everyone has an email app set up on their phone
    box = (
      <div className="mt-6 rounded-3xl border border-line bg-surface-2 p-5">
        <p className="font-semibold text-ink">{t("form.opened.title")}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{t("form.opened.body")}</p>
        <a
          href={whatsappHref(message.body)}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 ${linkClass}`}
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          {t("form.whatsapp")}
        </a>
      </div>
    );
  }

  return <div role="status">{box}</div>;
}
