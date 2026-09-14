import React, { useMemo } from "react";
import { Heart, ArrowUpRight } from "lucide-react";
import { defaults, templatePalette } from "../data/templates";
import { localizedCopy } from "../i18n";
import { useStudio } from "../hooks/StudioContext";
import { languageName } from "../data/regions";
import PosterCanvas from "./PosterCanvas";
export function useTemplateData(t) {
  const { data, preferences: p } = useStudio();
  return useMemo(
    () => ({
      ...defaults,
      ...data,
      ...localizedCopy(t.festival, p.language, 40),
      template: t.id,
      eventDate: t.calendarDate || "",
      artFinish: t.artFinish || "sculpted",
      designStyle: "royal",
      colors: templatePalette(t),
      size: "Instagram Post",
      business: data.business || "Your Business",
      fontSize: 76,
    }),
    [t, data, p.language],
  );
}
export default function TemplateCard({ template: t, onPreview, recommended }) {
  const { preferences: p, favourites, toggleFavourite } = useStudio();
  const data = useTemplateData(t);
  return (
    <article className="large-template-card">
      <button
        className="template-art"
        aria-label={`Preview ${t.festival} template`}
        onClick={() => onPreview(t)}
      >
        <PosterCanvas data={data} />
        <span className="free-tag">FREE</span>
        {recommended && <span className="popular-tag">✦ Recommended</span>}
        <span className="card-use">
          Take a closer look <ArrowUpRight size={17} />
        </span>
      </button>
      <div className="template-description">
        <div>
          <h3>{t.title}</h3>
          <p>
            {t.festival} · {languageName(p.language)} · {p.businessCategory}
          </p>
        </div>
        <button
          className={
            "favourite-button " +
            (favourites.includes(t.id) ? "is-favourite" : "")
          }
          aria-label={`${favourites.includes(t.id) ? "Unfavourite" : "Favourite"} ${t.festival}`}
          aria-pressed={favourites.includes(t.id)}
          onClick={() => toggleFavourite(t.id)}
        >
          <Heart
            size={19}
            fill={favourites.includes(t.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
    </article>
  );
}
