import React from "react";
export default function LayoutControls({ data, update }) {
  return (
    <div className="layout-controls">
      <h3 className="control-subheading">Layout & finishing</h3>
      {[
        ["padding", "Canvas padding", 15, 85],
        ["layoutSpacing", "Heading line spacing", 0, 35],
        ["radius", "Card corner radius", 0, 45],
      ].map(([key, name, min, max]) => (
        <label className="field" key={key}>
          {name}
          <span className="range-value">{data[key]}px</span>
          <input
            type="range"
            min={min}
            max={max}
            value={data[key]}
            onChange={(e) => update(key, +e.target.value)}
          />
        </label>
      ))}
      {[
        ["showBorder", "Show border"],
        ["showDecorations", "Festival decorations"],
        ["shadow", "Photo shadow"],
      ].map(([key, label]) => (
        <label className="check-field" key={key}>
          <input
            type="checkbox"
            checked={data[key]}
            onChange={(e) => update(key, e.target.checked)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
