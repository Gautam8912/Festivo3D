import { festivalAliases } from "../data/aliases";
import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  Heart,
  Clock,
  Sparkles,
} from "lucide-react";
import { templates, festivals, businesses } from "../data/templates";
import { useStudio } from "../hooks/StudioContext";
import { rankTemplates } from "../utils/ranking";
import TemplateCard from "./TemplateCard";
import TemplatePreview from "./TemplatePreview";
import { nativeFestival } from "../i18n";
export default function TemplateGallery({ full = false, onSelect }) {
  const { preferences: p, favourites, recent } = useStudio();
  const [filter, setFilter] = useState("All Templates"),
    [search, setSearch] = useState(""),
    [occasion, setOccasion] = useState(""),
    [category, setCategory] = useState(""),
    [sort, setSort] = useState(false),
    [limit, setLimit] = useState(full ? 12 : 6),
    [preview, setPreview] = useState(null);
  const list = useMemo(() => {
    let arr = templates.filter(
      (t) =>
        (filter === "All Templates" ||
          (filter === "Divine Atelier"
            ? !!t.deity
            : filter === "Favourites"
              ? favourites.includes(t.id)
              : filter === "Recently Used"
                ? recent.includes(t.id)
                : t.category === filter)) &&
        (!occasion || t.festival === occasion) &&
        (!category || t.businessCategories.includes(category)) &&
        `${t.festival} ${(festivalAliases[t.festival] || []).join(" ")} ${t.title} ${t.businessCategories.join(" ")} ${nativeFestival(t.festival, p.language)}`
          .toLowerCase()
          .includes(search.toLowerCase().replaceAll("'", "’")),
    );
    return sort
      ? arr.sort((a, b) => a.title.localeCompare(b.title))
      : rankTemplates(
          arr,
          { ...p, businessCategory: category || p.businessCategory },
          recent,
          occasion,
        );
  }, [filter, search, occasion, category, sort, p, recent, favourites]);
  function reset() {
    setSearch("");
    setOccasion("");
    setCategory("");
    setFilter("All Templates");
  }
  return (
    <section
      className={"gallery section " + (full ? "full-gallery" : "")}
      id="gallery"
    >
      <div className="section-title">
        <div>
          <div className="eyebrow">MADE FOR YOUR NEXT BIG MOMENT</div>
          <h2>
            {p.setupCompleted
              ? "A little closer to home."
              : "Find your festive fit."}
          </h2>
          <p>
            {p.setupCompleted
              ? `Recommended for ${p.state} · ${p.businessCategory}. Local phrases. Designs you can make your own.`
              : "Beautiful designs for every celebration. Pick one. Make it yours."}
          </p>
        </div>
        {!full && (
          <a className="text-link" href="#templates">
            Explore all templates <ArrowRight size={17} />
          </a>
        )}
      </div>
      <div className="gallery-toolbar">
        <div className="gallery-search">
          <Search size={18} />
          <input
            aria-label="Search templates"
            placeholder="Search a festival, design or business…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(12);
            }}
          />
        </div>
        <label className="gallery-select">
          <span>Occasion</span>
          <select
            aria-label="Filter by occasion"
            value={occasion}
            onChange={(e) => {
              setOccasion(e.target.value);
              setLimit(12);
            }}
          >
            <option value="">All occasions</option>
            {festivals.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className="gallery-select">
          <span>Business</span>
          <select
            aria-label="Filter by business category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setLimit(12);
            }}
          >
            <option value="">All businesses</option>
            {businesses.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <button
          className={"sort-button " + (sort ? "selected" : "")}
          aria-label="Sort templates alphabetically"
          aria-pressed={sort}
          onClick={() => setSort(!sort)}
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <div className="catalogue-tabs">
        {[
          "All Templates",
          "Divine Atelier",
          "Festivals",
          "Business Offers",
          "Business Categories",
          "Favourites",
          "Recently Used",
        ].map((f) => (
          <button
            key={f}
            className={filter === f ? "selected" : ""}
            onClick={() => {
              setFilter(f);
              setLimit(12);
            }}
          >
            {f === "Favourites" ? (
              <Heart size={14} />
            ) : f === "Recently Used" ? (
              <Clock size={14} />
            ) : null}
            {f}
          </button>
        ))}
      </div>
      <div className="catalogue-count">
        <span>
          <Sparkles size={13} />
          {sort
            ? "A–Z"
            : p.setupCompleted
              ? "Recommended for you"
              : "Discover your next design"}
        </span>
        <span>{list.length} free templates</span>
      </div>
      <div className="template-grid">
        {list.slice(0, limit).map((t, i) => (
          <TemplateCard
            key={t.id}
            template={t}
            onPreview={setPreview}
            recommended={p.setupCompleted && !sort && i < 3}
          />
        ))}
      </div>
      {!list.length && (
        <div className="empty-state">
          <Search />
          <h3>
            {filter === "Favourites"
              ? "Your favourites will feel at home here."
              : filter === "Recently Used"
                ? "Your next creation starts a collection."
                : "No matching designs just yet."}
          </h3>
          <p>
            {filter === "Favourites"
              ? "Tap the heart on a design to save it."
              : "Try another occasion or reset your filters."}
          </p>
          <button className="button secondary" onClick={reset}>
            Explore all templates
          </button>
        </div>
      )}
      {list.length > limit && (
        <div className="center">
          <button
            className="button secondary browse-button"
            onClick={() => setLimit((l) => l + 12)}
          >
            Show more designs <ArrowRight size={16} />
          </button>
          <span className="tiny">
            Showing {Math.min(limit, list.length)} of {list.length}. All free.
            Always local.
          </span>
        </div>
      )}
      {preview && (
        <TemplatePreview
          template={preview}
          onClose={() => setPreview(null)}
          onSelect={(id) => {
            setPreview(null);
            onSelect(id);
          }}
        />
      )}
    </section>
  );
}
