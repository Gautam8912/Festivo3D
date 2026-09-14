import { fontScripts } from "../i18n";
import {
  gold,
  glow,
  mandala,
  bell,
  diya,
  lotus,
  ellipse,
  line,
} from "./art/gold";
import { drawDeity } from "./art/deities";
import { drawRoyalMotif } from "./art/royalMotifs";
function density(c) {
  const m = c.getTransform();
  return Math.hypot(m.a, m.b);
}
const fallbackFonts = [...new Set(Object.values(fontScripts))]
  .map((s) => `"Festivo${s}"`)
  .join(", ");
function font(c, size, family = "Georgia", weight = "normal", italic = false) {
  c.font = `${italic ? "italic " : ""}${weight} ${size}px ${family}, ${fallbackFonts}, serif`;
}
function text(c, value, x, y, max, size, options = {}) {
  const str = String(value || "");
  if (!str) return;
  const {
    family = "Arial",
    weight = "normal",
    italic = false,
    align = "center",
    color = "#f2dfb7",
    foil = false,
    spacing = 0,
    finish = "sculpted",
  } = options;
  c.save();
  c.textAlign = align;
  c.textBaseline = "middle";
  c.direction = /[\u0600-\u06ff]/.test(str) ? "rtl" : "ltr";
  if ("letterSpacing" in c)
    c.letterSpacing = (/[^\u0000-\u024f]/.test(str) ? 0 : spacing) + "px";
  font(c, size, family, weight, italic);
  while (c.measureText(str).width > max && size > 12) {
    size -= 1;
    font(c, size, family, weight, italic);
  }
  if (foil) {
    c.fillStyle = "#160901";
    c.shadowColor = "#000000b0";
    c.shadowBlur = 14 * density(c);
    c.shadowOffsetY = 5 * density(c);
    c.fillText(str, x + 2, y + 3);
    c.shadowBlur = 8 * density(c);
    c.shadowOffsetY = 0;
    c.shadowColor = "#daa65555";
    const g = c.createLinearGradient(0, y - size * 0.65, 0, y + size * 0.65);
    [
      [0, "#8a5928"],
      [0.2, "#fff0b3"],
      [0.4, color],
      [0.5, "#b7863e"],
      [0.58, "#fff7cb"],
      [0.79, color],
      [1, "#795127"],
    ].forEach(([p, s]) => g.addColorStop(p, s));
    c.fillStyle = g;
    c.strokeStyle = "#efd29680";
    c.lineWidth = 0.6;
    c.strokeText(str, x, y);
    c.fillText(str, x, y);
  } else {
    c.fillStyle = color;
    c.fillText(str, x, y);
  }
  c.restore();
  return size;
}
function wrap(c, value, max, size, family, weight) {
  font(c, size, family, weight);
  const words = String(value || "").split(/\s+/);
  if (words.length < 2) return [value || ""];
  const lines = [];
  let current = "";
  for (const word of words) {
    const joined = current ? current + " " + word : word;
    if (current && c.measureText(joined).width > max) {
      lines.push(current);
      current = word;
    } else current = joined;
  }
  if (current) lines.push(current);
  if (lines.length <= 2) return lines;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
function rounded(c, x, y, w, h, r, fill, stroke) {
  c.beginPath();
  c.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}
function photo(c, entry, x, y, w, h, data, circle = false) {
  if (!entry?.image) return;
  const { image, rotation = 0, scale = 100, zoom = 100, crop = "fill" } = entry;
  c.save();
  c.translate(x + (entry.x || 0) * 2.5, y + (entry.y || 0) * 2.5);
  c.rotate((rotation * Math.PI) / 180);
  c.scale(scale / 100, scale / 100);
  if (data.shadow) {
    c.shadowColor = "#000000a0";
    c.shadowBlur = 30 * density(c);
    c.shadowOffsetY = 13;
  }
  rounded(
    c,
    -w / 2 - 4,
    -h / 2 - 4,
    w + 8,
    h + 8,
    circle ? w / 2 : (data.radius ?? 16),
    gold(c, 0, -h / 2, h),
  );
  c.shadowBlur = 0;
  c.shadowOffsetY = 0;
  c.beginPath();
  c.roundRect(-w / 2, -h / 2, w, h, circle ? w / 2 : (data.radius ?? 16));
  c.clip();
  const fit =
    ((crop === "fit"
      ? Math.min(w / image.width, h / image.height)
      : Math.max(w / image.width, h / image.height)) *
      zoom) /
    100;
  c.drawImage(
    image,
    (-image.width * fit) / 2,
    (-image.height * fit) / 2,
    image.width * fit,
    image.height * fit,
  );
  c.restore();
}
function background(c, H, p, data, t) {
  const g = c.createLinearGradient(0, 0, 1080, H);
  g.addColorStop(0, p.bg);
  g.addColorStop(0.42, p.bg);
  g.addColorStop(1, "#030407");
  c.fillStyle = g;
  c.fillRect(0, 0, 1080, H);
  const aura = (data.aura ?? 70) / 100;
  c.save();
  c.globalAlpha = aura;
  glow(c, 540, H * 0.34, 680, "#b9873922");
  glow(c, 130, 190, 400, "#c071181a");
  glow(c, 970, H * 0.78, 410, "#9d452b19");
  c.restore();
  if (data.showDecorations !== false) {
    for (let i = 0; i < 190; i++) {
      const x = (i * 193.7183) % 1080,
        y = (i * i * 81.337) % H;
      c.save();
      c.globalAlpha = (0.06 + (i % 8) * 0.025) * aura;
      ellipse(c, x, y, (i % 4) * 0.4 + 0.5, (i % 4) * 0.4 + 0.5, "#f4d89b");
      c.restore();
    }
    c.save();
    c.globalAlpha = 0.08;
    for (let y = 0; y < H; y += 4) {
      line(
        c,
        [
          [0, y],
          [1080, y],
        ],
        "#d2bd91",
        0.4,
      );
    }
    c.restore();
  }
  const vignette = c.createRadialGradient(
    540,
    H * 0.42,
    100,
    540,
    H * 0.5,
    Math.max(900, H * 0.65),
  );
  vignette.addColorStop(0, "#00000000");
  vignette.addColorStop(0.72, "#00000008");
  vignette.addColorStop(1, "#000000ab");
  c.fillStyle = vignette;
  c.fillRect(0, 0, 1080, H);
  const pad = data.padding ?? 30;
  if (data.showBorder !== false) {
    rounded(
      c,
      pad,
      pad,
      1080 - 2 * pad,
      H - 2 * pad,
      data.radius ?? 12,
      null,
      p.border,
    );
    rounded(
      c,
      pad + 10,
      pad + 10,
      1060 - 2 * pad,
      H - 20 - 2 * pad,
      data.radius ?? 8,
      null,
      p.border,
    );
    c.save();
    c.beginPath();
    c.rect(pad + 2, pad + 2, 1076 - 2 * pad, H - 4 - 2 * pad);
    c.clip();
    for (const [x, y] of [
      [pad, pad],
      [1080 - pad, pad],
      [pad, H - pad],
      [1080 - pad, H - pad],
    ]) {
      mandala(c, x, y, 153, 0.5);
      mandala(c, x, y, 93, 0.36);
    }
    c.restore();
  }
  if (data.showDecorations !== false && t.deity === "shiva-parvati") {
    c.save();
    c.globalAlpha = 0.45;
    for (const sign of [-1, 1]) {
      const x = 540 + sign * 451;
      for (let y = 247; y < H - 282; y += 53) {
        c.beginPath();
        c.moveTo(x, y);
        c.bezierCurveTo(
          x + sign * 20,
          y + 13,
          x - sign * 20,
          y + 39,
          x,
          y + 53,
        );
        c.strokeStyle = "#a79b59";
        c.lineWidth = 1.3;
        c.stroke();
        c.beginPath();
        c.ellipse(x - sign * 12, y + 20, 8, 17, sign * 0.6, 0, 7);
        c.strokeStyle = "#5f7d4c";
        c.stroke();
      }
    }
    c.restore();
  }
  if (data.showDecorations !== false && t.deity === "vishwakarma") {
    c.save();
    c.globalAlpha = 0.075;
    for (let x = 84; x < 1000; x += 40)
      line(
        c,
        [
          [x, 220],
          [x, H - 300],
        ],
        "#bdccd5",
        1,
      );
    for (let y = 220; y < H - 300; y += 40)
      line(
        c,
        [
          [84, y],
          [996, y],
        ],
        "#bdccd5",
        1,
      );
    c.restore();
  }
  if (data.showDecorations !== false && !t.solemn) {
    bell(c, 160, 153, 0.75);
    bell(c, 920, 153, 0.75);
    bell(c, 229, 90, 0.38);
    bell(c, 851, 90, 0.38);
  }
}
function footer(c, H, data, images, p) {
  const h = H > 1350 ? 267 : 205,
    y = H - h - 58,
    x = 78,
    w = 924;
  c.save();
  c.shadowColor = "#000000b0";
  c.shadowBlur = 32 * density(c);
  c.shadowOffsetY = 12 * density(c);
  const glass = c.createLinearGradient(x, y, x + w, y + h);
  glass.addColorStop(0, p.button + "e8");
  glass.addColorStop(0.5, "#15151ac9");
  glass.addColorStop(1, p.button + "f5");
  rounded(c, x, y, w, h, data.radius ?? 20, glass, p.border);
  c.shadowBlur = 0;
  c.shadowOffsetY = 0;
  rounded(
    c,
    x + 7,
    y + 7,
    w - 14,
    h - 14,
    Math.max(0, (data.radius ?? 20) - 4),
    null,
    "#e1bd7125",
  );
  line(
    c,
    [
      [x + 35, y + 1],
      [x + w - 35, y + 1],
    ],
    "#ffe7a176",
    1.3,
  );
  const tall = h > 230;
  const nameY = y + (tall ? 48 : 34);
  photo(c, images.owner, 145, y + 51, 68, 68, data, true);
  const nameX = images.owner?.image ? 569 : 540;
  text(
    c,
    data.business,
    nameX,
    nameY,
    images.owner?.image ? 700 : 815,
    tall ? 40 : 33,
    {
      family: data.font,
      weight: "bold",
      color: p.heading,
      foil: data.metallicHeading !== false,
    },
  );
  text(c, data.tagline, 540, y + (tall ? 89 : 68), 820, tall ? 23 : 21, {
    color: p.text,
  });
  const phone = [
    data.phone,
    data.whatsapp && data.whatsapp !== data.phone ? data.whatsapp : "",
  ]
    .filter(Boolean)
    .join("  ·  ");
  const contactY = y + (tall ? 139 : 108);
  if (phone) {
    rounded(c, 320, contactY - 18, 440, 35, 18, "#ffffff09", "#d3b57b30");
    text(c, phone, 540, contactY, 404, 24, {
      weight: "bold",
      color: p.heading,
    });
  }
  text(
    c,
    [data.address, data.city].filter(Boolean).join(", "),
    540,
    y + (tall ? 183 : 144),
    825,
    20,
    { color: p.text },
  );
  text(
    c,
    [data.website, data.instagram, data.facebook].filter(Boolean).join("  ·  "),
    540,
    y + (tall ? 216 : 166),
    825,
    17,
    { color: p.text },
  );
  if (data.showDecorations !== false) {
    const badges = [data.businessCategory, data.eventDate?.slice(0, 4)].filter(
      Boolean,
    );
    const widths = badges.map((label) =>
      Math.max(64, Math.min(192, label.length * 7 + 24)),
    );
    let bx =
      540 -
      (widths.reduce((a, b) => a + b, 0) +
        Math.max(0, badges.length - 1) * 12) /
        2;
    badges.forEach((label, i) => {
      const by = y + (tall ? 245 : 187);
      rounded(c, bx, by - 9, widths[i], 18, 9, "#d7b16b08", "#d7b16b3d");
      text(c, label, bx + widths[i] / 2, by, widths[i] - 16, 12, {
        color: p.border,
        spacing: 0.5,
      });
      bx += widths[i] + 12;
    });
  }
  if (data.ownerName)
    text(c, data.ownerName, 540, H - 31, 690, 13, { color: p.text });
  c.restore();
  return y;
}
export function renderRoyal(c, canvas, data, images, t) {
  if (canvas.width > canvas.height) {
    const ambient = c.createLinearGradient(0, 0, canvas.width, canvas.height);
    ambient.addColorStop(0, data.colors.bg);
    ambient.addColorStop(0.5, "#08090e");
    ambient.addColorStop(1, data.colors.bg);
    c.fillStyle = ambient;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate((canvas.width - canvas.height) / 2, 0);
    renderRoyal(
      c,
      { width: canvas.height, height: canvas.height },
      data,
      images,
      t,
    );
    c.restore();
    return canvas;
  }
  const W = 1080,
    H = (canvas.height / canvas.width) * W;
  c.scale(canvas.width / W, canvas.width / W);
  const p = data.colors;
  const tall = H >= 1400;
  const longHeading =
    wrap(
      c,
      data.offer,
      900 - ((data.padding ?? 30) - 30) * 2,
      data.fontSize * (tall ? 1.18 : 0.85),
      data.font,
      data.bold ? "bold" : "normal",
    ).length > 1;
  const artY = H * (tall ? 0.31 : longHeading ? 0.285 : 0.31);
  const artScale =
    ((tall ? 1.69 : longHeading ? 0.86 : 0.95) * (data.deityScale ?? 100)) /
    100;
  const hasProduct = !!images.product?.image;
  const artX = hasProduct ? 360 : 540;
  const finish = data.artFinish || t.artFinish || "sculpted";
  background(c, H, p, data, t);
  // Uniform coordinates preserve typography and photos in both portrait and square exports.
  text(
    c,
    data.greeting,
    540,
    tall ? 134 : 119,
    images.logo?.image ? 570 : 720,
    tall ? 24 : 20,
    { color: p.text, spacing: 1.5 },
  );
  if (images.logo?.image)
    photo(c, images.logo, 535, tall ? 225 : 181, 76, 76, data, true);
  if (data.eventDate) {
    const date = new Date(data.eventDate + "T12:00:00Z");
    if (!Number.isNaN(date.getTime())) {
      const label = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(date);
      text(
        c,
        label.toUpperCase(),
        540,
        tall ? 283 : images.logo?.image ? 241 : 164,
        600,
        tall ? 19 : 15,
        { color: p.border, spacing: 3 },
      );
    }
  }
  if (data.showDecorations !== false) {
    c.save();
    c.globalAlpha = (data.aura ?? 70) / 100;
    mandala(
      c,
      artX,
      artY,
      (tall ? 322 : 208) * (hasProduct ? 0.8 : 1),
      t.solemn ? 0.15 : 0.42,
    );
    glow(c, artX, artY, tall ? 470 : 300, "#d8a65233");
    c.restore();
    c.save();
    c.translate(artX, artY + 20);
    c.scale(
      artScale * (hasProduct ? 0.78 : 1),
      artScale * (hasProduct ? 0.78 : 1),
    );
    if (t.deity) drawDeity(c, t.deity, finish);
    else if (t.motif) {
      drawRoyalMotif(c, t.motif, finish);
    } else if (t.layout === "diwali") {
      lotus(c, 0, 85, 1.5, finish);
      diya(c, 0, 60, 1.6);
      diya(c, -158, 133, 0.7);
      diya(c, 158, 133, 0.7);
    } else if (t.layout === "eid") {
      c.save();
      c.save();
      c.beginPath();
      c.arc(0, -15, 126, 0, Math.PI * 2);
      c.clip();
      c.beginPath();
      c.arc(0, -15, 126, 0, Math.PI * 2);
      c.moveTo(158, -46);
      c.arc(51, -46, 107, 0, Math.PI * 2);
      c.fillStyle = gold(c);
      c.fill("evenodd");
      c.restore();
      for (const [x, y] of [
        [90, -78],
        [139, 44],
        [-172, -106],
      ]) {
        c.save();
        c.translate(x, y);
        c.rotate(Math.PI / 4);
        rounded(c, -8, -8, 16, 16, 1, gold(c));
        c.restore();
      }
      lotus(c, 0, 162, 0.7, finish);
      c.restore();
    } else {
      mandala(c, 0, -10, 170, 0.9);
      lotus(c, 0, 104, 1.2, finish);
      diya(c, 0, 90, 0.6);
    }
    c.restore();
  }
  photo(
    c,
    images.product,
    814,
    artY + 35,
    tall ? 290 : 247,
    tall ? 379 : 274,
    data,
  );
  photo(
    c,
    images.additional,
    hasProduct ? 170 : 873,
    artY + (tall ? 270 : 161),
    tall ? 155 : 120,
    tall ? 139 : 110,
    data,
  );
  const maxWidth = 900 - ((data.padding ?? 30) - 30) * 2;
  let mainSize = data.fontSize * (tall ? 1.18 : 0.85);
  const lines = wrap(
    c,
    data.offer,
    maxWidth,
    mainSize,
    data.font,
    data.bold ? "bold" : "normal",
  );
  let headingY = tall ? H * 0.575 : H * (lines.length > 1 ? 0.54 : 0.58);
  const space = data.layoutSpacing ?? 12;
  const available = H - (tall ? 267 : 205) - 58 - headingY - 130;
  if (lines.length > 1)
    mainSize = Math.min(mainSize, Math.max(28, (available - space) / 1.5));
  const lineGap = mainSize + space;
  const align = data.align || "center",
    tx = align === "left" ? 90 : align === "right" ? 990 : 540;
  lines.forEach((lineText, i) =>
    text(c, lineText, tx, headingY + i * lineGap, maxWidth, mainSize, {
      family: data.font,
      weight: data.bold ? "bold" : "normal",
      italic: data.italic,
      align,
      foil: data.metallicHeading !== false,
      color: p.heading,
      spacing: data.spacing,
      finish,
    }),
  );
  const lastY = headingY + (lines.length - 1) * lineGap;
  const footerY = H - (tall ? 267 : 205) - 58;
  let badgeY = Math.min(lastY + (tall ? 100 : 70), footerY - 100);
  if (data.discount) {
    const width = Math.min(
      760,
      Math.max(360, String(data.discount).length * 17),
    );
    rounded(
      c,
      540 - width / 2,
      badgeY - 23,
      width,
      49,
      data.radius ?? 24,
      p.badge,
      "#ffe8b48c",
    );
    text(c, data.discount, 540, badgeY + 2, width - 38, tall ? 34 : 27, {
      weight: "bold",
      color: "#271609",
    });
  }
  text(c, data.cta, 540, footerY - 34, 760, tall ? 25 : 20, { color: p.text });
  if (!t.solemn && data.showDecorations !== false) {
    diya(c, 192, footerY - 39, 0.25);
    diya(c, 888, footerY - 39, 0.25);
    line(
      c,
      [
        [274, footerY - 35],
        [345, footerY - 35],
      ],
      p.border,
      0.8,
    );
    line(
      c,
      [
        [735, footerY - 35],
        [806, footerY - 35],
      ],
      p.border,
      0.8,
    );
  }
  footer(c, H, data, images, p);
  return canvas;
}
