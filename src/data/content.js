/* ===================================================================
   PAGE CONTENT  —  programmes, gallery, team, timeline, FAQs
   -------------------------------------------------------------------
   Every text field has an English (en) and a Bengali (bn) version.
   All copy below is a realistic DRAFT written from your Facebook page:
   please read it through and replace it with your real details.
=================================================================== */

/* --- WHAT WE DO -------------------------------------------------- */
export const programs = [
  {
    id: "food",
    icon: "bowl",
    image: "/images/work-food.svg",
    title: { en: "Food & Nutrition", bn: "খাদ্য ও পুষ্টি" },
    summary: {
      en: "Cooked meals and dry ration kits for people living on the streets, in slums and in old-age homes across Kolkata.",
      bn: "কলকাতার ফুটপাত, বস্তি ও বৃদ্ধাশ্রমের মানুষের জন্য রান্না করা খাবার ও শুকনো রেশন কিট।",
    },
    details: {
      en: [
        "Weekly street-food drives where volunteers hand out freshly cooked meals.",
        "Monthly dry ration kits — rice, dal, oil, soya and spices — for families with no steady income.",
        "Birthday and festival meal sponsorships, where a donor funds one full day of meals.",
      ],
      bn: [
        "প্রতি সপ্তাহে রাস্তায় খাবার বিতরণ — স্বেচ্ছাসেবকরা সদ্য রান্না করা খাবার তুলে দেন।",
        "নিয়মিত আয় নেই এমন পরিবারের জন্য মাসিক শুকনো রেশন কিট — চাল, ডাল, তেল, সয়াবিন ও মশলা।",
        "জন্মদিন ও উৎসবে খাবারের পৃষ্ঠপোষকতা, যেখানে একজন দাতা একদিনের সম্পূর্ণ খাবারের দায়িত্ব নেন।",
      ],
    },
  },
  {
    id: "education",
    icon: "book",
    image: "/images/work-education.svg",
    title: { en: "Education & Learning", bn: "শিক্ষা ও পাঠ" },
    summary: {
      en: "Free coaching, study materials and school kits so that no child drops out for want of a pen, a book or a little guidance.",
      bn: "বিনামূল্যে পড়াশোনা, বই-খাতা ও স্কুল কিট — একটা কলম বা বইয়ের অভাবে যেন কোনও শিশুর পড়া বন্ধ না হয়।",
    },
    details: {
      en: [
        "Evening learning circles for first-generation learners in Classes 1 to 8.",
        "School kits at the start of every academic year: bags, notebooks, uniforms and shoes.",
        "Exam-fee and admission support for students at risk of dropping out.",
      ],
      bn: [
        "প্রথম প্রজন্মের পড়ুয়াদের জন্য (১ম–৮ম শ্রেণি) সান্ধ্যকালীন পাঠচক্র।",
        "প্রতি শিক্ষাবর্ষের শুরুতে স্কুল কিট: ব্যাগ, খাতা, ইউনিফর্ম ও জুতো।",
        "পড়া ছেড়ে দেওয়ার ঝুঁকিতে থাকা পড়ুয়াদের পরীক্ষার ফি ও ভর্তির সহায়তা।",
      ],
    },
  },
  {
    id: "health",
    icon: "heart",
    image: "/images/work-health.svg",
    title: { en: "Health Camps", bn: "স্বাস্থ্য শিবির" },
    summary: {
      en: "Free medical check-up camps, blood donation drives and medicine support in underserved neighbourhoods.",
      bn: "সুবিধাবঞ্চিত এলাকায় বিনামূল্যে স্বাস্থ্য পরীক্ষা শিবির, রক্তদান শিবির ও ওষুধের সহায়তা।",
    },
    details: {
      en: [
        "General check-up camps with volunteer doctors, plus free basic medicines.",
        "Blood donation camps organised with local clubs and hospitals.",
        "Awareness sessions on hygiene, menstrual health and seasonal illness.",
      ],
      bn: [
        "স্বেচ্ছাসেবী চিকিৎসকদের নিয়ে সাধারণ স্বাস্থ্য পরীক্ষা শিবির ও বিনামূল্যে প্রাথমিক ওষুধ।",
        "স্থানীয় ক্লাব ও হাসপাতালের সঙ্গে যৌথভাবে রক্তদান শিবির।",
        "স্বাস্থ্যবিধি, ঋতুকালীন স্বাস্থ্য ও মরশুমি অসুখ নিয়ে সচেতনতা শিবির।",
      ],
    },
  },
  {
    id: "winter",
    icon: "blanket",
    image: "/images/work-winter.svg",
    title: { en: "Winter & Relief", bn: "শীতবস্ত্র ও ত্রাণ" },
    summary: {
      en: "Blankets, warm clothes and emergency relief whenever the weather or a disaster leaves families exposed.",
      bn: "কম্বল, শীতবস্ত্র ও জরুরি ত্রাণ — আবহাওয়া বা দুর্যোগে বিপন্ন পরিবারের পাশে।",
    },
    details: {
      en: [
        "Night-time blanket distribution through December and January.",
        "Cyclone and flood relief kits: tarpaulin, food, water and basic medicine.",
        "Rebuilding support for families who lose their homes to fire or storm.",
      ],
      bn: [
        "ডিসেম্বর ও জানুয়ারি জুড়ে রাতে কম্বল বিতরণ।",
        "ঘূর্ণিঝড় ও বন্যার ত্রাণ কিট: ত্রিপল, খাবার, জল ও প্রাথমিক ওষুধ।",
        "আগুন বা ঝড়ে ঘর হারানো পরিবারের পুনর্গঠনে সহায়তা।",
      ],
    },
  },
  {
    id: "festival",
    icon: "gift",
    image: "/images/work-festival.svg",
    title: { en: "Festivals for Everyone", bn: "সবার জন্য উৎসব" },
    summary: {
      en: "New clothes and a proper celebration at Durga Puja, Eid and Poila Boishakh for children who would otherwise watch from outside.",
      bn: "দুর্গাপুজো, ইদ ও পয়লা বৈশাখে নতুন জামা ও আনন্দের আয়োজন — সেই শিশুদের জন্য, যারা নইলে বাইরে থেকেই দেখত।",
    },
    details: {
      en: [
        "Puja shopping days where children pick their own new clothes.",
        "Community feasts with sweets, music and games.",
        "Gift drives for children in shelter homes.",
      ],
      bn: [
        "পুজোর কেনাকাটার দিন, যেখানে শিশুরা নিজের পছন্দে নতুন জামা বেছে নেয়।",
        "মিষ্টি, গান আর খেলা নিয়ে সম্প্রদায়ের ভোজ।",
        "হোমে থাকা শিশুদের জন্য উপহার বিতরণ।",
      ],
    },
  },
  {
    id: "women",
    icon: "hands",
    image: "/images/work-women.svg",
    title: { en: "Women & Livelihood", bn: "নারী ও জীবিকা" },
    summary: {
      en: "Skill training and small self-help groups that help women in our neighbourhoods earn with dignity.",
      bn: "দক্ষতা প্রশিক্ষণ ও ছোট স্বনির্ভর গোষ্ঠী — যাতে এলাকার মহিলারা সম্মানের সঙ্গে রোজগার করতে পারেন।",
    },
    details: {
      en: [
        "Tailoring and handicraft training batches.",
        "Sanitary napkin distribution and menstrual health awareness.",
        "Help with documents, bank accounts and government scheme applications.",
      ],
      bn: [
        "সেলাই ও হস্তশিল্প প্রশিক্ষণের ব্যাচ।",
        "স্যানিটারি ন্যাপকিন বিতরণ ও ঋতুকালীন স্বাস্থ্য সচেতনতা।",
        "নথিপত্র, ব্যাঙ্ক অ্যাকাউন্ট ও সরকারি প্রকল্পে আবেদনে সহায়তা।",
      ],
    },
  },
];

/* --- OUR STORY / MILESTONES -------------------------------------- */
export const milestones = [
  {
    year: "2019",
    title: { en: "A handful of friends, one Sunday", bn: "কয়েকজন বন্ধু, একটি রবিবার" },
    text: {
      en: "A small group of friends in Kolkata started cooking and distributing meals to people sleeping on the footpath. There was no name, no registration — only a Sunday routine.",
      bn: "কলকাতার কয়েকজন বন্ধু ফুটপাতে ঘুমোনো মানুষের জন্য রান্না করে খাবার বিতরণ শুরু করেন। তখন নাম ছিল না, নথিভুক্তিও নয় — শুধু একটা রবিবারের অভ্যাস।",
    },
  },
  {
    year: "2020",
    title: { en: "The pandemic years", bn: "অতিমারির বছরগুলি" },
    text: {
      en: "During the lockdown the group delivered ration kits, masks and medicines to families who had lost all work. What began as a routine became a responsibility.",
      bn: "লকডাউনে কাজ হারানো পরিবারের কাছে রেশন কিট, মাস্ক ও ওষুধ পৌঁছে দেওয়া হয়। অভ্যাস তখন দায়িত্বে বদলে যায়।",
    },
  },
  {
    year: "2022",
    title: { en: "Marudyaan takes its name", bn: "মরুদ্যান নাম পায়" },
    text: {
      en: "The team formally became NGO Marudyaan — 'an oasis' — and added education and health camps to the regular food drives.",
      bn: "দলটি আনুষ্ঠানিকভাবে ‘এনজিও মরুদ্যান’ নাম নেয় এবং নিয়মিত খাদ্য বিতরণের সঙ্গে শিক্ষা ও স্বাস্থ্য শিবির যুক্ত হয়।",
    },
  },
  {
    year: "2024",
    title: { en: "Beyond the city", bn: "শহরের বাইরে" },
    text: {
      en: "Relief and winter drives reached districts outside Kolkata, supported by a growing circle of volunteers and small donors.",
      bn: "ক্রমবর্ধমান স্বেচ্ছাসেবক ও ছোট দাতাদের সহায়তায় ত্রাণ ও শীতবস্ত্র কর্মসূচি কলকাতার বাইরের জেলাগুলিতেও পৌঁছয়।",
    },
  },
  {
    year: "2026",
    title: { en: "Where we are today", bn: "আজ আমরা যেখানে" },
    text: {
      en: "Six running programmes, a volunteer team across the city, and a promise that every rupee is accounted for.",
      bn: "ছ’টি চলমান কর্মসূচি, শহরজুড়ে স্বেচ্ছাসেবকদের দল, এবং প্রতিটি টাকার হিসেব রাখার অঙ্গীকার।",
    },
  },
];

/* --- VALUES ------------------------------------------------------- */
export const values = [
  {
    id: "dignity",
    title: { en: "Dignity first", bn: "প্রথমে সম্মান" },
    text: {
      en: "We serve people, not photographs. Nobody has to say thank you to receive help from us.",
      bn: "আমরা মানুষের পাশে দাঁড়াই, ছবির জন্য নয়। সাহায্য পেতে কাউকে ধন্যবাদ বলতে হয় না।",
    },
  },
  {
    id: "transparency",
    title: { en: "Every rupee accounted for", bn: "প্রতিটি টাকার হিসেব" },
    text: {
      en: "Donations go into a dedicated account and each drive is published with photos and a cost breakdown.",
      bn: "অনুদান আলাদা অ্যাকাউন্টে জমা হয় এবং প্রতিটি কর্মসূচির ছবি ও খরচের হিসেব প্রকাশ করা হয়।",
    },
  },
  {
    id: "local",
    title: { en: "Rooted in the neighbourhood", bn: "পাড়ার ভিতর থেকেই" },
    text: {
      en: "Our volunteers live in the areas we work in, so help reaches the right door quickly.",
      bn: "আমাদের স্বেচ্ছাসেবকরা সেই এলাকাতেই থাকেন যেখানে কাজ হয়, তাই সাহায্য দ্রুত সঠিক দরজায় পৌঁছয়।",
    },
  },
  {
    id: "consistency",
    title: { en: "Present, not occasional", bn: "নিয়মিত, শুধু উৎসবে নয়" },
    text: {
      en: "We show up every week — not only during festivals or disasters.",
      bn: "আমরা প্রতি সপ্তাহেই থাকি — শুধু উৎসব বা দুর্যোগে নয়।",
    },
  },
];

/* --- TEAM --------------------------------------------------------- */
/* TODO: replace names, roles and photos with your real team.
   Put photos in public/images/team/ and set photo: "/images/team/name.jpg" */
export const team = [
  { id: "t1", photo: "", name: { en: "Full Name", bn: "পুরো নাম" }, role: { en: "Founder & President", bn: "প্রতিষ্ঠাতা ও সভাপতি" } },
  { id: "t2", photo: "", name: { en: "Full Name", bn: "পুরো নাম" }, role: { en: "Secretary", bn: "সম্পাদক" } },
  { id: "t3", photo: "", name: { en: "Full Name", bn: "পুরো নাম" }, role: { en: "Treasurer", bn: "কোষাধ্যক্ষ" } },
  { id: "t4", photo: "", name: { en: "Full Name", bn: "পুরো নাম" }, role: { en: "Volunteer Coordinator", bn: "স্বেচ্ছাসেবক সমন্বয়ক" } },
];

/* --- GALLERY ------------------------------------------------------
   TODO: add your own photos to public/images/gallery/ and list them
   here. category must be one of: food, education, health, winter,
   festival, women.
------------------------------------------------------------------- */
export const galleryItems = [
  { id: "g1",  src: "/images/gallery/g1.svg",  category: "festival",  caption: { en: "Puja clothes distribution", bn: "পুজোর জামা বিতরণ" } },
  { id: "g2",  src: "/images/gallery/g2.svg",  category: "food",      caption: { en: "Sunday street meal drive", bn: "রবিবারের খাবার বিতরণ" } },
  { id: "g3",  src: "/images/gallery/g3.svg",  category: "education", caption: { en: "Evening learning circle", bn: "সান্ধ্য পাঠচক্র" } },
  { id: "g4",  src: "/images/gallery/g4.svg",  category: "health",    caption: { en: "Free health check-up camp", bn: "বিনামূল্যে স্বাস্থ্য শিবির" } },
  { id: "g5",  src: "/images/gallery/g5.svg",  category: "winter",    caption: { en: "Blanket distribution at night", bn: "রাতে কম্বল বিতরণ" } },
  { id: "g6",  src: "/images/gallery/g6.svg",  category: "women",     caption: { en: "Tailoring training batch", bn: "সেলাই প্রশিক্ষণ ব্যাচ" } },
  { id: "g7",  src: "/images/gallery/g7.svg",  category: "food",      caption: { en: "Ration kits ready to go", bn: "বিতরণের জন্য প্রস্তুত রেশন কিট" } },
  { id: "g8",  src: "/images/gallery/g8.svg",  category: "education", caption: { en: "New school kits", bn: "নতুন স্কুল কিট" } },
  { id: "g9",  src: "/images/gallery/g9.svg",  category: "health",    caption: { en: "Blood donation camp", bn: "রক্তদান শিবির" } },
  { id: "g10", src: "/images/gallery/g10.svg", category: "festival",  caption: { en: "Community feast", bn: "সম্প্রদায়ের ভোজ" } },
  { id: "g11", src: "/images/gallery/g11.svg", category: "winter",    caption: { en: "Flood relief kits", bn: "বন্যার ত্রাণ কিট" } },
  { id: "g12", src: "/images/gallery/g12.svg", category: "women",     caption: { en: "Health awareness session", bn: "স্বাস্থ্য সচেতনতা শিবির" } },
];

/* --- VOICES ------------------------------------------------------- */
/* TODO: replace with real quotes (take written consent before publishing) */
export const testimonials = [
  {
    id: "v1",
    quote: {
      en: "My son studies in the evening circle. Last year he could not write his name; this year he stood second in class.",
      bn: "আমার ছেলে সান্ধ্য পাঠচক্রে পড়ে। গত বছর নিজের নামটাও লিখতে পারত না, এ বছর ক্লাসে দ্বিতীয় হয়েছে।",
    },
    author: { en: "Parent, Kolkata", bn: "একজন অভিভাবক, কলকাতা" },
  },
  {
    id: "v2",
    quote: {
      en: "I joined for one Sunday drive out of curiosity. Two years later I am still here — it changes you more than it changes them.",
      bn: "কৌতূহল থেকে একটা রবিবার এসেছিলাম। দু’বছর পরেও আছি — এটা ওদের চেয়ে আমাকেই বেশি বদলে দেয়।",
    },
    author: { en: "Volunteer", bn: "একজন স্বেচ্ছাসেবক" },
  },
  {
    id: "v3",
    quote: {
      en: "They sent photos and the full expense list of the drive I funded. That is why I keep giving.",
      bn: "আমি যে কর্মসূচিতে সাহায্য করেছিলাম, তার ছবি ও পুরো খরচের হিসেব পাঠিয়েছিল। সেই জন্যই আমি বারবার দিই।",
    },
    author: { en: "Monthly donor", bn: "একজন মাসিক দাতা" },
  },
];

/* --- VOLUNTEER ROLES ---------------------------------------------- */
export const volunteerRoles = [
  {
    id: "field",
    title: { en: "Field volunteer", bn: "মাঠপর্যায়ের স্বেচ্ছাসেবক" },
    text: { en: "Join weekend drives — packing, distributing and talking to families.", bn: "সপ্তাহান্তের কর্মসূচিতে যোগ দিন — প্যাকিং, বিতরণ ও পরিবারের সঙ্গে কথা বলা।" },
  },
  {
    id: "teach",
    title: { en: "Teach a class", bn: "ক্লাস নিন" },
    text: { en: "Give two hours a week to the evening learning circles.", bn: "সপ্তাহে দু’ঘণ্টা সান্ধ্য পাঠচক্রে সময় দিন।" },
  },
  {
    id: "skills",
    title: { en: "Lend a skill", bn: "দক্ষতা দিয়ে সাহায্য" },
    text: { en: "Photography, design, accounts, social media, translation — all of it helps.", bn: "ফোটোগ্রাফি, ডিজাইন, হিসাবরক্ষণ, সোশ্যাল মিডিয়া, অনুবাদ — সবই কাজে লাগে।" },
  },
  {
    id: "goods",
    title: { en: "Donate goods", bn: "সামগ্রী দিন" },
    text: { en: "Clothes, books, blankets, grain — in good, usable condition.", bn: "জামাকাপড়, বই, কম্বল, খাদ্যশস্য — ব্যবহারযোগ্য অবস্থায়।" },
  },
  {
    id: "csr",
    title: { en: "Partner with us", bn: "আমাদের সঙ্গী হন" },
    text: { en: "Companies, colleges and puja committees can adopt a full drive.", bn: "সংস্থা, কলেজ ও পুজো কমিটি একটি সম্পূর্ণ কর্মসূচির দায়িত্ব নিতে পারে।" },
  },
  {
    id: "spread",
    title: { en: "Spread the word", bn: "কথা ছড়িয়ে দিন" },
    text: { en: "Share our posts. Most of our volunteers came through a friend.", bn: "আমাদের পোস্ট শেয়ার করুন। বেশিরভাগ স্বেচ্ছাসেবক বন্ধুর মাধ্যমেই এসেছেন।" },
  },
];

/* --- DONATION TIERS ------------------------------------------------ */
export const donationTiers = [
  { id: "d1", amount: 500,   impact: { en: "Feeds 20 people for one evening", bn: "একটি সন্ধ্যায় ২০ জনের খাবার" } },
  { id: "d2", amount: 1000,  impact: { en: "A full school kit for two children", bn: "দুই শিশুর সম্পূর্ণ স্কুল কিট" } },
  { id: "d3", amount: 2500,  impact: { en: "Ration for a family for a month", bn: "একটি পরিবারের এক মাসের রেশন" } },
  { id: "d4", amount: 10000, impact: { en: "Sponsors an entire health camp", bn: "একটি সম্পূর্ণ স্বাস্থ্য শিবিরের খরচ" } },
];

/* --- FAQ ----------------------------------------------------------- */
export const faqs = [
  {
    id: "f1",
    q: { en: "Is my donation tax-exempt?", bn: "আমার অনুদান কি করমুক্ত?" },
    a: {
      en: "Donations are eligible for exemption under Section 80G once our certificate details are confirmed. Email us with your PAN and we will send a receipt.",
      bn: "আমাদের শংসাপত্রের তথ্য নিশ্চিত হলে অনুদান ৮০জি ধারায় ছাড়ের যোগ্য। আপনার প্যান নম্বর-সহ ইমেল করলে রসিদ পাঠিয়ে দেওয়া হবে।",
    },
  },
  {
    id: "f2",
    q: { en: "How do I know where my money went?", bn: "আমার টাকা কোথায় গেল, কীভাবে জানব?" },
    a: {
      en: "After every drive we publish photos and a cost breakdown on our Facebook page, and we send the same to donors on request.",
      bn: "প্রতিটি কর্মসূচির পরে আমরা ছবি ও খরচের হিসেব ফেসবুক পেজে প্রকাশ করি এবং চাইলে দাতাদের কাছেও পাঠাই।",
    },
  },
  {
    id: "f3",
    q: { en: "Can I donate things instead of money?", bn: "টাকার বদলে জিনিস দেওয়া যায়?" },
    a: {
      en: "Yes. Clothes, blankets, books, stationery and dry grain are always needed — message us on WhatsApp and we will arrange collection.",
      bn: "অবশ্যই। জামাকাপড়, কম্বল, বই, খাতা-কলম ও শুকনো খাদ্যশস্য সবসময়ই প্রয়োজন — হোয়াটসঅ্যাপে জানালে আমরা সংগ্রহের ব্যবস্থা করব।",
    },
  },
  {
    id: "f4",
    q: { en: "I am a student. Can I still volunteer?", bn: "আমি ছাত্র। আমি কি স্বেচ্ছাসেবক হতে পারি?" },
    a: {
      en: "Most of our volunteers are students. Weekend drives are designed so that two or three hours a week is enough.",
      bn: "আমাদের বেশিরভাগ স্বেচ্ছাসেবকই ছাত্রছাত্রী। সপ্তাহান্তের কর্মসূচি এমনভাবেই সাজানো, যাতে সপ্তাহে দু’-তিন ঘণ্টাই যথেষ্ট।",
    },
  },
  {
    id: "f5",
    q: { en: "Do you work outside Kolkata?", bn: "কলকাতার বাইরে কি কাজ হয়?" },
    a: {
      en: "Our regular programmes run in and around Kolkata, and relief drives reach other districts of West Bengal when needed.",
      bn: "নিয়মিত কর্মসূচি কলকাতা ও তার আশেপাশে চলে; প্রয়োজনে ত্রাণ কর্মসূচি পশ্চিমবঙ্গের অন্য জেলাতেও পৌঁছয়।",
    },
  },
];
