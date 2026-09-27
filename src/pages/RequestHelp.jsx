import { useState } from "react";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { helpPrograms } from "../data/content";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";
import { isValidEmail, isValidPhone } from "../utils/validation";

const field =
  "w-full rounded-xl border border-oasis-200 bg-white px-4 py-3 text-oasis-900 placeholder:text-oasis-800/35 transition focus:border-oasis-500 focus:outline-none focus:ring-2 focus:ring-oasis-500/20 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/15";

const labelText = "mb-1.5 block text-sm font-medium text-oasis-900";
const groupTitle = "font-display text-lg font-semibold text-oasis-900";

function Required() {
  return <span aria-hidden="true" className="text-red-600"> *</span>;
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

export default function RequestHelp() {
  const { t, tr } = useLang();
  /* ids, not labels, so a language switch keeps the choices intact */
  const [form, setForm] = useState({
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
  });
  // message KEY (not text) so it re-translates on a language switch
  const [errorKey, setErrorKey] = useState("");
  const [invalid, setInvalid] = useState({});
  // the email we last handed to the mail app, reused for the WhatsApp fallback
  const [sentBody, setSentBody] = useState("");

  usePageMeta(
    `${t("help.title")} — ${site.name}`,
    "Ask NGO Marudyaan for help from our Durga Puja clothes drive or winter blanket drive in Kolkata and West Bengal.",
  );

  const program = helpPrograms.find((p) => p.id === form.program);

  const clear = (...keys) => {
    setSentBody(""); // the details changed, so the WhatsApp copy would be stale
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

  const buildEmail = () => {
    const forLabel = forOptions.find((o) => o.id === form.requestFor)?.en;
    const needLabels = program.needs
      .filter((n) => form.needs.includes(n.id))
      .map((n) => `- ${n.label.en}`);
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
    if (needLabels.length) lines.push("", "Help needed:", ...needLabels);
    if (form.details.trim()) lines.push("", "More details:", form.details.trim());
    lines.push("", "— Sent from the Request Help form on the website");
    return {
      subject: `Help request: ${program.title.en} — ${form.name.trim()} (${count(form.total)} people)`,
      body: lines.join("\n"),
    };
  };

  /* No back end on a front-end-only site: we hand the request to the
     visitor's own email app with everything already filled in. */
  const onSubmit = (e) => {
    e.preventDefault();
    const problems = validate();
    if (problems.length) {
      setInvalid(Object.fromEntries(problems.map(([key]) => [key, true])));
      setErrorKey(problems[0][2]);
      setSentBody("");
      e.currentTarget.querySelector(`[name="${problems[0][0]}"]`)?.focus();
      return;
    }
    setInvalid({});
    setErrorKey("");
    const { subject, body } = buildEmail();
    setSentBody(body);
    window.location.assign(
      `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const describedBy = (key) => (invalid[key] ? "help-error" : undefined);

  const steps = ["help.how.1", "help.how.2", "help.how.3"];

  return (
    <>
      <PageHeader title={t("help.title")} sub={t("help.sub")} />

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          {/* how it works */}
          <Reveal className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-oasis-900">{t("help.how.title")}</h2>
            <ol className="mt-6 space-y-4">
              {steps.map((key, i) => (
                <li key={key} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-saffron-500 font-display font-bold text-oasis-900">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 leading-relaxed text-oasis-800/80">{t(key)}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-2xl border border-oasis-100 bg-white p-5">
              <p className="text-sm leading-relaxed text-oasis-800/75">{t("help.how.note")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-oasis-200 px-4 py-2 text-sm font-medium text-oasis-700 transition hover:border-oasis-400"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {site.contact.phone}
                </a>
                <a
                  href={`https://wa.me/${site.contact.whatsappHref}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-oasis-200 px-4 py-2 text-sm font-medium text-oasis-700 transition hover:border-oasis-400"
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
              className="rounded-3xl border border-oasis-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold text-oasis-900">{t("help.form.title")}</h2>
              <p className="mt-2 text-sm text-oasis-800/65">{t("help.form.note")}</p>

              {/* which drive */}
              <fieldset className="mt-6">
                <legend className={groupTitle}>
                  {t("help.form.program")}
                  <Required />
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {helpPrograms.map((p) => {
                    const checked = form.program === p.id;
                    return (
                      <label
                        key={p.id}
                        className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-oasis-500/40 ${
                          checked
                            ? "border-oasis-600 bg-oasis-50"
                            : invalid.program
                              ? "border-red-500"
                              : "border-oasis-200 hover:border-oasis-400"
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
                          <span className="rounded-xl bg-white p-2 text-oasis-600 shadow-sm">
                            <Icon name={p.icon} className="h-5 w-5" />
                          </span>
                          {checked && <Icon name="check" className="h-5 w-5 text-oasis-600" />}
                        </span>
                        <span className="mt-3 font-semibold text-oasis-900">{tr(p.title)}</span>
                        <span className="mt-1 text-sm leading-snug text-oasis-800/65">{tr(p.text)}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* your details */}
              <fieldset className="mt-8">
                <legend className={groupTitle}>{t("help.form.you")}</legend>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelText}>
                      {t("help.form.name")}
                      <Required />
                    </span>
                    <input
                      name="name"
                      type="text"
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
                    <span className={labelText}>
                      {t("help.form.phone")}
                      <Required />
                    </span>
                    <input
                      name="phone"
                      type="tel"
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
                    <span className={labelText}>{t("help.form.email")}</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={invalid.email || undefined}
                      aria-describedby={describedBy("email")}
                      value={form.email}
                      onChange={set("email")}
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={labelText}>{t("help.form.for")}</span>
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
                  <span className={labelText}>
                    {t("help.form.address")}
                    <Required />
                  </span>
                  <textarea
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
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className={labelText}>
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
                    <span className={labelText}>{t("help.form.children")}</span>
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
                    <span className={labelText}>{t("help.form.elderly")}</span>
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
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {program.needs.map((n) => (
                      <label
                        key={n.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                          form.needs.includes(n.id)
                            ? "border-oasis-600 bg-oasis-50"
                            : invalid.needs
                              ? "border-red-500"
                              : "border-oasis-200 hover:border-oasis-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="needs"
                          checked={form.needs.includes(n.id)}
                          onChange={() => toggleNeed(n.id)}
                          aria-invalid={invalid.needs || undefined}
                          aria-describedby={describedBy("needs")}
                          className="h-4 w-4 shrink-0 accent-oasis-600"
                        />
                        <span className="text-sm font-medium text-oasis-900">{tr(n.label)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <label className="mt-6 block">
                <span className={labelText}>
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

              <p id="help-error" role="alert" className="mt-3 min-h-5 text-sm font-medium text-red-600">
                {errorKey ? t(errorKey) : ""}
              </p>

              <button
                type="submit"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-oasis-700 px-7 py-3.5 font-semibold text-white transition hover:bg-oasis-600"
              >
                <Icon name="mail" className="h-4 w-4" />
                {t("help.form.submit")}
              </button>

              {/* not everyone has an email app set up on their phone */}
              <div role="status">
                {sentBody && (
                  <div className="mt-6 rounded-2xl border border-oasis-200 bg-oasis-50 p-5">
                    <p className="font-semibold text-oasis-900">{t("help.sent.title")}</p>
                    <p className="mt-1 text-sm leading-relaxed text-oasis-800/75">{t("help.sent.body")}</p>
                    <a
                      href={`https://wa.me/${site.contact.whatsappHref}?text=${encodeURIComponent(sentBody)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-oasis-300 bg-white px-5 py-2.5 text-sm font-semibold text-oasis-700 transition hover:border-oasis-500"
                    >
                      <Icon name="whatsapp" className="h-4 w-4" />
                      {t("help.sent.whatsapp")}
                    </a>
                  </div>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
