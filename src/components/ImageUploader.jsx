import React, { useRef, useState } from "react";
import { Upload, Trash2, ImagePlus, ChevronDown, Lock } from "lucide-react";
import { readImage } from "../utils/imageUtils";
export default function ImageUploader({
  kind,
  label,
  value,
  onChange,
  onError,
}) {
  const fileRef = useRef();
  const [busy, setBusy] = useState(false),
    [expanded, setExpanded] = useState(false);
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const image = await readImage(file);
      onChange({
        image,
        x: 0,
        y: 0,
        scale: 100,
        rotation: 0,
        zoom: 100,
        crop: "fill",
      });
      setExpanded(true);
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  return (
    <div className="image-uploader">
      <input
        ref={fileRef}
        type="file"
        aria-label={`Upload ${label}`}
        accept="image/jpeg,image/png,image/webp"
        onChange={upload}
        className="file-input"
        id={"upload-" + kind}
      />
      <div className="upload-heading">
        <strong>{label}</strong>
        {value?.image && (
          <button
            className="icon-button danger"
            aria-label={`Remove ${label}`}
            onClick={() => onChange(null)}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
      <button
        className={"upload-zone " + (value?.image ? "has-image" : "")}
        onClick={() => fileRef.current.click()}
        disabled={busy}
      >
        {value?.image ? (
          <img src={value.image.src} alt={`Uploaded ${label}`} />
        ) : (
          <ImagePlus size={24} />
        )}
        <span>
          {busy
            ? "Preparing your image…"
            : value?.image
              ? "Replace image"
              : "Click to upload"}
          <small>JPG, PNG, WEBP · up to 20 MB</small>
        </span>
        <Upload size={16} />
      </button>
      {value?.image && (
        <>
          <button
            className="image-settings-toggle"
            onClick={() => setExpanded(!expanded)}
          >
            Adjust image <ChevronDown size={14} />
          </button>
          {expanded && (
            <div className="image-adjustments">
              {[
                ["scale", "Size", 20, 200],
                ["x", "Move left / right", -150, 150],
                ["y", "Move up / down", -150, 150],
                ["rotation", "Rotate", -180, 180],
                ["zoom", "Zoom / crop", 100, 300],
              ].map(([key, text, min, max]) => (
                <label key={key}>
                  {text}
                  <span>
                    {value[key]}
                    {key === "rotation"
                      ? "°"
                      : key === "scale" || key === "zoom"
                        ? "%"
                        : ""}
                  </span>
                  <input
                    aria-label={`${label} ${text}`}
                    type="range"
                    min={min}
                    max={max}
                    value={value[key]}
                    onChange={(e) =>
                      onChange({ ...value, [key]: Number(e.target.value) })
                    }
                  />
                </label>
              ))}
              <label>
                Photo framing
                <select
                  value={value.crop}
                  onChange={(e) => onChange({ ...value, crop: e.target.value })}
                >
                  <option value="fill">Fill frame (crop edges)</option>
                  <option value="fit">Fit whole photo</option>
                </select>
              </label>
              <button
                className="text-link"
                onClick={() =>
                  onChange({
                    ...value,
                    x: 0,
                    y: 0,
                    scale: 100,
                    zoom: 100,
                    rotation: 0,
                    crop: "fill",
                  })
                }
              >
                Reset adjustments
              </button>
            </div>
          )}
        </>
      )}
      <p className="upload-privacy">
        <Lock size={11} /> Your photo stays on your device.
      </p>
    </div>
  );
}
