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
    qrImage: "/images/donate-qr.png",     // TODO: drop your QR here
    upiId: "marudyaan@upi",               // TODO: your real UPI ID
    upiName: "NGO Marudyaan",             // TODO: name shown in the UPI app
    bank: {
      accountName: "NGO Marudyaan",       // TODO
      accountNumber: "0000 0000 0000",    // TODO
      bankName: "State Bank of India",    // TODO
      branch: "Kolkata",                  // TODO
      ifsc: "SBIN0000000",                // TODO
      accountType: "Savings / Current",   // TODO
    },
    taxNote: true, // set false to hide the 80G tax-exemption note
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
