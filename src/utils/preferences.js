import { states, languages } from "../data/regions";
import { businesses } from "../data/templates";
export const PREF_KEY = "festivo3d-preferences-v2";
export const emptyPreferences = {
  state: "",
  language: "en",
  businessCategory: "Clothing",
  setupCompleted: false,
};
export function readLocal(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function loadPreferences() {
  const p = readLocal(PREF_KEY, {});
  return {
    ...emptyPreferences,
    state: states.some((s) => s.name === p.state) ? p.state : "",
    language: languages.some((l) => l.code === p.language) ? p.language : "en",
    businessCategory: businesses.includes(p.businessCategory)
      ? p.businessCategory
      : "Clothing",
    setupCompleted:
      !!p.setupCompleted && states.some((s) => s.name === p.state),
  };
}
export function removeLocal(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}
