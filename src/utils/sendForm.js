import { site } from "../data/site";

/* Each form sends in one of two ways:
   - with its Web3Forms key in site.js, straight from the page to the NGO's inbox;
   - without one, by opening the visitor's own email app with everything filled in.
   `form` is the form's name in site.forms.keys: "contact", "involved" or "help". */
export const web3formsKey = (form) => site.forms?.keys?.[form] || "";
export const sendsDirect = (form) => Boolean(web3formsKey(form));

export const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export const mailtoHref = (subject, body) =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const whatsappHref = (text) =>
  `https://wa.me/${site.contact.whatsappHref}?text=${encodeURIComponent(text)}`;

/* Web3Forms emails every field it receives as its own row, labelled with the
   field's name — so each detail is sent separately ({ "Phone": "…", … }) and
   `message` holds only what the visitor wrote in their own words. */
export async function postForm({ form, subject, name, email, fields = {}, message }) {
  const res = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: web3formsKey(form),
      subject,
      from_name: `${site.name} website`,
      name,
      // Web3Forms uses `email` as the reply-to address
      ...(email ? { email } : {}),
      ...fields,
      message,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
}
