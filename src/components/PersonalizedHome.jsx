import React from "react";
import {
  MapPin,
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useStudio } from "../hooks/StudioContext";
import { languageName, regionalFestivals } from "../data/regions";
import { templates } from "../data/templates";
import { nativeFestival } from "../i18n";
export default function PersonalizedHome() {
  const { preferences: p, openPreferences, selectTemplate } = useStudio();
  return (
    <section className="section personal-section">
      <div className="personal-banner">
        <div className="personal-heading">
          <span className="personal-map">
            <MapPin size={22} />
          </span>
          <div>
            <span className="eyebrow">
              {p.setupCompleted
                ? "WELCOME BACK. YOUR PREFERENCES ARE ACTIVE."
                : "ALL OF INDIA. A LITTLE MORE YOU."}
            </span>
            <h2>
              {p.setupCompleted ? (
                <>
                  Made for{" "}
                  <span>
                    {p.state} · {languageName(p.language)}
                  </span>
                </>
              ) : (
                <>Your state. Your language. Your celebration.</>
              )}
            </h2>
            <p>
              {p.setupCompleted
                ? `${p.businessCategory} posters, with local words and familiar celebrations.`
                : "Choose your state once. Find the festivals and language that feel like home."}
            </p>
          </div>
        </div>
        <button className="button secondary" onClick={openPreferences}>
          <SlidersHorizontal size={15} />
          {p.setupCompleted
            ? "Change State & Language"
            : "Personalize my studio"}
        </button>
      </div>
      {p.setupCompleted && (
        <div className="regional-chips">
          <span>
            <Sparkles size={14} /> Celebrations for your region
          </span>
          {(
            regionalFestivals[p.state] || [
              "Diwali",
              "Holi",
              "Eid",
              "Christmas",
              "New Year",
            ]
          )
            .slice(0, 5)
            .map((name) => (
              <button
                key={name}
                onClick={() =>
                  selectTemplate(templates.find((t) => t.festival === name).id)
                }
              >
                {nativeFestival(name, p.language)}
                <ArrowUpRight size={12} />
              </button>
            ))}
        </div>
      )}
    </section>
  );
}
