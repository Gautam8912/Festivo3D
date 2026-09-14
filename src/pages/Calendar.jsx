import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ArrowRight,
  Search,
  Download,
  Check,
  Info,
  Sparkles,
  List,
  Grid3X3,
  Crown,
} from "lucide-react";
import {
  september2026,
  calendarInfo,
  calendarSources,
} from "../data/festivalCatalogue";
import { templates, defaults, templatePalette } from "../data/templates";
import { languageName } from "../data/regions";
import { deityNames } from "../data/divinePresets";
import {
  filterCalendar,
  indiaToday,
  eventStatus,
  downloadCalendar,
  eventRelevance,
} from "../utils/calendarEngine";
import { localizedCopy } from "../i18n";
import { useStudio } from "../hooks/StudioContext";
import TargetingBar from "../components/TargetingBar";
import PosterCanvas from "../components/PosterCanvas";
export default function Calendar() {
  const {
    preferences: p,
    updateTargeting,
    data,
    selectTemplate,
    notify,
  } = useStudio();
  const [day, setDay] = useState(null),
    [regionOnly, setRegionOnly] = useState(false),
    [featuredOnly, setFeaturedOnly] = useState(false),
    [query, setQuery] = useState(""),
    [view, setView] = useState("calendar"),
    [selected, setSelected] = useState(p.activeFestival || "ganesh-chaturthi"),
    [preset, setPreset] = useState(p.activePreset || "");
  const today = indiaToday();
  const monthEvents = useMemo(
    () => filterCalendar({ ...p, regionOnly, featuredOnly, query }),
    [p, regionOnly, featuredOnly, query],
  );
  const events = useMemo(
    () => monthEvents.filter((e) => !day || e.day === day),
    [monthEvents, day],
  );
  const active =
    events.find((e) => e.id === selected) ||
    events.find((e) => e.featured && e.date >= today) ||
    events.find((e) => e.featured) ||
    events[0];
  const variants = active
    ? templates.filter((t) => active.presets.includes(t.id))
    : [];
  const t = variants.find((t) => t.id === preset) || variants[0];
  const preview = useMemo(
    () =>
      t
        ? {
            ...defaults,
            ...data,
            ...localizedCopy(active.name, p.language, 40),
            template: t.id,
            artFinish: t.artFinish || "sculpted",
            colors: templatePalette(t),
            eventDate: active.date,
            size: "Instagram Post",
            designStyle: "royal",
            fontSize: 80,
          }
        : null,
    [t, data, active, p.language],
  );
  function choose(event) {
    setSelected(event.id);
    setPreset("");
    updateTargeting({ activeFestival: event.id });
  }
  function chooseDay(n) {
    setDay(n);
    const first = monthEvents.find((e) => e.day === n);
    if (first) choose(first);
  }
  function reset() {
    setDay(null);
    setRegionOnly(false);
    setFeaturedOnly(false);
    setQuery("");
  }
  return (
    <main className="calendar-page section">
      <div className="calendar-heading">
        <div>
          <div className="eyebrow">
            <span className="gold-line" /> THE SEPTEMBER EDIT · 2026
          </div>
          <h1>
            A month of devotion.
            <br />
            <span className="gold-text">A calendar of possibilities.</span>
          </h1>
          <p>
            Find the moment. Choose your region. Create something extraordinary.
          </p>
        </div>
        <div className="calendar-month-badge">
          <CalendarDays size={24} />
          <span>
            <strong>SEPTEMBER</strong>
            <small>2026 · INDIA</small>
          </span>
        </div>
      </div>
      <TargetingBar />
      <p className="targeting-memory">
        <Check size={12} /> Your region and language are remembered. Your
        current poster changes only when you choose a preset.
      </p>
      <div className="calendar-workspace">
        <section className="calendar-browser">
          <div className="calendar-filterbar">
            <div className="calendar-search">
              <Search size={15} />
              <input
                aria-label="Search September observances"
                placeholder="Search a festival or observance…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDay(null);
                }}
              />
            </div>
            <div className="calendar-view-tabs">
              <button
                aria-label="Calendar grid view"
                aria-pressed={view === "calendar"}
                className={view === "calendar" ? "active" : ""}
                onClick={() => setView("calendar")}
              >
                <Grid3X3 size={17} />
              </button>
              <button
                aria-label="Calendar list view"
                aria-pressed={view === "list"}
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
              >
                <List size={17} />
              </button>
            </div>
          </div>
          <div className="calendar-options">
            <label>
              <input
                type="checkbox"
                checked={regionOnly}
                onChange={(e) => setRegionOnly(e.target.checked)}
              />{" "}
              My region only
            </label>
            <label>
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
              />{" "}
              Major highlights
            </label>
            <button onClick={reset}>Reset filters</button>
          </div>
          {view === "calendar" && (
            <div className="month-grid-wrap">
              <div className="month-grid-title">
                <h2>September 2026</h2>
                <button
                  onClick={() => setDay(null)}
                  className={!day ? "active" : ""}
                >
                  Full month
                </button>
              </div>
              <div
                className="month-grid"
                role="group"
                aria-label="September 2026 days"
              >
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                  <span className="weekday" key={d}>
                    {d}
                  </span>
                ))}
                <span className="empty-day" />
                {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
                  const es = monthEvents.filter((e) => e.day === n),
                    date = `2026-09-${String(n).padStart(2, "0")}`;
                  return (
                    <button
                      key={n}
                      aria-label={`September ${n}, 2026 · ${es.length} observances`}
                      aria-pressed={day === n}
                      className={
                        "month-day " +
                        (day === n ? "selected " : "") +
                        (date === today ? "today " : "") +
                        (es.some((e) => e.featured) ? "major " : "")
                      }
                      onClick={() => chooseDay(n)}
                    >
                      <span>{n}</span>
                      {es.length > 0 && (
                        <i
                          className={
                            es.some((e) => e.kind === "Remembrance")
                              ? "quiet"
                              : ""
                          }
                        />
                      )}
                      <small>
                        {es.length > 1
                          ? es.length + " events"
                          : es.length
                            ? "1 event"
                            : ""}
                      </small>
                    </button>
                  );
                })}
              </div>
              <div className="calendar-legend">
                <span>
                  <i />
                  Festival / observance
                </span>
                <span>
                  <i className="quiet" />
                  Remembrance
                </span>
                <span>IST · civil dates</span>
              </div>
            </div>
          )}
          <div className="event-list-heading">
            <h3>{day ? `${day} September` : "The month’s observances"}</h3>
            <span>
              {events.length} {events.length === 1 ? "occasion" : "occasions"}
            </span>
          </div>
          <div className="event-list">
            {events.map((e) => (
              <button
                className={
                  "calendar-event " + (active?.id === e.id ? "selected" : "")
                }
                key={e.id}
                onClick={() => choose(e)}
              >
                <span
                  className={
                    "event-date " + (e.kind === "Remembrance" ? "quiet" : "")
                  }
                >
                  <strong>{String(e.day).padStart(2, "0")}</strong>
                  <small>SEP</small>
                </span>
                <span className="event-name">
                  <strong>{e.name}</strong>
                  <small>
                    {e.kind}
                    {e.featured ? " · September highlight" : ""}
                    {e.regionalClusters.includes(p.cluster)
                      ? " · Your cluster"
                      : ""}
                  </small>
                </span>
                <ArrowRight size={15} />
              </button>
            ))}
            {!events.length && (
              <div className="calendar-empty">
                <CalendarDays size={26} />
                <h3>No listed observances for this selection.</h3>
                <p>Try another day or show the full reference month.</p>
                <button className="button secondary" onClick={reset}>
                  Show the full month
                </button>
              </div>
            )}
          </div>
          <button
            className="calendar-download"
            onClick={() => {
              try {
                downloadCalendar(events);
                notify(
                  "Calendar downloaded as an ICS file. Import it into your calendar app.",
                );
              } catch {
                notify(
                  "Could not export the calendar. Please try again.",
                  "error",
                );
              }
            }}
            disabled={!events.length}
          >
            <Download size={15} /> Download selected calendar (.ics)
          </button>
        </section>
        <aside className="calendar-detail">
          {active && t ? (
            <>
              <div className="event-detail-top">
                <span className="eyebrow">
                  {active.kind === "Remembrance"
                    ? "A QUIET, RESPECTFUL TRIBUTE"
                    : "FROM THE DIVINE ATELIER"}
                </span>
                <span className="event-status">
                  {eventStatus(active, today)}
                </span>
              </div>
              <h2>{active.name}</h2>
              <p className="detail-date">
                {new Intl.DateTimeFormat("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                }).format(new Date(active.date + "T12:00:00Z"))}{" "}
                · {languageName(p.language)}
              </p>
              <div className="calendar-poster">
                <PosterCanvas data={preview} />
              </div>
              <p className="event-description">{active.description}</p>
              {active.note && (
                <p className="event-note">
                  <Info size={14} />
                  {active.note}
                </p>
              )}
              <div className="event-region-tags">
                <span>India</span>
                <span>
                  {active.panIndia
                    ? "Pan-India"
                    : active.supportedStates.length + " states"}
                </span>
                {p.cluster && <span>Target: {p.cluster}</span>}
                <span>{languageName(p.language)}</span>
              </div>
              <label className="field">
                Divine template preset
                <select
                  aria-label="Divine template preset"
                  value={t.id}
                  onChange={(e) => {
                    setPreset(e.target.value);
                    updateTargeting({ activePreset: e.target.value });
                  }}
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="button full calendar-use"
                onClick={() =>
                  selectTemplate(t.id, {
                    eventDate: active.date,
                    designStyle: "royal",
                    artFinish: t.artFinish || "sculpted",
                  })
                }
              >
                <Crown size={17} /> Use this divine preset{" "}
                <ArrowRight size={17} />
              </button>
              <small className="calendar-local-note">
                Your saved business details are filled in. Every element stays
                editable.
              </small>
              <details className="regional-details">
                <summary>Regional relevance & reference notes</summary>
                <p>
                  <strong>Availability:</strong>{" "}
                  {active.panIndia
                    ? "Pan-India"
                    : active.supportedStates.join(", ")}
                </p>
                {active.priorityStates && (
                  <p>
                    <strong>Especially relevant:</strong>{" "}
                    {active.priorityStates.join(", ")}
                  </p>
                )}
                {active.regionalClusters.length > 0 && (
                  <p>
                    <strong>Featured clusters:</strong>{" "}
                    {active.regionalClusters.join(", ")}
                  </p>
                )}
                <p>
                  All 14 poster languages remain selectable. Recommendations are
                  editorial; they do not restrict who can celebrate.
                </p>
              </details>
            </>
          ) : (
            <div className="calendar-empty">
              <Sparkles size={30} />
              <h3>Your next design starts with a day.</h3>
              <p>Select an observance from the calendar.</p>
            </div>
          )}
        </aside>
      </div>
      <div className="calendar-sources">
        <Info size={20} />
        <div>
          <h3>A considered calendar, not a muhurat calculator.</h3>
          <p>
            {calendarInfo.note} Purnima Shraddha (26 September) is listed
            separately from Pratipada / Pitru Paksha (27 September).
          </p>
          <p className="calendar-scope">
            Coverage: {calendarInfo.scope} Reference reviewed: 14 September
            2026.
          </p>
          <div>
            {calendarSources.map((s) => (
              <a href={s.url} key={s.id} target="_blank" rel="noreferrer">
                [{s.id}] {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
