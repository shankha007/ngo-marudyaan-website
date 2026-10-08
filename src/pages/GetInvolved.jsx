import { useRef, useState } from "react";
import { Honeypot, SendResult, SubmitButton } from "../components/FormSend";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { field, fieldLabel } from "../components/ui";
import SectionHeading from "../components/SectionHeading";
import { faqs, volunteerRoles } from "../data/content";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import useFormSender from "../hooks/useFormSender";
import usePageMeta from "../hooks/usePageMeta";
import { isValidEmail, isValidPhone } from "../utils/validation";


/* icon + colour for each "way to help" card, in turn */
const roleLooks = [
  ["users", "bg-lime-400 text-oasis-900"],
  ["heart", "bg-saffron-400 text-oasis-900"],
  ["book", "bg-coral-400 text-oasis-900"],
  ["hands", "bg-brand text-on-brand"],
  ["globe", "bg-oasis-200 text-oasis-900"],
  ["sparkle", "bg-night text-lime-300"],
];

function Faq({ item }) {
  const { tr } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-3xl border bg-surface transition ${open ? "border-brand shadow-soft" : "border-line"}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-offset-[-3px]"
      >
        <span className="font-semibold text-ink">{tr(item.q)}</span>
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-300 ${
            open ? "rotate-180 bg-brand text-on-brand" : "bg-surface-2 text-ink"
          }`}
        >
          <Icon name="chevronDown" className="h-4 w-4" />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 leading-relaxed text-ink-2">{tr(item.a)}</p>
        </div>
      </div>
    </div>
  );
}

export default function GetInvolved() {
  const { t, tr } = useLang();
  /* `interest` holds the role id, not its label, so switching language
     does not leave the <select> pointing at a value that no longer exists. */
  const empty = {
    name: "",
    phone: "",
    email: "",
    interest: volunteerRoles[0].id,
    message: "",
  };
  const [form, setForm] = useState(empty);
  const sender = useFormSender("involved");

  usePageMeta(
    `${t("involved.title")} — ${site.name}`,
    "Volunteer, donate goods, lend a skill or partner with NGO Marudyaan in Kolkata.",
  );

  // message KEY (not text) so it re-translates on a language switch
  const [errorKey, setErrorKey] = useState("");
  const [invalid, setInvalid] = useState({});
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    sender.reset();
    if (invalid[key]) setInvalid((v) => ({ ...v, [key]: false }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    // name and phone are required: WhatsApp/phone is how the NGO follows up
    const missing = { name: !form.name.trim(), phone: !form.phone.trim() };
    const bad = {
      ...missing,
      phone: missing.phone || !isValidPhone(form.phone),
      email: form.email.trim() !== "" && !isValidEmail(form.email),
    };
    if (bad.name || bad.phone || bad.email) {
      setInvalid(bad);
      setErrorKey(
        missing.name || missing.phone
          ? "involved.form.required"
          : bad.phone
            ? "form.phone.invalid"
            : "form.email.invalid",
      );
      (bad.name ? nameRef : bad.phone ? phoneRef : emailRef).current?.focus();
      return;
    }
    setInvalid({});
    setErrorKey("");
    const role = volunteerRoles.find((r) => r.id === form.interest);
    const interestLabel = role ? role.title.en : form.interest;
    const body = `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nInterested in: ${interestLabel}\n\n${form.message}`;
    const sent = await sender.send({
      subject: `Volunteer / partnership enquiry — ${form.name.trim()}`,
      body,
      name: form.name,
      email: form.email.trim(),
      fields: { Phone: form.phone.trim(), "Interested in": interestLabel },
      note: form.message.trim() || "(no message)",
      form: formEl,
    });
    if (sent && sender.direct) setForm(empty);
  };

  const whatsappHref = `https://wa.me/${site.contact.whatsappHref}?text=${encodeURIComponent(
    "Hello NGO Marudyaan, I would like to get involved.",
  )}`;

  return (
    <>
      <PageHeader title={t("involved.title")} sub={t("involved.sub")} />

      {/* ways to help */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading title={t("involved.roles.title")} />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {volunteerRoles.map((role, i) => {
              const [icon, look] = roleLooks[i % roleLooks.length];
              return (
              <Reveal key={role.id} delay={i * 70}>
                <div className="h-full rounded-4xl border border-line bg-surface p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${look}`}>
                    <Icon name={icon} className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-6 text-xl font-bold text-ink">
                    {tr(role.title)}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-2">{tr(role.text)}</p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* sign-up form */}
      <section className="mx-2 rounded-4xl bg-surface-2 py-20 sm:mx-3 sm:rounded-5xl">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading align="left" title={t("involved.form.title")} sub={t(sender.direct ? "involved.form.note.direct" : "involved.form.note")} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-4 rounded-3xl border border-line bg-surface py-3 pr-6 pl-3 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25d366] text-white">
                <Icon name="whatsapp" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {t("involved.form.whatsapp")}
                </span>
                <span className="block text-sm text-ink-3">{site.contact.whatsapp}</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={100}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-4xl border border-line bg-surface p-6 shadow-lift sm:p-10"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={fieldLabel}>
                    {t("involved.form.name")}
                    <span aria-hidden="true" className="text-danger">{"\u00a0"}*</span>
                  </span>
                  <input
                    ref={nameRef}
                    type="text"
                    maxLength={120}
                    required
                    aria-invalid={invalid.name || undefined}
                    aria-describedby={invalid.name ? "involved-error" : undefined}
                    value={form.name}
                    onChange={set("name")}
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>
                    {t("involved.form.phone")}
                    <span aria-hidden="true" className="text-danger">{"\u00a0"}*</span>
                  </span>
                  <input
                    ref={phoneRef}
                    type="tel"
                    maxLength={20}
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={invalid.phone || undefined}
                    aria-describedby={invalid.phone ? "involved-error" : undefined}
                    value={form.phone}
                    onChange={set("phone")}
                    className={field}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className={fieldLabel}>
                  {t("involved.form.email")}
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  maxLength={254}
                  aria-invalid={invalid.email || undefined}
                  aria-describedby={invalid.email ? "involved-error" : undefined}
                  value={form.email}
                  onChange={set("email")}
                  className={field}
                />
              </label>

              <label className="mt-4 block">
                <span className={fieldLabel}>
                  {t("involved.form.interest")}
                </span>
                <select value={form.interest} onChange={set("interest")} className={field}>
                  {volunteerRoles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {tr(r.title)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className={fieldLabel}>
                  {t("involved.form.message")}
                </span>
                <textarea
                  maxLength={4000}
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  className={`${field} resize-y`}
                />
              </label>

              <p id="involved-error" role="alert" className="mt-3 min-h-5 text-sm font-medium text-danger">
                {errorKey ? t(errorKey) : ""}
              </p>

              <Honeypot direct={sender.direct} />
              <SubmitButton
                status={sender.status}
                direct={sender.direct}
                label="involved.form.submit"
                labelDirect="involved.form.submit.direct"
              />
              <SendResult status={sender.status} message={sender.message} sentKey="involved.sent" />
            </form>
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section className="py-20">
        <div className="container-page">
          <SectionHeading title={t("involved.faq.title")} />
          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.id} delay={i * 60}>
                <Faq item={f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
