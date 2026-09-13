// Original vector motifs: deliberately illustrative rather than sacred portraiture.
export function drawFestivalMotif(c, motif, colors) {
  c.save();
  c.translate(540, 785);
  const p = colors;
  const line = () => {
    c.strokeStyle = p.badge;
    c.lineWidth = 4;
  };
  const circle = (x, y, r, fill) => {
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fillStyle = fill;
    c.fill();
  };
  if (motif === "chariot") {
    line();
    c.fillStyle = p.button;
    c.beginPath();
    c.moveTo(-105, -12);
    c.lineTo(105, -12);
    c.lineTo(90, 56);
    c.lineTo(-90, 56);
    c.closePath();
    c.fill();
    c.stroke();
    for (const x of [-70, 70]) {
      circle(x, 60, 27, p.badge);
      circle(x, 60, 14, p.bg);
    }
    c.fillStyle = p.badge;
    c.beginPath();
    c.moveTo(0, -132);
    c.lineTo(-95, -28);
    c.lineTo(95, -28);
    c.closePath();
    c.fill();
    c.strokeStyle = p.bg;
    for (const x of [-50, 0, 50]) {
      c.beginPath();
      c.moveTo(0, -130);
      c.lineTo(x, -30);
      c.stroke();
    }
    line();
    for (const x of [-72, 72]) {
      c.beginPath();
      c.moveTo(x, -25);
      c.lineTo(x, 0);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(0, -135);
    c.lineTo(0, -174);
    c.stroke();
    c.fillStyle = "#ee8c50";
    c.beginPath();
    c.moveTo(0, -174);
    c.lineTo(53, -158);
    c.lineTo(0, -143);
    c.fill();
  }
  if (motif === "harvest") {
    line();
    c.fillStyle = "#ad6339";
    c.beginPath();
    c.moveTo(-64, -47);
    c.bezierCurveTo(-135, 70, -48, 100, 0, 98);
    c.bezierCurveTo(80, 100, 127, 35, 64, -47);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = p.badge;
    c.fillRect(-66, -58, 132, 18);
    for (let i = 0; i < 7; i++)
      circle(-57 + i * 19, -59 - (i % 2) * 5, 15, "#fff2c9");
    for (const dir of [-1, 1]) {
      c.strokeStyle = "#75a855";
      c.lineWidth = 8;
      c.beginPath();
      c.moveTo(dir * 155, 90);
      c.quadraticCurveTo(dir * 115, -30, dir * 171, -142);
      c.stroke();
      for (let i = 0; i < 4; i++) {
        c.beginPath();
        c.ellipse(dir * (135 + i * 8), -15 - i * 30, 13, 30, dir * 0.7, 0, 7);
        c.fillStyle = "#88b865";
        c.fill();
      }
    }
    c.strokeStyle = p.badge;
    c.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      c.beginPath();
      c.arc(0, 35, 52 + i * 5, 0.3, 2.8);
      c.stroke();
    }
  }
  if (motif === "flowers") {
    for (let ring = 4; ring >= 0; ring--) {
      const r = ring * 22;
      for (let i = 0; i < 20; i++) {
        const a = (i * Math.PI) / 10;
        circle(
          Math.cos(a) * r,
          Math.sin(a) * r * 0.65,
          16,
          ["#ed783e", "#f7d252", "#e66792", "#efca60", "#fff2bd"][ring],
        );
      }
    }
    circle(0, 0, 22, p.badge);
  }
  if (motif === "dandiya") {
    line();
    for (const dir of [-1, 1]) {
      c.save();
      c.rotate(dir * 0.55);
      c.fillStyle = dir === 1 ? "#e58c50" : "#e279a9";
      c.fillRect(-8, -110, 16, 220);
      for (let y = -100; y < 105; y += 25) {
        c.fillStyle = p.badge;
        c.fillRect(-8, y, 16, 8);
      }
      c.restore();
    }
  }
  if (motif === "kite") {
    for (const [x, y, angle] of [
      [-72, 0, -0.2],
      [82, 15, 0.25],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.fillStyle = x < 0 ? p.badge : "#e4829f";
      c.beginPath();
      c.moveTo(0, -108);
      c.lineTo(66, -30);
      c.lineTo(0, 35);
      c.lineTo(-66, -30);
      c.closePath();
      c.fill();
      c.strokeStyle = p.bg;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, -108);
      c.lineTo(0, 35);
      c.moveTo(-65, -30);
      c.lineTo(65, -30);
      c.stroke();
      c.strokeStyle = p.border;
      c.beginPath();
      c.moveTo(0, 35);
      c.bezierCurveTo(-45, 90, 50, 70, 0, 120);
      c.stroke();
      c.restore();
    }
  }
  if (motif === "national") {
    c.fillStyle = "#ed994a";
    c.fillRect(-145, -75, 290, 50);
    c.fillStyle = "#fff8e9";
    c.fillRect(-145, -25, 290, 50);
    c.fillStyle = "#27875a";
    c.fillRect(-145, 25, 290, 50);
    circle(0, 0, 23, "#23416c");
    circle(0, 0, 20, "#fff8e9");
    c.strokeStyle = "#23416c";
    c.lineWidth = 1.5;
    for (let i = 0; i < 24; i++) {
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(
        Math.cos((i * Math.PI) / 12) * 20,
        Math.sin((i * Math.PI) / 12) * 20,
      );
      c.stroke();
    }
  }
  if (motif === "lamps") {
    line();
    for (const x of [-85, 85]) {
      c.beginPath();
      c.moveTo(x, -90);
      c.lineTo(x, 80);
      c.moveTo(x - 43, 83);
      c.lineTo(x + 43, 83);
      c.stroke();
      c.fillStyle = p.badge;
      c.beginPath();
      c.ellipse(x, -58, 45, 17, 0, 0, Math.PI);
      c.fill();
      c.fillStyle = "#ffca62";
      c.beginPath();
      c.ellipse(x, -78, 9, 20, 0, 0, 7);
      c.fill();
    }
  }
  c.restore();
}
