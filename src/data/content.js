/* ===================================================================
   PAGE CONTENT  —  programmes, team, FAQs
   (Gallery photos and projects live in projects.js.)
   -------------------------------------------------------------------
   Every text field has an English (en) and a Bengali (bn) version.
   All copy below is a realistic DRAFT written from your Facebook page:
   please read it through and replace it with your real details.
=================================================================== */

/* --- WHAT WE DO --------------------------------------------------
   project: optional id of a project in projects.js. The programme then
   shows that project's cover photo (instead of `image`) and links to
   its album in the Gallery.
------------------------------------------------------------------- */
export const programs = [
  {
    id: "education",
    icon: "book",
    image: "/images/work-education.svg",
    project: "2021-micro-library",
    title: { en: "Education & Learning", bn: "শিক্ষা ও পাঠ" },
    summary: {
      en: "Free coaching, books and school kits, so that no child has to leave school for want of a pen, a book or someone to help with homework.",
      bn: "বিনামূল্যে পড়ানো, বই-খাতা আর স্কুল কিট, যাতে একটা কলম, একটা বই বা পড়া দেখিয়ে দেওয়ার লোকের অভাবে কোনও শিশুর পড়া বন্ধ না হয়।",
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
    id: "festival",
    icon: "gift",
    image: "/images/work-festival.svg",
    project: "2022-sharodiya-sahosathi",
    title: { en: "Festivals for Everyone", bn: "সবার জন্য উৎসব" },
    summary: {
      en: "New clothes and a proper celebration at Durga Puja, Eid and Poila Boishakh, for children who would otherwise only watch from outside.",
      bn: "দুর্গাপুজো, ইদ ও পয়লা বৈশাখে নতুন জামা আর আনন্দের আয়োজন, সেই শিশুদের জন্য যারা নইলে শুধু বাইরে থেকেই দেখত।",
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
    id: "winter",
    icon: "blanket",
    image: "/images/work-winter.svg",
    project: "2019-netaji-jayanti-winter-drive",
    title: { en: "Winter & Relief", bn: "শীতবস্ত্র ও ত্রাণ" },
    summary: {
      en: "Blankets and warm clothes in winter, and food and supplies for families when a cyclone or flood hits.",
      bn: "শীতে কম্বল ও গরম জামাকাপড়, আর ঘূর্ণিঝড় বা বন্যা হলে পরিবারগুলির কাছে খাবার ও প্রয়োজনীয় জিনিস।",
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
];

/* --- VALUES ------------------------------------------------------- */
export const values = [
  {
    id: "dignity",
    title: { en: "Dignity first", bn: "প্রথমে সম্মান" },
    text: {
      en: "We do this for the people, not for the photos. Nobody has to say thank you to get help from us.",
      bn: "আমরা মানুষের জন্য কাজ করি, ছবির জন্য নয়। সাহায্য পেতে কাউকে ধন্যবাদ বলতে হয় না।",
    },
  },
  {
    id: "transparency",
    title: { en: "Every rupee accounted for", bn: "প্রতিটি টাকার হিসেব" },
    text: {
      en: "Donations go into a separate account. After each drive we post the photos and what every item cost.",
      bn: "অনুদান আলাদা অ্যাকাউন্টে জমা হয়। প্রতিটি কর্মসূচির পরে আমরা ছবি আর প্রতিটি জিনিসের খরচ প্রকাশ করি।",
    },
  },
  {
    id: "local",
    title: { en: "Rooted in the neighbourhood", bn: "পাড়ার ভিতর থেকেই" },
    text: {
      en: "Our volunteers live in the areas we work in. They know the families, so help gets to the right door quickly.",
      bn: "আমাদের স্বেচ্ছাসেবকরা সেই এলাকাতেই থাকেন যেখানে কাজ হয়। পরিবারগুলিকে তাঁরা চেনেন, তাই সাহায্য তাড়াতাড়ি ঠিক দরজায় পৌঁছয়।",
    },
  },
  {
    id: "consistency",
    title: { en: "Present, not occasional", bn: "নিয়মিত, শুধু উৎসবে নয়" },
    text: {
      en: "We're around every week, not only at festival time or after a disaster.",
      bn: "আমরা প্রতি সপ্তাহেই আছি, শুধু উৎসবের সময় বা দুর্যোগের পরে নয়।",
    },
  },
];

/* --- TEAM --------------------------------------------------------- */
/* Governing body. To add a photo, put it in public/images/team/ and set
   photo: "/images/team/name.jpg" */
export const team = [
  { id: "t1", photo: "/images/team/swaraj-das.jpg", name: { en: "Swaraj Das", bn: "স্বরাজ দাস" }, role: { en: "President", bn: "সভাপতি" } },
  { id: "t2", photo: "/images/team/joy-roy.jpg", name: { en: "Joy Roy", bn: "জয় রায়" }, role: { en: "Vice President", bn: "সহ-সভাপতি" } },
  { id: "t3", photo: "/images/team/rahul-saha.jpg", name: { en: "Rahul Saha", bn: "রাহুল সাহা" }, role: { en: "Secretary", bn: "সম্পাদক" } },
  { id: "t4", photo: "/images/team/shankha-shubhra-das.jpg", name: { en: "Shankha Shubhra Das", bn: "শঙ্খশুভ্র দাস" }, role: { en: "Spokesperson", bn: "মুখপাত্র" } },
  { id: "t5", photo: "/images/team/anik-misra.jpg", name: { en: "Anik Misra", bn: "অনীক মিশ্র" }, role: { en: "Treasurer", bn: "কোষাধ্যক্ষ" } },
  { id: "t6", photo: "/images/team/suvam-mitra.jpg", name: { en: "Suvam Mitra", bn: "শুভম মিত্র" }, role: { en: "Assistant Treasurer", bn: "সহকারী কোষাধ্যক্ষ" } },
  { id: "t7", photo: "/images/team/subhabrata-sengupta.jpg", name: { en: "Subhabrata Sengupta", bn: "শুভব্রত সেনগুপ্ত" }, role: { en: "Governing Body Member", bn: "পরিচালন সমিতির সদস্য" } },
  { id: "t8", photo: "/images/team/tuhina-seth.jpg", name: { en: "Tuhina Seth", bn: "তুহিনা শেঠ" }, role: { en: "Governing Body Member", bn: "পরিচালন সমিতির সদস্য" } },
  { id: "t9", photo: "/images/team/nilajit-sarkar.jpg", name: { en: "Nilajit Sarkar", bn: "নীলাজিৎ সরকার" }, role: { en: "Governing Body Member", bn: "পরিচালন সমিতির সদস্য" } },
  { id: "t10", photo: "/images/team/arindam-sarkar.jpg", name: { en: "Arindam Sarkar", bn: "অরিন্দম সরকার" }, role: { en: "Governing Body Member", bn: "পরিচালন সমিতির সদস্য" } },
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
      en: "I came along to one Sunday drive out of curiosity. Two years later I'm still here. Honestly, it has changed me more than it has changed them.",
      bn: "কৌতূহল থেকে একটা রবিবার এসেছিলাম। দু’বছর পরেও আছি। সত্যি বলতে, ওদের চেয়ে আমাকেই বেশি বদলে দিয়েছে।",
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
    text: { en: "Come to our weekend drives to pack, hand things out and talk to families.", bn: "সপ্তাহান্তের কর্মসূচিতে আসুন। প্যাকিং, বিতরণ আর পরিবারগুলির সঙ্গে কথা বলায় হাত লাগান।" },
  },
  {
    id: "teach",
    title: { en: "Teach a class", bn: "ক্লাস নিন" },
    text: { en: "Give two hours a week to the evening learning circles.", bn: "সপ্তাহে দু’ঘণ্টা সান্ধ্য পাঠচক্রে সময় দিন।" },
  },
  {
    id: "skills",
    title: { en: "Lend a skill", bn: "দক্ষতা দিয়ে সাহায্য" },
    text: { en: "Good at photography, design, accounts, social media or translation? We can use it.", bn: "ফোটোগ্রাফি, ডিজাইন, হিসাবরক্ষণ, সোশ্যাল মিডিয়া বা অনুবাদ জানেন? আমাদের কাজে লাগবে।" },
  },
  {
    id: "goods",
    title: { en: "Donate goods", bn: "সামগ্রী দিন" },
    text: { en: "Clothes, books, blankets or grain, as long as they are clean and still usable.", bn: "জামাকাপড়, বই, কম্বল বা খাদ্যশস্য, পরিষ্কার আর ব্যবহারযোগ্য হলেই চলবে।" },
  },
  {
    id: "csr",
    title: { en: "Partner with us", bn: "আমাদের সঙ্গী হন" },
    text: { en: "Companies, colleges and puja committees can take on a whole drive with us.", bn: "সংস্থা, কলেজ বা পুজো কমিটি আমাদের সঙ্গে একটি গোটা কর্মসূচির দায়িত্ব নিতে পারে।" },
  },
  {
    id: "spread",
    title: { en: "Spread the word", bn: "কথা ছড়িয়ে দিন" },
    text: { en: "Share our posts. Most of our volunteers came through a friend.", bn: "আমাদের পোস্ট শেয়ার করুন। বেশিরভাগ স্বেচ্ছাসেবক বন্ধুর মাধ্যমেই এসেছেন।" },
  },
];

/* --- REQUEST HELP ------------------------------------------------- */
/* The drives people can ask for help from on the Request Help page, and
   the kinds of help each one offers. Need ids must be unique across all
   drives. The email the form sends always uses the English labels. */
export const helpPrograms = [
  {
    id: "education",
    icon: "book",
    title: { en: "Education support", bn: "পড়াশোনায় সাহায্য" },
    text: {
      en: "School kits, coaching and help with fees, so your child can stay in school.",
      bn: "স্কুলের সরঞ্জাম, পড়ানো আর ফি-র সাহায্য, যাতে আপনার সন্তানের পড়া বন্ধ না হয়।",
    },
    needs: [
      { id: "edu-kit", label: { en: "School bag, books & stationery", bn: "স্কুলব্যাগ, বই ও খাতা-কলম" } },
      { id: "edu-uniform", label: { en: "Uniform & shoes", bn: "স্কুলের পোশাক ও জুতো" } },
      { id: "edu-coaching", label: { en: "Evening coaching / tuition", bn: "সন্ধ্যার পড়া / টিউশন" } },
      { id: "edu-fees", label: { en: "Exam or admission fees", bn: "পরীক্ষা বা ভর্তির ফি" } },
    ],
  },
  {
    id: "puja",
    icon: "gift",
    title: { en: "Durga Puja drive", bn: "দুর্গাপুজোর কর্মসূচি" },
    text: {
      en: "New clothes and a festive meal, so nobody in the family sits out the Pujas.",
      bn: "নতুন জামা আর উৎসবের খাবার, যাতে পরিবারের কেউ পুজোয় বাদ না পড়ে।",
    },
    needs: [
      { id: "puja-kids", label: { en: "New clothes for children", bn: "শিশুদের নতুন জামাকাপড়" } },
      { id: "puja-adults", label: { en: "New clothes for adults", bn: "বড়দের নতুন জামাকাপড়" } },
      { id: "puja-saree", label: { en: "Sarees", bn: "শাড়ি" } },
      { id: "puja-meal", label: { en: "Festive meal / sweets", bn: "উৎসবের খাবার / মিষ্টি" } },
    ],
  },
  {
    id: "winter",
    icon: "blanket",
    title: { en: "Winter drive", bn: "শীতবস্ত্র কর্মসূচি" },
    text: {
      en: "Blankets and warm clothes through December and January.",
      bn: "ডিসেম্বর ও জানুয়ারি জুড়ে কম্বল ও গরম জামাকাপড়।",
    },
    needs: [
      { id: "winter-blanket", label: { en: "Blankets", bn: "কম্বল" } },
      { id: "winter-adults", label: { en: "Warm clothes for adults", bn: "বড়দের গরম জামাকাপড়" } },
      { id: "winter-kids", label: { en: "Warm clothes for children", bn: "শিশুদের গরম জামাকাপড়" } },
      { id: "winter-woollens", label: { en: "Caps, socks & mufflers", bn: "টুপি, মোজা ও মাফলার" } },
    ],
  },
  {
    id: "other",
    icon: "hands",
    title: { en: "Something else", bn: "অন্য কোনও সাহায্য" },
    text: {
      en: "Food, medicine, relief or anything else. Tell us about it below.",
      bn: "খাবার, ওষুধ, ত্রাণ বা অন্য কিছু। নিচে লিখে জানান।",
    },
    needs: [],
  },
];

/* --- DONATION TIERS ------------------------------------------------ */
export const donationTiers = [
  { id: "d1", amount: 500,   impact: { en: "Feeds 20 people for one evening", bn: "একটি সন্ধ্যায় ২০ জনের খাবার" } },
  { id: "d2", amount: 1000,  impact: { en: "A full school kit for two children", bn: "দুই শিশুর সম্পূর্ণ স্কুল কিট" } },
  { id: "d3", amount: 2500,  impact: { en: "Ration for a family for a month", bn: "একটি পরিবারের এক মাসের রেশন" } },
  { id: "d4", amount: 10000, impact: { en: "Full school kits for twenty children", bn: "কুড়ি জন শিশুর সম্পূর্ণ স্কুল কিট" } },
];

/* --- FAQ ----------------------------------------------------------- */
export const faqs = [
  {
    id: "f1",
    q: { en: "Is my donation tax-exempt?", bn: "আমার অনুদান কি করমুক্ত?" },
    a: {
      en: "Not yet. Our 80G registration is still being processed, so donations aren't tax-exempt for now. We'll update this page once it's approved. If you need a receipt for your donation, email us and we'll send one.",
      bn: "এখনও নয়। আমাদের ৮০জি নথিভুক্তি এখনও প্রক্রিয়াধীন, তাই আপাতত অনুদান করমুক্ত নয়। অনুমোদন পেলে এই পাতায় জানিয়ে দেব। যেকোনো সময় ইমেল করলে আপনার অনুদানের রসিদ পাঠিয়ে দেওয়া হবে।",
    },
  },
  {
    id: "f2",
    q: { en: "How do I know where my money went?", bn: "আমার টাকা কোথায় গেল, কীভাবে জানব?" },
    a: {
      en: "After every drive we post the photos and a list of what we spent on our Facebook page. If you'd like a copy sent to you directly, just ask.",
      bn: "প্রতিটি কর্মসূচির পরে আমরা ছবি ও খরচের হিসেব ফেসবুক পেজে প্রকাশ করি এবং চাইলে দাতাদের কাছেও পাঠাই।",
    },
  },
  {
    id: "f3",
    q: { en: "Can I donate things instead of money?", bn: "টাকার বদলে জিনিস দেওয়া যায়?" },
    a: {
      en: "Yes. We always need clothes, blankets, books, stationery and dry grain. Message us on WhatsApp and we'll arrange to collect them.",
      bn: "অবশ্যই। জামাকাপড়, কম্বল, বই, খাতা-কলম ও শুকনো খাদ্যশস্য সবসময়ই দরকার। হোয়াটসঅ্যাপে জানালে আমরা নিয়ে আসার ব্যবস্থা করব।",
    },
  },
  {
    id: "f4",
    q: { en: "I am a student. Can I still volunteer?", bn: "আমি ছাত্র। আমি কি স্বেচ্ছাসেবক হতে পারি?" },
    a: {
      en: "Yes. Most of our volunteers are students. Weekend drives take two or three hours, so you can fit them around your classes.",
      bn: "হ্যাঁ। আমাদের বেশিরভাগ স্বেচ্ছাসেবকই ছাত্রছাত্রী। সপ্তাহান্তের কর্মসূচিতে দু’-তিন ঘণ্টা লাগে, তাই পড়াশোনার ফাঁকেই আসা যায়।",
    },
  },
  {
    id: "f5",
    q: { en: "Do you work outside Kolkata?", bn: "কলকাতার বাইরে কি কাজ হয়?" },
    a: {
      en: "Our regular programmes run in and around Kolkata. When there's a cyclone or flood, our relief drives go to other districts of West Bengal too.",
      bn: "নিয়মিত কর্মসূচি কলকাতা ও তার আশেপাশে চলে। ঘূর্ণিঝড় বা বন্যা হলে আমাদের ত্রাণ পশ্চিমবঙ্গের অন্য জেলাতেও যায়।",
    },
  },
];
