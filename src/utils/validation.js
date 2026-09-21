/* Deliberately loose: catches obvious typos ("name@gmail", "name gmail.com")
   without rejecting unusual but valid addresses. */
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/* A phone number the NGO can actually call or WhatsApp: only digits and the
   usual separators (+ - space parentheses), with 10 to 15 digits in total —
   covers "98765 43210", "+91 98765-43210" and international numbers. */
export const isValidPhone = (value) => {
  const v = value.trim();
  if (!/^[+\d\s()-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "").length;
  return digits >= 10 && digits <= 15;
};
