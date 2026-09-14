import React, { useState } from "react";
import { useStudio } from "../hooks/StudioContext";
import { languageName } from "../data/regions";
import { Sparkles, ArrowUpRight, Menu, X } from "lucide-react";
export function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Festivo3D home">
      <span className="brand-icon">
        <Sparkles size={23} fill="white" />
      </span>
      Festivo<span className="brand-3d">3D</span>
    </a>
  );
}
export default function Navbar({ page }) {
  const [open, setOpen] = useState(false);
  const { preferences, openPreferences } = useStudio();
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Brand />
        <nav className={open ? "open" : ""} aria-label="Main navigation">
          {[
            ["Home", "home"],
            ["Templates", "templates"],
            ["Create Poster", "create"],
            ["September Calendar", "calendar"],
            ["Features", "features"],
          ].map(([text, id]) => (
            <a
              key={id}
              className={page === id ? "active" : ""}
              href={"#" + id}
              onClick={() => setOpen(false)}
            >
              {text}
            </a>
          ))}
        </nav>
        <button
          className="nav-preferences"
          onClick={openPreferences}
          aria-label="Change State & Language"
        >
          ◎ <span>{languageName(preferences.language)}</span>
        </button>
        <a href="#create" className="button small nav-cta">
          Create Poster <ArrowUpRight size={16} />
        </a>
        <button
          className="icon-button mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
