import React from "react";
import { ArrowRight, Heart, Check, MapPin } from "lucide-react";
import Modal from "./Modal";
import PosterCanvas from "./PosterCanvas";
import { useTemplateData } from "./TemplateCard";
import { useStudio } from "../hooks/StudioContext";
import { languageName } from "../data/regions";
export default function TemplatePreview({ template: t, onClose, onSelect }) {
  const { preferences: p, favourites, toggleFavourite } = useStudio();
  const data = useTemplateData(t);
  return (
    <Modal
      title={`${t.festival} template preview`}
      onClose={onClose}
      className="template-preview-modal"
    >
      <div className="large-preview-art">
        <PosterCanvas data={data} />
      </div>
      <div className="large-preview-details">
        <span className="eyebrow">YOUR NEXT GREAT PROMOTION</span>
        <h2>{t.title}</h2>
        <p>
          {t.festival} · {languageName(p.language)} · {p.businessCategory}
        </p>
        <span className="preview-region">
          <MapPin size={14} />
          {p.state || "Across India"}
        </span>
        <div className="preview-benefits">
          <span>
            <Check size={14} />
            Fully editable
          </span>
          <span>
            <Check size={14} />
            Free HD download
          </span>
          <span>
            <Check size={14} />
            Photos stay local
          </span>
        </div>
        <div className="template-preview-actions">
          <button className="button" onClick={() => onSelect(t.id)}>
            Use This Template <ArrowRight size={17} />
          </button>
          <button className="button secondary" onClick={() => onSelect(t.id)}>
            Edit
          </button>
          <button
            className="icon-button"
            aria-label="Toggle preview favourite"
            aria-pressed={favourites.includes(t.id)}
            onClick={() => toggleFavourite(t.id)}
          >
            <Heart
              size={19}
              fill={favourites.includes(t.id) ? "currentColor" : "none"}
            />
          </button>
        </div>
        <small>
          Preview uses your saved business details. You can change everything in
          the editor.
        </small>
      </div>
    </Modal>
  );
}
