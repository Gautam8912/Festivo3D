import { festivals, templates, businesses } from "./templates";
import { states, languages, regionalFestivals } from "./regions";
import { localizedCopy } from "../i18n";
const panIndia = new Set([
  "Diwali",
  "Holi",
  "Dussehra",
  "Ganesh Chaturthi",
  "Raksha Bandhan",
  "Republic Day",
  "Independence Day",
  "Ram Navami",
  "Janmashtami",
  "Navratri",
  "Makar Sankranti",
  "Eid",
  "Christmas",
  "New Year",
]);
export const festivalCatalogue = festivals.map((name) => {
  const localStates = Object.entries(regionalFestivals)
    .filter(([, names]) => names.includes(name))
    .map(([state]) => state);
  return {
    id: name.toLowerCase().replaceAll(" ", "-"),
    name,
    supportedStates:
      panIndia.has(name) || !localStates.length
        ? states.map((s) => s.name)
        : localStates,
    languages: languages.map((l) => l.code),
    categories: businesses,
    phrases: Object.fromEntries(
      languages.map((l) => [l.code, localizedCopy(name, l.code)]),
    ),
    templates: templates.filter((t) => t.festival === name).map((t) => t.id),
  };
});
