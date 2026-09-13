import React, { useEffect, useRef } from "react";
import { renderPoster } from "../utils/canvasRenderer";
import { ensurePosterFont } from "../i18n";
import { outputSize } from "../data/templates";
const NO_IMAGES = {};
export default function PosterCanvas({
  data,
  images = NO_IMAGES,
  canvasRef,
  onError,
  className = "",
  previewLimit = 660,
}) {
  const local = useRef();
  const errorRef = useRef(onError);
  errorRef.current = onError;
  useEffect(() => {
    let cancelled = false;
    const target = (canvasRef || local).current;
    target.dataset.ready = "false";
    const [w, h] = outputSize(data);
    ensurePosterFont(
      data.language,
      Object.values(data)
        .filter((v) => typeof v === "string")
        .join(" "),
    )
      .then(() => {
        if (cancelled) return;
        try {
          renderPoster(
            target,
            data,
            images,
            Math.min(1, (canvasRef ? 1000 : previewLimit) / Math.max(w, h)),
          );
          target.dataset.ready = "true";
        } catch (e) {
          errorRef.current?.(e.message);
        }
      })
      .catch((e) => {
        if (!cancelled) errorRef.current?.(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [data, images, canvasRef, previewLimit]);
  return (
    <canvas
      ref={canvasRef || local}
      className={className}
      role="img"
      aria-label={`${data.offer} promotional poster for ${data.business}`}
    />
  );
}
