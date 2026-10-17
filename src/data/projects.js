/* ===================================================================
   PROJECTS  —  the photo albums on the Gallery page
   -------------------------------------------------------------------
   HOW TO ADD A PROJECT
   1. Copy in the FOUR photos you want (they are renamed 01.jpg … 04.jpg
      and duplicates are skipped):
        npm run add-photos -- "C:\path\to\photo folder" 2025-puja-drive
      Or put them in  public/images/projects/2025-puja-drive/  yourself.
   2. Add a block to `projects` below, with the same id as the folder.
   3. Save. The four photos appear, in file-name order.

   FOUR PHOTOS PER PROJECT
   Every album holds four photos — the same size everywhere, and the
   gallery stays quick to load. A fifth photo in the folder is simply not
   shown, and `npm test` says which project has too many.

   HOW TO SWAP A PHOTO IN AN EXISTING PROJECT
   Delete the photo you don't want from its folder and its caption below,
   then run the same command with that project's id, or drop the new file
   into the folder yourself.

   FIELDS
   • id        folder name in public/images/projects/  (year first keeps
               the folders in order: "2025-puja-drive")
   • year      shown on the album and used to sort (newest first)
   • category  one of: education, festival, winter
               (drives the Gallery filter buttons)
   • cover     the photo used on the Home page and Our Work page;
               defaults to the first photo
   • captions  optional, per photo: { "03.jpg": { en, bn } }.
               A photo without one is captioned with the project title.
   • active    set false to hide a project without deleting it
=================================================================== */

export const projects = [
  {
    id: "2022-sharodiya-sahosathi",
    year: 2022,
    category: "festival",
    cover: "03.jpg",
    title: { en: "Sharodiya Sahosathi", bn: "শারদীয়া সহসাথী" },
    summary: {
      en: "Before Durga Puja, our volunteers spent an evening with a group of children and handed each of them new shoes, stationery and books, so that they too had something new for the festival.",
      bn: "দুর্গাপুজোর আগে আমাদের স্বেচ্ছাসেবকরা একদল শিশুর সঙ্গে একটা সন্ধ্যা কাটান এবং প্রত্যেকের হাতে নতুন জুতো, খাতা-পেন ও বই তুলে দেন, যাতে উৎসবে তাদের কাছেও কিছু নতুন থাকে।",
    },
    captions: {
      "01.jpg": { en: "Volunteers with the children after the gifts were handed out", bn: "উপহার বিতরণের পর শিশুদের সঙ্গে স্বেচ্ছাসেবকরা" },
      "02.jpg": { en: "Opening the new stationery kits", bn: "নতুন খাতা-পেনের কিট খোলা হচ্ছে" },
      "03.jpg": { en: "A Puja gift of new shoes and books", bn: "পুজোর উপহার — নতুন জুতো ও বই" },
      "04.jpg": { en: "Everyone together, gifts in hand", bn: "উপহার হাতে সবাই একসঙ্গে" },
    },
  },
  {
    id: "2021-micro-library",
    year: 2021,
    category: "education",
    cover: "01.jpg",
    title: { en: "Micro Library", bn: "মাইক্রো লাইব্রেরি" },
    summary: {
      en: "We collected Bengali storybooks, classics and school guidebooks and set up a small lending library at a women and children's development centre in Santoshpur, Kolkata — opened with the children who now use it.",
      bn: "বাংলা গল্পের বই, ক্লাসিক ও স্কুলের সহায়িকা সংগ্রহ করে কলকাতার সন্তোষপুরে একটি নারী ও শিশু উন্নয়ন কেন্দ্রে ছোট একটি গ্রন্থাগার গড়ে তোলা হয় — উদ্বোধন হয় সেই শিশুদের সঙ্গেই, যারা আজ এটি ব্যবহার করে।",
    },
    captions: {
      "01.jpg": { en: "Children with their new library", bn: "নতুন গ্রন্থাগার নিয়ে শিশুরা" },
      "02.jpg": { en: "The Micro Library shelf", bn: "মাইক্রো লাইব্রেরির বইয়ের তাক" },
      "03.jpg": { en: "Families, volunteers and children on opening day", bn: "উদ্বোধনের দিনে পরিবার, স্বেচ্ছাসেবক ও শিশুরা" },
      "04.jpg": { en: "Donated books collected for the library", bn: "গ্রন্থাগারের জন্য সংগ্রহ করা দানের বই" },
    },
  },
  {
    id: "2020-cyclone-relief",
    year: 2020,
    category: "winter",
    cover: "03.jpg",
    title: { en: "Amphan Relief at Gosaba", bn: "গোসাবায় আমফান ত্রাণ" },
    summary: {
      en: "When Cyclone Amphan flooded the Sundarbans, volunteers packed food and essentials in Kolkata, then carried them by boat to island villages cut off by the water and handed them out family by family.",
      bn: "ঘূর্ণিঝড় আমফানে সুন্দরবন প্লাবিত হলে স্বেচ্ছাসেবকরা কলকাতায় খাবার ও প্রয়োজনীয় সামগ্রী প্যাক করে নৌকায় জলবন্দি দ্বীপের গ্রামগুলিতে পৌঁছে দেন এবং পরিবার ধরে ধরে বিতরণ করেন।",
    },
    captions: {
      "01.jpg": { en: "Relief handed out on the river embankment", bn: "নদীবাঁধের উপর ত্রাণ বিতরণ" },
      "02.jpg": { en: "Packing rice, biscuits and essentials for the trip", bn: "যাত্রার জন্য চাল, বিস্কুট ও প্রয়োজনীয় সামগ্রী প্যাকিং" },
      "03.jpg": { en: "Relief boats at the riverbank", bn: "নদীর পাড়ে ত্রাণের নৌকা" },
      "04.jpg": { en: "Families gathered on the embankment", bn: "বাঁধের উপর জড়ো হওয়া পরিবারগুলি" },
    },
  },
  {
    id: "2019-netaji-jayanti-winter-drive",
    year: 2019,
    category: "winter",
    cover: "01.jpg",
    title: { en: "Netaji's birthday winter drive", bn: "নেতাজির জন্মদিনে শীতবস্ত্র বিতরণ" },
    summary: {
      en: "On Netaji Subhas Chandra Bose's birthday our volunteers set up in a lane in Sovabazar, north Kolkata, and handed blankets and clothes to the families living there, one by one.",
      bn: "নেতাজি সুভাষচন্দ্র বসুর জন্মদিনে আমাদের স্বেচ্ছাসেবকরা উত্তর কলকাতার শোভাবাজারের একটি গলিতে শিবির করে সেখানকার পরিবারগুলির হাতে একে একে কম্বল ও জামাকাপড় তুলে দেন।",
    },
    captions: {
      "01.jpg": { en: "A blanket handed over in the lane at Sovabazar", bn: "শোভাবাজারের গলিতে কম্বল তুলে দেওয়া হচ্ছে" },
      "02.jpg": { en: "Trying on a new dress from the drive", bn: "বিতরণে পাওয়া নতুন জামা পরে দেখা" },
      "03.jpg": { en: "The volunteer team with a portrait of Netaji", bn: "নেতাজির প্রতিকৃতির সঙ্গে স্বেচ্ছাসেবক দল" },
      "04.jpg": { en: "Our banner over the lane on the day of the drive", bn: "বিতরণের দিনে গলির উপর আমাদের ব্যানার" },
    },
  },
];

/* --- helpers (used by the site and the tests) ----------------------- */

export const projectPhotoSrc = (id, file) => `/images/projects/${id}/${file}`;

/* Joins the projects above with the photos found in their folders.
   photoMap: { [id]: ["01.jpg", …] } — or, on the site, entries like
   { file, width, height, blur, srcset } with the WebP copies (see
   scripts/project-photos.mjs). Hidden projects and projects with no
   photos yet are left out. Newest year first. */
export function buildGallery(list, photoMap) {
  return list
    .filter((p) => p.active !== false && photoMap[p.id]?.length)
    .map((p) => {
      const entries = photoMap[p.id].map((e) => (typeof e === "string" ? { file: e } : e));
      const photos = entries.map(({ file, ...image }) => ({
        ...image,
        id: `${p.id}/${file}`,
        file,
        src: projectPhotoSrc(p.id, file),
        caption: p.captions?.[file] ?? p.title,
      }));
      const cover = photos.find((ph) => ph.file === p.cover) ?? photos[0];
      return { ...p, photos, cover, coverSrc: cover.src };
    })
    .sort((a, b) => b.year - a.year);
}
