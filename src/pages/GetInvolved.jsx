import { useRef, useState } from "react";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { faqs, volunteerRoles } from "../data/content";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";
import { isValidEmail } from "../utils/validation";

const field =
  "w-full rounded-xl border border-oasis-200 bg-white px-4 py-3 text-oasis-900 placeholder:text-oasis-800/35 transition focus:border-oasis-500 focus:outline-none focus:ring-2 focus:ring-oasis-500/20 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/15";

function Faq({ item }) {
  const { tr } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-oasis-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-oasis-900">{tr(item.q)}</span>
        <Icon
          name="chevronDown"
          className={`h-5 w-5 shrink-0 text-oasis-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 leading-relaxed text-oasis-800/80">{tr(item.a)}</p>
        </div>
      </div>
    </div>
  );
}

export default function GetInvolved() {
  const { t, tr } = useLang();
  /* `interest` holds the role id, not its label, so switching language
     does not leave the <select> pointing at a value that no longer exists. */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: volunteerRoles[0].id,
    message: "",
  });

  usePageMeta(
    `${t("involved.title")} — ${site.name}`,
    "Volunteer, donate goods, lend a skill or partner with NGO Marudyaan in Kolkata.",
  );

  // message KEY (not text) so it re-translates on a language switch
  const [errorKey, setErrorKey] = useState("");
  const [invalid, setInvalid] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (invalid[key]) setInvalid((v) => ({ ...v, [key]: false }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const bad = {
      name: !form.name.trim(),
      email: form.email.trim() !== "" && !isValidEmail(form.email),
    };
    if (bad.name || bad.email) {
      setInvalid(bad);
      setErrorKey(bad.name ? "involved.form.required" : "form.email.invalid");
      (bad.name ? nameRef : emailRef).current?.focus();
      return;
    }
    setInvalid({});
    setErrorKey("");
    const role = volunteerRoles.find((r) => r.id === form.interest);
    const interestLabel = role ? role.title.en : form.interest;
    const body = `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nInterested in: ${interestLabel}\n\n${form.message}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
      "Volunteer / partnership enquiry",
    )}&body=${encodeURIComponent(body)}`;
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
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {volunteerRoles.map((role, i) => (
              <Reveal key={role.id} delay={i * 70}>
                <div className="h-full rounded-2xl border border-oasis-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex rounded-xl bg-oasis-50 p-3 text-oasis-600">
                    <Icon name="users" className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-oasis-900">
                    {tr(role.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-oasis-800/75">{tr(role.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* sign-up form */}
      <section className="bg-sand-100 py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading align="left" title={t("involved.form.title")} sub={t("involved.form.note")} />
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-oasis-200 bg-white px-5 py-4 transition hover:border-oasis-400 hover:shadow-sm"
            >
              <span className="rounded-xl bg-oasis-50 p-2.5 text-oasis-600">
                <Icon name="whatsapp" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-oasis-900">
                  {t("involved.form.whatsapp")}
                </span>
                <span className="block text-sm text-oasis-800/60">{site.contact.whatsapp}</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={100}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-oasis-100 bg-white p-8 shadow-sm"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                    {t("involved.form.name")}
                  </span>
                  <input
                    ref={nameRef}
                    type="text"
                    required
                    aria-invalid={invalid.name || undefined}
                    aria-describedby={invalid.name ? "involved-error" : undefined}
                    value={form.name}
                    onChange={set("name")}
                    className={field}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                    {t("involved.form.phone")}
                  </span>
                  <input type="tel" value={form.phone} onChange={set("phone")} className={field} />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                  {t("involved.form.email")}
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  aria-invalid={invalid.email || undefined}
                  aria-describedby={invalid.email ? "involved-error" : undefined}
                  value={form.email}
                  onChange={set("email")}
                  className={field}
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm font-medium text-oasis-900">
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
                <span className="mb-1.5 block text-sm font-medium text-oasis-900">
                  {t("involved.form.message")}
                </span>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  className={`${field} resize-y`}
                />
              </label>

              <p id="involved-error" role="alert" className="mt-3 min-h-5 text-sm font-medium text-red-600">
                {errorKey ? t(errorKey) : ""}
              </p>

              <button
                type="submit"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-oasis-700 px-7 py-3.5 font-semibold text-white transition hover:bg-oasis-600"
              >
                <Icon name="mail" className="h-4 w-4" />
                {t("involved.form.submit")}
              </button>
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
