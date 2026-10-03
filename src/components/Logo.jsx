/* The official logo. The image is a round crop of the logo on white, so the
   white circle behind it keeps it readable on the dark footer too.
   To change it, replace public/images/logo.png (keep it square). */

export default function Logo({ className = "h-10 w-10" }) {
  return (
    <img
      src="/images/logo.png"
      alt="NGO Marudyaan"
      width="384"
      height="384"
      className={`rounded-full bg-white object-contain ${className}`}
    />
  );
}
