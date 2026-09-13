// Local, coarse state centres. Optional geolocation suggests a state, never claims a boundary lookup.
export const states = [
  ["Andhra Pradesh", "te", 15.91, 79.74],
  ["Arunachal Pradesh", "en", 28.22, 94.72],
  ["Assam", "as", 26.2, 92.94],
  ["Bihar", "hi", 25.1, 85.31],
  ["Chhattisgarh", "hi", 21.28, 81.87],
  ["Goa", "en", 15.3, 74.12],
  ["Gujarat", "gu", 22.26, 71.19],
  ["Haryana", "hi", 29.06, 76.09],
  ["Himachal Pradesh", "hi", 31.1, 77.17],
  ["Jharkhand", "hi", 23.61, 85.28],
  ["Karnataka", "kn", 15.32, 75.71],
  ["Kerala", "ml", 10.85, 76.27],
  ["Madhya Pradesh", "hi", 22.97, 78.65],
  ["Maharashtra", "mr", 19.75, 75.71],
  ["Manipur", "en", 24.66, 93.9],
  ["Meghalaya", "en", 25.47, 91.36],
  ["Mizoram", "en", 23.16, 92.94],
  ["Nagaland", "en", 26.15, 94.56],
  ["Odisha", "or", 20.95, 85.1],
  ["Punjab", "pa", 31.15, 75.34],
  ["Rajasthan", "hi", 27.02, 74.21],
  ["Sikkim", "en", 27.53, 88.51],
  ["Tamil Nadu", "ta", 11.12, 78.66],
  ["Telangana", "te", 18.11, 79.02],
  ["Tripura", "bn", 23.94, 91.99],
  ["Uttar Pradesh", "hi", 26.84, 80.95],
  ["Uttarakhand", "hi", 30.06, 79.01],
  ["West Bengal", "bn", 22.98, 87.85],
  ["Delhi", "hi", 28.61, 77.2],
  ["Jammu & Kashmir", "ur", 33.77, 76.57],
  ["Ladakh", "hi", 34.15, 77.57],
  ["Puducherry", "ta", 11.94, 79.81],
  ["Chandigarh", "hi", 30.73, 76.77],
  ["Andaman & Nicobar Islands", "en", 11.74, 92.65],
  ["Dadra & Nagar Haveli and Daman & Diu", "gu", 20.18, 73.02],
  ["Lakshadweep", "ml", 10.57, 72.64],
].map(([name, language, lat, lon]) => ({ name, language, lat, lon }));
export const languages = [
  ["en", "English", "English"],
  ["hi", "Hindi", "हिन्दी"],
  ["bn", "Bengali", "বাংলা"],
  ["te", "Telugu", "తెలుగు"],
  ["ta", "Tamil", "தமிழ்"],
  ["mr", "Marathi", "मराठी"],
  ["gu", "Gujarati", "ગુજરાતી"],
  ["kn", "Kannada", "ಕನ್ನಡ"],
  ["ml", "Malayalam", "മലയാളം"],
  ["or", "Odia", "ଓଡ଼ିଆ"],
  ["pa", "Punjabi", "ਪੰਜਾਬੀ"],
  ["as", "Assamese", "অসমীয়া"],
  ["ur", "Urdu", "اردو"],
  ["sa", "Sanskrit", "संस्कृत"],
].map(([code, name, native]) => ({ code, name, native }));
export const languageName = (code) =>
  languages.find((l) => l.code === code)?.name || "English";
export const regionalFestivals = {
  Bihar: ["Chhath Puja", "Jitiya", "Sama-Chakeva", "Makar Sankranti"],
  Jharkhand: ["Chhath Puja", "Jitiya", "Sama-Chakeva", "Makar Sankranti"],
  "Uttar Pradesh": ["Ram Navami", "Janmashtami", "Holi", "Diwali", "Dussehra"],
  Maharashtra: ["Ganesh Chaturthi", "Gudi Padwa", "Dahi Handi", "Diwali"],
  Gujarat: ["Navratri", "Uttarayan", "Janmashtami", "Diwali"],
  "West Bengal": ["Durga Puja", "Kali Puja", "Poila Boishakh"],
  Odisha: ["Rath Yatra", "Raja Parba", "Nuakhai", "Durga Puja", "Diwali"],
  "Tamil Nadu": ["Pongal", "Tamil New Year", "Diwali", "Ganesh Chaturthi"],
  "Andhra Pradesh": [
    "Ugadi",
    "Makar Sankranti",
    "Dussehra",
    "Ganesh Chaturthi",
  ],
  Telangana: [
    "Bathukamma",
    "Ugadi",
    "Makar Sankranti",
    "Dussehra",
    "Ganesh Chaturthi",
  ],
  Karnataka: ["Ugadi", "Dussehra", "Ganesh Chaturthi", "Kannada Rajyotsava"],
  Kerala: ["Onam", "Vishu", "Christmas", "Eid"],
  Punjab: ["Baisakhi", "Lohri", "Gurpurab"],
  Assam: ["Bihu", "Durga Puja", "Magh Bihu"],
};
export function suggestState(lat, lon) {
  if (lat < 6 || lat > 37.6 || lon < 68 || lon > 97.5) return null;
  return [...states].sort(
    (a, b) =>
      (a.lat - lat) ** 2 +
      ((a.lon - lon) * Math.cos((lat * Math.PI) / 180)) ** 2 -
      ((b.lat - lat) ** 2 +
        ((b.lon - lon) * Math.cos((lat * Math.PI) / 180)) ** 2),
  )[0];
}
