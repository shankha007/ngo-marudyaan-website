import { useState } from "react";
import { mailtoHref, postForm, sendsDirect } from "../utils/sendForm";

/* Sends one form the best way available (see utils/sendForm.js).
   `form` is its name in site.forms.keys: "contact", "involved" or "help".
   `direct` says whether it goes straight to the inbox (it has a Web3Forms key).
   status: "idle" | "sending" | "sent" | "failed" | "opened" (handed to the email app)
   `message` keeps the last subject/body so the fallbacks resend exactly that.

   send() takes the same details twice: `body` is the whole thing as plain text
   (for the email app and WhatsApp), `fields` + `note` are the same details as
   separate labelled fields plus the visitor's own words (for Web3Forms). */
export default function useFormSender(form) {
  const direct = sendsDirect(form);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const send = async ({ subject, body, name, email, fields, note, form: formEl }) => {
    setMessage({ subject, body });
    if (!direct) {
      setStatus("opened");
      window.location.assign(mailtoHref(subject, body));
      return true;
    }
    // hidden "botcheck" box: people never see it, spam bots tick it
    if (formEl?.elements.botcheck?.checked) {
      setStatus("sent");
      return true;
    }
    setStatus("sending");
    try {
      await postForm({ form, subject, name, email, fields, message: note });
      setStatus("sent");
      return true;
    } catch {
      setStatus("failed");
      return false;
    }
  };

  /* call when the visitor edits the form, so an old result is not left showing */
  const reset = () => {
    if (status === "sending" || status === "idle") return;
    setStatus("idle");
    setMessage(null);
  };

  return { direct, status, message, send, reset };
}
