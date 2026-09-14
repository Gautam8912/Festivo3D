import React from "react";
import { MapPin, Languages, LocateFixed } from "lucide-react";
import { states, languages } from "../data/regions";
import { clustersForState } from "../data/targeting";
import { useStudio } from "../hooks/StudioContext";
export default function TargetingBar() {
  const { preferences: p, updateTargeting } = useStudio();
  return (
    <div className="targeting-bar">
      <div className="country-cell">
        <span>COUNTRY</span>
        <strong>🇮🇳 India</strong>
      </div>
      <label>
        <span>
          <MapPin size={12} /> STATE / UT
        </span>
        <select
          aria-label="Calendar state"
          value={p.state}
          onChange={(e) =>
            updateTargeting({
              state: e.target.value,
              cluster: "",
              language:
                states.find((s) => s.name === e.target.value)?.language ||
                p.language,
            })
          }
        >
          <option value="">All India</option>
          {states.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <LocateFixed size={12} /> REGIONAL CLUSTER
        </span>
        <select
          aria-label="Regional cluster"
          disabled={!p.state}
          value={p.cluster || ""}
          onChange={(e) => updateTargeting({ cluster: e.target.value })}
        >
          <option value="">Whole state</option>
          {clustersForState(p.state).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <Languages size={12} /> POSTER LANGUAGE
        </span>
        <select
          aria-label="Calendar language"
          value={p.language}
          onChange={(e) => updateTargeting({ language: e.target.value })}
        >
          {languages.map((l) => (
            <option value={l.code} key={l.code}>
              {l.name} · {l.native}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
