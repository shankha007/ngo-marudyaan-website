import { site } from "../data/site";

/* The forms send in one of two ways:
   - with a Web3Forms key in site.js, straight from the page to the NGO's inbox;
   - without one, by opening the visitor's own email app with everything filled in. */
export const sendsDirect = Boolean(site.forms?.web3formsKey);

export const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export const mailtoHref = (subject, body) =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const whatsappHref = (text) =>
  `https://wa.me/${site.contact.whatsappHref}?text=${encodeURIComponent(text)}`;

export async function postForm({ subject, body, name, email }) {
  const res = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: site.forms.web3formsKey,
      subject,
      from_name: `${site.name} website`,
      name,
      // Web3Forms uses `email` as the reply-to address
      ...(email ? { email } : {}),
      message: body,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
}
