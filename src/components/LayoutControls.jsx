import { artFinishes } from "../data/divinePresets";
import React from "react";
export default function LayoutControls({ data, update }) {
  return (
    <div className="layout-controls">
      <h3 className="control-subheading">The royal finish</h3>
      <label className="field">
        Design architecture
        <select
          value={data.designStyle || "royal"}
          onChange={(e) => update("designStyle", e.target.value)}
        >
          <option value="royal">Royal atelier · layered gold</option>
          <option value="classic">Original classic layout</option>
        </select>
      </label>
      <label className="field">
        Divine artwork finish
        <select
          value={data.artFinish || "sculpted"}
          onChange={(e) => update("artFinish", e.target.value)}
        >
          {artFinishes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </label>
      <label className="check-field">
        <input
          type="checkbox"
          checked={data.metallicHeading !== false}
          onChange={(e) => update("metallicHeading", e.target.checked)}
        />
        Metallic gold typography
      </label>
      <label className="field">
        Aura intensity<span className="range-value">{data.aura ?? 70}%</span>
        <input
          type="range"
          min="0"
          max="100"
          value={data.aura ?? 70}
          onChange={(e) => update("aura", +e.target.value)}
        />
      </label>
      <label className="field">
        Divine artwork size
        <span className="range-value">{data.deityScale ?? 100}%</span>
        <input
          type="range"
          min="60"
          max="120"
          value={data.deityScale ?? 100}
          onChange={(e) => update("deityScale", +e.target.value)}
        />
      </label>
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
