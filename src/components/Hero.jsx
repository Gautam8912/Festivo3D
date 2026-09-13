import React, { useMemo, useRef } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Check,
  Lock,
  MousePointer2,
  Download,
  ShieldCheck,
  Zap,
} from "lucide-react";
import PosterCanvas from "./PosterCanvas";
import { defaults } from "../data/templates";
export default function Hero() {
  const poster = useMemo(
    () => ({
      ...defaults,
      offer: "Diwali Dhamaka",
      business: "SHARMA FASHION",
      tagline: "Light up your style. Celebrate the savings.",
      discount: "UP TO 50% OFF",
    }),
    [],
  );
  const stage = useRef();
  function tilt(e) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    stage.current.style.transform = `perspective(1000px) rotateY(${(e.clientX - r.left - r.width / 2) / 65}deg) rotateZ(-5deg) rotateX(${-(e.clientY - r.top - r.height / 2) / 100}deg)`;
  }
  return (
    <>
      <section className="hero section">
        <div className="hero-copy">
          <div className="hero-pill">
            <span /> MADE FOR INDIA’S LOCAL BUSINESSES{" "}
            <span className="india">🇮🇳</span>
          </div>
          <h1>
            Create festival
            <br />
            <span className="gradient-text">posters.</span>
            <br />
            In minutes<span className="purple-dot">.</span>
            <span className="heading-spark">✧</span>
          </h1>
          <p>
            Professional promotional posters for Indian businesses
            <br className="desktop-break" /> — without Photoshop, design skills
            or a backend.
          </p>
          <div className="hero-actions">
            <a href="#create" className="button">
              <Sparkles size={18} /> Create Your Poster <ArrowRight size={18} />
            </a>
            <a href="#templates" className="button secondary">
              <ShapesIcon /> Explore Templates
            </a>
          </div>
          <div className="hero-assurance">
            <span>
              <Check size={14} /> Free to use
            </span>
            <span>
              <Check size={14} /> No design skills needed
            </span>
          </div>
          <div className="made-for">
            <div className="shop-avatars">
              <span>👩🏻</span>
              <span>👨🏽</span>
              <span>👩🏽</span>
              <span>👨🏻</span>
            </div>
            <div>
              <div className="rating-stars">★★★★★</div>
              <span>Made for the businesses that make India.</span>
            </div>
          </div>
        </div>
        <div
          className="hero-visual"
          onMouseMove={tilt}
          onMouseLeave={() => {
            stage.current.style.transform = "";
          }}
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-glow" />
          <div className="floating-spark spark-one">✦</div>
          <div className="floating-spark spark-two">✦</div>
          <span className="floating-emoji gift">🎁</span>
          <span className="floating-emoji diya">🪔</span>
          <div className="back-poster back-one" />
          <div className="back-poster back-two" />
          <div className="hero-poster" ref={stage}>
            <PosterCanvas data={poster} />
          </div>
          <div className="float-note note-top">
            <span className="note-icon purple">
              <Sparkles size={19} />
            </span>
            <div>
              <strong>Your business. Your vibe.</strong>
              <small>Beautifully, instantly.</small>
            </div>
          </div>
          <div className="float-note note-bottom">
            <span className="note-icon green">
              <Check size={21} />
            </span>
            <div>
              <strong>Ready to share!</strong>
              <small>1080 × 1080 • HD quality</small>
            </div>
            <span className="mini-download">
              <Download size={16} />
            </span>
          </div>
          <div className="made-browser">
            <MousePointer2 size={14} fill="currentColor" /> A little magic.
            Right in your browser.
          </div>
        </div>
      </section>
      <section className="trust-strip section">
        <span>
          <Zap />
          100% Free to Start
        </span>
        <span>
          <ShieldCheck />
          No Login Required
        </span>
        <span>
          <ShapesIcon />
          Works in Your Browser
        </span>
        <span>
          <Lock />
          Photos Stay on Your Device
        </span>
        <span>
          <Download />
          Download Instantly
        </span>
      </section>
    </>
  );
}
function ShapesIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      <rect x="12" y="2" width="6" height="6" rx="1.5" />
      <rect x="2" y="12" width="6" height="6" rx="1.5" />
      <rect x="12" y="12" width="6" height="6" rx="1.5" />
    </svg>
  );
}
