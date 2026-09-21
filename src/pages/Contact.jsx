import { useState } from "react";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

const field =
  "w-full rounded-xl border border-oasis-200 bg-white px-4 py-3 text-oasis-900 placeholder:text-oasis-800/35 transition focus:border-oasis-500 focus:outline-none focus:ring-2 focus:ring-oasis-500/20";

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");

  usePageMeta(
    `${t("contact.title")} — ${site.name}`,
    `Contact NGO Marudyaan, Kolkata — ${site.contact.phone}, ${site.contact.email}.`,
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  /* No back end on a front-end-only site: we hand the message to the
     visitor's own email app with everything already filled in. */
  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError(t("contact.form.required"));
      return;
    }
    setError("");
    const subject = form.subject.trim() || `Website enquiry from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
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
        <div className="container-page grid gap-10 lg:grid-cols-5">
          {/* details */}
          <Reveal className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-oasis-900">
              {t("contact.reach.title")}
            </h2>
            <ul className="mt-6 space-y-3">
              {details.map((d) => (
                <li key={d.label}>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="flex gap-4 rounded-2xl border border-oasis-100 bg-white p-4 transition hover:border-oasis-300 hover:shadow-sm"
                    >
                      <span className="shrink-0 self-start rounded-xl bg-oasis-50 p-2.5 text-oasis-600">
                        <Icon name={d.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs tracking-wide text-oasis-800/55 uppercase">
                          {d.label}
                        </span>
                        <span className="block break-words font-medium text-oasis-900">
                          {d.value}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex gap-4 rounded-2xl border border-oasis-100 bg-white p-4">
                      <span className="shrink-0 self-start rounded-xl bg-oasis-50 p-2.5 text-oasis-600">
                        <Icon name={d.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs tracking-wide text-oasis-800/55 uppercase">
                          {d.label}
                        </span>
                        <span className="block font-medium text-oasis-900">{d.value}</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <>
                <h3 className="font-display mt-8 text-lg font-semibold text-oasis-900">
                  {t("contact.social.title")}
                </h3>
                <div className="mt-3 flex gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="rounded-full border border-oasis-200 p-3 text-oasis-700 transition hover:border-oasis-600 hover:bg-oasis-50"
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
              className="rounded-3xl border border-oasis-100 bg-white p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl font-bold text-oasis-900">
                {t("contact.form.title")}
              </h2>
              <p className="mt-2 text-sm text-oasis-800/65">{t("contact.form.note")}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                    {t("contact.form.name")}
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    className={field}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                    {t("contact.form.email")}
                  </span>
                  <input type="email" value={form.email} onChange={set("email")} className={field} />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                  {t("contact.form.subject")}
                </span>
                <input type="text" value={form.subject} onChange={set("subject")} className={field} />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                  {t("contact.form.message")}
                </span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={set("message")}
                  className={`${field} resize-y`}
                  required
                />
              </label>

              {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-oasis-700 px-7 py-3.5 font-semibold text-white transition hover:bg-oasis-600"
              >
                <Icon name="mail" className="h-4 w-4" />
                {t("contact.form.submit")}
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* map */}
      <section className="pb-20">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-oasis-900">
            {t("contact.map.title")}
          </h2>
          <div className="mt-5 overflow-hidden rounded-3xl border border-oasis-100 shadow-sm">
            <iframe
              title={t("contact.map.title")}
              src={site.contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border-0"
            />
          </div>
        </div>
      </section>
    </>
  );
}
