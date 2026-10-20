# NGO Marudyaan: Codebase Guide

How the website is built, where everything lives, and how to change it.

- **Just want to change content?** Jump to [§4 Common changes](#4-common-changes-step-by-step).
- **Prefer pictures?** Open [codebase-guide.html](codebase-guide.html) in a browser: the same guide as a visual page with diagrams and copy-paste recipes.
- The [README](../README.md) covers day-to-day content editing in short form.

---

## Contents

1. [The project in one minute](#1-the-project-in-one-minute)
2. [Folder map](#2-folder-map)
3. [How the pieces connect](#3-how-the-pieces-connect)
4. [Common changes, step by step](#4-common-changes-step-by-step)
5. [Content files: `src/data/`](#5-content-files-srcdata)
6. [Translations: `src/i18n/`](#6-translations-srci18n)
7. [Code reference](#7-code-reference)
8. [How the forms work](#8-how-the-forms-work)
9. [Styling](#9-styling)
10. [Hosting, build and branches](#10-hosting-build-and-branches)
11. [Tests and scripts](#11-tests-and-scripts)
12. [House rules](#12-house-rules)

---

## 1. The project in one minute

A static website for **NGO Marudyaan (মরুদ্যান)**, a volunteer-run organisation in Kolkata.

- **8 pages + a 404:** Home, About (includes the programmes), Past Works, Gallery, Get Involved, Request Help, Donate, Contact.
- **English ⇄ Bengali** toggle covering every label and every piece of content.
- **Light / dark mode.**
- **3 forms** (Contact, Get Involved, Request Help) that send to the NGO's inbox via [Web3Forms](https://web3forms.com), or open the visitor's email app.
- **Donate page** with a UPI QR code, copyable bank details and one-tap UPI links on phones.

There is **no back end and no database**. `npm run build` produces static files in `dist/`, which Netlify publishes.

| Tool | Used for |
| --- | --- |
| React 19 + react-router-dom 7 | UI and page routing |
| Vite 8 | Dev server and build |
| Tailwind CSS v4 | Styling (configured in `src/index.css`, no config file) |
| Web3Forms | Delivering form submissions by email |
| playwright-core | End-to-end tests in your installed Chrome/Edge |
| oxlint | Linting |
| Netlify | Hosting (a `vercel.json` is also included) |

### Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (first time only) |
| `npm run dev` | Dev server at <http://localhost:5173>, reloads on save |
| `npm run build` | Build the site into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Lint the code |
| `npm test` | Build, then run every test suite |
| `npm run test:quick` | Fewer screen sizes, English only |
| `npm run test:live` | Run the tests against the live site |
| `npm run add-photos -- "<folder>" <project-id>` | Copy photos into a gallery album |
| `npm run og-image` | Regenerate the social-sharing preview image |

---

## 2. Folder map

```
ngo-marudyaan/
├── index.html              HTML shell: meta tags, theme script, #root
├── package.json            dependencies + npm scripts
├── vite.config.js          Vite plugins
├── vercel.json             hosting config for Vercel
├── public/                 copied as-is into dist/
│   ├── _redirects          Netlify routing (list of real pages)
│   ├── _headers            security + caching headers
│   ├── sitemap.xml         list of real pages for search engines
│   └── images/
│       ├── team/           team photos
│       └── projects/<id>/  gallery photos, one folder per album
├── scripts/                photo tools, OG image, build checks
├── src/
│   ├── data/               ★ ALL EDITABLE CONTENT
│   ├── i18n/strings.js     ★ ALL BUTTON / HEADING LABELS (en + bn)
│   ├── pages/              one file per page
│   ├── components/         shared building blocks
│   ├── hooks/              reusable React logic
│   ├── utils/              form sending, validation
│   ├── App.jsx             layout + list of pages (routes)
│   ├── main.jsx            entry point
│   └── index.css           colours, fonts, animations
└── tests/e2e/              browser test suites
```

> **Rule of thumb:** content lives in `src/data/` and `src/i18n/strings.js`. Pages and components only *read* it. For almost every change, you edit only those files.

---

## 3. How the pieces connect

```
index.html ──► src/main.jsx ──► <ErrorBoundary>
                                  <BrowserRouter>
                                    <LanguageProvider>   ← gives t() and tr() to everyone
                                      <App />            ← Navbar + page + Footer
```

`App.jsx` picks the page from the URL:

| URL | Page file |
| --- | --- |
| `/` | `src/pages/Home.jsx` |
| `/about` | `src/pages/About.jsx` |
| `/past-works` | `src/pages/PastWorks.jsx` |
| `/gallery` | `src/pages/Gallery.jsx` |
| `/get-involved` | `src/pages/GetInvolved.jsx` |
| `/request-help` | `src/pages/RequestHelp.jsx` |
| `/donate` | `src/pages/Donate.jsx` |
| `/contact` | `src/pages/Contact.jsx` |
| anything else | `src/pages/NotFound.jsx` |

**Which data feeds which page:**

| Data file → export | Shown on |
| --- | --- |
| `banner.js` → `bannerSlides`, `announcement` | Home carousel; strip above the header |
| `site.js` → `site` | Navbar, Footer, Contact, Donate, About (legal table) |
| `site.js` → `stats` | Home impact counters |
| `content.js` → `programs` | Home cards, About programme sections |
| `content.js` → `values` | Home, About |
| `content.js` → `team` | About |
| `content.js` → `testimonials` | Home |
| `content.js` → `volunteerRoles`, `faqs` | Get Involved |
| `content.js` → `helpPrograms` | Request Help |
| `content.js` → `donationTiers` | Donate |
| `projects.js` + `public/images/projects/` | Gallery, Home preview, programme/past-work photos |
| `pastWorks.js` → `pastWorks` | Past Works (all), About (latest three) |
| `i18n/strings.js` | Every label on every page |

---

## 4. Common changes, step by step

Every text field is bilingual: `{ en: "English", bn: "বাংলা" }`. Always fill in both.
After any change: run `npm run dev` and check the page, then `npm test` before publishing.

### Add a gallery project (photo album)

1. Copy up to **five** photos in. They're renamed `01.jpg`…`05.jpg`, and duplicates are skipped:
   ```bash
   npm run add-photos -- "C:\Users\me\Downloads\Puja 2025" 2025-puja-drive
   ```
   (Or create `public/images/projects/2025-puja-drive/` and drop the files in yourself.)
2. Add a block at the top of `projects` in [src/data/projects.js](../src/data/projects.js). The `id` must match the folder name:
   ```js
   {
     id: "2025-puja-drive",
     year: 2025,
     category: "festival",          // education | festival | winter
     cover: "03.jpg",               // optional, defaults to the first photo
     title: { en: "Puja Drive", bn: "পুজোর উদ্যোগ" },
     summary: { en: "…", bn: "…" },
     captions: {                    // optional, per photo
       "01.jpg": { en: "…", bn: "…" },
     },
   },
   ```
3. Optional: link the album from a past work (`project: "2025-puja-drive"` in `pastWorks.js`) or a programme (`project:` in `programs` in `content.js`).

Set `active: false` to hide a project. A sixth photo in a folder is ignored, and `npm test` reports it.

### Add a past work

Add a block to `pastWorks` in [src/data/pastWorks.js](../src/data/pastWorks.js). Order doesn't matter; the site sorts by date.

```js
{
  id: "puja-drive-2025",                // used in links: /past-works#puja-drive-2025
  date: "2025-10-05",                   // or just "2025"
  place: { en: "Belgharia, Kolkata", bn: "বেলঘরিয়া, কলকাতা" },   // optional
  category: "festival",                 // education | festival | winter
  project: "2025-puja-drive",           // optional gallery album id
  title: { en: "…", bn: "…" },
  summary: { en: "…", bn: "…" },
  highlights: [                         // optional dated points
    { date: "2025-10-05", en: "…", bn: "…" },
  ],
},
```

### Add a team member

1. Save a square photo as `public/images/team/firstname-lastname.jpg`.
2. Add a line to `team` in [src/data/content.js](../src/data/content.js), with a new unique `id`:
   ```js
   { id: "t11", photo: "/images/team/firstname-lastname.jpg", name: { en: "First Last", bn: "…" }, role: { en: "Member", bn: "সদস্য" } },
   ```
   Leave `photo: ""` to show the person's initials instead. The order in the list is the order on the About page.

### Change the home banner

Edit `bannerSlides` in [src/data/banner.js](../src/data/banner.js): set `image` (a file in `public/images/`, or any gallery photo like `/images/projects/<id>/01.jpg`) and rewrite `kicker`, `title`, `subtitle`. Copy a whole `{ … }` block to add a slide. `active: false` hides a slide. `bannerSettings` controls auto-play and speed.

### Show or hide the strip above the header

`announcement` in [src/data/banner.js](../src/data/banner.js): `active: true/false`, plus `badge`, `text`, `linkLabel` and `to`.

### Add a new page

Five places, or the tests fail:

1. **Create** `src/pages/MyPage.jsx`:
   ```jsx
   import PageHeader from "../components/PageHeader";
   import { site } from "../data/site";
   import { useLang } from "../i18n/LanguageContext";
   import usePageMeta from "../hooks/usePageMeta";

   export default function MyPage() {
     const { t } = useLang();
     usePageMeta(`${t("mypage.title")} — ${site.name}`, "English description for search engines.");
     return (
       <>
         <PageHeader title={t("mypage.title")} sub={t("mypage.sub")} />
         <section className="container-page py-16">…</section>
       </>
     );
   }
   ```
2. **Route:** in [src/App.jsx](../src/App.jsx), import it and add `<Route path="/my-page" element={<MyPage />} />` above the `*` route.
3. **Netlify:** add `/my-page   /index.html   200` to [public/_redirects](../public/_redirects), above the `/*` line.
4. **Sitemap:** add `<url><loc>https://marudyaan.com/my-page</loc></url>` to [public/sitemap.xml](../public/sitemap.xml).
5. **Labels:** add `"nav.mypage"`, `"mypage.title"`, `"mypage.sub"` to **both** `en` and `bn` in [src/i18n/strings.js](../src/i18n/strings.js).

Then, to put it in the menus: add `{ to: "/my-page", key: "nav.mypage" }` to `links` in [Navbar.jsx](../src/components/Navbar.jsx) and to `quickLinks` in [Footer.jsx](../src/components/Footer.jsx).

### Everything else

| I want to… | Edit |
| --- | --- |
| Change phone, email, address, map | `site.contact` in [site.js](../src/data/site.js) |
| Change social links (empty `""` hides one) | `site.social` in [site.js](../src/data/site.js) |
| Change UPI ID, bank details, QR | `site.donation` in [site.js](../src/data/site.js) + `public/images/donate-qr.png` |
| Change registration / PAN / 80G | `site.registration` in [site.js](../src/data/site.js) |
| Turn direct form sending on/off | `site.forms.keys` in [site.js](../src/data/site.js) (`""` = open email app) |
| Change impact numbers | `stats` in [site.js](../src/data/site.js) (label: `stat.<id>` in strings.js) |
| Edit a programme | `programs` in [content.js](../src/data/content.js) |
| Edit values, testimonials, volunteer roles, FAQs, donation tiers | the matching export in [content.js](../src/data/content.js) |
| Add a Request Help drive or need | `helpPrograms` in [content.js](../src/data/content.js) (need ids unique across all drives) |
| Change a button label or heading | [strings.js](../src/i18n/strings.js), both `en` and `bn` |
| Add an icon | the `paths` object in [Icon.jsx](../src/components/Icon.jsx) |
| Change brand colours or fonts | `--c-*` variables and `@theme` in [index.css](../src/index.css); fonts are imported in [main.jsx](../src/main.jsx) |
| Change the NGO's name or tagline | `site.name`, `site.tagline` (+ `Bn`) in [site.js](../src/data/site.js), then `npm run og-image` |
| Put a picture on a page | use the [Photo](../src/components/Photo.jsx) component, not `<img>` |

---

## 5. Content files: `src/data/`

Plain JavaScript objects and arrays, no logic. Most text fields are `{ en, bn }`.

### [site.js](../src/data/site.js)

| Key | Contents |
| --- | --- |
| `name`, `nameBn`, `tagline`, `taglineBn`, `url` | NGO name, tagline, site address (no trailing slash) |
| `registration` | `regNo`, `regAct`, `regDate`, `pan`, `eightyG` (empty hides it), `founded` |
| `contact` | `email`, `phone` (display) / `phoneHref` (digits for `tel:`), `whatsapp` / `whatsappHref`, `addressLines[]`, `serviceArea`, `hours`, `mapEmbed` |
| `social` | `facebook`, `instagram`, `youtube`, `twitter`; empty strings are hidden |
| `donation` | `qrImage`, `upiId`, `upiName`, `upiButtons` (one-tap UPI on phones; only with a real `upiId`), `bank{…}`, `taxNote` |
| `forms.keys` | Web3Forms keys for `contact`, `involved`, `help`. Public by design: they can only send to the NGO. |

`stats` is a separate export: `[{ id, value, suffix }]`.

### [banner.js](../src/data/banner.js)

- `bannerSettings`: `{ autoPlay, intervalMs }`
- `bannerSlides`: `[{ id, active, image, align: "left"|"center", kicker, title, subtitle, primaryCta?, secondaryCta? }]`. A CTA is `{ label: {en,bn}, to: "/route" }`.
- `announcement`: `{ active, badge, text, linkLabel, to }`. Empty `badge` or `linkLabel` drops that part.

### [content.js](../src/data/content.js)

| Export | Fields |
| --- | --- |
| `programs` | `id` (`education`, `festival`, `winter`), `icon`, `image`, `project?`, `title`, `summary`, `details: { en: [...], bn: [...] }`. With `project`, it uses that album's cover photo and links to it. |
| `values` | `id`, `title`, `text` |
| `team` | `id`, `photo` (`""` shows initials), `name`, `role` |
| `testimonials` | `id`, `quote`, `author` |
| `volunteerRoles` | `id`, `title`, `text` |
| `helpPrograms` | `id`, `icon`, `title`, `text`, `needs: [{ id, label }]` (`other` has none) |
| `donationTiers` | `id`, `amount`, `impact` |
| `faqs` | `id`, `q`, `a` |

`icon` must be a name from [Icon.jsx](../src/components/Icon.jsx): `bowl book heart blanket gift hands phone mail pin clock globe whatsapp facebook instagram youtube arrowRight arrowUp check copy close menu chevronLeft chevronRight chevronDown pause play quote sprout shield users`.

### [projects.js](../src/data/projects.js), [gallery.js](../src/data/gallery.js), [pastWorks.js](../src/data/pastWorks.js)

- `projects`: `{ id, year, category, cover?, title, summary?, captions?, active? }`. Photos aren't listed: they're the files in `public/images/projects/<id>/`, in name order, max 5.
- `buildGallery(list, photoMap)` joins projects with their photos, drops hidden or empty ones, and sorts newest first.
- `gallery.js` wires it up for the browser (`galleryProjects`, `galleryPhotos`, `findProject`, `programImage`). **Don't edit it**; edit `projects.js`.
- `pastWorks`: `{ id, date, place?, category, title, summary, highlights?, project? }`, plus helpers `sortedPastWorks`, `formatWorkDate`, `workYear`.

---

## 6. Translations: `src/i18n/`

| Kind of text | Where it lives | How code reads it |
| --- | --- | --- |
| UI labels (buttons, headings, errors) | [strings.js](../src/i18n/strings.js) as flat keys, e.g. `"nav.home"` | `t("nav.home")` |
| Content (programmes, FAQs, banner…) | `src/data/` as `{ en, bn }` | `tr(item.title)` |

Key prefixes in `strings.js`: `nav.*`, `cta.*`, `lang.*`, `carousel.*`, one per page (`home.*`, `about.*`, `work.*`, `gallery.*`, `involved.*`, `help.*`, `donate.*`, `contact.*`, `nf.*`), `form.*`, `cat.*` (gallery categories), `stat.*`, `footer.*`, `misc.*`.

[LanguageContext.jsx](../src/i18n/LanguageContext.jsx) provides `useLang()` → `{ lang, setLang, toggle, t, tr }`.

- The starting language is the saved choice (`localStorage` key `marudyaan-lang`), else Bengali if the browser is Bengali, else English.
- `t()` falls back to English, then to the key itself, so nothing ever shows blank.
- `tr()` returns `field[lang]`, falling back to `field.en`. It works on arrays too.
- Switching language sets `<html lang>`, which also turns on the taller Bengali line height.

---

## 7. Code reference

### Hooks: `src/hooks/`

| Hook | What it does |
| --- | --- |
| `usePageMeta(title, description, { noindex })` | Sets the page title, meta description, canonical and OG tags. Every page calls it. |
| `useFormSender(form)` | Sends one form. Returns `{ direct, status, message, send, reset }`. See [§8](#8-how-the-forms-work). |
| `useFocusTrap(active, ref, opts)` | Keeps keyboard focus inside the mobile menu or lightbox, then returns it to where it was. |
| `useTheme()` | `{ theme, toggle }` for light/dark. It follows the device until the visitor chooses (`localStorage` key `marudyaan-theme`). |
| `useActiveSection` | Tracks which section is on screen (for sticky jump chips). |

### Utilities: `src/utils/`

- **[sendForm.js](../src/utils/sendForm.js)**: `web3formsKey`, `sendsDirect`, `mailtoHref`, `whatsappHref`, `postForm` (POSTs to `https://api.web3forms.com/submit` and throws on failure).
- **[validation.js](../src/utils/validation.js)**: `isValidEmail` (loose `a@b.c` check), `isValidPhone` (digits, `+ - ( )` and spaces; 10 to 15 digits).

### Components: `src/components/`

| Component | Purpose |
| --- | --- |
| `Navbar` | Skip link, announcement strip, sticky header, language and theme toggles, mobile drawer. Desktop links from 1280 px up. Menu entries are the `links` array. |
| `Footer` | Brand, quick links (`quickLinks` array), contact, Donate call-to-action |
| `HeroBanner` | Home carousel. Pauses on hover/focus, starts paused for reduced motion, controls on the left. |
| `PageHeader` | Green banner with the page's only `<h1>` (`title`, `sub`) |
| `SectionHeading` | Section `<h2>` with optional kicker and subtitle |
| `Photo` | Use instead of `<img>`. Lazy by default; for gallery photos it adds WebP `srcset`, size and blur preview. |
| `Reveal` | Fades content in as it scrolls into view |
| `StatCounter` | Animated count-up number |
| `ProgramCard` | Programme card linking to `/about#<id>` |
| `WorkCard` / `WorkCardCompact` | A past work, in full or as a small card |
| `CopyField` | Label + value + Copy button (`compact` strips spaces) |
| `FormSend` | `SubmitButton`, `Honeypot` (spam trap), `SendResult` (success or fallback box) |
| `ChipBar` | Sticky row of jump links |
| `Icon` | Built-in SVG icons by `name` |
| `Logo`, `ScrollToTop`, `BackToTop`, `ErrorBoundary` | Logo; scroll on navigation; floating up button; crash screen |
| `ui.js` | Shared class names: `btn.*`, `size.*`, `field`, `fieldLabel`, `card`, `pill`, `arrow` |

### Pages: `src/pages/`

Every page has the same shape: `useLang()`, then `usePageMeta(...)`, then `<PageHeader>` followed by sections.

| Page | Notable details |
| --- | --- |
| Home | Banner → stats → who we are → programmes → gallery preview (6 photos) → testimonials → closing CTA |
| About | Mission and vision, values, programmes (`#our-work`, one `#<programme id>` section each), "How a drive happens" (`work.how.s1`…`s5`), latest 3 past works, team, legal table |
| PastWorks | Sticky year chips, one `#<year>` section each, cards with `id={work.id}` |
| Gallery | Category filter, one `#<project id>` album each, a lightbox (Esc, ← →, focus trap) |
| GetInvolved | Role cards, volunteer form, WhatsApp shortcut, FAQ accordion |
| RequestHelp | The biggest form: pick a drive → details → people counts → needs checkboxes. `validate()` lists every failing rule; `buildEmail()` writes the English email. |
| Donate | QR (with a placeholder if missing), UPI buttons (touch devices only), bank details, tiers, after-donation links |
| Contact | Contact rows, socials, form, map |
| NotFound | 404 page (`noindex`); Netlify returns HTTP 404 |

---

## 8. How the forms work

```
Visitor clicks Send
   │
   ▼
onSubmit → validate ── fails → highlight fields, show error, focus first bad field
   │
   ▼
useFormSender(form).send(...)
   ├─ no Web3Forms key ──► opens the email app (mailto:) → "email app opened" + WhatsApp fallback
   └─ has key
        ├─ honeypot ticked (a bot) ──► pretend success, send nothing
        └─ POST to Web3Forms
              ├─ ok   ──► "sent" box, form cleared
              └─ fail ──► "failed" box with WhatsApp / email links carrying the same message
```

- The message is built twice: `body` as plain text (email app, WhatsApp) and `fields` as labelled fields (Web3Forms).
- Errors and selected options are stored as **keys and ids**, so they re-translate on a language switch.
- Outgoing emails are always in **English**, for the volunteers.
- Editing a field clears an old result.

---

## 9. Styling

All styling is Tailwind classes in the JSX. Global setup is in [src/index.css](../src/index.css):

- **Semantic colours** that switch with dark mode: `canvas`, `surface`, `surface-2`, `ink`, `ink-2`, `ink-3`, `line`, `line-strong`, `brand`, `on-brand`, `brand-soft`, `brand-ink`, `focus`, `danger`. Their values are the `--c-*` variables in `:root` (light) and `[data-theme="dark"]`.
- **Fixed colours** that look the same in both modes: `night`, `oasis-*`, `lime-*`, `saffron-*` (Donate), `coral-400`.
- **Fonts:** Baloo Da 2 (headings) and Hind Siliguri (body), both covering English and Bengali.
- **Utilities:** `container-page` (page width), `shadow-soft`, `shadow-lift`, `marker`, `bg-dots`.
- **Animations** (`rise`, `float-slow`, `marquee`, `spin-slow`) all switch off for `prefers-reduced-motion`.

---

## 10. Hosting, build and branches

```
your change → push to uat → PR uat → main → Netlify builds main → live site
```

- **`main` is protected.** Work goes to `uat`, then a PR from `uat` into `main` (`gh pr create --base main --head uat`). A GitHub check ([enforce-uat-to-main.yml](../.github/workflows/enforce-uat-to-main.yml)) blocks PRs from any other branch.
- **Netlify** runs `npm run build` on `main` and publishes `dist/`.
- **[public/_redirects](../public/_redirects):** real pages get status 200; anything else gets the app with status 404 (so search engines see real 404s). Old `/our-work` links redirect to `/about`.
- **[public/_headers](../public/_headers)** and **[vercel.json](../vercel.json):** security headers (CSP etc.) and long caching for hashed files. A build check makes sure the two agree and that the CSP allows the inline script in `index.html`.
- **[vite.config.js](../vite.config.js):** React and Tailwind plugins, plus the photo plugin and the header check.
- **`index.html`:** `__SITE_URL__` is replaced with `site.url` at build time ([scripts/seo.mjs](../scripts/seo.mjs)). A small inline script sets the theme before the first paint and preloads the first banner photo.

---

## 11. Tests and scripts

### Tests: `tests/e2e/`

`npm test` builds the site, serves it, and drives your installed Chrome/Edge. Tests read their expected values from `src/data/`, so editing content doesn't break them.

| Suite | Checks |
| --- | --- |
| **smoke** | Every page, every screen size, both languages: no errors, no broken images, no overflow, one `<h1>` |
| **navigation** | `App.jsx`, `_redirects` and `sitemap.xml` list the same pages; links, anchors, language persistence |
| **features** | Gallery folders match `projects.js` (max 5 photos), filters, lightbox, copy buttons, UPI, all three forms, FAQ, counters. Ends with **warnings** for placeholder content. |
| **performance** | WebP copies, lazy loading, no layout shift, banner photo loads first |
| **a11y** | Carousel pause, focus traps, skip link, required markers, no English labels in Bengali mode |
| **netlify-badge** | Live only: Netlify's badge never covers a button |

Flags: `--live`, `--quick`, `--only=smoke,features`, `--base=<url>`, `--no-build`. Failure screenshots go to `tests/e2e/output/`.

### Scripts: `scripts/`

| Script | What it does |
| --- | --- |
| [add-photos.mjs](../scripts/add-photos.mjs) | `npm run add-photos`: copies photos into an album as `01.jpg`…, skips duplicates, stops at 5 |
| [project-photos.mjs](../scripts/project-photos.mjs) | Vite plugin: lists album photos (max 5), makes WebP copies at 400/800/1600 px plus blur previews (cached), preloads the banner photo |
| [og-image.mjs](../scripts/og-image.mjs) | `npm run og-image`: renders `public/images/og-image.jpg` (1200×630) from `site.js` |
| [seo.mjs](../scripts/seo.mjs) | Fills in `__SITE_URL__` and adds structured data |
| [security-headers.mjs](../scripts/security-headers.mjs) | Checks `_headers` ⇄ `vercel.json` and the CSP hash |

---

## 12. House rules

- **Bilingual everything.** Use `t("key")` for labels and `tr({ en, bn })` for content. Never hard-code visible English in JSX, including `aria-label` and `alt`.
- **Store ids, not display text**, in state, so a language switch re-renders correctly.
- **One `<h1>` per page:** `PageHeader` on inner pages, `HeroBanner` on Home.
- **Keep the bottom-right corner clear.** Netlify's badge sits there.
- **Fail soft.** A missing QR, blocked storage or a crash shows something usable, never a blank screen.
- **`// TODO` in `src/data/`** marks placeholder info; `npm test` lists what's still outstanding.
- **Max 5 photos per album.**
