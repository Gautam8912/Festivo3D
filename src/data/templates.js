import { divinePresets } from "./divinePresets";
import { septemberRecords } from "./septemberObservances";
import { regionalFestivals, languages } from "./regions";
export const festivals = [
  "Diwali",
  "Holi",
  "Eid",
  "Chhath Puja",
  "Dussehra",
  "Ganesh Chaturthi",
  "Navratri",
  "Raksha Bandhan",
  "Pongal",
  "Onam",
  "Christmas",
  "New Year",
  "Janmashtami",
  "Makar Sankranti",
  "Independence Day",
  "Republic Day",
  "Teacher’s Day",
  "Women’s Day",
  "Father’s Day",
  "Mother’s Day",
  "Valentine’s Day",
  "Akshaya Tritiya",
  "Karwa Chauth",
  "Bhai Dooj",
  "Lohri",
  "Baisakhi",
  "Buddha Purnima",
  "Mahashivratri",
  "Ram Navami",
  "Guru Purnima",
  "Jitiya",
  "Sama-Chakeva",
  "Gudi Padwa",
  "Dahi Handi",
  "Uttarayan",
  "Durga Puja",
  "Kali Puja",
  "Poila Boishakh",
  "Rath Yatra",
  "Raja Parba",
  "Nuakhai",
  "Tamil New Year",
  "Ugadi",
  "Bathukamma",
  "Kannada Rajyotsava",
  "Vishu",
  "Gurpurab",
  "Bihu",
  "Magh Bihu",
];
for (const event of septemberRecords) {
  if (!festivals.includes(event.name)) festivals.push(event.name);
}
export const offers = [
  "Sunday Sale",
  "Mega Sale",
  "Grand Opening",
  "Special Discount",
  "Clearance Sale",
  "New Arrival",
  "Limited Time Offer",
];
export const businesses = [
  "Jewellery",
  "Clothing",
  "Grocery",
  "Restaurant",
  "Salon",
  "Coaching Centre",
  "Electronics",
  "Mobile Shop",
  "Sweet Shop",
  "Furniture",
  "Medical Store",
  "Beauty",
  "Real Estate",
  "Automobile",
  "Bakery",
  "Pharmacy",
  "Home Business",
  "General Store",
];
export const palettes = [
  {
    name: "Festival Orange",
    bg: "#9b2417",
    heading: "#fff0c8",
    badge: "#ffcd64",
    text: "#fff4dc",
    border: "#e5b660",
    button: "#d6602b",
  },
  {
    name: "Royal Purple",
    bg: "#28104e",
    heading: "#ffdea0",
    badge: "#eab55a",
    text: "#fff2dc",
    border: "#d7aa61",
    button: "#8050d1",
  },
  {
    name: "Emerald Green",
    bg: "#064a3c",
    heading: "#ffe5a6",
    badge: "#deb96d",
    text: "#fff8df",
    border: "#ac995c",
    button: "#219978",
  },
  {
    name: "Sunset Pink",
    bg: "#ed527b",
    heading: "#fff8e9",
    badge: "#ffd85d",
    text: "#fff9ee",
    border: "#ffc6da",
    button: "#a92c6b",
  },
  {
    name: "Golden Celebration",
    bg: "#472616",
    heading: "#ffe7a0",
    badge: "#edc77e",
    text: "#fff4dd",
    border: "#dca75d",
    button: "#b76c32",
  },
  {
    name: "Ocean Blue",
    bg: "#123758",
    heading: "#d7f9ff",
    badge: "#79e0eb",
    text: "#f1fbff",
    border: "#5aacc5",
    button: "#207a99",
  },
];
palettes.push(
  ...[
    {
      name: "Royal Velvet Maroon",
      bg: "#2A0812",
      heading: "#ffe2a8",
      badge: "#cba057",
      text: "#f3e7d0",
      border: "#ba9156",
      button: "#25141c",
    },
    {
      name: "Imperial Navy",
      bg: "#040B22",
      heading: "#ffdf9c",
      badge: "#d4aa5d",
      text: "#eeeadc",
      border: "#b99a63",
      button: "#0c152d",
    },
    {
      name: "Emerald Forest",
      bg: "#042215",
      heading: "#f8dfa5",
      badge: "#c7a365",
      text: "#e8eddc",
      border: "#ad955b",
      button: "#112d21",
    },
    {
      name: "Dark Saffron Glow",
      bg: "#3A1200",
      heading: "#ffe9b6",
      badge: "#e1b975",
      text: "#fff0cf",
      border: "#c19553",
      button: "#29170b",
    },
  ],
);
const special = {
  Diwali: ["diwali", "Diwali Dhamaka", 1],
  Holi: ["holi", "Rang Barse, Offers Barse!", 3],
  Eid: ["eid", "Eid Mubarak", 2],
  "Chhath Puja": ["sun", "Chhath Puja Special", 0],
  Christmas: ["christmas", "A Merry Little Sale", 2],
  "New Year": ["party", "Hello, New Beginnings", 5],
  "Mega Sale": ["sale", "The Big Shopping Sale", 3],
  Jewellery: ["jewel", "A Little Golden Magic", 4],
};
const motifs = {
  "Rath Yatra": "chariot",
  Pongal: "harvest",
  Lohri: "harvest",
  Baisakhi: "harvest",
  Nuakhai: "harvest",
  Bihu: "harvest",
  "Magh Bihu": "harvest",
  Onam: "flowers",
  Bathukamma: "flowers",
  Ugadi: "flowers",
  Vishu: "flowers",
  Navratri: "dandiya",
  "Makar Sankranti": "kite",
  Uttarayan: "kite",
  "Independence Day": "national",
  "Republic Day": "national",
  "Ganesh Chaturthi": "lamps",
  "Durga Puja": "lamps",
  "Kali Puja": "lamps",
  "Tamil New Year": "lamps",
};
export const templates = [...festivals, ...offers, ...businesses].map(
  (name, i) => {
    const [layout, title, palette] = special[name] || [
      ["arch", "sale", "jewel", "party"][i % 4],
      name + " Special",
      i % 6,
    ];
    return {
      id: name.toLowerCase().replaceAll(" ", "-"),
      festival: name,
      calendarDate: septemberRecords.find((e) => e.name === name)?.date || "",
      title,
      layout: motifs[name] ? "arch" : layout,
      motif: motifs[name],
      palette,
      category:
        i < festivals.length
          ? "Festivals"
          : i < festivals.length + offers.length
            ? "Business Offers"
            : "Business Categories",
      name: title,
      occasion: name,
      businessCategories:
        i < festivals.length + offers.length ? businesses : [name],
      supportedStates: Object.entries(regionalFestivals)
        .filter(([, names]) => names.includes(name))
        .map(([state]) => state),
      languages: languages.map((l) => l.code),
      collection: "Royal Atelier",
      premium: false,
    };
  },
);
// Two additional art directions for the most-used celebrations; every record remains free.
for (const occasion of [
  "Diwali",
  "Holi",
  "Eid",
  "Pongal",
  "Chhath Puja",
  "Rath Yatra",
]) {
  const base = templates.find((t) => t.festival === occasion);
  for (const [suffix, name, palette, category] of [
    ["fashion", "Festive Fashion", 3, "Clothing"],
    ["gold", "Golden Celebration", 4, "Jewellery"],
  ]) {
    templates.push({
      ...base,
      id: base.id + "-" + suffix,
      title: occasion + " · " + name,
      name: occasion + " · " + name,
      palette,
      businessCategories: [category, "General Store", "Home Business"],
    });
  }
}
for (const t of templates) {
  if (divinePresets[t.festival]) {
    const d = divinePresets[t.festival];
    Object.assign(t, {
      deity: d.deity,
      solemn: !!d.solemn,
      collection: "Divine Atelier",
      palette: d.palette,
      artFinish: "sculpted",
    });
    if (!t.id.endsWith("-fashion") && !t.id.endsWith("-gold")) {
      t.title = d.title || t.festival + " · Quiet Devotion";
      t.name = t.title;
    }
  }
}
for (const occasion of [
  "Ganesh Chaturthi",
  "Hartalika Teej",
  "Vishwakarma Puja",
  "Janmashtami",
  "Radha Ashtami",
  "Anant Chaturdashi",
  "Chhath Puja",
]) {
  const base = templates.find((t) => t.festival === occasion);
  for (const [suffix, title, palette, artFinish] of [
    ["temple", "Temple Engraving", 8, "engraved"],
    ["heritage", "Heritage Bronze", 6, "antique"],
  ])
    templates.push({
      ...base,
      id: base.id + "-" + suffix,
      title: occasion + " · " + title,
      name: occasion + " · " + title,
      palette,
      artFinish,
    });
}
for (const t of templates) {
  if (t.palette < 6) t.palette = 6 + (t.palette % 4);
}
export const featuredIds = [
  "diwali",
  "holi",
  "eid",
  "mega-sale",
  "jewellery",
  "christmas",
];
export const sizes = {
  "Instagram Post": [1080, 1080],
  "WhatsApp Status": [1080, 1920],
  "Instagram Story": [1080, 1920],
  "Facebook Post": [1200, 1500],
  "WhatsApp Square": [1080, 1080],
  "Portrait Social Post": [1080, 1350],
  Custom: [1080, 1080],
};
export const phrases = {
  Diwali: [
    "Diwali Dhamaka Sale",
    "Festival Special Offer",
    "Light Up Your Shopping",
    "Diwali Mega Discount",
  ],
  Holi: [
    "Rang Barse, Offers Barse!",
    "Rangon Ka Celebration, Prices Mein Discount!",
  ],
  Eid: ["Eid Special Collection", "Celebrate Eid With Special Offers"],
  "Chhath Puja": ["Chhath Puja Special", "Chhath Festival Offer"],
};
export const defaults = {
  designStyle: "royal",
  metallicHeading: true,
  artFinish: "sculpted",
  aura: 70,
  deityScale: 100,
  eventDate: "",
  business: "Sharma Fashion",
  ownerName: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  city: "",
  cta: "Shop today",
  greeting: "Warm festive wishes",
  language: "en",
  customWidth: 1080,
  customHeight: 1080,
  padding: 30,
  layoutSpacing: 12,
  radius: 15,
  showBorder: true,
  showDecorations: true,
  shadow: true,
  phone: "9876543210",
  address: "MG Road, Vijayawada",
  offer: "Diwali Dhamaka Sale",
  discount: "UP TO 50% OFF",
  website: "@sharmafashion",
  tagline: "Celebrate more. Spend less.",
  template: "diwali",
  size: "Instagram Post",
  colors: palettes[6],
  font: "Georgia",
  fontSize: 85,
  bold: true,
  italic: false,
  align: "center",
  spacing: 0,
};

export function templatePalette(t) {
  const p = { ...palettes[t.palette] };
  if (!t.collection && t.layout === "holi")
    return {
      ...p,
      bg: "#fff2d9",
      heading: "#372057",
      text: "#563870",
      button: "#542275",
    };
  if (!t.collection && t.layout === "sale")
    return { ...p, heading: "#372057", text: "#513174" };
  return p;
}

export function outputSize(data) {
  return data.size === "Custom"
    ? [
        Math.max(320, Math.min(2400, Number(data.customWidth) || 1080)),
        Math.max(320, Math.min(2400, Number(data.customHeight) || 1080)),
      ]
    : sizes[data.size] || sizes["Instagram Post"];
}
