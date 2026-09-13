import React, { useState } from "react";
import {
  MapPin,
  Languages,
  Store,
  LocateFixed,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { states, languages, languageName, suggestState } from "../data/regions";
import { businesses } from "../data/templates";
import { useStudio } from "../hooks/StudioContext";
import Modal from "./Modal";
export default function Preferences({ onClose }) {
  const { preferences, savePreferences, notify } = useStudio();
  const [draft, setDraft] = useState(preferences),
    [locating, setLocating] = useState(false),
    [locationHint, setHint] = useState("");
  function locate() {
    if (!navigator.geolocation) {
      notify(
        "Location is unavailable. Please choose your state from the list.",
        "error",
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const state = suggestState(pos.coords.latitude, pos.coords.longitude);
        if (!state) {
          setHint(
            "We couldn’t suggest an Indian state. Please choose it manually.",
          );
          return;
        }
        setDraft((d) => ({
          ...d,
          state: state.name,
          language: state.language,
        }));
        setHint(
          `Approximate suggestion: ${state.name}. This uses nearby state centres, not a boundary lookup. Please check before saving.`,
        );
      },
      () => {
        setLocating(false);
        setHint(
          "Location wasn’t available or permission was declined. You can always select your state manually.",
        );
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false },
    );
  }
  function save(e) {
    e.preventDefault();
    if (!draft.state) return;
    savePreferences({ ...draft, setupCompleted: true });
    onClose();
  }
  return (
    <Modal
      title="State and language preferences"
      onClose={onClose}
      className="preferences-modal"
    >
      <div className="modal-symbol">
        <MapPin size={29} />
      </div>
      <div className="eyebrow">ONE LITTLE SETUP. A MORE PERSONAL STUDIO.</div>
      <h2>
        Local business.
        <br />
        <span className="gradient-text">Your language.</span>
      </h2>
      <p className="modal-intro">
        Tell us a little about your business. We’ll remember, so you don’t have
        to do this again.
      </p>
      <form onSubmit={save}>
        <label className="field">
          <MapPin size={14} /> Where is your business located?
          <select
            required
            value={draft.state}
            onChange={(e) => {
              const state = states.find((s) => s.name === e.target.value);
              setDraft({
                ...draft,
                state: state?.name || "",
                language: state?.language || "en",
              });
              setHint("");
            }}
          >
            <option value="">Choose your state / UT</option>
            {states.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="locate-button"
          disabled={locating}
          onClick={locate}
        >
          <LocateFixed size={14} />
          {locating
            ? "Finding an approximate state…"
            : "Use my state automatically"}
        </button>
        {locationHint && (
          <p className="location-hint" role="status">
            {locationHint}
          </p>
        )}
        <label className="field">
          <Languages size={14} /> Which language should your posters use?
          <select
            value={draft.language}
            onChange={(e) => setDraft({ ...draft, language: e.target.value })}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} · {l.native}
                {states.find((s) => s.name === draft.state)?.language === l.code
                  ? " — State recommended"
                  : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <Store size={14} /> Your business category
          <select
            value={draft.businessCategory}
            onChange={(e) =>
              setDraft({ ...draft, businessCategory: e.target.value })
            }
          >
            {businesses.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <p className="setup-note">
          Poster phrases change language. Your business name and numbers stay
          exactly as you enter them. The studio’s controls remain in English.
        </p>
        <button className="button full" type="submit">
          Save my preferences <ArrowRight size={17} />
        </button>
      </form>
      <button className="explore-first" onClick={onClose}>
        {preferences.setupCompleted
          ? "Keep current preferences"
          : "Explore first, set up later"}
      </button>
      <div className="privacy-line">
        <ShieldCheck size={13} /> Saved only on this browser. No account needed.
      </div>
    </Modal>
  );
}
