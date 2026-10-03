/* ===================================================================
   SITE SETTINGS  —  edit this file to update contact & donation info
   -------------------------------------------------------------------
   Anything marked  // TODO  is a placeholder you should replace with
   your real details before the site goes live.
=================================================================== */

export const site = {
  name: "NGO Marudyaan",
  nameBn: "মরুদ্যান",
  tagline: "An oasis of hope",
  taglineBn: "আশার এক মরুদ্যান",

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
    // TODO: replace with your exact Google Maps embed URL (Maps → Share → Embed a map)
    mapEmbed:
      "https://www.google.com/maps?q=Kolkata,West%20Bengal%20700056&output=embed",
  },

  social: {
    facebook: "https://www.facebook.com/NgoMarudyaanOfficial",
    instagram: "",  // TODO: add if you have one
    youtube: "",    // TODO
    twitter: "",    // TODO
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
  { id: "meals",      value: 12000, suffix: "+" },
  { id: "children",   value: 450,   suffix: "+" },
  { id: "camps",      value: 60,    suffix: "+" },
  { id: "volunteers", value: 120,   suffix: "+" },
];
