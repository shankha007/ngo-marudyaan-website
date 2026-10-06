# NGO Marudyaan — মরুদ্যান

**Live site: https://ngo-marudyaan.netlify.app**

Every change merged into `main` rebuilds and republishes the live site automatically
(Netlify runs `npm run build` and publishes `dist/`). You do not need to
deploy by hand.

### How changes reach the live site

`main` is protected: you cannot push to it directly. All work goes through `uat` first.

1. Push your changes to the `uat` branch (`git switch uat`, commit, `git push`).
2. Check them, then open a pull request from `uat` into `main`:
   `gh pr create --base main --head uat`
3. Merge the pull request once the `source-branch-is-uat` check passes. That publishes the site.

Pull requests into `main` from any branch other than `uat` are blocked.

Front-end-only website for NGO Marudyaan, Kolkata. Built with **React + Vite + Tailwind CSS v4**,
with an English ⇄ Bengali language toggle. There is no back end and no database — everything
is static, so it can be hosted free on Netlify, Vercel, GitHub Pages or any normal web host.

---

## Running it on your computer

```bash
npm install     # first time only
npm run dev     # opens http://localhost:5173
```

To produce the files you upload to a web host:

```bash
npm run build   # creates the dist/ folder — upload its contents
npm run preview # check the built site locally before uploading
```

---

## Pages

| Page | Address | File |
| --- | --- | --- |
| Home | `/` | `src/pages/Home.jsx` |
| About Us | `/about` | `src/pages/About.jsx` |
| Our Work | `/our-work` | `src/pages/OurWork.jsx` |
| Gallery | `/gallery` | `src/pages/Gallery.jsx` |
| Get Involved | `/get-involved` | `src/pages/GetInvolved.jsx` |
| Donate | `/donate` | `src/pages/Donate.jsx` |
| Contact Us | `/contact` | `src/pages/Contact.jsx` |
| Not found (404) | anything else | `src/pages/NotFound.jsx` |

---

## The five files you will actually edit

Everything you need to change day to day lives in **`src/data/`** and **`src/i18n/`**.
You do not need to touch any other file.

### 1. `src/data/banner.js` — the home page banner

This is the one you will change most often, for each new drive or project.

1. Put the new picture in `public/images/` (e.g. `puja-drive.jpg`).
2. In `banner.js`, set `image: "/images/puja-drive.jpg"` and rewrite the `en` and `bn` text.
3. Save. The site updates immediately in `npm run dev`.

- Add another `{ ... }` block to `bannerSlides` for a second rotating banner.
- Keep just one block if you want a single fixed banner.
- Set `active: false` to hide a banner without deleting it.
- The thin strip above the menu is the `announcement` object at the bottom of the file.

### 2. `src/data/site.js` — contact and donation details

Phone, WhatsApp, email, address, social links, registration numbers, **UPI ID and bank
details**, and the impact numbers shown on the home page.

**For the Donate page:** save your QR code as `public/images/donate-qr.png`
(any square PNG or JPG). Until you do, the page shows a clearly marked empty box —
nothing breaks.

**One-tap UPI buttons:** once `upiId` is your real UPI ID, set `upiButtons: true`.
Phone visitors then get a "Pay with a UPI app" button, plus a button for each
suggested amount, which open GPay / PhonePe with everything filled in. Keep it
`false` until the UPI ID is real, or the buttons would pay the placeholder ID.
Try a small payment from your own phone after switching it on — some UPI apps
limit link payments to personal (non-merchant) UPI IDs.

### 3. `src/data/projects.js` — the Gallery's project albums

The Gallery shows one album per project (newest year first). Each project's photos live in
their own folder, `public/images/projects/<project id>/`, and **every photo in that folder is
shown automatically**, in file-name order.

**Adding a new project** (two steps):

1. Copy the photos in. This renames them `01.jpg`, `02.jpg`, … and skips exact duplicates:

   ```bash
   npm run add-photos -- "C:\Users\me\Downloads\Puja 2025" 2025-puja-drive
   ```

   (Or create the folder and drop the files in yourself.)

2. Add a block to `projects` in `projects.js`, with the same `id` as the folder:

   ```js
   {
     id: "2025-puja-drive",
     year: 2025,
     category: "festival",
     cover: "03.jpg",                       // optional: photo for Home / Our Work
     title: { en: "Puja Drive", bn: "পুজোর উদ্যোগ" },
     summary: { en: "…", bn: "…" },
     captions: {                            // optional, per photo
       "01.jpg": { en: "…", bn: "…" },
     },
   },
   ```

`category` must be one of: `food`, `education`, `health`, `winter`, `festival`, `women`.
The Gallery's filter buttons only show categories that have a project.

**Adding photos to an existing project:** run `add-photos` with that project's id, or drop the
files into its folder. Nothing else changes. Photos without a caption are captioned with the
project's title. Set `active: false` to hide a project without deleting it.

To show a project on a programme in Our Work, set `project: "<project id>"` on that programme
in `content.js`: the programme then uses the project's cover photo and links to its album.

`npm test` checks that every folder has an entry and every entry has a folder, and that covers
and captions name real files.

### 4. `src/data/content.js` — programmes, team, story, FAQs

Every entry has an `en` and a `bn` version. Replace the draft copy with your real text.

### 5. `src/i18n/strings.js` — menu labels, buttons and section headings

Add a key to **both** `en` and `bn`, then use it as `t("your.key")`.

---

## Placeholder images

The `.svg` images in `public/images/` (`banner-2.svg` and the `work-*.svg` programme pictures)
are generated placeholders that say what belongs there. Replace them with your own photos,
keeping the same file names — or use new names and update the path in `src/data/`. Any gallery
photo can be reused directly, e.g. `image: "/images/projects/2021-micro-library/09.jpg"`.
JPG, PNG and WebP all work.

Recommended sizes: banner **1600×900**, programme images **1000×750**. Gallery photos can be
any shape (thumbnails are cropped square; the full photo shows when opened).

**You don't need to shrink photos yourself.** For every photo in `public/images/projects/`,
the build makes small WebP copies (400, 800 and 1600 px wide) and a blurred preview. Each page
downloads only the size it shows, so a phone gets a ~20 KB thumbnail instead of a 300 KB photo.
The originals are never changed. To get the same for a banner or programme picture, use a photo
from a project folder (as above).

## Page speed

- **Pictures** load lazily (only as you scroll near them), at the size they're shown, with a
  blurred preview and their real width and height, so nothing jumps while they load. Add new
  pictures with the `<Photo>` component (`src/components/Photo.jsx`), not a plain `<img>`, and
  they get all of this.
- **The home banner** is the one picture that loads first: it starts downloading before the
  page's JavaScript.
- **The lightbox** fetches the next and previous photos while you look at one.
- **Fonts** (Baloo 2, Inter, Noto Sans Bengali) are served from this site rather than Google
  Fonts, so the first paint doesn't wait for another server.
- **Caching:** on Netlify (`public/_headers`) and Vercel (`vercel.json`), the photo copies and
  the site's scripts are cached by browsers for a year. Their names change whenever their
  content does, so visitors never see an old version.

The `performance` test suite checks all of this.

---

## Things marked TODO

Search the project for `TODO` to find every placeholder that needs your real information:

- registration number, PAN, 80G certificate, founding year (`src/data/site.js`)
- UPI ID and bank account details (`src/data/site.js`)
- Google Maps embed link for the Contact page (`src/data/site.js`)
- Instagram / YouTube links (`src/data/site.js`)
- team members' names, roles and photos (`src/data/content.js`)
- testimonial quotes — take written consent before publishing (`src/data/content.js`)

All the written copy on the site is a **draft** based on your Facebook page. Read it through
and correct anything that is not accurate about your work.

---

## How the forms work

The Contact, Get Involved and Request Help forms can work in two ways:

- **Straight from the page (recommended).** Each form has its own free access key from
  [web3forms.com](https://web3forms.com), so each shows up as a separate form in the
  Web3Forms dashboard. Create three forms there with `ngomarudyaan@gmail.com`, and paste each
  key into `forms.keys` in `src/data/site.js` (`contact`, `involved`, `help`). Visitors press
  Send and the message lands in your inbox, with every detail (phone, address, number of
  people…) on its own line — no email app needed. If sending fails (for example, no
  signal), the form offers to send the same details on WhatsApp or by email instead.
- **Through the visitor's email app** (what a form does while its key is empty). The form opens
  their email app with everything filled in, and they press Send. Many phones have no email
  app set up, so the form also offers WhatsApp as a fallback.

---

## Testing

An automated end-to-end test suite drives a real browser through the whole site: every page
at four screen sizes in both languages, the forms, the gallery, the donate page, keyboard and
screen-reader behaviour, and more. Run it after making changes, before you push.

**You need:** Google Chrome or Microsoft Edge installed (the tests use your existing browser —
nothing extra to download beyond `npm install`).

```bash
npm test             # builds the site, serves it locally, runs everything (~6 minutes)
npm run test:quick   # fewer screen sizes, English only (~3 minutes)
npm run test:live    # runs against the live site on Netlify
```

`npm run test:live` also checks things that only exist on Netlify: that unknown URLs return
"404 not found", and that Netlify's "Powered by Netlify" badge doesn't cover any of our buttons.

**Reading the result.** The run ends with a summary like `53 passed, 0 failed, 6 warnings`.

- **✗ failed** — something is broken. Screenshots of the failing pages are saved in
  `tests/e2e/output/`.
- **⚠ warnings** — placeholder content still on the site (QR code, bank details, team names,
  placeholder photos). They never fail the run; they disappear as you add your real content.

The tests read their expected values from `src/data/` and `src/i18n/`, so changing your text,
photos or bank details does **not** break them.

**Useful options** (note the `--` before them):

```bash
npm test -- --only=features,a11y      # run only some suites
npm test -- --no-build                # skip the build step (reuse the last dist/)
```

Suites: `smoke` (page sweep), `navigation`, `features`, `performance` (image sizes, lazy
loading, layout shift, fonts), `a11y` (accessibility), `netlify-badge`. Set `HEADED=1` to watch the browser, or `CHROME_PATH=…` to pick a browser.

**Adding a new page?** Add its path to `public/_redirects` and `public/sitemap.xml` as well
as `src/App.jsx` — the `navigation` suite fails if the lists don't match, because a page
missing from `_redirects` would load fine but tell search engines it doesn't exist, and one
missing from the sitemap is harder for Google to find.

**Link previews.** When someone shares the site on WhatsApp or Facebook, the preview shows
`public/images/og-image.jpg`. If you change the NGO's name or tagline, remake it with
`npm run og-image`.

---

## Publishing the site

**Netlify or Vercel (easiest):** push this folder to GitHub, connect the repository, and use
build command `npm run build` with publish directory `dist`. The included `public/_redirects`
and `vercel.json` make sure the inner pages load correctly on a refresh.

**Any normal web host (cPanel, Hostinger):** run `npm run build` and upload everything inside
`dist/` to your `public_html` folder. Ask your host to point all paths to `index.html`, or the
inner pages will 404 when someone refreshes them.

**GitHub Pages:** works too, but add `base: "/<repo-name>/"` to `vite.config.js` first.
