import { useState } from "react";
import CopyField from "../components/CopyField";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
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

  const whatsappHref = `https://wa.me/${contact.whatsappHref}?text=${encodeURIComponent(
    "Hello NGO Marudyaan, I have made a donation. Here are my details:\nName:\nPhone:\nAmount:\nPAN (for 80G receipt):",
  )}`;
  const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(
    "Donation details",
  )}&body=${encodeURIComponent(
    "Name:\nPhone:\nAmount:\nDate of transfer:\nPAN (for 80G receipt):\n\n(Please attach the payment screenshot.)",
  )}`;

  return (
    <>
      <PageHeader title={t("donate.title")} sub={t("donate.sub")} />

      {/* QR + bank details */}
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-5">
          {/* QR card */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col items-center rounded-3xl border border-oasis-100 bg-white p-8 text-center shadow-sm">
              <h2 className="font-display text-2xl font-bold text-oasis-900">
                {t("donate.qr.title")}
              </h2>
              <div className="mt-6 rounded-2xl bg-sand-100 p-4 ring-1 ring-oasis-100">
                {qrFailed ? (
                  <div className="flex h-64 w-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-oasis-300 px-6 text-sm text-oasis-800/60">
                    <Icon name="copy" className="mb-3 h-8 w-8 text-oasis-300" />
                    {t("donate.qr.missing")}
                    <code className="mt-2 text-[11px] break-all text-oasis-600">
                      public{donation.qrImage}
                    </code>
                  </div>
                ) : (
                  <img
                    src={donation.qrImage}
                    alt="UPI QR code for NGO Marudyaan"
                    onError={() => setQrFailed(true)}
                    className="h-64 w-64 rounded-xl bg-white object-contain"
                  />
                )}
              </div>
              <p className="mt-4 max-w-xs text-sm text-oasis-800/65">{t("donate.qr.note")}</p>
              <div className="mt-6 w-full rounded-2xl bg-oasis-50 px-5 py-1">
                <CopyField label={t("donate.upi.label")} value={donation.upiId} mono />
              </div>
              <p className="mt-4 text-xs text-oasis-800/50">{donation.upiName}</p>
            </div>
          </Reveal>

          {/* bank card */}
          <Reveal delay={100} className="lg:col-span-3">
            <div className="flex h-full flex-col rounded-3xl border border-oasis-100 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-oasis-900">
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
                />
                <CopyField label={t("donate.bank.bankName")} value={donation.bank.bankName} />
                <CopyField label={t("donate.bank.branch")} value={donation.bank.branch} />
                <CopyField label={t("donate.bank.ifsc")} value={donation.bank.ifsc} mono />
                <CopyField
                  label={t("donate.bank.accountType")}
                  value={donation.bank.accountType}
                />
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-saffron-500/10 p-4 text-sm text-oasis-900/80">
                <Icon name="shield" className="mt-0.5 h-5 w-5 shrink-0 text-saffron-600" />
                <p>{t("donate.safety")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* what your donation does */}
      <section className="bg-sand-100 py-20">
        <div className="container-page">
          <SectionHeading title={t("donate.impact.title")} sub={t("donate.impact.note")} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {donationTiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 80}>
                <div className="h-full rounded-2xl border border-oasis-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="font-display text-3xl font-bold text-oasis-700">
                    ₹{tier.amount.toLocaleString("en-IN")}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-oasis-800/75">
                    {tr(tier.impact)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* after you donate */}
      <section className="py-20">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl bg-oasis-800 p-8 text-sand-100">
              <h2 className="font-display text-2xl font-bold text-white">
                {t("donate.after.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-sand-200/85">{t("donate.after.body")}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-oasis-900 transition hover:bg-saffron-400"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  {t("donate.after.whatsapp")}
                </a>
                <a
                  href={mailHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Icon name="mail" className="h-4 w-4" />
                  {t("donate.after.email")}
                </a>
              </div>
              {site.donation.taxNote && site.registration.eightyG && (
                <p className="mt-6 border-t border-white/15 pt-5 text-sm text-sand-200/70">
                  {t("about.legal.80g")}: {site.registration.eightyG}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-3xl border border-oasis-100 bg-white p-8 shadow-sm">
              <span className="inline-flex rounded-2xl bg-oasis-50 p-3 text-oasis-600">
                <Icon name="gift" className="h-7 w-7" />
              </span>
              <h2 className="font-display mt-5 text-2xl font-bold text-oasis-900">
                {t("donate.goods.title")}
              </h2>
              <p className="mt-3 leading-relaxed text-oasis-800/80">{t("donate.goods.body")}</p>
              <div className="mt-7 space-y-3 text-sm">
                <a
                  href={`tel:${contact.phoneHref}`}
                  className="flex items-center gap-3 rounded-xl border border-oasis-100 px-4 py-3 text-oasis-800 transition hover:border-oasis-300 hover:bg-oasis-50"
                >
                  <Icon name="phone" className="h-4 w-4 text-oasis-600" />
                  {contact.phone}
                </a>
                <a
                  href={`https://wa.me/${contact.whatsappHref}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-oasis-100 px-4 py-3 text-oasis-800 transition hover:border-oasis-300 hover:bg-oasis-50"
                >
                  <Icon name="whatsapp" className="h-4 w-4 text-oasis-600" />
                  {contact.whatsapp}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 rounded-xl border border-oasis-100 px-4 py-3 break-all text-oasis-800 transition hover:border-oasis-300 hover:bg-oasis-50"
                >
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-oasis-600" />
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
