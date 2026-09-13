import { renderPoster } from "./canvasRenderer";
import { ensurePosterFont } from "../i18n";
import { validPhone } from "./whatsapp";
export async function exportCanvas(data, images) {
  if (!data.business.trim())
    throw new Error("Please enter your business name before exporting.");
  if (!data.offer.trim())
    throw new Error("Please add a promotional headline or offer.");
  if (!validPhone(data.phone) || !validPhone(data.whatsapp))
    throw new Error(
      "Please enter a valid phone / WhatsApp number (10–15 digits).",
    );
  await ensurePosterFont(
    data.language,
    Object.values(data)
      .filter((v) => typeof v === "string")
      .join(" "),
  );
  const canvas = document.createElement("canvas");
  renderPoster(canvas, data, images, 1);
  return canvas;
}
