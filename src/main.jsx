import { validCluster } from "./data/targeting";
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TemplateGallery from "./components/TemplateGallery";
import Preferences from "./components/Preferences";
import Create from "./pages/Create";
import { StudioContext } from "./hooks/StudioContext";
import { defaults, templatePalette, templates, sizes } from "./data/templates";
import { loadDetails, saveDetails, clearDetails } from "./utils/storage";
import {
  PREF_KEY,
  emptyPreferences,
  loadPreferences,
  writeLocal,
  readLocal,
  removeLocal,
} from "./utils/preferences";
import { localizedCopy } from "./i18n";
import "./styles.css";
import "./styles/fonts.css";
import "./styles/studio.css";
import "./styles/royal.css";
const PosterEditor = lazy(() => import("./components/PosterEditor"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Preview = lazy(() => import("./pages/Preview"));
function initial() {
  const saved = loadDetails();
  if (!saved || typeof saved !== "object") return { ...defaults };
  const d = {
    ...defaults,
    ...saved,
    colors: { ...defaults.colors, ...saved.colors },
  };
  for (const key of [
    "business",
    "phone",
    "offer",
    "discount",
    "address",
    "website",
    "ownerName",
    "whatsapp",
    "instagram",
    "facebook",
    "city",
    "cta",
    "greeting",
    "tagline",
  ])
    if (typeof d[key] !== "string") d[key] = defaults[key] || "";
  if (!templates.some((t) => t.id === d.template)) d.template = "diwali";
  if (!sizes[d.size]) d.size = "Instagram Post";
  return d;
}
const routeName = () => location.hash.slice(1).replace(/^\//, "") || "home";
function App() {
  const [route, setRoute] = useState(routeName),
    [data, setData] = useState(initial),
    [toast, setToast] = useState(null),
    [preferences, setPreferences] = useState(loadPreferences),
    [prefsOpen, setPrefsOpen] = useState(
      () => !loadPreferences().setupCompleted,
    ),
    [images, setImages] = useState({}),
    [saveStatus, setSaveStatus] = useState("saved"),
    [favourites, setFavourites] = useState(() => {
      const a = readLocal("festivo3d-favourites", []);
      return Array.isArray(a) ? a : [];
    }),
    [recent, setRecent] = useState(() => {
      const a = readLocal("festivo3d-recent", []);
      return Array.isArray(a) ? a : [];
    });
  const timer = useRef(),
    skipSave = useRef(false);
  function notify(message, type = "success") {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 6500);
  }
  useEffect(() => {
    const change = () => setRoute(routeName());
    window.addEventListener("hashchange", change);
    return () => {
      window.removeEventListener("hashchange", change);
      clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (["features", "how-it-works", "privacy"].includes(route))
      requestAnimationFrame(() =>
        document.getElementById(route)?.scrollIntoView({ behavior: "smooth" }),
      );
    else window.scrollTo(0, 0);
  }, [route]);
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      setSaveStatus("cleared");
      return;
    }
    setSaveStatus("saving");
    const id = setTimeout(() => {
      const saved = saveDetails(data);
      setSaveStatus(saved ? "saved" : "error");
      if (!saved)
        notify(
          "Your browser can’t save details. Editing and downloads still work.",
          "error",
        );
    }, 200);
    return () => clearTimeout(id);
  }, [data]);
  function updateTargeting(patch) {
    const next = { ...preferences, ...patch, country: "India" };
    next.cluster = validCluster(next.state, next.cluster);
    next.setupCompleted = !!next.state;
    setPreferences(next);
    if (!writeLocal(PREF_KEY, next))
      notify(
        "Your targeting is active for this visit but could not be saved.",
        "error",
      );
  }
  function savePreferences(p) {
    setPreferences(p);
    const t = templates.find((t) => t.id === data.template) || templates[0];
    setData((d) => ({
      ...d,
      ...(d.language !== p.language
        ? localizedCopy(
            t.festival,
            p.language,
            Number(d.discount.match(/\d+/)?.[0] || 40),
          )
        : {}),
      businessCategory: p.businessCategory,
    }));
    if (!writeLocal(PREF_KEY, p))
      notify(
        "Preferences are active for this visit, but your browser blocked saving them.",
        "error",
      );
    else notify("Preferences saved. Your next visit will feel right at home.");
  }
  function remember(id, category) {
    const t = templates.find((t) => t.id === id);
    const next = {
      ...preferences,
      businessCategory: category || preferences.businessCategory,
      ...(t?.calendarDate
        ? {
            activeFestival: t.festival.toLowerCase().replaceAll(" ", "-"),
            activePreset: id,
          }
        : {}),
    };
    setPreferences(next);
    if (!writeLocal(PREF_KEY, next))
      notify(
        "Your template is active but its preferences could not be saved.",
        "error",
      );
    const r = [id, ...recent.filter((x) => x !== id)].slice(0, 18);
    setRecent(r);
    if (!writeLocal("festivo3d-recent", r))
      notify("Could not save recent templates on this device.", "error");
  }
  function selectTemplate(id, overrides = {}) {
    const t = templates.find((t) => t.id === id);
    if (!t) return;
    setData((d) => ({
      ...d,
      ...localizedCopy(
        t.festival,
        preferences.language,
        Number(d.discount.match(/\d+/)?.[0] || 40),
      ),
      template: id,
      eventDate: t.calendarDate || "",
      artFinish: t.artFinish || "sculpted",
      designStyle: "royal",
      colors: d.keepColours ? d.colors : templatePalette(t),
      businessCategory: preferences.businessCategory,
      ...overrides,
    }));
    remember(id, overrides.businessCategory);
    location.hash = "editor";
  }
  function toggleFavourite(id) {
    const next = favourites.includes(id)
      ? favourites.filter((x) => x !== id)
      : [id, ...favourites];
    setFavourites(next);
    if (!writeLocal("festivo3d-favourites", next))
      notify(
        "Favourites are available for this visit, but couldn’t be saved.",
        "error",
      );
  }
  function clear() {
    clearDetails();
    for (const key of [PREF_KEY, "festivo3d-favourites", "festivo3d-recent"])
      removeLocal(key);
    skipSave.current = true;
    setData({ ...defaults, business: "", phone: "", address: "", website: "" });
    setPreferences({ ...emptyPreferences });
    setImages({});
    setFavourites([]);
    setRecent([]);
  }
  const value = {
    data,
    setData,
    images,
    setImages,
    preferences,
    savePreferences,
    updateTargeting,
    openPreferences: () => setPrefsOpen(true),
    notify,
    selectTemplate,
    favourites,
    toggleFavourite,
    recent,
    remember,
    clearSaved: clear,
    saveStatus,
  };
  return (
    <StudioContext.Provider value={value}>
      <Navbar page={route} />
      <Suspense
        fallback={
          <div className="route-loading" role="status">
            Opening your poster studio…
          </div>
        }
      >
        {route === "editor" ? (
          <PosterEditor
            data={data}
            setData={setData}
            clearSaved={clear}
            notify={notify}
          />
        ) : route === "preview" ? (
          <Preview />
        ) : route === "calendar" ? (
          <Calendar />
        ) : route === "create" ? (
          <Create />
        ) : route === "templates" ? (
          <main>
            <div className="gallery-page-heading section">
              <span className="hero-pill">
                <span /> EVERY REGION. EVERY CELEBRATION.
              </span>
              <h1>
                A little inspiration.
                <br />
                <span className="gradient-text">
                  A whole lot of celebration.
                </span>
              </h1>
              <p>
                Big previews. Local words. Beautiful designs for the business
                you’re building.
              </p>
            </div>
            <TemplateGallery full onSelect={selectTemplate} />
          </main>
        ) : (
          <main>
            <Home onSelect={selectTemplate} />
          </main>
        )}
      </Suspense>
      <Footer />
      {prefsOpen && <Preferences onClose={() => setPrefsOpen(false)} />}
      {toast && (
        <div
          className={"toast " + toast.type}
          role={toast.type === "error" ? "alert" : "status"}
        >
          {toast.type === "error" ? (
            <AlertCircle size={20} />
          ) : (
            <CheckCircle2 size={20} />
          )}
          <span>{toast.message}</span>
          <button
            className="icon-button"
            aria-label="Dismiss message"
            onClick={() => setToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </StudioContext.Provider>
  );
}
createRoot(document.getElementById("root")).render(<App />);
