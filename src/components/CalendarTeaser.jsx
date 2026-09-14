import React from "react";
import { ArrowRight, CalendarDays, Crown } from "lucide-react";
import { useStudio } from "../hooks/StudioContext";
import { september2026 } from "../data/festivalCatalogue";
import { templates, defaults, templatePalette } from "../data/templates";
import { localizedCopy } from "../i18n";
import PosterCanvas from "./PosterCanvas";
export default function CalendarTeaser() {
  const { preferences: p, data, updateTargeting } = useStudio();
  function open(id) {
    updateTargeting({ activeFestival: id });
    location.hash = "calendar";
  }
  return (
    <section className="section calendar-teaser">
      <div className="section-title">
        <div>
          <div className="eyebrow">THE SEPTEMBER EDIT</div>
          <h2>
            Divine beginnings.
            <span className="gold-text"> Beautiful impressions.</span>
          </h2>
          <p>
            A hand-drawn gold collection for the month’s most meaningful
            moments.
          </p>
        </div>
        <a className="text-link" href="#calendar">
          <CalendarDays size={16} /> September calendar <ArrowRight size={16} />
        </a>
      </div>
      <div className="divine-showcase">
        {["ganesh-chaturthi", "hartalika-teej", "vishwakarma-puja"].map(
          (id) => {
            const e = september2026.find((x) => x.id === id),
              t = templates.find((x) => x.id === id);
            const preview = {
              ...defaults,
              ...data,
              ...localizedCopy(e.name, p.language),
              template: t.id,
              colors: templatePalette(t),
              size: "Instagram Post",
              eventDate: e.date,
              artFinish: "sculpted",
              designStyle: "royal",
              fontSize: 80,
            };
            return (
              <button
                className="divine-showcase-card"
                key={id}
                onClick={() => open(id)}
              >
                <div className="showcase-art">
                  <PosterCanvas data={preview} />
                  <span className="showcase-date">
                    {String(e.day).padStart(2, "0")}
                    <small>SEP</small>
                  </span>
                </div>
                <div className="showcase-copy">
                  <div>
                    <span>DIVINE ATELIER · 2026</span>
                    <h3>{e.name}</h3>
                  </div>
                  <span className="showcase-arrow">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </button>
            );
          },
        )}
      </div>
      <div className="collection-note">
        <Crown size={14} /> Original Canvas artwork. Royal finishes. Free to
        make your own.
      </div>
    </section>
  );
}
