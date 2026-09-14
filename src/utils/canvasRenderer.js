import { renderRoyal } from "./royalRenderer";
function canvasAspect(c) {
  return c.canvas.height / c.canvas.width;
}
import { templates, sizes, outputSize } from "../data/templates";
import { drawFestivalMotif } from "./festivalDecorations";
import { fontScripts, translations } from "../i18n";
function rounded(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}
function star(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    let a = (i * Math.PI) / 4;
    let rr = i % 2 ? r * 0.24 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function diya(c, x, y, s) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  const g = c.createLinearGradient(0, -20, 0, 75);
  g.addColorStop(0, "#ffcd70");
  g.addColorStop(0.4, "#bd602c");
  g.addColorStop(1, "#61301c");
  c.fillStyle = g;
  c.beginPath();
  c.ellipse(0, 12, 94, 39, 0, 0, Math.PI);
  c.fill();
  c.fillStyle = "#f0b652";
  c.beginPath();
  c.ellipse(0, 9, 94, 18, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#763923";
  c.beginPath();
  c.ellipse(0, 6, 76, 10, 0, 0, Math.PI * 2);
  c.fill();
  const flame = c.createLinearGradient(0, -95, 0, 0);
  flame.addColorStop(0, "#fffcd9");
  flame.addColorStop(0.6, "#ffcf61");
  flame.addColorStop(1, "#f57a23");
  c.shadowBlur = 30;
  c.shadowColor = "#ffad35";
  c.fillStyle = flame;
  c.beginPath();
  c.moveTo(0, -102);
  c.bezierCurveTo(0, -56, 42, -31, 17, -5);
  c.bezierCurveTo(-24, 14, -30, -36, 0, -102);
  c.fill();
  c.restore();
}
function ornament(c, x, y, r, color) {
  c.save();
  c.translate(x, y);
  c.strokeStyle = color;
  c.lineWidth = 1.4;
  for (let i = 0; i < 24; i++) {
    c.rotate(Math.PI / 12);
    c.beginPath();
    c.ellipse(r * 0.48, 0, r * 0.52, r * 0.105, 0, 0, Math.PI * 2);
    c.stroke();
  }
  c.beginPath();
  c.arc(0, 0, r * 0.67, 0, 7);
  c.stroke();
  c.restore();
}
function text(
  c,
  str,
  x,
  y,
  max,
  size,
  font,
  color,
  weight = "normal",
  align = "center",
  italic = false,
  spacing = 0,
) {
  str = String(str || "");
  font =
    font +
    ", " +
    Object.values(fontScripts)
      .map((s) => '"Festivo' + s + '"')
      .join(", ");
  if (/[^\u0000-\u024f]/.test(str)) spacing = 0;
  c.direction = /[\u0600-\u06ff]/.test(str) ? "rtl" : "ltr";
  c.fillStyle = color;
  c.textAlign = align;
  c.textBaseline = "middle";
  c.font = `${italic ? "italic " : ""}${weight} ${size}px ${font}`;
  if ("letterSpacing" in c) c.letterSpacing = spacing + "px";
  while (c.measureText(str).width > max && size > 13) {
    size -= 2;
    c.font = `${italic ? "italic " : ""}${weight} ${size}px ${font}`;
  }
  c.save();
  c.translate(x, y);
  const matrix = c.getTransform();
  c.scale(1, matrix.a / matrix.d);
  c.fillText(str, 0, 0);
  c.restore();
  if ("letterSpacing" in c) c.letterSpacing = "0px";
}
function photo(c, img, setting, x, y, w, h, round = 24) {
  if (!img) return;
  c.save();
  const aspect = canvasAspect(c);
  c.translate(
    x + w / 2 + (setting?.x || 0) * 3,
    y + h / 2 + (setting?.y || 0) * 3,
  );
  c.scale(1, 1 / aspect);
  h *= aspect;
  c.rotate(((setting?.rotation || 0) * Math.PI) / 180);
  const z = (setting?.scale || 100) / 100;
  c.scale(z, z);
  if (c._photoShadow) {
    c.shadowColor = "#00000080";
    c.shadowBlur = 25;
    c.shadowOffsetY = 12;
    rounded(c, -w / 2, -h / 2, w, h, round, "#ffffff");
    c.shadowBlur = 0;
    c.shadowOffsetY = 0;
  }
  c.beginPath();
  c.roundRect(-w / 2, -h / 2, w, h, round);
  c.clip();
  let scale =
    setting?.crop === "fit"
      ? Math.min(w / img.width, h / img.height)
      : Math.max(w / img.width, h / img.height);
  scale *= (setting?.zoom || 100) / 100;
  c.drawImage(
    img,
    (-img.width * scale) / 2,
    (-img.height * scale) / 2,
    img.width * scale,
    img.height * scale,
  );
  c.restore();
}
export function renderPoster(canvas, data, images = {}, resolution = 1) {
  const [w, h] = outputSize(data);
  canvas.width = Math.round(w * resolution);
  canvas.height = Math.round(h * resolution);
  const c = canvas.getContext("2d");
  if (!c) throw new Error("Canvas is not supported in this browser.");
  if (data.designStyle !== "classic")
    return renderRoyal(
      c,
      canvas,
      data,
      images,
      templates.find((t) => t.id === data.template) || templates[0],
    );
  c.scale(canvas.width / 1080, canvas.height / 1080);
  c._photoShadow = data.shadow;
  const t = templates.find((t) => t.id === data.template) || templates[0],
    p = data.colors;
  const gradient = c.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, p.bg);
  gradient.addColorStop(0.55, p.bg);
  gradient.addColorStop(1, "#090b1a");
  c.fillStyle = gradient;
  c.fillRect(0, 0, 1080, 1080);
  // A deterministic particle field keeps previews and exports identical.
  for (let i = 0; i < (data.showDecorations === false ? 0 : 95); i++) {
    const x = ((Math.sin(i * 127.1) * 43758.5453) % 1) * 1080,
      y = ((Math.cos(i * 73.7) * 19642.2) % 1) * 1080;
    c.globalAlpha = 0.1 + Math.abs(Math.sin(i)) * 0.55;
    star(c, Math.abs(x), Math.abs(y), i % 7 === 0 ? 8 : 2, p.border);
  }
  c.globalAlpha = 1;
  c.lineWidth = 2;
  const pad = data.padding ?? 30;
  if (data.showBorder !== false) {
    rounded(
      c,
      pad,
      pad,
      1080 - pad * 2,
      1080 - pad * 2,
      data.radius ?? 5,
      null,
      p.border,
    );
    rounded(
      c,
      pad + 13,
      pad + 13,
      1054 - pad * 2,
      1054 - pad * 2,
      data.radius ?? 4,
      null,
      p.border,
    );
  }
  c.save();
  c.translate(pad - 30, pad - 30);
  c.scale((1140 - pad * 2) / 1080, (1140 - pad * 2) / 1080);
  if (
    data.showDecorations !== false &&
    (t.layout === "diwali" || t.layout === "jewel" || t.layout === "arch")
  ) {
    c.globalAlpha = 0.6;
    ornament(c, 0, 0, 270, p.border);
    ornament(c, 1080, 0, 270, p.border);
    ornament(c, 0, 1080, 240, p.border);
    ornament(c, 1080, 1080, 240, p.border);
    c.globalAlpha = 1;
    c.strokeStyle = p.border;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(110, 790);
    c.lineTo(110, 420);
    c.bezierCurveTo(110, 160, 380, 180, 540, 65);
    c.bezierCurveTo(700, 180, 970, 160, 970, 420);
    c.lineTo(970, 790);
    c.stroke();
    for (const x of [175, 900]) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 180);
      c.stroke();
      ornament(c, x, 200, 35, p.badge);
    }
  }
  if (data.showDecorations !== false && t.layout === "holi") {
    c.fillStyle = p.bg;
    c.fillRect(0, 0, 1080, 1080);
    const colors = ["#ed3a96", "#ffcc32", "#49c9d3", "#8c4ecd", "#fe7f3d"];
    for (let i = 0; i < 55; i++) {
      let x = (Math.sin(i * 14.8) * 0.5 + 0.5) * 1080,
        y =
          i % 2
            ? (Math.sin(i * 22) * 0.5 + 0.5) * 240
            : 820 + (Math.cos(i * 32) * 0.5 + 0.5) * 260;
      c.globalAlpha = 0.7;
      c.fillStyle = colors[i % 5];
      c.beginPath();
      c.arc(x, y, 15 + (i % 7) * 19, 0, 7);
      c.fill();
    }
    c.globalAlpha = 1;
  }
  if (data.showDecorations !== false && t.layout === "eid") {
    c.strokeStyle = p.border;
    for (let x = 110; x < 1100; x += 215) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, 140 + (x % 3) * 30);
      c.stroke();
      star(c, x, 150 + (x % 3) * 30, 23, p.badge);
    }
    c.fillStyle = p.badge;
    c.beginPath();
    c.arc(540, 272, 105, 0, 7);
    c.fill();
    c.fillStyle = p.bg;
    c.beginPath();
    c.arc(579, 247, 90, 0, 7);
    c.fill();
    star(c, 622, 280, 25, p.badge);
    c.globalAlpha = 0.35;
    for (let x = 0; x < 1200; x += 80) {
      c.fillStyle = p.border;
      c.fillRect(x, 900, 45, 180);
      c.beginPath();
      c.arc(x + 22, 900, 22, Math.PI, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;
  }
  if (t.layout === "sale") {
    c.save();
    c.translate(540, 510);
    for (let i = 0; i < 22; i++) {
      c.rotate(Math.PI / 11);
      c.fillStyle = i % 2 ? p.bg : p.button;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-160, -1500);
      c.lineTo(160, -1500);
      c.fill();
    }
    c.restore();
    rounded(c, 150, 315, 780, 410, 50, p.badge);
  }
  if (data.showDecorations !== false && t.layout === "sun") {
    const glow = c.createRadialGradient(540, 280, 0, 540, 280, 350);
    glow.addColorStop(0, "#ffec90");
    glow.addColorStop(0.35, "#ffb344");
    glow.addColorStop(1, "#ffad0000");
    c.fillStyle = glow;
    c.fillRect(150, 0, 780, 650);
    c.fillStyle = "#ffe5a1";
    c.beginPath();
    c.arc(540, 260, 95, 0, 7);
    c.fill();
    for (let i = 0; i < 12; i++) {
      c.strokeStyle = "#f9c262";
      c.globalAlpha = 0.4;
      c.beginPath();
      c.ellipse(540, 820 + i * 22, 100 + i * 52, 12, 0, 0, 7);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
  if (data.showDecorations !== false && t.layout === "christmas") {
    for (let j = 0; j < 2; j++) {
      const x = j ? 980 : 100;
      c.fillStyle = j ? "#167053" : "#23916b";
      for (let i = 0; i < 4; i++) {
        c.beginPath();
        c.moveTo(x, 340 + i * 100);
        c.lineTo(x - 75 - i * 30, 580 + i * 100);
        c.lineTo(x + 75 + i * 30, 580 + i * 100);
        c.closePath();
        c.fill();
      }
      star(c, x, 340, 35, "#fbd678");
    }
    for (let i = 0; i < 50; i++) {
      c.fillStyle = "#ffffff";
      c.beginPath();
      c.arc((i * 197) % 1080, (i * 283) % 1080, 2 + (i % 4), 0, 7);
      c.fill();
    }
  }
  if (data.showDecorations !== false && t.layout === "party") {
    for (let i = 0; i < 45; i++) {
      c.save();
      c.translate((i * 173) % 1080, (i * 291) % 1080);
      c.rotate(i);
      c.fillStyle = ["#f2bc6b", "#f86f9c", "#67cbd2"][i % 3];
      c.fillRect(0, 0, 7, 25);
      c.restore();
    }
    ornament(c, 880, 190, 150, p.badge);
    ornament(c, 100, 700, 180, p.border);
  }
  const dark = t.layout === "holi" || t.layout === "sale";
  const ink = p.heading;
  const tx = data.align === "left" ? 150 : data.align === "right" ? 930 : 540;
  text(
    c,
    data.business || "Your Business",
    540,
    118,
    740,
    31,
    "Arial",
    p.text,
    "bold",
    "center",
    false,
    4,
  );
  if (images.logo?.image)
    photo(c, images.logo.image, images.logo, 463, 152, 154, 105, 15);
  else
    text(
      c,
      data.greeting ||
        translations[data.language || "en"]?.greeting ||
        "Warm festive wishes",
      540,
      181,
      750,
      17,
      "Arial",
      p.border,
      "normal",
      "center",
      false,
      4,
    );
  const hasPhoto = !!images.product?.image;
  const top = t.layout === "eid" || t.layout === "sun" ? 435 : 350;
  const words = (data.offer || "Your Special Offer").split(" ");
  let lines = [];
  if (words.length > 2) {
    let mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  } else lines = words.length === 2 ? words : [data.offer || "Your Offer"];
  const fsize = hasPhoto ? data.fontSize * 0.8 : data.fontSize;
  const gap = data.layoutSpacing ?? 12;
  lines.forEach((line, i) =>
    text(
      c,
      line,
      tx,
      top + i * (fsize + gap),
      790,
      fsize,
      data.font,
      ink,
      data.bold ? "bold" : "normal",
      data.align,
      data.italic,
      data.spacing,
    ),
  );
  const badgeY = Math.min(
    hasPhoto ? 660 : 740,
    top + lines.length * (fsize + gap) + (hasPhoto ? 4 : 25),
  );
  if (t.layout !== "sale")
    rounded(c, 290, badgeY - 27, 500, 65, data.radius ?? 32, p.badge);
  text(c, data.discount, 540, badgeY + 6, 465, 36, "Arial", "#292035", "bold");
  text(c, data.tagline, 540, badgeY + 75, 800, 25, "Arial", p.text);
  if (hasPhoto)
    photo(
      c,
      images.product.image,
      images.product,
      340,
      badgeY + 110,
      400,
      Math.max(115, 880 - badgeY - 110),
      data.radius ?? 25,
    );
  else if (data.showDecorations !== false && t.motif) {
    drawFestivalMotif(c, t.motif, p);
  } else if (data.showDecorations !== false && t.layout === "diwali") {
    diya(c, 295, 812, 1);
    diya(c, 540, 780, 1.5);
    diya(c, 785, 812, 1);
  } else if (data.showDecorations !== false && t.layout === "jewel") {
    c.strokeStyle = p.badge;
    c.lineWidth = 13;
    c.beginPath();
    c.ellipse(540, 763, 105, 82, 0, 0, 7);
    c.stroke();
    star(c, 540, 675, 38, p.heading);
    c.lineWidth = 3;
    c.beginPath();
    c.ellipse(540, 763, 122, 97, 0, 0, 7);
    c.stroke();
  } else if (data.showDecorations !== false && t.layout === "holi") {
    text(
      c,
      translations[data.language || "en"]?.tagline || "Celebrate with us",
      540,
      780,
      800,
      22,
      "Arial",
      p.text,
      "bold",
      "center",
      false,
      2,
    );
  }
  if (images.owner?.image)
    photo(c, images.owner.image, images.owner, 815, 740, 150, 150, 75);
  if (images.additional?.image)
    photo(
      c,
      images.additional.image,
      images.additional,
      120,
      750,
      165,
      130,
      data.radius ?? 20,
    );
  if (data.ownerName)
    text(c, data.ownerName, 890, 905, 200, 18, "Arial", p.text);
  text(c, data.cta, 540, 909, 630, 26, "Arial", p.heading, "bold");
  rounded(c, 92, 940, 896, 94, data.radius ?? 15, p.button);
  text(
    c,
    [
      data.phone,
      data.whatsapp && data.whatsapp !== data.phone
        ? "WhatsApp " + data.whatsapp
        : "",
    ]
      .filter(Boolean)
      .join("  •  "),
    540,
    958,
    825,
    24,
    "Arial",
    "#ffffff",
    "bold",
  );
  text(
    c,
    [data.address, data.city].filter(Boolean).join(", "),
    540,
    984,
    835,
    20,
    "Arial",
    "#ffffff",
  );
  text(
    c,
    [data.website, data.instagram, data.facebook].filter(Boolean).join("  •  "),
    540,
    1012,
    835,
    18,
    "Arial",
    "#ffffff",
  );
  c.restore();
  return canvas;
}
