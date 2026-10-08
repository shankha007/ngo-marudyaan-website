import { useState } from "react";
import { Honeypot, SendResult, SubmitButton } from "../components/FormSend";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { btn, field, fieldLabel, size } from "../components/ui";
import { helpPrograms } from "../data/content";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import useFormSender from "../hooks/useFormSender";
import usePageMeta from "../hooks/usePageMeta";
import { isValidEmail, isValidPhone } from "../utils/validation";


const groupTitle = "font-display text-xl font-bold text-ink";

function Required() {
  return <span aria-hidden="true" className="text-danger">{"\u00a0"}*</span>;
}

/* "" → 0, "3" → 3, anything that is not a whole number → NaN */
const count = (value) => {
  const v = value.trim();
  if (v === "") return 0;
  return /^\d+$/.test(v) ? Number(v) : NaN;
};

const forOptions = [
  { id: "self", key: "help.form.for.self", en: "Myself / my family" },
  { id: "other", key: "help.form.for.other", en: "Someone else I know" },
];

/* ids, not labels, so a language switch keeps the choices intact */
const emptyForm = {
  program: "",
  name: "",
  phone: "",
  email: "",
  requestFor: forOptions[0].id,
  address: "",
  total: "",
  children: "",
  elderly: "",
  needs: [],
  details: "",
};

export default function RequestHelp() {
  const { t, tr } = useLang();
  const [form, setForm] = useState(emptyForm);
  // message KEY (not text) so it re-translates on a language switch
  const [errorKey, setErrorKey] = useState("");
  const [invalid, setInvalid] = useState({});
  const sender = useFormSender("help");

  usePageMeta(
    `${t("help.title")} — ${site.name}`,
    "Ask NGO Marudyaan for help from our Durga Puja clothes drive or winter blanket drive in Kolkata and West Bengal.",
  );

  const program = helpPrograms.find((p) => p.id === form.program);

  const clear = (...keys) => {
    sender.reset(); // the details changed, so the WhatsApp copy would be stale
    if (keys.some((k) => invalid[k])) {
      setInvalid((v) => ({ ...v, ...Object.fromEntries(keys.map((k) => [k, false])) }));
    }
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    clear(key, ...(key === "details" ? ["needs"] : []), ...(key === "elderly" ? ["children"] : []));
  };

  const pickProgram = (id) => {
    // drop ticked needs that belong to the drive we just left
    setForm((f) => ({ ...f, program: id, needs: [] }));
    clear("program", "needs", "details");
  };

  const toggleNeed = (id) => {
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(id) ? f.needs.filter((n) => n !== id) : [...f.needs, id],
    }));
    clear("needs", "details");
  };

  /* Every problem is marked at once, the message and focus go to the
     first one in the order the fields appear on the page. */
  const validate = () => {
    const total = count(form.total);
    const children = count(form.children);
    const elderly = count(form.elderly);
    const hasNeeds = form.needs.length > 0 || form.details.trim() !== "";
    return [
      ["program", !program, "help.err.program"],
      ["name", !form.name.trim(), "help.err.contact"],
      ["phone", !form.phone.trim(), "help.err.contact"],
      ["phone", form.phone.trim() !== "" && !isValidPhone(form.phone), "form.phone.invalid"],
      ["address", !form.address.trim(), "help.err.contact"],
      ["email", form.email.trim() !== "" && !isValidEmail(form.email), "form.email.invalid"],
      ["total", !(total >= 1), "help.err.people"],
      ["children", Number.isNaN(children) || Number.isNaN(elderly), "help.err.people"],
      ["children", total >= 1 && children + elderly > total, "help.err.breakdown"],
      [program?.needs.length ? "needs" : "details", !!program && !hasNeeds, "help.err.needs"],
    ].filter(([, failed]) => failed);
  };

  /* The same details as plain text (email app / WhatsApp) and as separate
     labelled fields (Web3Forms), always in English for the volunteers. */
  const buildEmail = () => {
    const forLabel = forOptions.find((o) => o.id === form.requestFor)?.en;
    const needLabels = program.needs.filter((n) => form.needs.includes(n.id)).map((n) => n.label.en);
    const details = form.details.trim();
    const lines = [
      `HELP REQUEST — ${program.title.en}`,
      "",
      `Name: ${form.name.trim()}`,
      `Phone / WhatsApp: ${form.phone.trim()}`,
      `Email: ${form.email.trim() || "(not given)"}`,
      `Request is for: ${forLabel}`,
      `Address: ${form.address.trim()}`,
      "",
      `Number of people who need help: ${count(form.total)}`,
      `  Children (under 14): ${count(form.children)}`,
      `  Elderly (60+): ${count(form.elderly)}`,
    ];
    if (needLabels.length) lines.push("", "Help needed:", ...needLabels.map((l) => `- ${l}`));
    if (details) lines.push("", "More details:", details);
    lines.push("", "— Sent from the Request Help form on the website");
    return {
      subject: `Help request: ${program.title.en} — ${form.name.trim()} (${count(form.total)} people)`,
      body: lines.join("\n"),
      fields: {
        Drive: program.title.en,
        "Phone / WhatsApp": form.phone.trim(),
        "Request is for": forLabel,
        Address: form.address.trim(),
        "Number of people who need help": String(count(form.total)),
        "Children (under 14)": String(count(form.children)),
        "Elderly (60+)": String(count(form.elderly)),
        ...(needLabels.length ? { "Help needed": needLabels.join(", ") } : {}),
      },
      note: details || "(no extra details)",
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const problems = validate();
    if (problems.length) {
      setInvalid(Object.fromEntries(problems.map(([key]) => [key, true])));
      setErrorKey(problems[0][2]);
      sender.reset();
      formEl.querySelector(`[name="${problems[0][0]}"]`)?.focus();
      return;
    }
    setInvalid({});
    setErrorKey("");
    const { subject, body, fields, note } = buildEmail();
    const sent = await sender.send({
      subject,
      body,
      name: form.name.trim(),
      email: form.email.trim(),
      fields,
      note,
      form: formEl,
    });
    if (sent && sender.direct) setForm(emptyForm);
  };

  const describedBy = (key) => (invalid[key] ? "help-error" : undefined);

  const steps = ["help.how.1", sender.direct ? "help.how.2.direct" : "help.how.2", "help.how.3"];

  return (
    <>
      <PageHeader title={t("help.title")} sub={t("help.sub")} />

      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* how it works */}
          <Reveal className="lg:col-span-2">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">{t("help.how.title")}</h2>
            <ol className="relative mt-8 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[21px] before:w-0.5 before:bg-line before:content-['']">
              {steps.map((key, i) => (
                <li key={key} className="relative flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-lime-400 font-display text-lg font-bold text-oasis-900 ring-4 ring-canvas">
                    {i + 1}
                  </span>
                  <p className="pt-2 leading-relaxed text-ink-2">{t(key)}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-4xl border border-line bg-surface p-6 shadow-soft">
              <p className="text-sm leading-relaxed text-ink-2">{t(sender.direct ? "help.how.note.direct" : "help.how.note")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className={`${btn.outline} ${size.sm}`}
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {site.contact.phone}
                </a>
                <a
                  href={`https://wa.me/${site.contact.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn.outline} ${size.sm}`}
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  {site.contact.whatsapp}
                </a>
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={100} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-4xl border border-line bg-surface p-6 shadow-lift sm:p-10"
            >
              <h2 className="font-display text-3xl font-bold text-ink">{t("help.form.title")}</h2>
              <p className="mt-2 text-sm text-ink-2">{t("help.form.note")}</p>

              {/* which drive */}
              <fieldset className="mt-6">
                <legend className={groupTitle}>
                  {t("help.form.program")}
                  <Required />
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {helpPrograms.map((p) => {
                    const checked = form.program === p.id;
                    return (
                      <label
                        key={p.id}
                        className={`relative flex cursor-pointer flex-col rounded-3xl border-2 p-4 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/30 ${
                          checked
                            ? "border-brand bg-brand-soft"
                            : invalid.program
                              ? "border-danger"
                              : "border-line-strong hover:border-ink"
                        }`}
                      >
                        <input
                          type="radio"
                          name="program"
                          value={p.id}
                          checked={checked}
                          onChange={() => pickProgram(p.id)}
                          aria-invalid={invalid.program || undefined}
                          aria-describedby={describedBy("program")}
                          className="sr-only"
                        />
                        <span className="flex items-center justify-between">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-400 text-oasis-900">
                            <Icon name={p.icon} className="h-5 w-5" />
                          </span>
                          {checked && (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand text-on-brand">
                              <Icon name="check" className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </span>
                        <span className="mt-3 font-semibold text-ink">{tr(p.title)}</span>
                        <span className="mt-1 text-sm leading-snug text-ink-2">{tr(p.text)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* your details */}
              <fieldset className="mt-8">
                <legend className={groupTitle}>{t("help.form.you")}</legend>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={fieldLabel}>
                      {t("help.form.name")}
                      <Required />
                    </span>
                    <input
                      name="name"
                      type="text"
                      maxLength={120}
                      required
                      autoComplete="name"
                      aria-invalid={invalid.name || undefined}
                      aria-describedby={describedBy("name")}
                      value={form.name}
                      onChange={set("name")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>
                      {t("help.form.phone")}
                      <Required />
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      maxLength={20}
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      aria-invalid={invalid.phone || undefined}
                      aria-describedby={describedBy("phone")}
                      value={form.phone}
                      onChange={set("phone")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>{t("help.form.email")}</span>
                    <input
                      name="email"
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      aria-invalid={invalid.email || undefined}
                      aria-describedby={describedBy("email")}
                      value={form.email}
                      onChange={set("email")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>{t("help.form.for")}</span>
                    <select value={form.requestFor} onChange={set("requestFor")} className={field}>
                      {forOptions.map((o) => (
                        <option key={o.id} value={o.id}>
                          {t(o.key)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className={fieldLabel}>
                    {t("help.form.address")}
                    <Required />
                  </span>
                  <textarea
                    maxLength={4000}
                    name="address"
                    rows={2}
                    required
                    autoComplete="street-address"
                    placeholder={t("help.form.address.hint")}
                    aria-invalid={invalid.address || undefined}
                    aria-describedby={describedBy("address")}
                    value={form.address}
                    onChange={set("address")}
                    className={`${field} resize-y`}
                  />
                </label>
              </fieldset>

              {/* who needs help */}
              <fieldset className="mt-8">
                <legend className={groupTitle}>{t("help.form.people")}</legend>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className={fieldLabel}>
                      {t("help.form.total")}
                      <Required />
                    </span>
                    <input
                      name="total"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      required
                      aria-invalid={invalid.total || undefined}
                      aria-describedby={describedBy("total")}
                      value={form.total}
                      onChange={set("total")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>{t("help.form.children")}</span>
                    <input
                      name="children"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      aria-invalid={invalid.children || undefined}
                      aria-describedby={describedBy("children")}
                      value={form.children}
                      onChange={set("children")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={fieldLabel}>{t("help.form.elderly")}</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      aria-invalid={invalid.children || undefined}
                      aria-describedby={describedBy("children")}
                      value={form.elderly}
                      onChange={set("elderly")}
                      className={field}
                    />
                  </label>
                </div>
              </fieldset>

              {/* what help */}
              {program && program.needs.length > 0 && (
                <fieldset className="mt-8">
                  <legend className={groupTitle}>
                    {t("help.form.needs")}
                    <Required />
                  </legend>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {program.needs.map((n) => (
                      <label
                        key={n.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                          form.needs.includes(n.id)
                            ? "border-brand bg-brand-soft"
                            : invalid.needs
                              ? "border-danger"
                              : "border-line-strong hover:border-ink"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="needs"
                          checked={form.needs.includes(n.id)}
                          onChange={() => toggleNeed(n.id)}
                          aria-invalid={invalid.needs || undefined}
                          aria-describedby={describedBy("needs")}
                          className="h-4 w-4 shrink-0 accent-[var(--c-brand)]"
                        />
                        <span className="text-sm font-medium text-ink">{tr(n.label)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <label className="mt-6 block">
                <span className={fieldLabel}>
                  {program && program.needs.length === 0 ? (
                    <>
                      {t("help.form.details.other")}
                      <Required />
                    </>
                  ) : (
                    t("help.form.details")
                  )}
                </span>
                <textarea
                  maxLength={4000}
                  name="details"
                  required={program?.needs.length === 0}
                  rows={4}
                  placeholder={t("help.form.details.hint")}
                  aria-invalid={invalid.details || undefined}
                  aria-describedby={describedBy("details")}
                  value={form.details}
                  onChange={set("details")}
                  className={`${field} resize-y`}
                />
              </label>

              <p id="help-error" role="alert" className="mt-3 min-h-5 text-sm font-medium text-danger">
                {errorKey ? t(errorKey) : ""}
              </p>

              <Honeypot direct={sender.direct} />
              <SubmitButton
                status={sender.status}
                direct={sender.direct}
                label="help.form.submit"
                labelDirect="help.form.submit.direct"
              />
              <SendResult status={sender.status} message={sender.message} sentKey="help.sent.direct" />
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
