import React, { useRef, useState } from "react";
import { Download, Share2, ArrowLeft, Check, ExternalLink } from "lucide-react";
import { useStudio } from "../hooks/StudioContext";
import PosterCanvas from "../components/PosterCanvas";
import { outputSize } from "../data/templates";
import { downloadPoster, sharePoster } from "../utils/posterExport";
import { whatsappUrl } from "../utils/whatsapp";
import { exportCanvas } from "../utils/renderExport";
export default function Preview() {
  const { data, images, notify } = useStudio();
  const canvas = useRef();
  const [busy, setBusy] = useState(false),
    [fallback, setFallback] = useState(false);
  const [w, h] = outputSize(data);
  async function act(share = false) {
    setBusy(true);
    try {
      const c = await exportCanvas(data, images);
      if (share) {
        const success = await sharePoster(c, data);
        if (!success) {
          setFallback(true);
          await downloadPoster(c, data);
          notify("Poster downloaded. Attach it in WhatsApp to share.");
        }
      } else {
        await downloadPoster(c, data);
        notify("Your full-resolution PNG is downloaded.");
      }
    } catch (e) {
      if (e.name !== "AbortError") notify(e.message, "error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="final-preview-page section">
      <a href="#editor" className="back-link">
        <ArrowLeft size={15} /> Back to editor
      </a>
      <div className="center">
        <div className="eyebrow">MADE BY YOU. READY FOR YOUR CUSTOMERS.</div>
        <h1>
          Your business,{" "}
          <span className="gradient-text">beautifully festive.</span>
        </h1>
        <p>
          {w} × {h} pixels · PNG · No watermark
        </p>
      </div>
      <div className="final-preview-art">
        <PosterCanvas
          data={data}
          images={images}
          canvasRef={canvas}
          onError={(m) => notify(m, "error")}
        />
      </div>
      <div className="final-preview-actions">
        <a className="button secondary" href="#editor">
          Keep editing
        </a>
        <button className="button" disabled={busy} onClick={() => act()}>
          <Download size={17} />
          Download PNG
        </button>
        <button
          className="button whatsapp"
          disabled={busy}
          onClick={() => act(true)}
        >
          <Share2 size={17} />
          Share poster
        </button>
      </div>
      {fallback && (
        <div className="share-fallback" role="status">
          <Check size={17} />
          <p>
            Downloaded to your device. Open WhatsApp and attach the PNG.{" "}
            <a href={whatsappUrl(data)} target="_blank" rel="noreferrer">
              Open WhatsApp <ExternalLink size={13} />
            </a>
          </p>
        </div>
      )}
    </main>
  );
}
