import { path, gold, ellipse, line, lotus, diya, mandala } from "./gold";
export function drawRoyalMotif(c, motif, finish = "sculpted") {
  const p = (d) => path(c, d, { finish });
  c.save();
  if (motif === "chariot") {
    for (const x of [-94, 94]) {
      ellipse(c, x, 140, 34, 34, gold(c), "#f5d99a");
      ellipse(c, x, 140, 27, 27, null, "#4f341b");
      for (let i = 0; i < 12; i++)
        line(
          c,
          [
            [x, 140],
            [
              x + Math.cos((i * Math.PI) / 6) * 26,
              140 + Math.sin((i * Math.PI) / 6) * 26,
            ],
          ],
          "#6f4d23",
          2,
        );
      ellipse(c, x, 140, 6, 6, "#f4dda2");
    }
    p("M-132 78 L132 78 L111 125 L-111 125Z");
    p("M-77 72 L-77 -59 L77 -59 L77 72Z");
    for (const x of [-75, -51, 51, 75])
      p(`M${x - 4} -57 L${x + 4} -57 L${x + 4} 75 L${x - 4} 75Z`);
    for (let i = 0; i < 3; i++) {
      const y = -66 - i * 33,
        w = 111 - i * 23;
      p(
        `M${-w} ${y} Q-25 ${y - 22} 0 ${y - 63} Q25 ${y - 22} ${w} ${y} L${w - 10} ${y + 12} L${-w + 10} ${y + 12}Z`,
      );
    }
    line(
      c,
      [
        [0, -186],
        [0, -226],
      ],
      "#eac585",
      4,
    );
    p("M0 -226 Q27 -244 65 -222 L27 -211 L0 -214Z");
    p("M-29 71 L-29 17 Q0 -17 29 17 L29 71Z");
    for (let i = -4; i <= 4; i++) ellipse(c, i * 24, 96, 4, 7, "#e5cb8b");
    lotus(c, 0, 188, 0.55, finish);
  } else if (motif === "harvest") {
    for (const sign of [-1, 1]) {
      line(
        c,
        [
          [sign * 164, 139],
          [sign * 147, -178],
        ],
        "#b69e63",
        7,
      );
      for (let y = -140; y < 130; y += 36) {
        line(
          c,
          [
            [sign * 141, y],
            [sign * 157, y],
          ],
          "#f0d695",
          3,
        );
        path(
          c,
          `M${sign * 145} ${y} Q${sign * 205} ${y - 76} ${sign * 224} ${y - 70} Q${sign * 180} ${y - 38} ${sign * 145} ${y}`,
          { finish, depth: false },
        );
      }
    }
    p("M-64 -40 Q-137 111 -26 143 Q114 169 94 55 Q92 20 64 -40Z");
    ellipse(c, 0, -41, 68, 13, gold(c, 0, -70, 80), "#f6dfab");
    ellipse(c, 0, -41, 56, 7, "#352413");
    const milk = new Path2D(
      "M-53 -44 Q-64 -23 -45 -17 Q-29 -32 -25 -4 Q-20 9 -10 -8 Q5 -24 14 5 Q27 34 36 4 L40 -36 Q55 -21 53 -44Z",
    );
    c.fillStyle = "#f4e9d0";
    c.fill(milk);
    line(
      c,
      [
        [-94, 55],
        [94, 55],
      ],
      "#e6c786",
      8,
    );
    for (let i = -3; i <= 3; i++) {
      path(
        c,
        `M${i * 21} 64 Q${i * 21 - 12} 89 ${i * 21} 111 Q${i * 21 + 12} 89 ${i * 21} 64`,
        { fill: false, stroke: "#ebd6a3", width: 2 },
      );
    }
    lotus(c, 0, 163, 0.68, finish);
  } else if (motif === "kite") {
    for (const [x, y, rotation] of [
      [-86, 6, -0.3],
      [90, 18, 0.24],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      p("M0 -157 L93 -43 L0 58 L-93 -43Z");
      line(
        c,
        [
          [0, -157],
          [0, 58],
        ],
        "#513c1e",
        2,
      );
      path(c, "M-93 -43 Q0 -74 93 -43 M0 57 Q-55 108 -15 146 Q35 170 0 202", {
        fill: false,
        stroke: "#e5c586",
        width: 2,
      });
      for (const yy of [77, 124, 171])
        p(
          `M0 ${yy} L-15 ${yy - 11} L-10 ${yy + 11} L0 ${yy} L15 ${yy - 11} L10 ${yy + 11}Z`,
        );
      c.restore();
    }
  } else if (motif === "dandiya") {
    for (const sign of [-1, 1]) {
      c.save();
      c.rotate(sign * 0.55);
      p("M-10 -176 Q0 -192 10 -176 L10 167 Q0 177 -10 167Z");
      for (let y = -163; y < 166; y += 23)
        path(c, `M-10 ${y} L10 ${y} L10 ${y + 5} L-10 ${y + 5}Z`, {
          fill: true,
          stroke: "#734528",
          depth: false,
        });
      for (let i = -2; i <= 2; i++)
        line(
          c,
          [
            [i * 4, 171],
            [i * 8, 206],
          ],
          "#c6a471",
          2,
        );
      c.restore();
    }
    lotus(c, 0, 171, 0.53, finish);
  } else if (motif === "flowers") {
    mandala(c, 0, 0, 176, 0.4);
    for (let ring = 0; ring < 2; ring++) {
      for (let i = 0; i < 12; i++) {
        c.save();
        c.rotate((i * Math.PI) / 6 + ring * 0.2);
        c.translate(0, -65 + ring * 19);
        c.scale(1 - ring * 0.3, 1 - ring * 0.3);
        p("M0 30 C-55 -13 -39 -93 0 -143 C39 -93 55 -13 0 30Z");
        c.restore();
      }
    }
    ellipse(c, 0, 0, 24, 24, gold(c), "#f2d99e");
    ellipse(c, 0, 0, 9, 9, "#704633", "#f9dda0");
  } else if (motif === "national") {
    p("M-187 -98 L187 -98 L187 104 L-187 104Z");
    for (const [y, a, b] of [
      [-84, "#d4772f", "#f4bd71"],
      [-27, "#fcf1d7", "#cbbda4"],
      [30, "#0b583b", "#3e9970"],
    ]) {
      const gradient = c.createLinearGradient(-170, y, 170, y + 57);
      gradient.addColorStop(0, a);
      gradient.addColorStop(0.5, b);
      gradient.addColorStop(1, a);
      c.fillStyle = gradient;
      c.fillRect(-171, y, 342, 57);
    }
    ellipse(c, 0, 0, 25, 25, null, "#192f5c");
    for (let i = 0; i < 24; i++)
      line(
        c,
        [
          [0, 0],
          [
            Math.cos((i * Math.PI) / 12) * 25,
            Math.sin((i * Math.PI) / 12) * 25,
          ],
        ],
        "#192f5c",
        1.5,
      );
    lotus(c, 0, 162, 0.8, finish);
  } else {
    for (const x of [-94, 94]) {
      p(
        `M${x - 10} -13 L${x + 10} -13 L${x + 15} 114 L${x + 51} 140 L${x - 51} 140 L${x - 15} 114Z`,
      );
      diya(c, x, -12, 0.9);
      ellipse(c, x, 98, 24, 7, gold(c));
    }
    lotus(c, 0, 154, 0.58, finish);
  }
  c.restore();
}
