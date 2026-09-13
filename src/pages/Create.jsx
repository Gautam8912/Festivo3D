import React, { useState, useMemo } from "react";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Check,
  SlidersHorizontal,
  WandSparkles,
} from "lucide-react";
import {
  templates,
  festivals,
  businesses,
  defaults,
  templatePalette,
} from "../data/templates";
import { useStudio } from "../hooks/StudioContext";
import { languageName, regionalFestivals } from "../data/regions";
import { localizedCopy } from "../i18n";
import { parseBrief } from "../utils/briefParser";
import PosterCanvas from "../components/PosterCanvas";
export default function Create() {
  const {
    data,
    preferences: p,
    selectTemplate,
    openPreferences,
    notify,
  } = useStudio();
  const [occasion, setOccasion] = useState(
      templates.find((t) => t.id === data.template)?.festival || "Diwali",
    ),
    [category, setCategory] = useState(p.businessCategory),
    [amount, setAmount] = useState(40),
    [business, setBusiness] = useState(data.business),
    [size, setSize] = useState("Instagram Post"),
    [brief, setBrief] = useState(""),
    [parsed, setParsed] = useState(null);
  const t = templates.find((t) => t.festival === occasion) || templates[0];
  const preview = useMemo(
    () => ({
      ...defaults,
      ...data,
      ...localizedCopy(occasion, p.language, amount),
      business,
      template: t.id,
      colors: templatePalette(t),
      size,
    }),
    [occasion, p.language, amount, business, t, size, data],
  );
  function inspect() {
    if (!brief.trim()) {
      notify("Describe an occasion, business type or discount first.", "error");
      return;
    }
    setParsed(parseBrief(brief));
  }
  function apply() {
    if (parsed.occasion) setOccasion(parsed.occasion);
    if (parsed.businessCategory) setCategory(parsed.businessCategory);
    if (parsed.amount !== undefined) setAmount(parsed.amount);
    if (parsed.format) setSize(parsed.format);
    notify("Recognized details applied. Check the fields before continuing.");
  }
  function create() {
    if (!business.trim()) {
      notify("Please enter your business name.", "error");
      return;
    }
    selectTemplate(t.id, {
      business,
      businessCategory: category,
      ...localizedCopy(occasion, p.language, amount),
      size,
    });
  }
  return (
    <main className="create-page section">
      <a className="back-link" href="#templates">
        ← Explore templates instead
      </a>
      <div className="create-heading">
        <div className="eyebrow">CHOOSE. PERSONALIZE. CELEBRATE.</div>
        <h1>
          Your next poster starts{" "}
          <span className="gradient-text">right here.</span>
        </h1>
        <p>
          A few details. A complete, editable design. No design skills needed.
        </p>
      </div>
      <div className="create-layout">
        <div className="create-controls">
          <div className="create-local">
            <MapPin size={18} />
            <span>
              {p.state || "Across India"} · {languageName(p.language)}
            </span>
            <button className="text-link" onClick={openPreferences}>
              Change
            </button>
          </div>
          <div className="quick-card">
            <h2>
              <Sparkles size={20} /> Let’s make something festive.
            </h2>
            <label className="field">
              1. Choose an occasion
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                {["For your region", "All occasions"].map((group, i) => (
                  <optgroup label={group} key={group}>
                    {(i === 0
                      ? regionalFestivals[p.state] || []
                      : [
                          ...festivals,
                          ...templates
                            .filter((t) => t.category === "Business Offers")
                            .map((t) => t.festival),
                        ]
                    ).map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <div className="form-pair">
              <label className="field">
                2. Business category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {businesses.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                3. Discount percentage
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      Math.max(0, Math.min(100, Number(e.target.value))),
                    )
                  }
                />
              </label>
            </div>
            <label className="field">
              4. Business name
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Your shop or business"
                maxLength={80}
              />
            </label>
            <label className="field">
              5. Pick a format
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option>Instagram Post</option>
                <option>WhatsApp Status</option>
                <option>Portrait Social Post</option>
              </select>
            </label>
            <button className="button full" onClick={create}>
              Create & open editor <ArrowRight size={17} />
            </button>
            <p className="quick-note">
              <Check size={13} /> Add your logo and product photos in the next
              step.
            </p>
          </div>
          <details className="brief-card">
            <summary>
              <WandSparkles size={18} /> Have a brief? Let’s fill the fields.
            </summary>
            <p>
              A local, rule-based helper—not AI. Recognizes listed occasion
              names, business categories, percentages and formats. Review
              everything before applying.
            </p>
            <label className="field">
              Your brief
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="Diwali offer for my clothing shop, 20% discount, portrait"
                maxLength={500}
              />
            </label>
            <button className="button secondary" onClick={inspect}>
              Read my brief
            </button>
            {parsed && (
              <div className="parsed-brief">
                <h3>Here’s what we recognized</h3>
                <dl>
                  <dt>Occasion</dt>
                  <dd>{parsed.occasion || "Not specified"}</dd>
                  <dt>Business</dt>
                  <dd>{parsed.businessCategory || "Not specified"}</dd>
                  <dt>Discount</dt>
                  <dd>
                    {parsed.amount !== undefined
                      ? parsed.amount + "%"
                      : "Not specified"}
                  </dd>
                  <dt>Format</dt>
                  <dd>{parsed.format || "Not specified"}</dd>
                </dl>
                <button className="text-link" onClick={apply}>
                  Apply these details <ArrowRight size={14} />
                </button>
              </div>
            )}
          </details>
        </div>
        <div className="create-preview">
          <div className="preview-toolbar">
            <span>
              <span className="live-dot" /> Your starting design
            </span>
            <span>{languageName(p.language)}</span>
          </div>
          <PosterCanvas data={preview} />
          <div className="preview-bottom">
            <SlidersHorizontal size={14} /> Every detail stays editable.
          </div>
        </div>
      </div>
    </main>
  );
}
