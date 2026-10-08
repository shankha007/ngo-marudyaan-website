import { useRef, useState } from "react";
import { Honeypot, SendResult, SubmitButton } from "../components/FormSend";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { field, fieldLabel } from "../components/ui";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import useFormSender from "../hooks/useFormSender";
import usePageMeta from "../hooks/usePageMeta";
import { isValidEmail } from "../utils/validation";

const empty = { name: "", email: "", subject: "", message: "" };


export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState(empty);
  const sender = useFormSender("contact");
  // store the message KEY, not its text, so it re-translates if the
  // visitor switches language while the error is showing
  const [errorKey, setErrorKey] = useState("");
  const [invalid, setInvalid] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  usePageMeta(
    `${t("contact.title")} — ${site.name}`,
    `Contact NGO Marudyaan, Kolkata — ${site.contact.phone}, ${site.contact.email}.`,
  );

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    sender.reset();
    if (invalid[key]) setInvalid((v) => ({ ...v, [key]: false }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const bad = {
      name: !form.name.trim(),
      email: form.email.trim() !== "" && !isValidEmail(form.email),
      message: !form.message.trim(),
    };
    if (bad.name || bad.email || bad.message) {
      setInvalid(bad);
      setErrorKey(bad.name || bad.message ? "contact.form.required" : "form.email.invalid");
      (bad.name ? nameRef : bad.email ? emailRef : messageRef).current?.focus();
      return;
    }
    setInvalid({});
    setErrorKey("");
    const subject = form.subject.trim() || `Website enquiry from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    const sent = await sender.send({
      subject,
      body,
      name: form.name,
      email: form.email.trim(),
      note: form.message,
      form: formEl,
    });
    if (sent && sender.direct) setForm(empty);
  };

  const details = [
    {
      icon: "phone",
      label: t("contact.phone"),
      value: site.contact.phone,
      href: `tel:${site.contact.phoneHref}`,
    },
    {
      icon: "whatsapp",
      label: t("contact.whatsapp"),
      value: site.contact.whatsapp,
      href: `https://wa.me/${site.contact.whatsappHref}`,
      external: true,
    },
    {
      icon: "mail",
      label: t("contact.email"),
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    { icon: "pin", label: t("contact.address"), value: site.contact.addressLines.join(", ") },
    { icon: "globe", label: t("contact.area"), value: site.contact.serviceArea },
    { icon: "clock", label: t("contact.hours"), value: site.contact.hours },
  ];

  const socials = [
    { url: site.social.facebook, icon: "facebook", label: "Facebook" },
    { url: site.social.instagram, icon: "instagram", label: "Instagram" },
    { url: site.social.youtube, icon: "youtube", label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <>
      <PageHeader title={t("contact.title")} sub={t("contact.sub")} />

      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* details */}
          <Reveal className="lg:col-span-2">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              {t("contact.reach.title")}
            </h2>
            <ul className="mt-6 space-y-3">
              {details.map((d) => (
                <li key={d.label}>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-3 rounded-3xl border border-line bg-surface p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift sm:gap-4 sm:p-4"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink transition group-hover:bg-lime-400 group-hover:text-oasis-900">
                        <Icon name={d.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs tracking-wide text-ink-3 uppercase">
                          {d.label}
                        </span>
                        <span className="block break-words text-[15px] font-medium text-ink sm:text-base">
                          {d.value}
                        </span>
                      </span>
                      <Icon name="arrowUpRight" className="ml-auto h-4 w-4 shrink-0 text-ink-3 transition group-hover:text-ink" />
                    </a>
                  ) : (
                    <div className="group flex items-center gap-3 rounded-3xl border border-line bg-surface p-3.5 sm:gap-4 sm:p-4">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink transition group-hover:bg-lime-400 group-hover:text-oasis-900">
                        <Icon name={d.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs tracking-wide text-ink-3 uppercase">
                          {d.label}
                        </span>
                        <span className="block font-medium text-ink">{d.value}</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <>
                <h3 className="font-display mt-8 text-lg font-semibold text-ink">
                  {t("contact.social.title")}
                </h3>
                <div className="mt-3 flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-ink transition hover:border-ink hover:bg-ink hover:text-canvas"
                    >
                      <Icon name={s.icon} filled={s.icon === "facebook"} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </Reveal>

          {/* form */}
          <Reveal delay={100} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-4xl border border-line bg-surface p-6 shadow-lift sm:p-10"
            >
              <h2 className="font-display text-3xl font-bold text-ink">
                {t("contact.form.title")}
              </h2>
              <p className="mt-2 text-sm text-ink-2">{t(sender.direct ? "contact.form.note.direct" : "contact.form.note")}</p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={fieldLabel}>
                    {t("contact.form.name")}
                    <span aria-hidden="true" className="text-danger">{"\u00a0"}*</span>
                  </span>
                  <input
                    type="text"
                    maxLength={120}
                    ref={nameRef}
                    aria-invalid={invalid.name || undefined}
                    aria-describedby={invalid.name ? "contact-error" : undefined}
                    value={form.name}
                    onChange={set("name")}
                    className={field}
                    required
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>
                    {t("contact.form.email")}
                  </span>
                  <input
                    type="email"
                    maxLength={254}
                    ref={emailRef}
                    aria-invalid={invalid.email || undefined}
                    aria-describedby={invalid.email ? "contact-error" : undefined}
                    value={form.email}
                    onChange={set("email")}
                    className={field}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className={fieldLabel}>
                  {t("contact.form.subject")}
                </span>
                <input type="text" maxLength={150} value={form.subject} onChange={set("subject")} className={field} />
              </label>

              <label className="mt-4 block">
                <span className={fieldLabel}>
                  {t("contact.form.message")}
                  <span aria-hidden="true" className="text-danger">{"\u00a0"}*</span>
                </span>
                <textarea
                  maxLength={4000}
                  ref={messageRef}
                  aria-invalid={invalid.message || undefined}
                  aria-describedby={invalid.message ? "contact-error" : undefined}
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  className={`${field} resize-y`}
                  required
                />
              </label>

              <p id="contact-error" role="alert" className="mt-3 min-h-5 text-sm font-medium text-danger">
                {errorKey ? t(errorKey) : ""}
              </p>

              <Honeypot direct={sender.direct} />
              <SubmitButton
                status={sender.status}
                direct={sender.direct}
                label="contact.form.submit"
                labelDirect="contact.form.submit.direct"
              />
              <SendResult status={sender.status} message={sender.message} sentKey="contact.sent" />
            </form>
          </Reveal>
        </div>
      </section>

      {/* map */}
      <section className="pb-20">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {t("contact.map.title")}
          </h2>
          <div className="mt-6 overflow-hidden rounded-4xl border border-line shadow-soft">
            <iframe
              title={t("contact.map.title")}
              src={site.contact.mapEmbed}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              /* the map may run its own scripts and open Google Maps in a new
                 tab, but cannot reach this page or navigate it */
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              className="h-[420px] w-full border-0 dark:[filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
