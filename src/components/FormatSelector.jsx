import React from "react";
import { sizes, outputSize } from "../data/templates";
export default function FormatSelector({ data, onChange }) {
  const [w, h] = outputSize(data);
  return (
    <>
      <label className="field">
        Poster size
        <select
          value={data.size}
          onChange={(e) => onChange("size", e.target.value)}
        >
          {Object.keys(sizes).map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </label>
      {data.size === "Custom" && (
        <>
          <div className="form-pair">
            <label className="field">
              Width (px)
              <input
                type="number"
                min="320"
                max="2400"
                step="1"
                value={data.customWidth}
                onChange={(e) =>
                  onChange("customWidth", Math.round(Number(e.target.value)))
                }
                onBlur={() => onChange("customWidth", w)}
              />
            </label>
            <label className="field">
              Height (px)
              <input
                type="number"
                min="320"
                max="2400"
                step="1"
                value={data.customHeight}
                onChange={(e) =>
                  onChange("customHeight", Math.round(Number(e.target.value)))
                }
                onBlur={() => onChange("customHeight", h)}
              />
            </label>
          </div>
          <p className="setup-note">
            320–2400 px per side. Actual export: {w} × {h}.
          </p>
        </>
      )}
    </>
  );
}
