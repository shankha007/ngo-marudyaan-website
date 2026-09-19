# NGO Marudyaan — মরুদ্যান

**Live site: https://ngo-marudyaan.netlify.app**

Every push to `main` rebuilds and republishes the live site automatically
(Netlify runs `npm run build` and publishes `dist/`). You do not need to
deploy by hand.

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

## The four files you will actually edit

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

### 3. `src/data/content.js` — programmes, gallery, team, story, FAQs

Every entry has an `en` and a `bn` version. Replace the draft copy with your real text.

**Adding gallery photos:** drop the files into `public/images/gallery/`, then add a line to
`galleryItems`:

```js
{ id: "g13", src: "/images/gallery/g13.jpg", category: "food",
  caption: { en: "Ration drive, Howrah", bn: "রেশন বিতরণ, হাওড়া" } },
```

`category` must be one of: `food`, `education`, `health`, `winter`, `festival`, `women`.

### 4. `src/i18n/strings.js` — menu labels, buttons and section headings

Add a key to **both** `en` and `bn`, then use it as `t("your.key")`.

---

## Placeholder images

Every image in `public/images/` right now is a generated placeholder that says what belongs
there. Replace them with your own photos, keeping the same file names — or use new names and
update the path in `src/data/`. JPG, PNG and WebP all work.

Recommended sizes: banner **1600×900**, programme images **1000×750**, gallery **square**.

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

The site has no server, so the Contact and Get Involved forms open the visitor's own email
app with all the fields already filled in — they just press Send. Mail arrives at
`ngomarudyaan@gmail.com`. If you later want forms that submit directly on the page, a free
service like Formspree or Google Forms can be dropped in without changing anything else.

---

## Publishing the site

**Netlify or Vercel (easiest):** push this folder to GitHub, connect the repository, and use
build command `npm run build` with publish directory `dist`. The included `public/_redirects`
and `vercel.json` make sure the inner pages load correctly on a refresh.

**Any normal web host (cPanel, Hostinger):** run `npm run build` and upload everything inside
`dist/` to your `public_html` folder. Ask your host to point all paths to `index.html`, or the
inner pages will 404 when someone refreshes them.

**GitHub Pages:** works too, but add `base: "/<repo-name>/"` to `vite.config.js` first.
