import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  Check,
  Lock,
  Type,
  Image,
  Palette,
  LayoutTemplate,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  RotateCcw,
  Monitor,
  Smartphone,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  templatePalette,
  templates,
  festivals,
  palettes,
  phrases,
  sizes,
  defaults,
} from "../data/templates";
import { useStudio } from "../hooks/StudioContext";
import { languageName } from "../data/regions";
import { localizedCopy } from "../i18n";
import { validPhone, whatsappUrl } from "../utils/whatsapp";
import { exportCanvas } from "../utils/renderExport";
import FormatSelector from "./FormatSelector";
import LayoutControls from "./LayoutControls";
import { outputSize } from "../data/templates";
import PosterCanvas from "./PosterCanvas";
import ImageUploader from "./ImageUploader";
import ColorPicker from "./ColorPicker";
import { downloadPoster, sharePoster } from "../utils/posterExport";
export default function PosterEditor({ data, setData, clearSaved, notify }) {
  const {
    images,
    setImages,
    preferences,
    openPreferences,
    remember,
    saveStatus,
  } = useStudio();
  const [controlsOpen, setControlsOpen] = useState(true);
  const [tab, setTab] = useState("details"),
    [quick, setQuick] = useState(false),
    [busy, setBusy] = useState(false),
    [generated, setGenerated] = useState(false),
    [fallback, setFallback] = useState(false),
    [preview3d, setPreview3d] = useState(!!data.preview3d);
  const canvasRef = useRef();
  const current = templates.find((t) => t.id === data.template) || templates[0];
  function update(key, value) {
    setData((d) => ({ ...d, [key]: value }));
    setGenerated(false);
  }
  function selectTemplate(id) {
    const t = templates.find((t) => t.id === id);
    setData((d) => ({
      ...d,
      template: id,
      colors: d.keepColours ? d.colors : templatePalette(t),
      ...localizedCopy(
        t.festival,
        preferences.language,
        Number(data.discount.match(/\d+/)?.[0] || 40),
      ),
    }));
    setGenerated(false);
    remember(id);
  }
  function valid() {
    if (!data.business.trim()) {
      notify("Add your business name to make this poster yours.", "error");
      setTab("details");
      document.getElementById("business")?.focus();
      return false;
    }
    if (!data.offer.trim()) {
      notify("Add an offer or festive greeting first.", "error");
      setTab("details");
      return false;
    }
    if (!validPhone(data.phone) || !validPhone(data.whatsapp)) {
      notify(
        "Please enter a valid phone / WhatsApp number (10–15 digits).",
        "error",
      );
      setTab("details");
      return false;
    }
    return true;
  }
  async function download() {
    if (!valid()) return;
    setBusy(true);
    try {
      await downloadPoster(await exportCanvas(data, images), data);
      notify("Your HD poster is downloaded. Time to spread the word!");
      setGenerated(true);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    if (!valid()) return;
    try {
      const shared = await sharePoster(await exportCanvas(data, images), data);
      if (!shared) {
        setFallback(true);
        await downloadPoster(await exportCanvas(data, images), data);
        notify("Poster downloaded. Attach it in WhatsApp to share.");
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        setFallback(true);
        notify(
          "Direct sharing is unavailable. Download your poster to share it.",
        );
      }
    }
  }
  async function generate() {
    if (!valid()) return;
    try {
      await exportCanvas(data, images);
    } catch (e) {
      notify(e.message, "error");
      return;
    }
    setGenerated(true);
    notify("Your poster is ready! Download it in full HD.");
    location.hash = "preview";
    document
      .querySelector(".editor-preview")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  const tabs = [
    ["details", Type, "Business"],
    ["templates", LayoutTemplate, "Template"],
    ["photos", Image, "Photos"],
    ["style", Palette, "Style"],
  ];
  const fields = [
    ["business", "Business name", "e.g. Sharma Fashion", 80],
    ["offer", "Offer / festive greeting", "e.g. Diwali Dhamaka Sale", 100],
    ["discount", "Discount / highlight", "e.g. UP TO 50% OFF", 65],
    [
      "tagline",
      "Tagline (optional)",
      "A little festive. A lot of savings.",
      100,
    ],
    ["phone", "Phone number", "9876543210", 25],
    ["address", "Business address", "Street, city", 130],
    ["website", "Website", "www.yourbusiness.in", 90],
    ["ownerName", "Owner name", "Your name (optional)", 70],
    ["whatsapp", "WhatsApp number", "+91 9876543210", 25],
    ["city", "City", "Your city", 60],
    ["instagram", "Instagram", "@yourbusiness", 80],
    ["facebook", "Facebook", "Your Facebook page", 90],
    ["cta", "Call to action", "Shop today", 100],
    ["greeting", "Regional greeting", "Your festive wishes", 140],
  ];
  return (
    <main className="editor-page">
      <div className="editor-topbar">
        <div>
          <a className="back-link" href="#templates">
            <ArrowLeft size={14} /> All templates
          </a>
          <h1>
            Make it <span className="gradient-text">your own.</span>
          </h1>
          <p>A little creativity. A lot of possibilities.</p>
        </div>
        <div className="editor-top-actions">
          <span className="saved-label">
            <CheckCircle2 size={14} />{" "}
            {saveStatus === "saved"
              ? "Details saved on this device"
              : saveStatus === "saving"
                ? "Saving on this device…"
                : saveStatus === "cleared"
                  ? "Saved data cleared"
                  : "Storage unavailable · editing still works"}
          </span>
          <button className="button" onClick={download} disabled={busy}>
            <Download size={17} />
            {busy ? "Downloading…" : "Download Poster"}
          </button>
        </div>
      </div>
      <div className="editor-layout">
        <aside
          className={
            "editor-left " + (!controlsOpen ? "controls-collapsed" : "")
          }
        >
          <button
            className="mobile-controls-toggle"
            aria-expanded={controlsOpen}
            onClick={() => setControlsOpen(!controlsOpen)}
          >
            {controlsOpen
              ? "Hide editing controls −"
              : "Show editing controls +"}
          </button>
          <div className="mode-toggle">
            <button
              className={!quick ? "active" : ""}
              onClick={() => setQuick(false)}
            >
              Full editor
            </button>
            <button
              className={quick ? "active" : ""}
              onClick={() => {
                setQuick(true);
                setTab("details");
              }}
            >
              <Sparkles size={14} /> Quick create
            </button>
          </div>
          {!quick && (
            <div className="editor-tabs" role="tablist">
              {tabs.map(([id, Icon, name]) => (
                <button
                  role="tab"
                  aria-selected={tab === id}
                  key={id}
                  className={tab === id ? "active" : ""}
                  onClick={() => setTab(id)}
                >
                  <Icon size={18} />
                  {name}
                </button>
              ))}
            </div>
          )}
          <div className="editor-local-bar">
            <span>
              {preferences.state || "Across India"} ·{" "}
              {languageName(data.language)}
            </span>
            <button className="text-link" onClick={openPreferences}>
              Change State & Language
            </button>
          </div>
          <div className="control-body">
            {quick ? (
              <>
                <div className="panel-heading">
                  <h2>Five steps. One great poster.</h2>
                  <p>We’ll take care of the design.</p>
                </div>
                <label className="field">
                  1. Choose your occasion
                  <select
                    value={data.template}
                    onChange={(e) => selectTemplate(e.target.value)}
                  >
                    {templates.map((t) => (
                      <option value={t.id} key={t.id}>
                        {t.festival}
                      </option>
                    ))}
                  </select>
                </label>
                {fields.slice(0, 2).map(([key, label, placeholder, max], i) => (
                  <label className="field" key={key}>
                    {i + 2}. {label}
                    <input
                      id={key}
                      value={data[key] || ""}
                      maxLength={max}
                      placeholder={placeholder}
                      onChange={(e) => update(key, e.target.value)}
                    />
                  </label>
                ))}
                <ImageUploader
                  kind="product"
                  label="4. Add a photo (optional)"
                  value={images.product}
                  onChange={(value) => setImages({ ...images, product: value })}
                  onError={(m) => notify(m, "error")}
                />
                <button className="button full" onClick={generate}>
                  <Sparkles size={17} />
                  5. Generate Poster
                </button>
              </>
            ) : (
              <>
                {tab === "details" && (
                  <>
                    <div className="panel-heading">
                      <h2>Your business, in the spotlight.</h2>
                      <p>Type below. Watch your poster come to life.</p>
                    </div>
                    {fields.map(([key, label, placeholder, max]) => (
                      <label className="field" key={key}>
                        {label}
                        {["business", "offer"].includes(key) && (
                          <span className="required"> *</span>
                        )}
                        <input
                          id={key}
                          type={key === "phone" ? "tel" : "text"}
                          value={data[key] || ""}
                          placeholder={placeholder}
                          maxLength={max}
                          onChange={(e) => update(key, e.target.value)}
                        />
                        {key === "offer" && (
                          <div className="suggestions">
                            {[
                              localizedCopy(current.festival, data.language)
                                .offer,
                              localizedCopy(current.festival, data.language)
                                .greeting,
                            ].map((phrase) => (
                              <button
                                type="button"
                                key={phrase}
                                onClick={() => update("offer", phrase)}
                              >
                                <Sparkles size={11} />
                                {phrase}
                              </button>
                            ))}
                          </div>
                        )}
                      </label>
                    ))}
                    <button
                      className="button full"
                      onClick={() => setTab("photos")}
                    >
                      Add your photos <ChevronRight size={16} />
                    </button>
                  </>
                )}
                {tab === "templates" && (
                  <>
                    <div className="panel-heading">
                      <h2>Pick your celebration.</h2>
                      <p>Changing templates keeps your business details.</p>
                    </div>
                    <label className="field">
                      Festival / occasion
                      <select
                        value={data.template}
                        onChange={(e) => selectTemplate(e.target.value)}
                      >
                        {[
                          "Festivals",
                          "Business Offers",
                          "Business Categories",
                        ].map((category) => (
                          <optgroup label={category} key={category}>
                            {templates
                              .filter((t) => t.category === category)
                              .map((t) => (
                                <option value={t.id} key={t.id}>
                                  {t.title}
                                </option>
                              ))}
                          </optgroup>
                        ))}
                      </select>
                    </label>
                    <div className="editor-template-grid">
                      {templates
                        .filter((t) => t.category === current.category)
                        .map((t) => (
                          <button
                            className={data.template === t.id ? "selected" : ""}
                            onClick={() => selectTemplate(t.id)}
                            key={t.id}
                          >
                            <PosterCanvas
                              previewLimit={280}
                              data={{
                                ...defaults,
                                ...localizedCopy(
                                  t.festival,
                                  preferences.language,
                                ),
                                template: t.id,
                                colors: templatePalette(t),
                              }}
                            />
                            <span>
                              {t.festival}
                              {data.template === t.id && <Check size={13} />}
                            </span>
                          </button>
                        ))}
                    </div>
                  </>
                )}
                {tab === "photos" && (
                  <>
                    <div className="panel-heading">
                      <h2>A personal touch.</h2>
                      <p>Your images are processed here, never uploaded.</p>
                    </div>
                    {[
                      ["logo", "Business logo"],
                      ["product", "Product photo"],
                      ["owner", "Owner / business photo"],
                      ["additional", "Additional promotional image"],
                    ].map(([kind, label]) => (
                      <ImageUploader
                        kind={kind}
                        label={label}
                        key={kind}
                        value={images[kind]}
                        onChange={(value) => {
                          setImages({ ...images, [kind]: value });
                          setGenerated(false);
                        }}
                        onError={(m) => notify(m, "error")}
                      />
                    ))}
                    <button
                      className="button full"
                      onClick={() => setTab("style")}
                    >
                      Make it your style <ChevronRight size={16} />
                    </button>
                  </>
                )}
                {tab === "style" && (
                  <>
                    <div className="panel-heading">
                      <h2>Find your colours.</h2>
                      <p>A fresh palette. An entirely new feeling.</p>
                    </div>
                    <ColorPicker
                      colors={data.colors}
                      onChange={(v) => update("colors", v)}
                    />
                    <label className="check-field">
                      <input
                        type="checkbox"
                        checked={!!data.keepColours}
                        onChange={(e) =>
                          update("keepColours", e.target.checked)
                        }
                      />
                      Keep my colours for new posters
                    </label>
                    <h3 className="control-subheading">Heading typography</h3>
                    <p className="setup-note">
                      Display fonts style Latin text. Indian scripts use the
                      bundled Noto font for your language. Long text fits
                      automatically.
                    </p>
                    <label className="field">
                      Font family
                      <select
                        value={data.font}
                        onChange={(e) => update("font", e.target.value)}
                      >
                        <option value="Georgia">Elegant Serif · Georgia</option>
                        <option value="Arial">Modern Sans · Arial</option>
                        <option value="Trebuchet MS">
                          Friendly · Trebuchet
                        </option>
                        <option value="Courier New">Classic · Courier</option>
                        <option value="Impact">Bold Display · Impact</option>
                      </select>
                    </label>
                    <label className="field">
                      Font size{" "}
                      <span className="range-value">{data.fontSize}px</span>
                      <input
                        type="range"
                        min="35"
                        max="130"
                        value={data.fontSize}
                        onChange={(e) => update("fontSize", +e.target.value)}
                      />
                    </label>
                    <label className="field">
                      Letter spacing{" "}
                      <span className="range-value">{data.spacing}px</span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={data.spacing}
                        onChange={(e) => update("spacing", +e.target.value)}
                      />
                    </label>
                    <div className="format-buttons">
                      <button
                        className={data.bold ? "selected" : ""}
                        aria-label="Bold heading"
                        aria-pressed={data.bold}
                        onClick={() => update("bold", !data.bold)}
                      >
                        <Bold size={18} />
                      </button>
                      <button
                        className={data.italic ? "selected" : ""}
                        aria-label="Italic heading"
                        aria-pressed={data.italic}
                        onClick={() => update("italic", !data.italic)}
                      >
                        <Italic size={18} />
                      </button>
                      <span />
                      {[
                        ["left", AlignLeft],
                        ["center", AlignCenter],
                        ["right", AlignRight],
                      ].map(([id, Icon]) => (
                        <button
                          aria-label={`Align heading ${id}`}
                          aria-pressed={data.align === id}
                          className={data.align === id ? "selected" : ""}
                          key={id}
                          onClick={() => update("align", id)}
                        >
                          <Icon size={18} />
                        </button>
                      ))}
                    </div>
                    <LayoutControls data={data} update={update} />
                    <button
                      className="text-link reset-style"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          colors: templatePalette(current),
                          font: "Georgia",
                          fontSize: 85,
                          bold: true,
                          italic: false,
                          align: "center",
                          spacing: 0,
                        }))
                      }
                    >
                      <RotateCcw size={14} /> Reset design style
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="editor-private">
            <Lock size={12} /> Private by design. No account needed.
          </div>
        </aside>
        <section className="editor-preview">
          <div className="preview-toolbar">
            <span>
              <span className="live-dot" /> Live preview
            </span>
            <button
              className={"preview-toggle " + (preview3d ? "selected" : "")}
              onClick={() => {
                setPreview3d(!preview3d);
                update("preview3d", !preview3d);
              }}
              aria-pressed={preview3d}
            >
              <Monitor size={15} />
              {preview3d ? "3D view" : "Flat view"}
            </button>
          </div>
          <div
            className={"canvas-stage " + (preview3d ? "perspective-view" : "")}
          >
            <PosterCanvas
              data={data}
              images={images}
              canvasRef={canvasRef}
              onError={(m) => notify(m, "error")}
            />
          </div>
          <div className="canvas-caption">
            {outputSize(data)[0]} × {outputSize(data)[1]} px <span>•</span>{" "}
            {data.size}
            <span>•</span> Watermark-free
          </div>
          <div className="preview-bottom">
            <Sparkles size={14} />
            {generated
              ? "Looking good! Your poster is ready to download."
              : "Your changes appear instantly. Make it yours."}
          </div>
        </section>
        <aside className="editor-right">
          <div className="panel-heading">
            <h2>The finishing touches</h2>
            <p>Made to look good everywhere.</p>
          </div>
          <FormatSelector data={data} onChange={update} />
          <div className="size-diagrams">
            <button
              onClick={() => update("size", "Instagram Post")}
              className={
                outputSize(data)[0] === outputSize(data)[1] ? "selected" : ""
              }
            >
              <span className="size-square" />
              Square<small>1080 × 1080</small>
            </button>
            <button
              onClick={() => update("size", "WhatsApp Status")}
              className={outputSize(data)[1] === 1920 ? "selected" : ""}
            >
              <span className="size-story" />
              Story<small>1080 × 1920</small>
            </button>
          </div>
          <div className="export-info">
            <h3>Good to go. Great to share.</h3>
            <p>
              <Check size={14} /> Full-resolution PNG
            </p>
            <p>
              <Check size={14} /> No watermark
            </p>
            <p>
              <Check size={14} /> 100% free, always local
            </p>
          </div>
          <button className="button full" onClick={generate}>
            <Sparkles size={16} />
            {generated ? "Poster Ready!" : "Generate Poster"}
          </button>
          <button
            className="button secondary full"
            onClick={download}
            disabled={busy}
          >
            <Download size={16} />
            Download PNG
          </button>
          <button className="button whatsapp full" onClick={share}>
            <Share2 size={16} />
            Share on WhatsApp
          </button>
          <p className="export-note">
            Made with a little festive magic.
            <br />
            Downloaded directly to your device.
          </p>
          <div className="editor-tip">
            <span>✦ A little tip</span>
            <p>
              Keep your offer short and bold. A great photo and a clear discount
              go a long way!
            </p>
          </div>
          <button
            className="clear-saved"
            onClick={() => {
              if (
                window.confirm(
                  "Clear all saved business details, state/language preferences, favourites and recent templates? Current photos will also be removed.",
                )
              ) {
                clearSaved();
                setImages({});
                notify("Saved details cleared from this device.");
              }
            }}
          >
            <Trash2 size={13} />
            Clear Saved Data
          </button>
        </aside>
      </div>
      <div className="mobile-editor-bar">
        <button
          onClick={() => {
            setControlsOpen(true);
            setTab("details");
            document
              .querySelector(".editor-left")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Type size={19} />
          Details
        </button>
        <button
          onClick={() => {
            setControlsOpen(true);
            setTab("photos");
            document
              .querySelector(".editor-left")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Image size={19} />
          Photos
        </button>
        <button
          onClick={() => {
            setControlsOpen(true);
            setTab("style");
            document
              .querySelector(".editor-left")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Palette size={19} />
          Style
        </button>
        <button onClick={generate}>
          <Monitor size={19} />
          Preview
        </button>
        <button onClick={download}>
          <Download size={19} />
          Download
        </button>
      </div>
      {fallback && (
        <div className="modal-backdrop" onClick={() => setFallback(false)}>
          <section
            className="share-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setFallback(false);
                return;
              }
              if (e.key === "Tab") {
                const items =
                  e.currentTarget.querySelectorAll("button,a[href]");
                const first = items[0],
                  last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="icon-button modal-close"
              autoFocus
              aria-label="Close share instructions"
              onClick={() => setFallback(false)}
            >
              <X />
            </button>
            <span className="share-modal-icon">
              <Share2 size={30} />
            </span>
            <h2 id="share-title">Ready for your WhatsApp moment?</h2>
            <p>
              This browser can’t attach an image directly. Download your poster,
              then attach it in your WhatsApp chat or status.
            </p>
            <button className="button full" onClick={download}>
              <Download size={17} />
              1. Download your poster
            </button>
            <a
              className="button whatsapp full"
              href={whatsappUrl(data)}
              target="_blank"
              rel="noopener noreferrer"
            >
              2. Open WhatsApp <ExternalLink size={16} />
            </a>
            <small>
              Attach the downloaded PNG using WhatsApp’s photo button.
            </small>
          </section>
        </div>
      )}
    </main>
  );
}
