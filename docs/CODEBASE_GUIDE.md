# NGO Marudyaan: Codebase Guide

This guide explains how the NGO Marudyaan website is built: what each file is for, what each function and component does, and how the pieces connect. Read it top to bottom once and you should be able to find your way around the whole project.

For day-to-day content editing (changing the banner, donation details, gallery photos), the [README](../README.md) is the shorter, task-focused guide. This document covers the code.

---

## Contents

1. [What the project is](#1-what-the-project-is)
2. [Tech stack](#2-tech-stack)
3. [Folder map](#3-folder-map)
4. [How the app starts](#4-how-the-app-starts)
5. [Data layer: `src/data/`](#5-data-layer-srcdata)
6. [Translations: `src/i18n/`](#6-translations-srci18n)
7. [Hooks: `src/hooks/`](#7-hooks-srchooks)
8. [Utilities: `src/utils/`](#8-utilities-srcutils)
9. [Shared components: `src/components/`](#9-shared-components-srccomponents)
10. [Pages: `src/pages/`](#10-pages-srcpages)
11. [How the forms work, end to end](#11-how-the-forms-work-end-to-end)
12. [Styling](#12-styling)
13. [Static files: `public/`](#13-static-files-public)
14. [Build, hosting and branch rules](#14-build-hosting-and-branch-rules)
15. [The test suite: `tests/e2e/`](#15-the-test-suite-testse2e)
16. [Scripts: `scripts/`](#16-scripts-scripts)
17. [Common changes: where to make them](#17-common-changes-where-to-make-them)
18. [Conventions used throughout](#18-conventions-used-throughout)

---

## 1. What the project is

A static, front-end-only website for **NGO Marudyaan (মরুদ্যান)**, a volunteer-run organisation in Kolkata. It has:

- 8 pages: Home, About, Our Work, Gallery, Get Involved, Request Help, Donate and Contact, plus a 404 page.
- An **English ⇄ Bengali** language toggle that covers every label and every piece of content.
- Three forms (Contact, Get Involved, Request Help). They either post straight to the NGO's inbox through [Web3Forms](https://web3forms.com) or open the visitor's email app.
- A donation page with a UPI QR code, copyable bank details, and one-tap UPI payment links on phones.

There is **no back end and no database**. Everything is bundled into static files (`dist/`) and hosted on Netlify at <https://ngo-marudyaan.netlify.app>.

---

## 2. Tech stack

| Concern | Tool | Where it's configured |
| --- | --- | --- |
| UI library | React 19 | [package.json](../package.json) |
| Routing | react-router-dom 7 (`BrowserRouter`) | [src/main.jsx](../src/main.jsx), [src/App.jsx](../src/App.jsx) |
| Build tool / dev server | Vite 8 | [vite.config.js](../vite.config.js) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) | [src/index.css](../src/index.css) |
| Linting | oxlint | [.oxlintrc.json](../.oxlintrc.json) |
| End-to-end tests | playwright-core, driving the installed Chrome/Edge | [tests/e2e/](../tests/e2e/) |
| Form delivery | Web3Forms (third-party HTTP API) | [src/utils/sendForm.js](../src/utils/sendForm.js) |
| Hosting | Netlify (Vercel config also included) | [public/_redirects](../public/_redirects), [vercel.json](../vercel.json) |

### npm scripts ([package.json](../package.json))

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server on <http://localhost:5173> with hot reload. |
| `npm run build` | Builds the production site into `dist/`. |
| `npm run preview` | Serves the built `dist/` locally. |
| `npm run lint` | Runs oxlint over the source. |
| `npm test` | Builds, serves locally, and runs every end-to-end suite. |
| `npm run test:quick` | Same, with fewer screen sizes and English only. |
| `npm run test:live` | Runs the suites against the live Netlify site. |
| `npm run og-image` | Regenerates the social-sharing preview image. |

---

## 3. Folder map

```
ngo-marudyaan/
├── index.html                 HTML shell: <head> meta tags, fonts, #root mount point
├── package.json               dependencies and npm scripts
├── vite.config.js             Vite plugins (React + Tailwind)
├── vercel.json                SPA rewrite rule for Vercel hosting
├── .oxlintrc.json             lint rules
├── .claude/launch.json        dev-server config for the Claude desktop preview
├── .github/workflows/
│   └── enforce-uat-to-main.yml   CI check: PRs into main must come from uat
├── public/                    copied as-is into dist/
│   ├── _redirects             Netlify routing (real pages 200, others 404)
│   ├── robots.txt, sitemap.xml
│   ├── favicon.svg
│   └── images/                banner, programme, gallery, QR and OG images
├── scripts/
│   └── og-image.mjs           renders public/images/og-image.jpg
├── src/
│   ├── main.jsx               entry point: mounts <App> with providers
│   ├── App.jsx                layout + route table
│   ├── index.css              Tailwind import, design tokens, animations
│   ├── data/                  ALL editable content (site settings, banner, page copy)
│   ├── i18n/                  language context + UI label dictionary
│   ├── hooks/                 reusable React hooks
│   ├── utils/                 plain JS helpers (form sending, validation)
│   ├── components/            shared UI building blocks
│   └── pages/                 one file per route
└── tests/e2e/                 browser-driven test suites + runner
```

**Rule of thumb:** content lives in `src/data/` and `src/i18n/strings.js`. Behaviour lives in `src/components/`, `src/hooks/`, `src/utils/` and `src/pages/`. Pages read from the data files and should never hard-code copy. The only exceptions are page meta descriptions and the plain-text email bodies, which are always written in English.

---

## 4. How the app starts

### [index.html](../index.html)

The single HTML document Vite serves. It contains:

- `<title>`, meta description, `theme-color` and the canonical URL.
- **Open Graph / Twitter tags** for link previews on WhatsApp and Facebook. These point at `/images/og-image.jpg`.
- Google Fonts: **Baloo 2** (display headings), **Inter** (body text) and **Noto Sans Bengali** (Bengali script).
- `<div id="root">`, where React mounts, and the script tag that loads `/src/main.jsx`.

### [src/main.jsx](../src/main.jsx)

Mounts the React tree. The provider nesting order matters:

```
<StrictMode>
  <ErrorBoundary>          ← catches render crashes anywhere below
    <BrowserRouter>        ← enables <Link>, useLocation, etc.
      <LanguageProvider>   ← supplies lang / t() / tr() to every component
        <App />
```

It also imports `index.css`, which pulls in Tailwind and the global styles.

### [src/App.jsx](../src/App.jsx): `App()`

The page layout shared by every route, plus the route table.

```
<ScrollToTop />    invisible; manages scroll position on navigation
<Navbar />         announcement strip + sticky header + mobile drawer
<main id="main">   target of the "Skip to main content" link
  <Routes> … </Routes>
</main>
<Footer />
<BackToTop />      floating button, bottom-left
```

| Path | Page component |
| --- | --- |
| `/` | `Home` |
| `/about` | `About` |
| `/our-work` | `OurWork` |
| `/gallery` | `Gallery` |
| `/get-involved` | `GetInvolved` |
| `/request-help` | `RequestHelp` |
| `/donate` | `Donate` |
| `/contact` | `Contact` |
| `*` (anything else) | `NotFound` |

> ⚠️ **Adding a page means editing three files:** this route table, [public/_redirects](../public/_redirects) and [public/sitemap.xml](../public/sitemap.xml). The `navigation` test suite fails if the three lists don't match.

---

## 5. Data layer: `src/data/`

These files are plain JavaScript objects and arrays, not code with logic. Most text fields are bilingual objects shaped like `{ en: "…", bn: "…" }`. Components read them through `tr()` (see [§6](#6-translations-srci18n)).

### [src/data/site.js](../src/data/site.js)

Global settings. Exports:

#### `site`

| Key | Contents | Used by |
| --- | --- | --- |
| `name`, `nameBn`, `tagline`, `taglineBn` | NGO name and tagline in both languages | Navbar, Footer, page titles, OG image |
| `registration` | `regNo`, `regAct`, `regDate`, `pan`, `eightyG` (empty hides it), `founded` | About (legal table), Home (founded badge), Donate (80G note) |
| `contact` | `email`, `phone` / `phoneHref`, `whatsapp` / `whatsappHref`, `addressLines[]`, `serviceArea`, `hours`, `mapEmbed` | Contact, Footer, Navbar drawer, Donate, Request Help, form fallbacks |
| `social` | `facebook`, `instagram`, `youtube`, `twitter` URLs. Empty strings are hidden. | Footer, Contact |
| `donation` | `qrImage`, `upiId`, `upiName`, `upiButtons` (bool), `bank{…}`, `taxNote` (bool) | Donate |
| `forms.keys` | Web3Forms access keys: `contact`, `involved`, `help` | [sendForm.js](../src/utils/sendForm.js) |

`phoneHref` and `whatsappHref` are the machine-readable forms of the numbers, used in `tel:` and `https://wa.me/` links. `phone` and `whatsapp` are the display versions.

**`upiButtons`**: when `true`, the Donate page shows `upi://pay` deep-link buttons on touch devices. Keep it `false` until `upiId` is real.

**`forms.keys`**: if a key is an empty string, that form falls back to opening the visitor's email app.

#### `stats`

An array of `{ id, value, suffix }` impact numbers (meals, children, camps, volunteers). The Home page shows them through `StatCounter`. Each label comes from the string key `stat.<id>`.

### [src/data/banner.js](../src/data/banner.js)

The home-page hero carousel and the announcement strip. Exports:

- **`bannerSettings`**: `{ autoPlay, intervalMs }`. Controls whether slides rotate and how fast.
- **`bannerSlides`**: an array of slides. Each slide has:
  - `id` (unique), `active` (set `false` to hide it), `image` (a path under `public/`)
  - `align`: `"left"` or `"center"`
  - `kicker`, `title`, `subtitle`: bilingual text
  - `primaryCta` / `secondaryCta`: `{ label: {en,bn}, to: "/route" }`, both optional
- **`announcement`**: `{ active, text, linkLabel, to }`. The thin strip above the header, rendered by `Navbar`.

### [src/data/content.js](../src/data/content.js)

All page copy. Exports:

| Export | Shape | Rendered on |
| --- | --- | --- |
| `programs` | `{ id, icon, image, title, summary, details: {en:[…], bn:[…]} }`. Ids: `food`, `education`, `health`, `winter`, `festival`, `women`. | Home (cards), Our Work (sections, anchored by `id`) |
| `milestones` | `{ year, title, text }` | About (timeline) |
| `values` | `{ id, title, text }` | Home (mission list), About (values grid) |
| `team` | `{ id, photo, name, role }`. An empty `photo` shows the person's initials. | About |
| `galleryItems` | `{ id, src, category, caption }`. `category` must be one of the six programme categories. | Gallery, Home (first 6) |
| `testimonials` | `{ id, quote, author }` | Home |
| `volunteerRoles` | `{ id, title, text }` | Get Involved (cards + "Interested in" select) |
| `helpPrograms` | `{ id, icon, title, text, needs: [{ id, label }] }`. Ids: `puja`, `winter`, `other`. `other` has no needs. | Request Help |
| `donationTiers` | `{ id, amount, impact }` | Donate |
| `faqs` | `{ id, q, a }` | Get Involved |

`icon` values must be names defined in [Icon.jsx](../src/components/Icon.jsx). Need ids in `helpPrograms` must be unique across all drives.

---

## 6. Translations: `src/i18n/`

There are two kinds of translatable text:

1. **UI labels** (buttons, headings, menu items, error messages). These live in `strings.js` and are read with **`t("key")`**.
2. **Content** (programmes, banner, FAQs…). These live in `src/data/` as `{ en, bn }` objects and are read with **`tr(field)`**.

### [src/i18n/strings.js](../src/i18n/strings.js)

Exports **`strings`**, an object `{ en: {…}, bn: {…} }` of flat dot-separated keys. The keys are grouped by prefix:

| Prefix | Area |
| --- | --- |
| `nav.*` | Menu labels, skip link, menu open/close |
| `cta.*` | Generic call-to-action buttons |
| `lang.*` | Language toggle |
| `carousel.*` | Banner screen-reader labels |
| `home.*`, `about.*`, `work.*`, `gallery.*`, `involved.*`, `help.*`, `donate.*`, `contact.*`, `nf.*` | Per-page text |
| `form.*` | Shared form messages (sending, sent, failed, invalid email/phone…) |
| `cat.*` | Gallery category names |
| `stat.*` | Impact counter labels |
| `footer.*`, `misc.*` | Footer, Back-to-top |

When you add a key, add it to **both** `en` and `bn`.

### [src/i18n/LanguageContext.jsx](../src/i18n/LanguageContext.jsx)

| Function / export | What it does |
| --- | --- |
| `STORAGE_KEY` (const) | `"marudyaan-lang"`, the `localStorage` key that remembers the visitor's choice. |
| `readInitialLang()` | Picks the starting language: first a saved choice in `localStorage`, otherwise `bn` if the browser language starts with `bn`, otherwise `en`. Wrapped in `try/catch` so blocked storage (for example private mode) doesn't crash the site. |
| `LanguageProvider({ children })` | Holds `lang` state. On every change it saves the choice to `localStorage` and sets `<html lang="…">`, which also switches on the Bengali line-height rule in CSS. It provides the context value below. |
| `t(key)` | UI label lookup. Falls back to the English text, then to the key itself, so a missing translation never shows as blank. |
| `tr(field)` | Content lookup. Returns `""` for null, returns a plain string as-is, and otherwise returns `field[lang]`, falling back to `field.en`. Works for arrays too, such as `programs[].details`. |
| `toggle()` | Flips between `en` and `bn`. |
| `useLang()` | The hook every component uses: `const { lang, setLang, toggle, t, tr } = useLang()`. Throws if called outside the provider. |

---

## 7. Hooks: `src/hooks/`

### [useFocusTrap.js](../src/hooks/useFocusTrap.js): `useFocusTrap(active, containerRef, { initialFocusRef, returnFocus })`

Keyboard focus management for overlays. It is used by the mobile menu ([Navbar](../src/components/Navbar.jsx)) and the photo lightbox ([Gallery](../src/pages/Gallery.jsx)).

While `active` is true, the hook:

1. Remembers which element had focus when the overlay opened.
2. Moves focus into the container: to `initialFocusRef` if given, otherwise to the first focusable element.
3. Listens for `Tab` / `Shift+Tab` and wraps focus around inside the container, so it can't escape to the page behind.

When `active` becomes false, it returns focus to `returnFocus()` if that was given, otherwise to the remembered opener.

`FOCUSABLE` is the CSS selector for focusable elements. Elements that are hidden (no client rects) or inside an `[inert]` ancestor are skipped.

### [useFormSender.js](../src/hooks/useFormSender.js): `useFormSender(form)`

Sends one form. `form` is `"contact"`, `"involved"` or `"help"`, which selects the Web3Forms key. It returns `{ direct, status, message, send, reset }`:

| Value | Meaning |
| --- | --- |
| `direct` | `true` if this form has a Web3Forms key, so it posts straight to the inbox. |
| `status` | `"idle"`, `"sending"`, `"sent"`, `"failed"` or `"opened"` (handed to the email app). |
| `message` | `{ subject, body }` of the last send. The fallback WhatsApp and email links reuse it. |
| `send({ subject, body, name, email, fields, note, form })` | **Without a key:** sets status `opened` and navigates to a `mailto:` link. **With a key:** if the hidden `botcheck` honeypot is ticked, it pretends to succeed and sends nothing; otherwise it calls `postForm()` and sets `sent` or `failed`. Returns `true` or `false`. |
| `reset()` | Clears a finished result (`sent`, `failed`, `opened`) when the visitor edits the form again. |

`body` is the full plain-text message, used by the email app and WhatsApp. `fields` and `note` carry the same details split into labelled fields for Web3Forms. See [§11](#11-how-the-forms-work-end-to-end).

### [usePageMeta.js](../src/hooks/usePageMeta.js): `usePageMeta(title, description)`

Sets `document.title` and the `<meta name="description">` tag when a page mounts, and again when the values change (for example on a language switch). The site has no server rendering, so every page calls this itself.

---

## 8. Utilities: `src/utils/`

### [sendForm.js](../src/utils/sendForm.js)

| Export | What it does |
| --- | --- |
| `web3formsKey(form)` | Returns `site.forms.keys[form]`, or `""` if there is none. |
| `sendsDirect(form)` | `true` if the form has a key. |
| `WEB3FORMS_URL` | `https://api.web3forms.com/submit` |
| `mailtoHref(subject, body)` | Builds a `mailto:` URL to the NGO's email with the subject and body URL-encoded. |
| `whatsappHref(text)` | Builds a `https://wa.me/<number>?text=…` URL to the NGO's WhatsApp. |
| `postForm({ form, subject, name, email, fields, message })` | POSTs JSON to Web3Forms: `access_key`, `subject`, `from_name`, `name`, an optional `email` (used as the reply-to), each entry of `fields` as its own key, and `message`. Throws if the HTTP request fails or the response doesn't say `success: true`. |

### [validation.js](../src/utils/validation.js)

| Export | Rule |
| --- | --- |
| `isValidEmail(value)` | A deliberately loose `something@something.something` check. It catches typos such as `name@gmail` without rejecting unusual but valid addresses. |
| `isValidPhone(value)` | Allows only digits, `+`, `-`, spaces and parentheses, and needs **10 to 15 digits** in total. |

---

## 9. Shared components: `src/components/`

| Component | Props | What it does |
| --- | --- | --- |
| [Navbar](../src/components/Navbar.jsx) | none | Skip link, announcement strip (from `banner.js`), sticky header with logo, desktop nav links, language toggle, Donate button, and the mobile slide-in drawer. Details below. |
| [Footer](../src/components/Footer.jsx) | none | Four columns: brand blurb and socials, quick links, contact details, and a Donate call-to-action. Then a copyright line with the current year. Social icons with no URL are filtered out. |
| [HeroBanner](../src/components/HeroBanner.jsx) | none | The home-page carousel. Details below. |
| [PageHeader](../src/components/PageHeader.jsx) | `title`, `sub?` | The green banner at the top of every inner page. It contains the page's only `<h1>`, plus decorative blurred circles and a curved bottom edge. |
| [SectionHeading](../src/components/SectionHeading.jsx) | `kicker?`, `title`, `sub?`, `align` (`"center"` or `"left"`), `light` (for dark backgrounds) | A section `<h2>` with an optional small uppercase kicker, a subtitle and a saffron underline bar. It is wrapped in `Reveal`. |
| [Reveal](../src/components/Reveal.jsx) | `as` (tag, default `div`), `delay` (ms), `className`, `...rest` | Fades and lifts its children in the first time they scroll into view, using an `IntersectionObserver` with a 12% threshold. It adds the `is-visible` class, which triggers the `rise` keyframes in `index.css`. If `IntersectionObserver` is missing, the content shows immediately. |
| [StatCounter](../src/components/StatCounter.jsx) | `value`, `suffix`, `label` | Counts up from 0 to `value` over 1.4 s with an ease-out-cubic curve the first time it is 40% visible. It jumps straight to the final value for reduced-motion users. |
| [ProgramCard](../src/components/ProgramCard.jsx) | `program` | A card with the programme image, an icon badge straddling the image edge, the title, the summary, and a "Read more" link to `/our-work#<id>`. |
| [CopyField](../src/components/CopyField.jsx) | `label`, `value`, `mono`, `compact` | A label and value row with a Copy button, used for UPI and bank details. `compact` strips spaces before copying, because banking apps reject pasted spaces. The button shows "Copied" for 1.8 s. Clipboard failures are ignored, since the value is visible on screen anyway. |
| [FormSend](../src/components/FormSend.jsx) | (three named exports) | Shared form parts. See below. |
| [Icon](../src/components/Icon.jsx) | `name`, `className`, `filled`, `...rest` | A built-in inline SVG icon set (no library). Returns `null` for unknown names. It renders stroked by default; `filled` switches to a solid fill. Always `aria-hidden`. Available names: `bowl book heart blanket gift hands phone mail pin clock globe whatsapp facebook instagram youtube arrowRight arrowUp check copy close menu chevronLeft chevronRight chevronDown pause play quote sprout shield users`. |
| [Logo](../src/components/Logo.jsx) | `className` | A placeholder SVG logo (a sprout over water) coloured with the CSS theme variables. To use a real logo, replace it with an `<img>`, as the file comment explains. |
| [ScrollToTop](../src/components/ScrollToTop.jsx) | none | Renders nothing. On every route or hash change it either smoothly scrolls to the element the `#hash` names, or jumps instantly to the top of the page. |
| [BackToTop](../src/components/BackToTop.jsx) | none | A floating button that appears after scrolling 600 px and smooth-scrolls to the top. While hidden it is removed from the tab order and the accessibility tree. It sits at the **bottom-left** so Netlify's badge doesn't cover it. |
| [ErrorBoundary](../src/components/ErrorBoundary.jsx) | `children` | A class component that catches render errors anywhere in the app, logs them to the console, and shows a bilingual "Something went wrong" message with a home link and the NGO's email address. |

### Navbar in detail ([Navbar.jsx](../src/components/Navbar.jsx))

- **`links`** (const): the nav entries `{ to, key, end }`. Donate is kept separate as a highlighted button.
- **`langLabels`** (const): the full and short labels for the toggle (`English` / `EN`, `বাংলা` / `বাং`).
- **`LanguageToggle({ compact, className })`**: a two-button group that calls `setLang`. `aria-pressed` marks the active language. The compact version is used on mobile.
- **`Navbar()`** state and effects:
  - `open`: whether the mobile drawer is open. It closes automatically on route change and on `Escape`.
  - `scrolled`: becomes true after 12 px of scrolling and adds a shadow and blur to the sticky header.
  - It locks body scroll while the drawer is open.
  - `useFocusTrap(open, drawerRef)` keeps keyboard focus inside the open drawer.
  - The drawer is `inert` while closed, so its off-screen links are not tabbable.
  - The desktop links appear at the `xl` breakpoint (1280 px) and up. Below that, the hamburger menu is used.
  - `pb-24` on the drawer footer keeps its buttons clear of Netlify's badge.

### HeroBanner in detail ([HeroBanner.jsx](../src/components/HeroBanner.jsx))

- **`prefersReducedMotion()`**: `true` if the OS asks for reduced motion. The carousel then **starts paused**.
- `slides`: the `bannerSlides` with `active !== false`. If there are none, the component renders nothing.
- **`go(n)`**: moves to slide `n`, wrapping around at both ends.
- **`rotating`**: true only if `autoPlay` is on, there is more than one slide, and the carousel is not paused by the user, by mouse hover, or by keyboard focus inside it. Focus on the Pause/Play button itself does not count, so pressing Play visibly works.
- An interval advances the slide every `intervalMs` while `rotating`.
- `aria-live` is `"off"` while auto-rotating and `"polite"` otherwise, so screen readers announce only slide changes the user caused.
- `num(n)` formats dot numbers in Bengali or English digits.
- The controls (Pause/Play, Previous, Next, and dot buttons at least 24 px tall) sit on the **left** to avoid Netlify's badge. On narrow phones the dots stack above the buttons.
- This follows WCAG 2.2.2 "Pause, Stop, Hide".

### FormSend in detail ([FormSend.jsx](../src/components/FormSend.jsx))

| Export | What it renders |
| --- | --- |
| `SubmitButton({ status, direct, label, labelDirect })` | The submit button. It is disabled and shows "Sending…" while `status === "sending"`. Its label comes from `labelDirect` or `label` (both string keys), depending on whether the form sends directly. |
| `Honeypot({ direct })` | A hidden `botcheck` checkbox, rendered only for direct forms. People never see it; spam bots tick it, and `useFormSender` then silently drops the submission. |
| `SendResult({ status, message, sentKey })` | A `role="status"` region. **sent**: a success box with the form's own "what happens next" text (`sentKey`). **failed**: an error box with "Send on WhatsApp" and "Send by email" fallback links that carry the same message. **opened**: a note that the email app was opened, with a WhatsApp fallback for phones that have no email app set up. |

---

## 10. Pages: `src/pages/`

Every page follows the same pattern:

```jsx
const { t, tr } = useLang();
usePageMeta(`${t("x.title")} — ${site.name}`, "English meta description");
return (<><PageHeader … /> <section>…</section> …</>);
```

### [Home.jsx](../src/pages/Home.jsx): `Home()`

Sections, top to bottom:

1. `HeroBanner`
2. **Impact numbers**: `stats` → `StatCounter`
3. **Who we are**: an image with a floating "founded" badge, the mission text, the `values` list and a "Learn more" link to About
4. **What we do**: `programs` → `ProgramCard` grid
5. **Gallery preview**: the first 6 `galleryItems`; the first is shown twice the size
6. **Voices**: `testimonials`
7. **Closing CTA**: Donate and Volunteer buttons

### [About.jsx](../src/pages/About.jsx)

- **`Initials({ name })`**: shows up to two initials from a name. It is the fallback when a team member has no photo, and defaults to "M".
- **`About()`**: mission and vision cards, a `values` grid, a `milestones` timeline (alternating left and right on wider screens), a `team` grid, and a legal/registration table. `legalRows` filters out empty values.

### [OurWork.jsx](../src/pages/OurWork.jsx): `OurWork()`

- **Jump chips**: `<a href="#food">`-style links to each programme.
- **One `<section id={program.id}>` per programme**, with alternating image side, the details list, and Donate and Volunteer buttons. `scroll-mt-24` keeps a section clear of the sticky header when it is scrolled to.
- **"How a drive happens"**: 5 numbered steps from the string keys `work.how.s1.t` / `work.how.s1.b` through `s5`.
- Arriving at `/our-work#food` is handled centrally by `ScrollToTop`; the page has no anchor-scroll effect of its own.

### [Gallery.jsx](../src/pages/Gallery.jsx): `Gallery()`

- **`categories`** (const): `all`, followed by the six programme categories.
- State: `filter` (the active category) and `openIndex` (the index into the filtered `items`, or `null` when the lightbox is closed).
- **`items`**: the `galleryItems` filtered by category (memoised).
- **`close()`**: closes the lightbox.
- **`step(delta)`**: moves to the next or previous photo, wrapping around.
- A keyboard effect, active while the lightbox is open: `Escape` closes it, `←` / `→` step through photos, and body scroll is locked.
- **Focus management**: `useFocusTrap` with the Close button as initial focus. On close, focus returns to the thumbnail of the last photo viewed (found through `data-thumb` and `lastIndexRef`).
- The lightbox is a `role="dialog"`. Clicking the backdrop closes it; clicks on the image and arrows stop propagation so they don't. It shows the caption and an "n of total" counter.

### [GetInvolved.jsx](../src/pages/GetInvolved.jsx)

- **`Faq({ item })`**: an accordion item. The answer opens and closes with an animated `grid-rows` transition, and `aria-expanded` reflects its state.
- **`GetInvolved()`**:
  - Role cards from `volunteerRoles`.
  - **Volunteer form**: Name (required), Phone (required and validated), Email (optional, validated if filled), "Interested in" (a `<select>` that stores the role **id**, so a language switch doesn't break it) and Message.
  - **`set(key)`**: a curried change handler. It updates the field, resets any old send result, and clears that field's error flag.
  - **`onSubmit`**: validates, sets `invalid` flags and an `errorKey`, and focuses the first bad field. Otherwise it builds the plain-text body plus `fields: { Phone, "Interested in" }` and calls `sender.send`. It clears the form after a successful direct send.
  - A WhatsApp shortcut link with a pre-filled greeting.
  - The FAQ list from `faqs`.

### [RequestHelp.jsx](../src/pages/RequestHelp.jsx)

This is the most involved form on the site. Its helpers:

| Helper | What it does |
| --- | --- |
| `Required()` | The red `*` marker, hidden from screen readers. |
| `count(value)` | Parses a number field: `""` → `0`, a whole number → that number, anything else → `NaN`. |
| `forOptions` (const) | "Myself / my family" or "Someone else I know". Stores an id and the English label for the email. |
| `emptyForm` (const) | The initial state: `program`, `name`, `phone`, `email`, `requestFor`, `address`, `total`, `children`, `elderly`, `needs[]`, `details`. |
| `clear(...keys)` | Resets a stale send result and clears the error flags for the given keys. |
| `set(key)` | A change handler. It also clears related errors: editing `details` clears `needs`, and editing `elderly` clears `children`, because they share one error. |
| `pickProgram(id)` | Selects a drive and **empties `needs`**, since needs belong to one drive. |
| `toggleNeed(id)` | Ticks or unticks a need checkbox. |
| `validate()` | Returns a list of `[fieldName, failed, errorKey]` for every failing rule, in on-page order: drive chosen; name, phone and address present; phone and email valid; total ≥ 1; children and elderly are whole numbers; children + elderly ≤ total; at least one need ticked, or details written for "Something else". |
| `buildEmail()` | Builds `{ subject, body, fields, note }` **in English** (for the volunteers) from the form. The subject reads like `Help request: <drive> — <name> (<n> people)`. |
| `onSubmit` | Runs `validate()`. On failure it marks every bad field, shows the first error, and focuses the first bad field through its `name` attribute. Otherwise it calls `buildEmail()` and `sender.send(...)`. |
| `describedBy(key)` | Links an invalid field to the `#help-error` message for screen readers. |

The UI has a "How it works" step list, whose second step's text depends on whether the form sends directly, and four fieldsets:

1. **Which drive**: radio cards from `helpPrograms`.
2. **Your details**.
3. **Who needs help**: total, children and elderly counts.
4. **What help**: checkboxes, shown only if the drive has `needs`.

Then a details textarea, which is *required* for the "Something else" drive.

### [Donate.jsx](../src/pages/Donate.jsx): `Donate()`

- **`upiHref(amount?)`**: builds a `upi://pay?pa=…&pn=…&cu=INR&tn=…[&am=…]` deep link that opens GPay, PhonePe or Paytm with the payment pre-filled.
- **`whatsappHref`** / **`mailHref`**: pre-filled "I have made a donation" messages asking for name, amount and PAN (for the 80G receipt).
- **QR card**: shows `donation.qrImage`. If the image fails to load (`onError` → `qrFailed`), a dashed "QR not added yet" placeholder appears instead of a broken image. Below it are the copyable UPI ID and the payee name.
- **UPI buttons**: rendered only when `donation.upiButtons` is true, and made visible only on touch devices through Tailwind's `pointer-coarse:` variant, since desktops have no UPI app.
- **Bank card**: `CopyField` rows. The account number and IFSC use `compact`, so they copy without spaces.
- **Impact tiers**: `donationTiers`, each with an optional "Give ₹X" UPI button.
- **After you donate**: WhatsApp and email links, and the 80G number if `taxNote` is on and a number is set.
- **Donate goods**: phone, WhatsApp and email links.

### [Contact.jsx](../src/pages/Contact.jsx): `Contact()`

- **`details`**: contact rows (phone, WhatsApp, email, address, service area, hours). Rows with an `href` become links; WhatsApp opens in a new tab.
- **`socials`**: only the social links that have a URL.
- **Form**: Name (required), Email (optional, validated), Subject (optional; it defaults to `Website enquiry from <name>`) and Message (required). `set` and `onSubmit` follow the same pattern as Get Involved.
- **Map**: an `<iframe>` of `site.contact.mapEmbed`.

### [NotFound.jsx](../src/pages/NotFound.jsx): `NotFound()`

Logo, "404", a translated title and body, and a "Back to home" button. Netlify serves this page with HTTP status **404**; see [§13](#13-static-files-public).

---

## 11. How the forms work, end to end

```
Visitor clicks Send
      │
      ▼
page onSubmit ──► validation (utils/validation.js + page rules)
      │               └─ fails → mark fields aria-invalid, show errorKey, focus first bad field
      ▼
useFormSender(form).send({ subject, body, name, email, fields, note, form })
      │
      ├── no Web3Forms key for this form ──► status "opened"
      │        window.location → mailto:… (visitor's email app)
      │        SendResult shows "email app opened" + WhatsApp fallback
      │
      └── has key
             ├── honeypot "botcheck" ticked ──► status "sent" (silently dropped)
             └── postForm() → POST https://api.web3forms.com/submit
                    ├── ok      ──► status "sent", form cleared, success box
                    └── failure ──► status "failed", box with WhatsApp / email
                                    links carrying the same message
```

Key design points:

- **Two representations of the same data.** `body` is a single plain-text block, used for the email app and WhatsApp. `fields` + `note` are separate labelled fields, so Web3Forms emails each detail on its own line.
- **Error messages are stored as keys, not text** (`errorKey`), so they re-translate if the visitor switches language while an error is showing.
- **Select and radio values store ids, not labels**, for the same reason.
- **Outgoing email text is always English**, so the volunteers can read it.
- Editing any field calls `sender.reset()`, so a stale result never sits beside changed data.
- The Web3Forms keys are public by design. A key can only send to the NGO's own inbox.

---

## 12. Styling

### [src/index.css](../src/index.css)

- `@import "tailwindcss"` loads Tailwind v4. There is no `tailwind.config.js`; Tailwind v4 is configured in CSS.
- **`@theme`** defines the design tokens that become Tailwind classes:
  - `oasis-50` … `oasis-900`: brand greens (`bg-oasis-700`, `text-oasis-900`…)
  - `sand-50` … `sand-300`: warm backgrounds
  - `saffron-400` … `saffron-600`: the accent colour, used for Donate buttons and highlights
  - `--font-display` (Baloo 2) and `--font-sans` (Inter), each falling back to Noto Sans Bengali
  - Changing these hex values re-skins the whole site.
- `html[lang="bn"] body { line-height: 1.8 }`: Bengali script needs more line height.
- **`@utility container-page`**: the page-width wrapper (max 80 rem, 1.25 rem side padding), used everywhere.
- **Animations**: `rise` (used by `.reveal.is-visible`) and `float-slow` (`.animate-float-slow`).
- **`prefers-reduced-motion`**: turns off smooth scrolling, reveal animations and floating.
- A thin on-brand scrollbar for WebKit browsers.

Everything else is Tailwind utility classes written inline in the JSX. The `field` class string is copied into each form page so all inputs look the same, including `aria-invalid:` red borders.

---

## 13. Static files: `public/`

Copied unchanged into `dist/`.

| File | Purpose |
| --- | --- |
| [_redirects](../public/_redirects) | **Netlify routing.** Each real page path is rewritten to `/index.html` with status **200**. Everything else (`/*`) gets `/index.html` with status **404**, so the React 404 page shows *and* search engines see a real 404. New pages must be added here. |
| [sitemap.xml](../public/sitemap.xml) | Lists every real page for search engines. Must match `App.jsx`. |
| [robots.txt](../public/robots.txt) | Allows everything and points to the sitemap. |
| `favicon.svg` | Browser tab icon. |
| `images/` | `banner-*.svg`, `work-*.svg`, `about-main.svg` and `gallery/g*.svg` are **generated placeholders**, to be replaced with real photos. `donate-qr.png` is the UPI QR code. `og-image.jpg` is the 1200×630 link-preview image. |

---

## 14. Build, hosting and branch rules

- **[vite.config.js](../vite.config.js)**: just the React and Tailwind plugins. For GitHub Pages hosting you would add `base: "/<repo>/"`.
- **[vercel.json](../vercel.json)**: rewrites every path to `/index.html`, for hosting on Vercel. Note that unlike `_redirects`, it doesn't produce real 404 statuses.
- **[.oxlintrc.json](../.oxlintrc.json)**: enforces React's rules of hooks and warns when a file exports non-components alongside components (needed for fast refresh).
- **[.claude/launch.json](../.claude/launch.json)**: tells the Claude desktop app how to start the dev server (`npm run dev`, port 5173).
- **Deployment**: Netlify watches `main`, runs `npm run build` and publishes `dist/`.
- **Branch flow** ([.github/workflows/enforce-uat-to-main.yml](../.github/workflows/enforce-uat-to-main.yml)): `main` is protected. All work goes to `uat`, then a PR from `uat` into `main`. The `source-branch-is-uat` job fails any PR into `main` whose head branch isn't `uat` from this same repository. A GitHub ruleset requires this check to pass before merging.

---

## 15. The test suite: `tests/e2e/`

A custom runner (not Jest or the Playwright test runner) that drives the **installed** Chrome or Edge through `playwright-core`. Tests read their expected values from `src/data/` and `src/i18n/`, so editing content doesn't break them.

### [run.mjs](../tests/e2e/run.mjs): the runner

| Piece | What it does |
| --- | --- |
| CLI flags | `--live` (test the Netlify site), `--quick`, `--only=a,b`, `--base=<url>`, `--no-build`. Environment variables: `LIVE_URL`, `QUICK`, `HEADED=1`, `CHROME_PATH`. |
| `flag(name)` / `option(name)` | Parse `--name` and `--name=value` arguments. |
| `run(cmdArgs)` | Runs the Vite CLI as a child process (used for `vite build`). |
| `freePort()` | Finds an unused TCP port for `vite preview`. |
| `waitFor(url, ms)` | Polls until the preview server answers, with a 30 s timeout. |
| Main flow | Builds (unless `--no-build`), starts `vite preview`, launches the browser, then imports each `<suite>.test.mjs` and calls its default export with `{ browser, base, live, quick, report }`. Prints a summary and exits with `1` if anything failed. |

Suites run in this order: `smoke`, `navigation`, `features`, `a11y`, `netlify-badge`.

### [lib.mjs](../tests/e2e/lib.mjs): shared helpers

| Export | What it does |
| --- | --- |
| `ROOT`, `OUTPUT_DIR` | The project root, and `tests/e2e/output/` (failure screenshots, git-ignored). |
| `VIEWPORTS` | mobile 375, tablet 768, laptop 1024, desktop 1440. |
| `realRoutes()` | Parses `public/_redirects` for its 200 lines and adds `/`. |
| `sitemapRoutes()` | Parses the paths out of `public/sitemap.xml`. |
| `appRoutes()` | Regex-extracts the `<Route path="…">` values from `src/App.jsx`. |
| `fileExists(...parts)` | `existsSync` relative to the project root. |
| `launchBrowser()` | Uses `CHROME_PATH` if set, otherwise tries the `chrome` channel, then `msedge`. |
| `openPage(browser, base, { lang, viewport, contextOptions })` | Opens a new browser context with the language pre-seeded in `localStorage` (once per session, so reload tests still work) and attaches error collectors to `page.errors`: `page`, `console` and `http`. |
| `resetErrors(page)` | Empties the collectors. |
| `scrollLikeAUser(page)` | Scrolls with the mouse wheel in 300 px steps, so scroll-reveal animations actually fire. |
| `WEB3FORMS_URL` | Must match the URL in `sendForm.js`. |
| `captureSubmission(page, action, { fail })` | Runs `action` and captures either a `mailto:` navigation (through the Chrome DevTools Protocol) or a Web3Forms POST, which is **intercepted and answered locally**, so tests never send real email. Returns `{ via, to, subject, body, payload }`. |
| `screenshotOnFailure(page, name)` | Saves a PNG to `OUTPUT_DIR`. |
| `createReporter()` | The `report` object: `ok`, `fail`, `warn`, `skip`, `check(cond, msg, detail)`, `suite`, plus the totals. |

### The suites

| Suite | File | What it checks |
| --- | --- | --- |
| **smoke** | [smoke.test.mjs](../tests/e2e/smoke.test.mjs) | Every real route plus one unknown route, at every viewport, in both languages. For each page: no JavaScript or console errors, no failed requests, no broken images, no horizontal overflow, no `.reveal` content stuck invisible, exactly one `<h1>`, and the correct `<html lang>`. |
| **navigation** | [navigation.test.mjs](../tests/e2e/navigation.test.mjs) | `App.jsx`, `_redirects` and `sitemap.xml` list the same pages. Header links open the right page at the top. The Bengali choice survives a reload. Odd `#fragments` don't crash. `/our-work#id` and Home's "Read more" scroll to the section, clear of the header. The header fits on one line at 1280 px and up. **Live only:** HTTP status codes (real pages 200, unknown 404). |
| **features** | [features.test.mjs](../tests/e2e/features.test.mjs) | Gallery filters and lightbox. Copy buttons copy the right values (without spaces where needed). WhatsApp link format. QR image or its placeholder. UPI buttons hidden on desktop and shown on phones. Validation, focus, sending and fallbacks on all three forms in both languages. The FAQ accordion. Impact counters reach their values. Ends with **warnings** for placeholder content still on the site (QR, bank details, registration numbers, team names, missing Web3Forms keys, `.svg` placeholder images). |
| **a11y** | [a11y.test.mjs](../tests/e2e/a11y.test.mjs) | The banner's Pause/Play, focus-pause, hover-pause and reduced-motion behaviour, and its 24 px tap targets. The mobile menu and lightbox focus traps and focus return. The skip link. Back-to-top is never a hidden tab stop. Icon badges aren't stretched. Required-field `*` markers match the required fields. No English-only `aria-label` or `alt` text in Bengali mode. |
| **netlify-badge** | [netlify-badge.test.mjs](../tests/e2e/netlify-badge.test.mjs) | **Live only.** At 9 screen sizes, checks that Netlify's injected "Powered by Netlify" badge (`#nl-badge-frame`) doesn't cover any of our buttons, both on load and after scrolling, including inside the open mobile menu. The helper `covered(page, menuOnly)` returns the labels of covered controls. |

---

## 16. Scripts: `scripts/`

### [og-image.mjs](../scripts/og-image.mjs)

Generates `public/images/og-image.jpg`, the 1200×630 image shown when the site is shared on WhatsApp, Facebook or X. Those platforms can't display SVG, so the image has to be a JPG. The script builds an HTML page (gradient sky, sun, dunes, palm tree, logo, and the name and taglines from `site.js`), renders it in headless Chrome through `launchBrowser()` from the test library, waits for the fonts to load, and saves a JPEG screenshot. Run it with `npm run og-image` after changing the NGO's name or tagline.

---

## 17. Common changes: where to make them

| I want to… | Edit |
| --- | --- |
| Change the home banner / add a slide | [src/data/banner.js](../src/data/banner.js) (`bannerSlides`), plus the image in `public/images/` |
| Hide or change the top announcement strip | [src/data/banner.js](../src/data/banner.js) (`announcement`) |
| Update phone, email, address or social links | [src/data/site.js](../src/data/site.js) (`site.contact`, `site.social`) |
| Update UPI, bank or QR details | [src/data/site.js](../src/data/site.js) (`site.donation`), plus `public/images/donate-qr.png` |
| Turn direct form sending on or off | [src/data/site.js](../src/data/site.js) (`site.forms.keys`) |
| Change impact numbers | [src/data/site.js](../src/data/site.js) (`stats`) |
| Edit programmes, team, timeline, FAQs or testimonials | [src/data/content.js](../src/data/content.js) |
| Add a gallery photo | `public/images/gallery/` + `galleryItems` in [content.js](../src/data/content.js) |
| Add a Request Help drive or need | `helpPrograms` in [content.js](../src/data/content.js) |
| Change a button label or heading | [src/i18n/strings.js](../src/i18n/strings.js) (both `en` and `bn`) |
| Add a new icon | the `paths` object in [Icon.jsx](../src/components/Icon.jsx) |
| Change brand colours or fonts | `@theme` in [src/index.css](../src/index.css) (and the font link in [index.html](../index.html)) |
| Add a new page | Create it in `src/pages/`, add a `<Route>` in [App.jsx](../src/App.jsx), add the path to [_redirects](../public/_redirects) and [sitemap.xml](../public/sitemap.xml), add it to `links` in [Navbar.jsx](../src/components/Navbar.jsx) and `quickLinks` in [Footer.jsx](../src/components/Footer.jsx), and add its strings |
| Change the link-preview image | `npm run og-image` (text comes from `site.js`) |

---

## 18. Conventions used throughout

- **Bilingual everything.** UI labels use `t("key")`. Content uses `tr({ en, bn })`. Never hard-code visible English in JSX. Screen-reader labels count too; the a11y suite checks for English leaking into Bengali mode.
- **Store ids and keys, not display text,** in state (error keys, selected role, drive and needs), so a language switch re-renders correctly.
- **One `<h1>` per page**: `PageHeader` on inner pages, `HeroBanner` on Home.
- **Accessibility built in:** focus traps for overlays, `aria-invalid` and `aria-describedby` on bad fields, `role="alert"` for errors and `role="status"` for results, `aria-hidden` on decorative SVGs, respect for `prefers-reduced-motion`, and tap targets of at least 24 px.
- **Avoid the bottom-right corner.** Netlify pins its badge there, so floating controls (Back-to-top, carousel controls, drawer buttons) sit on the left or are lifted clear of it.
- **Fail soft.** Blocked `localStorage`, a missing clipboard, a missing QR image, a missing `IntersectionObserver` and render crashes all fall back to something usable instead of a blank screen.
- **TODO markers** in `src/data/` flag placeholder information that must be replaced before launch. The `features` suite reports what is still outstanding as warnings.
