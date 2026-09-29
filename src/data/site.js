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

  // TODO: confirm your official registration details
  registration: {
    regNo: "XXXXXXXXXX",            // TODO: Society / Trust registration number
    regAct: "West Bengal Societies Registration Act, 1961", // TODO
    pan: "XXXXXXXXXX",              // TODO: PAN of the organisation
    eightyG: "XXXXXXXXXX",          // TODO: 80G certificate number (leave "" if not applicable)
    founded: "2019",                // TODO: year the NGO started working
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
    taxNote: true, // set false to hide the 80G tax-exemption note
  },

  /* --- FORMS -------------------------------------------------------
     The Contact, Get Involved and Request Help forms can send straight
     to your inbox from the page, so visitors do not need an email app.
     1. Go to https://web3forms.com, enter ngomarudyaan@gmail.com and
        press "Create Access Key". The key arrives by email.
     2. Paste it below. (It is safe to publish — it can only send to you.)
     Leave it "" and the forms open the visitor's email app instead.
  ------------------------------------------------------------------ */
  forms: {
    web3formsKey: "", // TODO: paste your Web3Forms access key
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
