const KEY = "festivo3d-details-v1";
export function loadDetails() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
export function saveDetails(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function clearDetails() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
