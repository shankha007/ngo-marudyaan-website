/* Shared pieces for the three forms (Contact, Get Involved, Request Help):
   the submit button, the hidden spam trap, and the message shown after sending.
   Used with hooks/useFormSender.js. */
import Icon from "./Icon";
import { useLang } from "../i18n/LanguageContext";
import { mailtoHref, whatsappHref } from "../utils/sendForm";

/* `direct`: this form sends straight to the inbox (useFormSender's `direct`) */
export function SubmitButton({ status, direct, label, labelDirect }) {
  const { t } = useLang();
  const sending = status === "sending";
  return (
    <button
      type="submit"
      disabled={sending}
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-oasis-700 px-7 py-3.5 font-semibold text-white transition hover:bg-oasis-600 disabled:cursor-wait disabled:opacity-70"
    >
      <Icon name="mail" className="h-4 w-4" />
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

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-oasis-300 bg-white px-5 py-2.5 text-sm font-semibold text-oasis-700 transition hover:border-oasis-500";

/* What happened after Send. `sentKey` is the form's own "what happens next" line. */
export function SendResult({ status, message, sentKey }) {
  const { t } = useLang();
  let box = null;

  if (status === "sent") {
    box = (
      <div className="mt-6 flex gap-3 rounded-2xl border border-oasis-200 bg-oasis-50 p-5">
        <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-oasis-600" />
        <div>
          <p className="font-semibold text-oasis-900">{t("form.sent.title")}</p>
          <p className="mt-1 text-sm leading-relaxed text-oasis-800/75">{t(sentKey)}</p>
        </div>
      </div>
    );
  } else if (status === "failed" && message) {
    box = (
      <div className="mt-6 rounded-2xl border border-saffron-500/40 bg-saffron-500/10 p-5">
        <p className="font-semibold text-oasis-900">{t("form.failed.title")}</p>
        <p className="mt-1 text-sm leading-relaxed text-oasis-800/75">{t("form.failed.body")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={whatsappHref(message.body)} target="_blank" rel="noreferrer" className={linkClass}>
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
      <div className="mt-6 rounded-2xl border border-oasis-200 bg-oasis-50 p-5">
        <p className="font-semibold text-oasis-900">{t("form.opened.title")}</p>
        <p className="mt-1 text-sm leading-relaxed text-oasis-800/75">{t("form.opened.body")}</p>
        <a
          href={whatsappHref(message.body)}
          target="_blank"
          rel="noreferrer"
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
