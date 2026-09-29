import { useState } from "react";
import { mailtoHref, postForm, sendsDirect } from "../utils/sendForm";

/* Sends a form the best way available (see utils/sendForm.js).
   status: "idle" | "sending" | "sent" | "failed" | "opened" (handed to the email app)
   `message` keeps the last subject/body so the fallbacks resend exactly that.

   send() takes the same details twice: `body` is the whole thing as plain text
   (for the email app and WhatsApp), `fields` + `note` are the same details as
   separate labelled fields plus the visitor's own words (for Web3Forms). */
export default function useFormSender() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const send = async ({ subject, body, name, email, fields, note, form }) => {
    setMessage({ subject, body });
    if (!sendsDirect) {
      setStatus("opened");
      window.location.assign(mailtoHref(subject, body));
      return true;
    }
    // hidden "botcheck" box: people never see it, spam bots tick it
    if (form?.elements.botcheck?.checked) {
      setStatus("sent");
      return true;
    }
    setStatus("sending");
    try {
      await postForm({ subject, name, email, fields, message: note });
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

  return { status, message, send, reset };
}
