import React from "react";
import { Check } from "lucide-react";
import { palettes } from "../data/templates";
export default function ColorPicker({ colors, onChange }) {
  return (
    <>
      <div className="palette-grid">
        {[...palettes.slice(6), ...palettes.slice(0, 6)].map((p) => (
          <button
            key={p.name}
            title={p.name}
            className={"palette " + (colors.bg === p.bg ? "chosen" : "")}
            onClick={() => onChange({ ...p })}
          >
            <span
              style={{
                background: `linear-gradient(120deg,${p.bg} 50%,${p.badge} 50%)`,
              }}
            >
              {colors.bg === p.bg && <Check size={17} />}
            </span>
            {p.name}
          </button>
        ))}
      </div>
      <div className="color-inputs">
        {[
          ["bg", "Background"],
          ["heading", "Heading"],
          ["badge", "Offer badge"],
          ["button", "Contact bar"],
          ["text", "Body text"],
          ["border", "Border & details"],
        ].map(([key, label]) => (
          <label key={key}>
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => onChange({ ...colors, [key]: e.target.value })}
            />
            {label}
            <span>{colors[key]}</span>
          </label>
        ))}
      </div>
    </>
  );
}
