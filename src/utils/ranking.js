import { eventRelevance, indiaToday } from "./calendarEngine";
import { september2026 } from "../data/festivalCatalogue";
import { festivalCatalogue } from "../data/festivalCatalogue";
import { regionalFestivals } from "../data/regions";
import { translations } from "../i18n";
export function rankTemplates(list, p, recent, occasion = "") {
  const today = indiaToday();
  return [...list].sort((a, b) => score(b) - score(a));
  function score(t) {
    const event = september2026.find((e) => e.name === t.festival);
    return (
      (event && p.activeFestival === event.id ? 24 : 0) +
      (event ? eventRelevance(event, p) : 0) +
      (event &&
      event.date >= today &&
      event.date.slice(0, 7) === today.slice(0, 7)
        ? 12
        : 0) +
      ((regionalFestivals[p.state] || []).includes(t.festival) ? 40 : 0) +
      (t.festival === occasion ? 60 : 0) +
      (t.businessCategories.includes(p.businessCategory)
        ? t.businessCategories.length <= 3
          ? 18
          : 8
        : 0) +
      (translations[p.language]?.festivals[t.festival] ? 6 : 0) +
      (recent.includes(t.id) ? Math.max(1, 12 - recent.indexOf(t.id)) : 0) +
      (festivalCatalogue
        .find((f) => f.name === t.festival)
        ?.languages.includes(p.language)
        ? 2
        : 0)
    );
  }
}
