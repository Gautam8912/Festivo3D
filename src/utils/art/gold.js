function density(c) {
  const m = c.getTransform();
  return Math.hypot(m.a, m.b);
}
export const GOLD_STOPS = [
  [0, "#563112"],
  [0.16, "#b78137"],
  [0.3, "#fce5a1"],
  [0.43, "#b47b2b"],
  [0.53, "#fff4c6"],
  [0.66, "#d8ab57"],
  [0.84, "#81501c"],
  [1, "#e9c578"],
];
export function gold(c, x = 0, y = -180, h = 360, finish = "sculpted") {
  const g = c.createLinearGradient(x - 60, y, x + 90, y + h);
  const stops =
    finish === "antique"
      ? [
          [0, "#3b2011"],
          [0.2, "#b87b3c"],
          [0.38, "#e9c797"],
          [0.56, "#85542c"],
          [0.75, "#c39755"],
          [1, "#573617"],
        ]
      : GOLD_STOPS;
  stops.forEach(([p, color]) => g.addColorStop(p, color));
  return g;
}
export function path(
  c,
  d,
  {
    fill = true,
    stroke = "#f6da8c",
    width = 1.3,
    finish = "sculpted",
    depth = true,
  } = {},
) {
  const p = new Path2D(d);
  if (depth && fill && finish !== "engraved") {
    c.save();
    c.translate(3, 5);
    c.fillStyle = "#170b04";
    c.shadowColor = "#080402";
    c.shadowBlur = 13 * density(c);
    c.fill(p);
    c.restore();
  }
  if (fill && finish !== "engraved") {
    c.fillStyle = gold(c, 0, -200, 400, finish);
    c.fill(p);
  }
  c.lineWidth = finish === "engraved" ? 2.5 : width;
  c.strokeStyle = stroke;
  c.stroke(p);
}
export function ellipse(c, x, y, rx, ry, fill, stroke) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
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
export function line(c, points, color = "#c49d59", width = 1) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.strokeStyle = color;
  c.lineWidth = width;
  c.stroke();
}
export function glow(c, x, y, r, color = "#b97b2538") {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(0.4, color);
  g.addColorStop(1, "#00000000");
  c.fillStyle = g;
  c.fillRect(x - r, y - r, 2 * r, 2 * r);
}
export function mandala(c, x, y, r, alpha = 0.55) {
  c.save();
  c.translate(x, y);
  c.globalAlpha = alpha;
  c.strokeStyle = "#e6bc70";
  for (let ring = 0; ring < 3; ring++) {
    const rr = r * (0.7 + ring * 0.15);
    c.lineWidth = ring === 1 ? 0.9 : 1.5;
    c.beginPath();
    c.arc(0, 0, rr, 0, 7);
    c.stroke();
  }
  for (let i = 0; i < 48; i++) {
    c.save();
    c.rotate((i * Math.PI) / 24);
    c.lineWidth = 0.85;
    c.beginPath();
    c.ellipse(r * 0.8, 0, r * 0.2, r * 0.038, 0, 0, 7);
    c.stroke();
    line(
      c,
      [
        [r * 0.62, 0],
        [r * 0.66, 0],
      ],
      "#eed08f",
      1,
    );
    c.restore();
  }
  for (let i = 0; i < 16; i++) {
    c.rotate(Math.PI / 8);
    c.beginPath();
    c.ellipse(r * 0.33, 0, r * 0.33, r * 0.09, 0, 0, 7);
    c.stroke();
  }
  c.restore();
}
export function lotus(c, x, y, s = 1, finish = "sculpted") {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  for (let i = -3; i <= 3; i++) {
    c.save();
    c.rotate(i * 0.19);
    path(
      c,
      `M0 30 C-18 12 -${20 + Math.abs(i) * 15} -20 ${i * 12} -${60 - Math.abs(i) * 9} C${20 + Math.abs(i) * 15} -20 18 12 0 30Z`,
      { finish, depth: false },
    );
    c.restore();
  }
  path(c, "M-105 10 Q-65 75 0 39 Q65 75 105 10 Q45 19 0 35 Q-45 19 -105 10Z", {
    finish,
  });
  c.restore();
}
export function bell(c, x, y, s = 1) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  line(
    c,
    [
      [0, -180],
      [0, -20],
    ],
    "#b9985a",
    1.5,
  );
  ellipse(c, 0, -13, 8, 8, null, "#e5c275");
  path(c, "M-31 40 Q-22 28 -21 10 Q-20 -13 0 -13 Q20 -13 21 10 Q22 28 31 40Z");
  ellipse(c, 0, 40, 33, 8, gold(c, 0, 25, 35));
  ellipse(c, 0, 47, 6, 9, "#d4ad65");
  c.restore();
}
export function diya(c, x, y, s = 1) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  glow(c, 0, -35, 90, "#f5a42e35");
  path(c, "M-50 0 Q0 18 50 0 Q39 40 0 40 Q-39 40 -50 0Z");
  ellipse(c, 0, 0, 51, 9, "#deae53", "#ffe0a1");
  ellipse(c, 0, 0, 42, 5, "#4c290f");
  const g = c.createLinearGradient(0, -72, 0, 0);
  g.addColorStop(0, "#fffde3");
  g.addColorStop(0.5, "#ffdf72");
  g.addColorStop(1, "#d66d20");
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(0, -73);
  c.bezierCurveTo(-7, -43, -30, -25, -13, -7);
  c.bezierCurveTo(26, 14, 20, -37, 0, -73);
  c.fill();
  c.restore();
}
export function gear(c, x, y, r, rotation = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(rotation);
  c.strokeStyle = "#d8b06a";
  c.lineWidth = 2;
  c.beginPath();
  for (let i = 0; i < 64; i++) {
    const a = (i * Math.PI) / 32,
      rr = r * (i % 4 < 2 ? 1 : 0.85);
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.closePath();
  c.stroke();
  ellipse(c, 0, 0, r * 0.63, r * 0.63, null, "#ad8245");
  ellipse(c, 0, 0, r * 0.22, r * 0.22, null, "#b1884b");
  for (let i = 0; i < 6; i++) {
    c.rotate(Math.PI / 3);
    line(
      c,
      [
        [r * 0.25, 0],
        [r * 0.59, 0],
      ],
      "#b1884b",
      2,
    );
  }
  c.restore();
}
