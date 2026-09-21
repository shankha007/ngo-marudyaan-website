/* Deliberately loose: catches obvious typos ("name@gmail", "name gmail.com")
   without rejecting unusual but valid addresses. */
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
