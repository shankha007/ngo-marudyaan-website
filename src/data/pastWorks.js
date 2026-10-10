/* ===================================================================
   PAST WORKS  —  every drive and project we have done, on the
   Past Works page (newest first) and the latest three on About Us
   -------------------------------------------------------------------
   HOW TO ADD A WORK
   Copy one block below and change it. The order in this file does not
   matter: the site sorts by date.

   FIELDS
   • id          short unique name, used in links: /past-works#<id>
   • date        "2019-07-03" — or "2021" when only the year is known
   • place       optional, where it happened
   • category    one of: food, education, health, winter, festival
                 (sets the icon and lists the work under that programme
                 on the Our Work page)
   • title, summary   English (en) and Bengali (bn)
   • highlights  optional dated points under the summary
   • project     optional id of a photo album in projects.js. The work
                 then shows the album's cover photo and a "View photos"
                 link to it in the Gallery.

   HOW TO ADD PHOTOS
   Make an album for the work (see the top of projects.js), then set
   `project` here to the album's id. Until then the work shows its
   programme's icon instead of a photo.
=================================================================== */

export const pastWorks = [
  {
    id: "sharodiya-sahosathi-2022",
    date: "2022",
    category: "festival",
    project: "2022-sharodiya-sahosathi",
    title: { en: "Sharodiya Sahosathi 2022", bn: "শারদীয়া সহসাথী ২০২২" },
    summary: {
      en: "Before Durga Puja, our volunteers spent an evening with a group of children and handed each of them new shoes, stationery and books, so that they too had something new for the festival.",
      bn: "দুর্গাপুজোর আগে আমাদের স্বেচ্ছাসেবকরা একদল শিশুর সঙ্গে একটা সন্ধ্যা কাটান এবং প্রত্যেকের হাতে নতুন জুতো, খাতা-পেন ও বই তুলে দেন, যাতে উৎসবে তাদের কাছেও কিছু নতুন থাকে।",
    },
  },
  {
    id: "micro-library",
    date: "2021",
    place: { en: "Santoshpur, Kolkata", bn: "সন্তোষপুর, কলকাতা" },
    category: "education",
    project: "2021-micro-library",
    title: { en: "Micro Library", bn: "মাইক্রো লাইব্রেরি" },
    summary: {
      en: "We collected Bengali storybooks, classics and school guides and set up a small free lending library at a women and children's development centre, opened together with the children who now use it.",
      bn: "বাংলা গল্পের বই, ক্লাসিক ও স্কুলের সহায়িকা সংগ্রহ করে একটি নারী ও শিশু উন্নয়ন কেন্দ্রে বিনামূল্যের ছোট একটি গ্রন্থাগার গড়ে তোলা হয় — উদ্বোধন হয় সেই শিশুদের সঙ্গেই, যারা আজ এটি ব্যবহার করে।",
    },
  },
  {
    id: "amphan-relief-gosaba",
    date: "2020-05-31",
    place: { en: "Gosaba, Sundarbans, West Bengal", bn: "গোসাবা, সুন্দরবন, পশ্চিমবঙ্গ" },
    category: "winter",
    project: "2020-cyclone-relief",
    title: { en: "Amphan Relief at Gosaba", bn: "গোসাবায় আমফান ত্রাণ" },
    summary: {
      en: "After Cyclone Amphan flooded the Sundarbans, volunteers packed food and essentials in Kolkata, carried them by boat to island villages around Gosaba that the water had cut off, and handed them out family by family.",
      bn: "ঘূর্ণিঝড় আমফানে সুন্দরবন প্লাবিত হলে স্বেচ্ছাসেবকরা কলকাতায় খাবার ও প্রয়োজনীয় সামগ্রী প্যাক করে নৌকায় গোসাবার জলবন্দি দ্বীপের গ্রামগুলিতে পৌঁছে দেন এবং পরিবার ধরে ধরে বিতরণ করেন।",
    },
  },
  {
    id: "covid-relief",
    date: "2020-05-16",
    place: { en: "Belgharia, Kolkata", bn: "বেলঘরিয়া, কলকাতা" },
    category: "food",
    title: { en: "Covid Relief", bn: "কোভিড ত্রাণ" },
    summary: {
      en: "When the lockdown took away daily work, we brought food to families who had nothing left to fall back on. The Corona Relief Project carried on side by side with our Amphan relief.",
      bn: "লকডাউনে রোজকার কাজ হারিয়ে যাঁদের আর কোনও উপায় ছিল না, তাঁদের কাছে খাবার পৌঁছে দেওয়া হয়। আমফান ত্রাণের পাশাপাশি চলেছে আমাদের ‘করোনা রিলিফ প্রজেক্ট’-এর কাজও।",
    },
    highlights: [
      {
        date: "2020-05-28",
        en: "Rice, dal, potatoes, salt and other essentials handed to 20 labourers' families near Belgharia Mission.",
        bn: "বেলঘরিয়া মিশন সংলগ্ন ২০টি শ্রমিক পরিবারের হাতে চাল, ডাল, আলু, নুন ইত্যাদি তুলে দেওয়া হয়।",
      },
      {
        date: "2020-05-29",
        en: "Financial help for the family of a young boy near Belgharia Mohua Club, for his brain tumour operation.",
        bn: "বেলঘরিয়া মহুয়া ক্লাবের নিকট একটি ছোট্ট ভাইয়ের ব্রেন টিউমার অপারেশনের জন্য তার পরিবারকে অর্থসাহায্য করা হয়।",
      },
    ],
  },
  {
    id: "sharodiya-sahosathi-2019",
    date: "2019-09-29",
    place: { en: "Diamond Harbour, West Bengal", bn: "ডায়মন্ড হারবার, পশ্চিমবঙ্গ" },
    category: "festival",
    title: { en: "Sharodiya Sahosathi for special children", bn: "বিশেষ শিশুদের জন্য শারদীয়া সহসাথী" },
    summary: {
      en: "The first Sharodiya Sahosathi: ahead of Durga Puja we spent the day with children with special needs, so that the festival reached them too.",
      bn: "প্রথম শারদীয়া সহসাথী: দুর্গাপুজোর আগে বিশেষ চাহিদাসম্পন্ন শিশুদের সঙ্গে একটা দিন কাটানো, যাতে উৎসবের আনন্দ তাদের কাছেও পৌঁছয়।",
    },
  },
  {
    id: "indian-museum-excursion",
    date: "2019-07-03",
    place: { en: "Indian Museum, Kolkata", bn: "ভারতীয় সংগ্রহশালা, কলকাতা" },
    category: "education",
    title: { en: "A day at the Indian Museum", bn: "ভারতীয় সংগ্রহশালায় একটি দিন" },
    summary: {
      en: "An excursion for underprivileged children to the Indian Museum, Kolkata, a chance to see history up close and spend a day learning outside the classroom.",
      bn: "সুবিধাবঞ্চিত শিশুদের নিয়ে কলকাতার ভারতীয় সংগ্রহশালায় শিক্ষামূলক ভ্রমণ — ইতিহাসকে কাছ থেকে দেখা আর ক্লাসঘরের বাইরে শেখার একটা দিন।",
    },
  },
  {
    id: "netaji-jayanti-winter-drive",
    date: "2019-01-23",
    place: { en: "Kolkata", bn: "কলকাতা" },
    category: "winter",
    title: { en: "Netaji's birthday winter drive", bn: "নেতাজির জন্মদিনে শীতবস্ত্র বিতরণ" },
    summary: {
      en: "On Netaji Subhas Chandra Bose's birthday we went out to help people living on the streets through the winter cold.",
      bn: "নেতাজি সুভাষচন্দ্র বসুর জন্মদিনে শীতের রাতে পথবাসী মানুষের পাশে দাঁড়ানোর উদ্যোগ নেয় মরুদ্যান।",
    },
  },
  {
    id: "shantipur-children",
    date: "2018-08-17",
    place: { en: "Shantipur, West Bengal", bn: "শান্তিপুর, পশ্চিমবঙ্গ" },
    category: "education",
    title: { en: "For the children of Shantipur", bn: "শান্তিপুরের শিশুদের পাশে" },
    summary: {
      en: "Our first work outside Kolkata: volunteers travelled to Shantipur to support underprivileged children there.",
      bn: "কলকাতার বাইরে আমাদের প্রথম কাজ: স্বেচ্ছাসেবকরা শান্তিপুরে গিয়ে সেখানকার সুবিধাবঞ্চিত শিশুদের পাশে দাঁড়ান।",
    },
  },
  {
    id: "help-an-author",
    date: "2018-06-15",
    category: "education",
    title: { en: "Help an Author", bn: "লেখকের পাশে" },
    summary: {
      en: "We stood beside a writer who needed support, so that their work could reach readers.",
      bn: "সহায়তার প্রয়োজন ছিল এমন এক লেখকের পাশে দাঁড়ানো, যাতে তাঁর লেখা পাঠকের কাছে পৌঁছতে পারে।",
    },
  },
  {
    id: "first-winter-project",
    date: "2017-12-25",
    place: { en: "Streets of Kolkata", bn: "কলকাতার পথে" },
    category: "winter",
    title: { en: "Our first winter project", bn: "আমাদের প্রথম শীতবস্ত্র উদ্যোগ" },
    summary: {
      en: "Where it all began: on Christmas Day 2017 our volunteers went out on the streets of Kolkata to bring warmth to people spending the winter on the footpath.",
      bn: "যেখান থেকে শুরু: ২০১৭-র বড়দিনে আমাদের স্বেচ্ছাসেবকরা কলকাতার পথে নেমেছিলেন ফুটপাতে শীত কাটানো মানুষদের কাছে একটু উষ্ণতা পৌঁছে দিতে।",
    },
  },
];

/* --- helpers -------------------------------------------------------- */

/* Newest first. "2021" counts as the start of that year. */
export const sortedPastWorks = [...pastWorks].sort((a, b) => b.date.localeCompare(a.date));

/* "25 December 2017" / "২৫ ডিসেম্বর, ২০১৭" — or just the year. */
export function formatWorkDate(date, lang) {
  const [y, m, d] = date.split("-").map(Number);
  const locale = lang === "bn" ? "bn-BD" : "en-GB";
  if (!m) return y.toLocaleString(locale, { useGrouping: false });
  return new Date(Date.UTC(y, m - 1, d || 1)).toLocaleDateString(locale, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    ...(d ? { day: "numeric" } : {}),
  });
}

export const workYear = (work) => work.date.slice(0, 4);
