import { useState } from "react";
import CopyField from "../components/CopyField";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { btn, size } from "../components/ui";

/* colour of each donation amount card, in turn */
const tierLooks = [
  { card: "bg-lime-400 text-oasis-900", sub: "text-oasis-900/80", upi: "border-oasis-900/25 hover:bg-oasis-900/10" },
  { card: "border border-line bg-surface text-ink", sub: "text-ink-2", upi: "border-line-strong hover:border-ink" },
  { card: "bg-saffron-400 text-oasis-900", sub: "text-oasis-900/80", upi: "border-oasis-900/25 hover:bg-oasis-900/10" },
  { card: "bg-night text-white", sub: "text-white/75", upi: "border-white/25 hover:bg-white/10" },
];
import { donationTiers } from "../data/content";
import { site } from "../data/site";
import { useLang } from "../i18n/LanguageContext";
import usePageMeta from "../hooks/usePageMeta";

export default function Donate() {
  const { t, tr } = useLang();
  const [qrFailed, setQrFailed] = useState(false);
  const { donation, contact } = site;

  usePageMeta(
    `${t("donate.title")} — ${site.name}`,
    "Donate to NGO Marudyaan by UPI QR code or bank transfer. Every contribution is acknowledged with photos and an expense report.",
  );

  /* upi:// links open the visitor's UPI app (GPay, PhonePe, Paytm…) with the
     payee filled in. Only phones can follow them, so the buttons are shown on
     touch screens only (pointer-coarse), and only once upiButtons is switched on. */
  const upiHref = (amount) =>
    `upi://pay?pa=${donation.upiId}&pn=${encodeURIComponent(donation.upiName)}&cu=INR` +
    `&tn=${encodeURIComponent(`Donation to ${site.name}`)}` +
    (amount ? `&am=${amount.toFixed(2)}` : "");

  const whatsappHref = `https://wa.me/${contact.whatsappHref}?text=${encodeURIComponent(
    "Hello NGO Marudyaan, I have made a donation. Here are my details:\nName:\nPhone:\nAmount:",
  )}`;
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    "Donation details",
  )}&body=${encodeURIComponent(
    "Name:\nPhone:\nAmount:\nDate of transfer:\n\n(Please attach the payment screenshot.)",
  )}`;

  return (
    <>
      <PageHeader title={t("donate.title")} sub={t("donate.sub")} />

      {/* QR + bank details */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* QR card */}
          <Reveal className="lg:col-span-2">
            <div className="relative flex h-full flex-col items-center rounded-4xl border-2 border-lime-400 bg-surface p-6 text-center shadow-lift sm:p-8">
              <span className="absolute -top-3.5 inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold tracking-wide text-oasis-900 uppercase">
                <Icon name="sparkle" filled className="h-3.5 w-3.5" />
                <span>UPI</span>
              </span>
              <h2 className="font-display text-3xl font-bold text-ink">
                {t("donate.qr.title")}
              </h2>
              {/* always white behind the QR code: scanners need dark-on-light, even in dark mode */}
              <div className="mt-6 w-full max-w-72 rounded-3xl bg-white p-3 ring-1 ring-line sm:p-4">
                {qrFailed ? (
                  <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-line-strong px-6 text-sm text-ink-3">
                    <Icon name="copy" className="mb-3 h-8 w-8 text-ink-3" />
                    {t("donate.qr.missing")}
                    <code className="mt-2 text-[11px] break-all text-brand-ink">
                      public{donation.qrImage}
                    </code>
                  </div>
                ) : (
                  <img
                    src={donation.qrImage}
                    alt={t("donate.qr.alt")}
                    onError={() => setQrFailed(true)}
                    className="aspect-square w-full rounded-2xl bg-white object-contain"
                  />
                )}
              </div>
              <p className="mt-4 max-w-xs text-sm text-ink-2">{t("donate.qr.note")}</p>
              {donation.upiButtons && (
                <div className="hidden w-full flex-col items-center pointer-coarse:flex">
                  <a
                    href={upiHref()}
                    className={`mt-5 w-full ${btn.donate} ${size.lg}`}
                  >
                    <Icon name="heart" className="h-5 w-5" />
                    {t("donate.upi.pay")}
                  </a>
                  <p className="mt-2 text-xs text-ink-3">{t("donate.upi.payNote")}</p>
                </div>
              )}
              <div className="mt-6 w-full rounded-3xl bg-brand-soft px-5 py-1 text-left">
                <CopyField label={t("donate.upi.label")} value={donation.upiId} mono compact />
              </div>
              <p className="mt-4 text-xs text-ink-3">{donation.upiName}</p>
            </div>
          </Reveal>

          {/* bank card */}
          <Reveal delay={100} className="lg:col-span-3">
            <div className="flex h-full flex-col rounded-4xl border border-line bg-surface p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-3xl font-bold text-ink">
                {t("donate.bank.title")}
              </h2>
              <div className="mt-4">
                <CopyField
                  label={t("donate.bank.accountName")}
                  value={donation.bank.accountName}
                />
                <CopyField
                  label={t("donate.bank.accountNumber")}
                  value={donation.bank.accountNumber}
                  mono
                  compact
                />
                <CopyField label={t("donate.bank.bankName")} value={donation.bank.bankName} />
                <CopyField label={t("donate.bank.branch")} value={donation.bank.branch} />
                <CopyField label={t("donate.bank.ifsc")} value={donation.bank.ifsc} mono compact />
                <CopyField
                  label={t("donate.bank.accountType")}
                  value={donation.bank.accountType}
                />
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-3xl bg-saffron-500/10 p-4 text-sm text-ink-2">
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-saffron-700 dark:text-saffron-400" />
                <p>{t("donate.safety")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* what your donation does */}
      <section className="mx-2 rounded-4xl bg-surface-2 py-20 sm:mx-3 sm:rounded-5xl">
        <div className="container-page">
          <SectionHeading title={t("donate.impact.title")} sub={t("donate.impact.note")} />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {donationTiers.map((tier, i) => {
              const look = tierLooks[i % tierLooks.length];
              return (
              <Reveal key={tier.id} delay={i * 80}>
                <div className={`flex h-full flex-col rounded-4xl p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lift ${look.card}`}>
                  <div className="font-display text-5xl font-bold tracking-tight">
                    ₹{tier.amount.toLocaleString("en-IN")}
                  </div>
                  <p className={`mt-4 leading-relaxed ${look.sub}`}>
                    {tr(tier.impact)}
                  </p>
                  {donation.upiButtons && (
                    <div className="mt-auto hidden pt-5 pointer-coarse:block">
                      <a
                        href={upiHref(tier.amount)}
                        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${look.upi}`}
                      >
                        {t("donate.upi.give")} ₹{tier.amount.toLocaleString("en-IN")}
                      </a>
                    </div>
                  )}
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* after you donate */}
      <section className="py-20">
        <div className="container-page grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="relative isolate h-full overflow-hidden rounded-4xl bg-night p-7 text-white/85 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -bottom-24 -z-10 h-72 w-72 rounded-full bg-lime-400/20 blur-3xl"
              />
              <h2 className="font-display text-3xl font-bold text-white">
                {t("donate.after.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-white/80">{t("donate.after.body")}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn.lime} ${size.md}`}
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  {t("donate.after.whatsapp")}
                </a>
                <a
                  href={mailHref}
                  className={`${btn.glass} ${size.md}`}
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {t("donate.after.email")}
                </a>
              </div>
              {site.donation.taxNote && site.registration.eightyG && (
                <p className="mt-6 border-t border-white/15 pt-5 text-sm text-white/70">
                  {t("about.legal.80g")}: {site.registration.eightyG}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-4xl border border-line bg-surface p-7 shadow-soft sm:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-400 text-oasis-900">
                <Icon name="gift" className="h-7 w-7" />
              </span>
              <h2 className="font-display mt-6 text-3xl font-bold text-ink">
                {t("donate.goods.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-2">{t("donate.goods.body")}</p>
              <div className="mt-7 space-y-3 text-sm">
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 font-medium text-ink transition hover:border-line-strong hover:bg-surface-2"
                >
                  <Icon name="phone" className="h-4 w-4 text-brand-ink" />
                  {contact.phone}
                </a>
                <a
                  href={`https://wa.me/${contact.whatsappHref}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 font-medium text-ink transition hover:border-line-strong hover:bg-surface-2"
                >
                  <Icon name="whatsapp" className="h-4 w-4 text-brand-ink" />
                  {contact.whatsapp}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 font-medium break-all text-ink transition hover:border-line-strong hover:bg-surface-2"
                >
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-ink" />
                  {contact.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
