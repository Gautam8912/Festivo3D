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

import { septemberRecords, calendarSources } from "./septemberObservances";
export { calendarSources };
export const september2026 = septemberRecords.map((record) => ({
  ...record,
  supportedStates:
    record.states === "all" ? states.map((s) => s.name) : record.states,
  panIndia: record.states === "all",
  languages: languages.map((l) => l.code),
  regionalClusters: record.clusters || [],
  categories: record.recommendedCategories || businesses,
  phrases: Object.fromEntries(
    languages.map((l) => [l.code, localizedCopy(record.name, l.code)]),
  ),
  presets: templates.filter((t) => t.festival === record.name).map((t) => t.id),
}));
export const calendarInfo = {
  month: 9,
  year: 2026,
  timeZone: "Asia/Kolkata",
  scope:
    "Major Hindu and regional observances, vrats, remembrance days and selected civil/Jain occasions.",
  checkedOn: "2026-09-14",
  note: "Reference civil dates for India—not a location-specific panchang or muhurat calculator. Regional, sectarian and family traditions may differ. Confirm ritual timings locally.",
};
