/* ===================================================================
   HOME PAGE BANNER  —  the part you will change most often
   -------------------------------------------------------------------
   HOW TO CHANGE THE BANNER
   1. Put your new picture in:  public/images/   (e.g. puja-drive.jpg)
   2. Edit the slide below: set `image` to "/images/puja-drive.jpg"
      and rewrite the English (en) and Bengali (bn) text.
   3. Save. That's it.

   • Want more than one banner? Add another { ... } block to the array —
     they rotate automatically every few seconds.
   • Want a single fixed banner? Keep just one block in the array.
   • Hide a banner without deleting it: set  active: false
=================================================================== */

export const bannerSettings = {
  autoPlay: true,       // rotate slides automatically?
  intervalMs: 6500,     // time each slide stays on screen
};

export const bannerSlides = [
  {
    id: "puja-2026",
    active: true,
    image: "/images/banner-1.svg",          // TODO: replace with your photo
    align: "left",                          // "left" | "center"
    kicker: { en: "Our current drive", bn: "আমাদের চলতি উদ্যোগ" },
    title: {
      en: "This Puja, let a smile bloom on someone's face",
      bn: "এই পুজো, কারও মুখে ফুটুক একটুখানি হাসি",
    },
    subtitle: {
      en: "New clothes, festive meals and a day of joy for children and families who are usually left out of the celebration.",
      bn: "নতুন জামা, উৎসবের খাবার আর একটা আনন্দের দিন — সেই সব শিশু ও পরিবারের জন্য, যারা সাধারণত উৎসবের বাইরেই থেকে যায়।",
    },
    primaryCta: { label: { en: "Support this drive", bn: "এই উদ্যোগে পাশে থাকুন" }, to: "/donate" },
    secondaryCta: { label: { en: "See our work", bn: "আমাদের কাজ দেখুন" }, to: "/our-work" },
  },
  {
    id: "winter-2026",
    active: true,
    image: "/images/banner-2.svg",          // TODO: replace with your photo
    align: "left",
    kicker: { en: "Coming up next", bn: "পরবর্তী উদ্যোগ" },
    title: {
      en: "Warmth for every winter night",
      bn: "প্রতিটি শীতের রাতে একটু উষ্ণতা",
    },
    subtitle: {
      en: "Blankets and warm clothing distributed to people living on the streets of Kolkata through the coldest weeks of the year.",
      bn: "বছরের সবচেয়ে শীতল সপ্তাহগুলিতে কলকাতার ফুটপাতবাসী মানুষের হাতে কম্বল ও শীতবস্ত্র পৌঁছে দেওয়া।",
    },
    primaryCta: { label: { en: "Become a volunteer", bn: "স্বেচ্ছাসেবক হন" }, to: "/get-involved" },
    secondaryCta: { label: { en: "Contact us", bn: "যোগাযোগ করুন" }, to: "/contact" },
  },
];

/* Thin strip above the header. Set active:false to hide it. */
export const announcement = {
  active: true,
  text: {
    en: "Puja donation drive is open — every contribution reaches a family directly.",
    bn: "পুজোর অনুদান সংগ্রহ চলছে — প্রতিটি সহায়তা সরাসরি পরিবারের কাছে পৌঁছয়।",
  },
  linkLabel: { en: "Donate", bn: "দান করুন" },
  to: "/donate",
};
