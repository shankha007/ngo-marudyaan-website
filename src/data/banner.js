/* ===================================================================
   HOME PAGE BANNER  —  the part you will change most often
   -------------------------------------------------------------------
   HOW TO CHANGE THE BANNER
   1. Put your new picture in:  public/images/   (e.g. puja-drive.jpg)
      — or use any gallery photo, e.g. "/images/projects/<id>/01.jpg"
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
    image: "/images/projects/2022-sharodiya-sahosathi/02.jpg",
    align: "left",                          // "left" | "center"
    kicker: { en: "Our current drive", bn: "আমাদের চলতি উদ্যোগ" },
    title: {
      en: "This Puja, help a child get something new to wear",
      bn: "এই পুজো, কারও মুখে ফুটুক একটুখানি হাসি",
    },
    subtitle: {
      en: "New clothes, a festive meal and a good day out for children and families who usually miss out on the celebrations.",
      bn: "নতুন জামা, উৎসবের খাবার আর একটা ভালো দিন, সেই সব শিশু ও পরিবারের জন্য যারা সাধারণত উৎসবের বাইরেই থেকে যায়।",
    },
    primaryCta: { label: { en: "Support this drive", bn: "এই উদ্যোগে পাশে থাকুন" }, to: "/donate" },
    secondaryCta: { label: { en: "See our work", bn: "আমাদের কাজ দেখুন" }, to: "/about#our-work" },
  },
  {
    id: "winter-2026",
    active: true,
    image: "/images/projects/2019-netaji-jayanti-winter-drive/01.jpg",
    align: "left",
    kicker: { en: "Coming up next", bn: "পরবর্তী উদ্যোগ" },
    title: {
      en: "A warm blanket for a cold night",
      bn: "শীতের রাতে একটা গরম কম্বল",
    },
    subtitle: {
      en: "In the coldest weeks of the year, we hand out blankets and warm clothes to people sleeping on Kolkata's footpaths.",
      bn: "বছরের সবচেয়ে ঠান্ডা সপ্তাহগুলিতে আমরা কলকাতার ফুটপাতে রাত কাটানো মানুষদের হাতে কম্বল ও গরম জামাকাপড় তুলে দিই।",
    },
    primaryCta: { label: { en: "Become a volunteer", bn: "স্বেচ্ছাসেবক হন" }, to: "/get-involved" },
    secondaryCta: { label: { en: "Contact us", bn: "যোগাযোগ করুন" }, to: "/contact" },
  },
];

/* ===================================================================
   THIN STRIP ABOVE THE HEADER  ("top banner")
   -------------------------------------------------------------------
   • Show or hide it with the one flag below:  active: true / false
   • Everything it says — the little pill, the message and the link —
     is text you edit right here. Leave `badge` empty ("") to drop the
     pill, or `linkLabel` empty to drop the link.
=================================================================== */
export const announcement = {
  active: false,        // <-- the switch: true shows the strip, false hides it
  badge: { en: "New", bn: "নতুন" },
  text: {
    en: "Our Puja drive is open. Whatever you give goes straight to a family.",
    bn: "পুজোর অনুদান সংগ্রহ চলছে। আপনি যা দেবেন, তা সরাসরি একটি পরিবারের কাছে পৌঁছবে।",
  },
  linkLabel: { en: "Donate", bn: "দান করুন" },
  to: "/donate",
};
