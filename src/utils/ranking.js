import { festivalCatalogue } from "../data/festivalCatalogue";
import { regionalFestivals } from "../data/regions";
import { translations } from "../i18n";
export function rankTemplates(list, p, recent, occasion = "") {
  return [...list].sort((a, b) => score(b) - score(a));
  function score(t) {
    return (
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
