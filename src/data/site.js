/* ===================================================================
   SITE SETTINGS  —  edit this file to update contact & donation info
   -------------------------------------------------------------------
   A field left empty ("") is simply not shown on the site.
=================================================================== */

export const site = {
  name: "NGO Marudyaan",
  nameBn: "মরুদ্যান",
  tagline: "An effort to make society better",
  taglineBn: "সমাজকে আরও সুন্দর করার এক প্রয়াস",

  // The site's own address: used for search engines (canonical links,
  // sitemap, social previews). No trailing slash.
  url: "https://marudyaan.com",

  registration: {
    regNo: "S0000579 of 2018-2019",
    regAct: "West Bengal Societies Registration Act, 1961",
    regDate: "10 Aug 2018",
    pan: "AAIAM2209E",
    eightyG: "",                    // 80G is pending; add the certificate number once it is granted
    founded: "24 Aug 2017",         // the day the NGO started working
  },

  contact: {
    email: "ngomarudyaan@gmail.com",
    phone: "+91 87775 94521",
    phoneHref: "+918777594521",
    whatsapp: "+91 91631 78138",
    whatsappHref: "919163178138",
    addressLines: ["Kolkata, West Bengal", "India — 700056"],
    serviceArea: "Kolkata & across West Bengal",
    hours: "Open to messages all week",
    // The Contact page map, centred on a pin at the NGO's location
    // (22°39'54.3"N 88°22'59.6"E, Belgharia). To move it, change the
    // latitude,longitude after q=; z= is the zoom level.
    mapEmbed:
      "https://www.google.com/maps?q=22.665083,88.383222&z=17&hl=en&output=embed",
  },

  social: {
    facebook: "https://www.facebook.com/NgoMarudyaanOfficial",
    instagram: "https://www.instagram.com/ngo_marudyaan",
    youtube: "",    // no account yet; add the link if one is opened
    twitter: "",    // no account yet; add the link if one is opened
  },

  /* --- DONATION DETAILS -------------------------------------------
     Put your QR code image at:  public/images/donate-qr.png
     (any square PNG/JPG works — it is shown at ~280px)
  ------------------------------------------------------------------ */
  donation: {
    // The QR code, upiId and upiName must all be the same UPI account.
    qrImage: "/images/donate-qr.png",
    upiId: "ribhumaster@oksbi",
    upiName: "Shankha Shubhra Das",       // account holder's name, as UPI apps show it
    /* On phones, show "Pay with a UPI app" buttons that open GPay / PhonePe
       with the UPI ID (and amount) already filled in.
       Only switch on when upiId above is a real UPI ID. */
    upiButtons: true,
    /* The UPI above is a Governing Body member's account, used until the
       bank issues a UPI QR code for the society's current account. While
       true, the Donate page explains this to donors. Set to false once
       qrImage, upiId and upiName are the society's own account. */
    upiInterim: true,
    bank: {
      accountName: "MARUDYAAN",
      accountNumber: "753202010003418",
      bankName: "Union Bank of India",
      branch: "Belgharia",
      ifsc: "UBIN0575321",
      accountType: "Current",
    },
    taxNote: false, // set true to show the 80G number on the Donate page (needs registration.eightyG)
  },

  /* --- FORMS -------------------------------------------------------
     The Contact, Get Involved and Request Help forms can send straight
     to your inbox from the page, so visitors do not need an email app.
     Each form has its own Web3Forms access key, so each one appears as
     a separate form (with its own history) in the Web3Forms dashboard.
     1. At https://web3forms.com, create one form per key below, using
        ngomarudyaan@gmail.com. Each key arrives by email.
     2. Paste each key next to its form. (Keys are safe to publish —
        they can only send to you.)
     A form whose key is "" opens the visitor's email app instead.
  ------------------------------------------------------------------ */
  forms: {
    keys: {
      contact: "94bb79b3-8ecb-4d3b-ac65-ca8e47311ca0",  // Contact page
      involved: "0dd35f27-e972-4e87-92b3-ab2d52dae992", // Get Involved page
      help: "2835ca99-7be5-473c-859f-b28dcd4cc073",     // Request Help page
    },
  },
};

/* Impact numbers shown on the home page and the About page.
   Update the `value` fields as your work grows. */
export const stats = [
  { id: "meals",      value: 4000, suffix: "+" },
  { id: "children",   value: 500,  suffix: "+" },
  { id: "camps",      value: 10,   suffix: "+" },
  { id: "volunteers", value: 50,   suffix: "+" },
];
