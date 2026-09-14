import { divinePresets } from "../data/divinePresets";
import { divineNames, quietWishes } from "./divineNames";
import en from "./en";
import hi from "./hi";
import bn from "./bn";
import te from "./te";
import ta from "./ta";
import mr from "./mr";
import gu from "./gu";
import kn from "./kn";
import ml from "./ml";
import or from "./or";
import pa from "./pa";
import as from "./as";
import ur from "./ur";
import sa from "./sa";
export const translations = {
  en,
  hi,
  bn,
  te,
  ta,
  mr,
  gu,
  kn,
  ml,
  or,
  pa,
  as,
  ur,
  sa,
};
export const nativeFestival = (name, lang = "en") =>
  divineNames[lang]?.[name] || translations[lang]?.festivals[name] || name;
export function localizedCopy(festival, language = "en", amount = 40) {
  const t = translations[language] || en;
  const name = nativeFestival(festival, language);
  if (festival === "Pitru Paksha" || festival.includes("Shraddha"))
    return {
      language,
      offer: quietWishes[language] || quietWishes.en,
      discount: "",
      tagline: name,
      cta: "",
      greeting: quietWishes[language] || quietWishes.en,
    };
  return {
    language,
    offer: divinePresets[festival] ? name : `${name} ${t.offer}`,
    discount: t.discount.replace("{n}", String(amount)),
    tagline: t.tagline,
    cta: t.cta,
    greeting: t.greetingPattern
      ? t.greetingPattern.replace("{name}", name)
      : language === "en"
        ? `${t.greeting} · ${name}`
        : `${name} ${t.greeting}`,
  };
}
export const fontScripts = {
  hi: "Devanagari",
  mr: "Devanagari",
  sa: "Devanagari",
  bn: "Bengali",
  as: "Bengali",
  te: "Telugu",
  ta: "Tamil",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  or: "Oriya",
  pa: "Gurmukhi",
  ur: "Arabic",
};
const loaded = {};
const scriptTests = {
  Devanagari: /[\u0900-\u097f]/,
  Bengali: /[\u0980-\u09ff]/,
  Telugu: /[\u0c00-\u0c7f]/,
  Tamil: /[\u0b80-\u0bff]/,
  Gujarati: /[\u0a80-\u0aff]/,
  Kannada: /[\u0c80-\u0cff]/,
  Malayalam: /[\u0d00-\u0d7f]/,
  Oriya: /[\u0b00-\u0b7f]/,
  Gurmukhi: /[\u0a00-\u0a7f]/,
  Arabic: /[\u0600-\u06ff]/,
};
export function ensurePosterFont(language, text = "") {
  const scripts = new Set(
    [
      fontScripts[language],
      ...Object.keys(scriptTests).filter((key) => scriptTests[key].test(text)),
    ].filter(Boolean),
  );
  return Promise.all(
    [...scripts].map(
      (script) =>
        (loaded[script] ??= document.fonts
          .load(`500 28px "Festivo${script}"`)
          .then((fonts) => {
            if (!fonts.length)
              throw new Error(
                "The local language font could not load. Please reload before downloading.",
              );
          })
          .catch((e) => {
            delete loaded[script];
            throw e;
          })),
    ),
  ).then(() => undefined);
}
