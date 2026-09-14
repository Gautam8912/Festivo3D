import CalendarTeaser from "../components/CalendarTeaser";
import React from "react";
import {
  Sparkles,
  Store,
  Download,
  ArrowRight,
  Lock,
  Check,
  Image,
  Smartphone,
  Zap,
  Palette,
  Heart,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import PersonalizedHome from "../components/PersonalizedHome";
import Hero from "../components/Hero";
import TemplateGallery from "../components/TemplateGallery";
export default function Home({ onSelect }) {
  return (
    <>
      <Hero />
      <PersonalizedHome />
      <CalendarTeaser />
      <TemplateGallery onSelect={onSelect} />
      <section className="how-section" id="how-it-works">
        <div className="section">
          <div className="center section-title">
            <div className="eyebrow">
              FROM “I HAVE AN OFFER” TO “WOW, THAT’S MY POSTER!”
            </div>
            <h2>Three steps. Endless possibilities.</h2>
            <p>No complicated tools. Just your business, looking its best.</p>
          </div>
          <div className="step-grid">
            {[
              [
                Sparkles,
                "Choose a template",
                "Pick a festival, an offer, or a design that feels like you.",
                "purple",
              ],
              [
                Store,
                "Make it yours",
                "Add your business details, your offer, and a photo.",
                "orange",
              ],
              [
                Download,
                "Download & share",
                "Get a crisp HD poster. Let your customers know!",
                "green",
              ],
            ].map(([Icon, title, desc, color], i) => (
              <div className={"step-card " + color} key={title}>
                <span className="step-number">0{i + 1}</span>
                <div className="step-icon">
                  <Icon size={28} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                {i < 2 && (
                  <span className="step-next">
                    <ArrowRight size={23} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="section features-section">
        <div className="section-title center">
          <div className="eyebrow">SMALL BUSINESS. BIG POSSIBILITIES.</div>
          <h2>Everything you need. Nothing you don’t.</h2>
          <p>Your new favourite business tool. Minus the learning curve.</p>
        </div>
        <div className="feature-grid">
          {[
            [Zap, "Instant creation", "Your next promotion, ready in seconds."],
            [Lock, "100% private", "All the magic happens on your device."],
            [
              Smartphone,
              "Made for mobile",
              "Create wherever business takes you.",
            ],
            [
              Palette,
              "Professional templates",
              "Good design, without the designer.",
            ],
            [
              Image,
              "Your photos, your brand",
              "Make every poster unmistakably yours.",
            ],
            [
              Download,
              "HD PNG downloads",
              "Sharp, share-ready and watermark-free.",
            ],
            [
              Heart,
              "Completely free",
              "More for your business. No hidden fees.",
            ],
            [
              UserCheck,
              "No login. No fuss.",
              "Just open, create, and celebrate.",
            ],
          ].map(([Icon, title, desc], i) => (
            <div className="feature-card" key={title}>
              <span className={"feature-icon color-" + (i % 4)}>
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section" id="privacy">
        <div className="privacy-card">
          <div className="privacy-art">
            <ShieldCheck size={78} />
            <span>
              <Lock size={20} />
            </span>
          </div>
          <div>
            <div className="eyebrow">YOUR BUSINESS IS YOUR BUSINESS.</div>
            <h2>Your photos never leave your device.</h2>
            <p>
              Festivo3D processes your images directly inside your browser. Your
              logo,
              <br className="desktop-break" /> product photos and business
              information are not uploaded to our servers.
            </p>
            <div className="privacy-checks">
              <span>
                <Check size={15} /> No uploads
              </span>
              <span>
                <Check size={15} /> No accounts
              </span>
              <span>
                <Check size={15} /> Just peace of mind
              </span>
            </div>
          </div>
          <span className="privacy-decoration">✧</span>
        </div>
      </section>
      <section className="section final-cta">
        <div className="eyebrow">YOUR NEXT BIG SALE STARTS HERE</div>
        <h2>
          Give your business a little{" "}
          <span className="gradient-text">festive magic.</span>
        </h2>
        <p>Your customers are scrolling. Give them a reason to stop.</p>
        <a className="button" href="#create">
          <Sparkles size={18} /> Let’s Create My Poster <ArrowRight size={18} />
        </a>
        <small>Free. Private. Ready in seconds.</small>
      </section>
    </>
  );
}
