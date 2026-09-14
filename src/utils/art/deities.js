import {
  gold,
  path,
  ellipse,
  line,
  glow,
  mandala,
  lotus,
  diya,
  gear,
} from "./gold";
function crown(c, dx = 0, dy = 0, s = 1, finish = "sculpted") {
  c.save();
  c.translate(dx, dy);
  c.scale(s, s);
  path(
    c,
    "M-53 -105 L-61 -145 L-35 -128 L-28 -168 L-9 -144 L0 -187 L12 -145 L30 -170 L38 -130 L62 -149 L52 -105Z",
    { finish },
  );
  path(c, "M-54 -108 Q0 -132 54 -108 L53 -93 Q0 -117 -53 -93Z", { finish });
  for (const x of [-37, -20, 0, 20, 37])
    ellipse(c, x, -113 - Math.cos(x / 38) * 10, 3, 5, "#fff0ae");
  ellipse(c, 0, -147, 7, 12, "#5f251f", "#f1ca72");
  c.restore();
}
function modaks(c, x, y, s = 0.8) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  ellipse(c, 0, 12, 75, 14, gold(c, 0, 0, 45), "#f1d597");
  for (const [dx, dy] of [
    [-30, -2],
    [30, -2],
    [0, -10],
  ]) {
    c.save();
    c.translate(dx, dy);
    path(c, "M-18 3 Q-27 -6 -12 -22 Q-2 -34 0 -45 Q3 -33 14 -22 Q28 -4 18 3Z");
    for (const xx of [-8, 0, 8])
      line(
        c,
        [
          [0, -37],
          [xx, 0],
        ],
        "#8b5725",
        1,
      );
    c.restore();
  }
  c.restore();
}
function trishul(c, x, y, s = 0.6) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.shadowBlur = 12;
  c.shadowColor = "#c39d5766";
  line(
    c,
    [
      [0, -95],
      [0, 138],
    ],
    "#dcba77",
    5,
  );
  path(
    c,
    "M-39 -108 Q-61 -64 -19 -40 L-5 -40 L-5 -98 L0 -130 L6 -97 L6 -40 L19 -40 Q61 -64 39 -108 Q91 -52 20 -24 L6 -24 L6 10 L-6 10 L-6 -24 L-20 -24 Q-91 -52 -39 -108Z",
    { depth: false },
  );
  c.restore();
}
function ganesha(c, finish) {
  const p = (d) => path(c, d, { finish });
  // Four arms, lotus seat and a sculpted elephant head with an unmistakable curled trunk.
  p(
    "M-47 -9 Q-95 -48 -123 -5 L-149 37 Q-160 51 -146 64 Q-131 69 -124 56 L-98 29 L-64 42Z",
  );
  p(
    "M47 -9 Q95 -48 123 -5 L149 37 Q160 51 146 64 Q131 69 124 56 L98 29 L64 42Z",
  );
  p(
    "M-45 12 Q-100 29 -119 65 L-162 85 Q-174 99 -157 111 Q-113 108 -76 77 L-45 65Z",
  );
  p("M45 12 Q100 29 119 65 L162 85 Q174 99 157 111 Q113 108 76 77 L45 65Z");
  lotus(c, 0, 152, 1.12, finish);
  p(
    "M-42 54 Q-118 58 -131 121 Q-138 150 -79 153 Q-27 154 0 133 Q27 154 79 153 Q138 150 131 121 Q118 58 42 54Z",
  );
  p("M-45 -16 Q-68 12 -70 72 Q-69 119 0 134 Q69 119 70 72 Q68 12 45 -16Z");
  ellipse(
    c,
    0,
    74,
    52,
    39,
    finish === "engraved" ? null : gold(c, 0, 20, 120, finish),
    "#edd08c",
  );
  p("M-42 -94 Q-92 -150 -130 -99 Q-151 -70 -126 -21 Q-109 8 -53 -32 L-25 -57Z");
  p("M42 -94 Q92 -150 130 -99 Q151 -70 126 -21 Q109 8 53 -32 L25 -57Z");
  path(
    c,
    "M-69 -99 Q-133 -122 -113 -48 Q-84 -12 -54 -49 M69 -99 Q133 -122 113 -48 Q84 -12 54 -49",
    { fill: false, finish },
  );
  p(
    "M-42 -102 Q0 -127 42 -102 Q68 -83 50 -50 Q39 -21 19 -20 L-15 -20 Q-46 -21 -56 -52 Q-70 -82 -42 -102Z",
  );
  p(
    "M-15 -52 Q3 -68 21 -48 Q38 -31 28 -4 Q15 28 38 42 Q63 58 67 33 Q65 16 53 23 Q58 33 48 32 Q35 29 39 9 Q53 -15 38 -44 Q17 -67 -15 -52Z",
  );
  path(c, "M-18 -73 Q-9 -80 -2 -72 M18 -73 Q27 -80 34 -72", {
    fill: false,
    stroke: "#43250e",
    width: 3,
    finish: "engraved",
  });
  path(c, "M-25 -43 Q-36 -17 -14 -10 Q-18 -25 -13 -40Z", { finish });
  line(
    c,
    [
      [-6, -99],
      [-6, -84],
    ],
    "#d47b4b",
    3,
  );
  line(
    c,
    [
      [4, -99],
      [4, -84],
    ],
    "#d47b4b",
    3,
  );
  crown(c, 0, -22, 0.8, finish);
  path(c, "M-43 4 Q0 51 43 4 M-49 19 Q0 67 49 19", {
    fill: false,
    stroke: "#ffe1a2",
    width: 3,
  });
  for (let i = -4; i <= 4; i++)
    ellipse(c, i * 9, 36 - Math.abs(i) * 4, 3, 4, "#efcd83");
  modaks(c, 167, 132, 0.65);
  c.save();
  c.translate(-170, 149);
  ellipse(c, 0, 0, 25, 12, gold(c));
  ellipse(c, 23, -7, 11, 9, gold(c));
  ellipse(c, 18, -17, 7, 8, gold(c));
  ellipse(c, 26, -8, 2, 2, "#231706");
  path(c, "M-23 2 Q-63 21 -69 -5 Q-70 -16 -60 -10", { fill: false, width: 2 });
  c.restore();
  trishul(c, -179, -60, 0.35);
}
function face(c, x, y, s, side = 1, finish = "sculpted") {
  c.save();
  c.translate(x, y);
  c.scale(s * side, s);
  path(
    c,
    "M-26 -54 Q3 -80 31 -52 Q41 -40 30 -19 L40 -2 L30 4 Q32 15 24 22 Q18 42 0 44 L-8 66 L-42 59 L-26 32 Q-41 4 -40 -16 Q-43 -40 -26 -54Z",
    { finish },
  );
  path(c, "M2 -17 Q15 -22 22 -15 M18 10 Q22 13 28 10", {
    fill: false,
    stroke: "#5b371a",
    width: 2,
  });
  ellipse(c, -28, 8, 9, 16, null, "#f6d18c");
  c.restore();
}
function toran(c) {
  for (let i = 0; i < 19; i++) {
    const x = -230 + i * 25,
      y = -195 + Math.sin((i * Math.PI) / 18) * 48;
    for (let j = 0; j < 3; j++)
      ellipse(
        c,
        x + (j - 1) * 5,
        y + j * 7,
        6,
        9,
        ["#b36d21", "#e2aa38", "#d28520"][j],
      );
    line(
      c,
      [
        [x, y + 20],
        [x + 8, y + 40],
      ],
      "#6d8e48",
      2,
    );
  }
}
function shivaParvati(c, finish) {
  toran(c);
  line(
    c,
    [
      [-163, -195],
      [-163, 142],
      [165, 142],
      [165, -195],
    ],
    "#d3ac62",
    3,
  );
  for (const x of [-163, 165])
    for (let y = -150; y < 110; y += 35)
      ellipse(c, x, y, 5, 13, null, "#dfbd76");
  path(c, "M-183 142 L181 142 L164 164 L-166 164Z", { finish });
  trishul(c, -219, 0, 0.7);
  path(c, "M-57 -5 Q-107 12 -121 106 L-128 130 L-17 130 L24 29Z", { finish });
  path(c, "M70 -24 Q141 5 153 125 Q76 154 -7 129 L22 36Z", { finish });
  face(c, -57, -58, 0.91, 1, finish);
  face(c, 59, -54, 0.89, -1, finish);
  path(
    c,
    "M-91 -112 Q-114 -155 -80 -166 Q-67 -192 -46 -166 Q-8 -161 -20 -116 Q-50 -139 -91 -112Z",
    { finish },
  );
  path(
    c,
    "M-54 -166 Q-77 -187 -57 -198 Q-45 -199 -37 -185 Q-61 -190 -54 -166Z",
    { finish },
  );
  path(
    c,
    "M22 -122 Q98 -175 140 -66 L158 114 L136 118 Q100 -97 75 -111 Q49 -101 33 -89Z",
    { finish },
  );
  path(c, "M-55 9 Q-1 47 29 13 M-93 68 Q-40 99 1 64 M15 64 Q65 105 120 82", {
    fill: false,
    width: 5,
  });
  for (const x of [-48, -37, 51, 61]) ellipse(c, x, 69, 6, 15, null, "#aacf8a");
  for (let i = 0; i < 15; i++)
    ellipse(c, 105 + Math.sin(i) * 10, -64 + i * 12, 3, 4, "#ffe8b0");
  lotus(c, 0, 167, 0.65, finish);
}
function vishwakarma(c, finish) {
  for (const [x, y, r] of [
    [-150, -50, 91],
    [155, 30, 105],
    [-110, 125, 53],
  ])
    gear(c, x, y, r, y / 100);
  c.save();
  c.globalAlpha = 0.2;
  for (let i = -200; i <= 200; i += 30) {
    line(
      c,
      [
        [i, -200],
        [i, 200],
      ],
      "#acc3de",
      1,
    );
    line(
      c,
      [
        [-240, i],
        [240, i],
      ],
      "#acc3de",
      1,
    );
  }
  c.restore();
  path(
    c,
    "M-52 -3 Q-111 14 -100 72 L-140 104 L-102 129 L-42 63 L-36 7 M52 -3 Q111 14 100 72 L140 104 L102 129 L42 63 L36 7",
    { finish },
  );
  path(c, "M-46 -8 Q0 -36 46 -8 L77 105 L102 146 L-102 146 L-77 105Z", {
    finish,
  });
  face(c, 0, -65, 1, 1, finish);
  crown(c, 0, -12, 0.73, finish);
  path(
    c,
    "M-35 -60 Q-53 9 -24 28 L0 53 L36 27 Q65 -4 29 -40 Q21 10 2 16 Q-25 -1 -35 -60Z",
    { finish },
  );
  for (let i = -3; i <= 3; i++)
    path(c, `M${i * 7} -19 Q${i * 9} 10 ${i * 5} 32`, {
      fill: false,
      stroke: "#6d4521",
      width: 1,
    });
  path(
    c,
    "M-179 106 L-98 106 L-109 126 L-126 126 L-133 154 L-169 154 L-174 126 L-197 119Z",
    { finish },
  );
  path(
    c,
    "M134 -7 L145 -1 L114 95 L105 89Z M122 -31 L172 -12 L164 14 L112 -5Z",
    { finish },
  );
  path(c, "M-128 150 L135 150 L120 176 L-111 176Z", { finish });
  for (const x of [-80, 80]) {
    ellipse(c, x, 185, 28, 28, gold(c), "#f7d68c");
    for (let i = 0; i < 8; i++)
      line(
        c,
        [
          [x, 185],
          [
            x + Math.cos((i * Math.PI) / 4) * 22,
            185 + Math.sin((i * Math.PI) / 4) * 22,
          ],
        ],
        "#62401c",
        2,
      );
  }
  path(c, "M-44 7 Q0 55 49 9 M-41 36 Q0 82 48 33", { fill: false, width: 3 });
}
function feather(c, x, y, s = 1) {
  c.save();
  c.translate(x, y);
  c.rotate(-0.3);
  c.scale(s, s);
  line(
    c,
    [
      [0, 57],
      [0, -102],
    ],
    "#ddba6d",
    3,
  );
  const g = c.createLinearGradient(-35, 0, 35, -90);
  g.addColorStop(0, "#174c3c");
  g.addColorStop(0.4, "#4f8b66");
  g.addColorStop(0.7, "#a7af62");
  g.addColorStop(1, "#143a30");
  ellipse(c, 0, -45, 35, 62, g, "#c8b56a");
  ellipse(c, 0, -51, 21, 33, "#ae9b4d", "#eed096");
  ellipse(c, 0, -56, 14, 22, "#126a75");
  ellipse(c, 0, -57, 8, 13, "#061e45");
  for (let i = 0; i < 9; i++) {
    line(
      c,
      [
        [0, 12 - i * 12],
        [-29, -i * 10],
      ],
      "#c6c28688",
      1,
    );
    line(
      c,
      [
        [0, 12 - i * 12],
        [29, -i * 10],
      ],
      "#c6c28688",
      1,
    );
  }
  c.restore();
}
function matki(c, x, y, s = 0.7) {
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  path(c, "M-39 -26 Q-87 65 -5 71 Q75 76 51 10 L37 -26Z");
  ellipse(c, 0, -25, 40, 9, "#e0b76b", "#f9e4b1");
  path(
    c,
    "M-34 -25 Q-30 -3 -15 -12 Q-12 6 2 -8 Q5 -2 10 14 Q15 25 22 14 L25 -24Z",
    { fill: true, stroke: "#fff4d9", depth: false },
  );
  c.fillStyle = "#fff5db";
  c.fill(
    new Path2D(
      "M-34 -25 Q-30 -3 -15 -12 Q-12 6 2 -8 Q5 -2 10 14 Q15 25 22 14 L25 -24Z",
    ),
  );
  line(
    c,
    [
      [-51, 26],
      [54, 26],
    ],
    "#f0dca1",
    5,
  );
  ellipse(c, 50, 74, 28, 5, "#e7d7b2");
  c.restore();
}
function kadamba(c) {
  c.save();
  c.globalAlpha = 0.3;
  path(
    c,
    "M-224 174 L-209 72 L-237 -2 L-226 -10 L-201 25 L-188 -77 L-177 -78 L-180 22 L-143 -45 L-134 -38 L-177 64 L-180 177Z",
    { fill: true, depth: false },
  );
  for (const [x, y] of [
    [-190, -104],
    [-227, -62],
    [-155, -70],
    [-233, -15],
    [-128, -37],
  ]) {
    ellipse(c, x, y, 34, 30, "#665127");
    for (let i = 0; i < 5; i++)
      ellipse(
        c,
        x + Math.sin(i * 8) * 24,
        y + Math.cos(i * 9) * 20,
        3,
        4,
        "#eed09b",
      );
  }
  c.restore();
}
function krishna(c, finish, radha = false) {
  kadamba(c);
  lotus(c, 0, 166, 1.4, finish);
  path(
    c,
    "M-28 -13 Q-79 14 -72 64 L-26 111 L-63 152 L-31 168 L15 118 L45 48Z",
    { finish },
  );
  path(c, "M12 23 Q62 40 50 99 L27 153 L5 157 L3 120 L12 80 L-15 55Z", {
    finish,
  });
  face(c, -4, -79, 0.95, -1, finish);
  path(c, "M-37 -141 Q-13 -175 30 -132 L45 -99 Q-11 -141 -47 -96Z", { finish });
  feather(c, 20, -165, 0.58);
  path(
    c,
    "M-31 2 Q-41 -5 -62 -25 L-45 -36 L4 0 Q26 16 51 -22 L64 -13 Q32 55 -7 25Z",
    { finish },
  );
  c.save();
  c.translate(0, -32);
  c.rotate(-0.17);
  path(c, "M-107 -5 L100 -5 L111 0 L100 7 L-107 7Z", { finish });
  for (let i = -3; i <= 3; i++) ellipse(c, i * 19, 0, 2.3, 2.3, "#513612");
  c.restore();
  path(c, "M-18 -8 Q-10 32 27 35 M-22 7 Q-7 55 28 51", {
    fill: false,
    width: 3,
  });
  matki(c, -147, 111, 0.8);
  if (radha) {
    path(c, "M86 -29 Q170 -3 171 115 L192 144 Q127 177 59 144 L77 60Z", {
      finish,
    });
    face(c, 118, -79, 0.75, 1, finish);
    path(
      c,
      "M82 -129 Q170 -150 179 -35 L192 118 L169 133 Q134 -110 111 -115Z",
      { finish },
    );
    path(c, "M82 9 Q61 57 30 43 M149 21 Q170 66 121 95", {
      fill: false,
      width: 5,
    });
    ellipse(c, 125, -75, 3, 4, "#b74931");
    lotus(c, 169, 120, 0.5, finish);
  } else feather(c, 167, 24, 1.2);
}
function surya(c, finish) {
  c.save();
  c.translate(0, -50);
  for (let i = 0; i < 32; i++) {
    c.save();
    c.rotate((i * Math.PI) / 16);
    path(c, "M0 -91 L-8 -119 L0 -157 L8 -119Z", { finish, depth: false });
    c.restore();
  }
  ellipse(c, 0, 0, 91, 91, gold(c, 0, -90, 180, finish), "#fbe4a0");
  path(
    c,
    "M-44 -12 Q-29 -24 -13 -12 M13 -12 Q29 -24 44 -12 M0 -11 L-6 19 L5 20 M-21 41 Q0 52 21 41",
    { fill: false, stroke: "#784b1d", width: 3 },
  );
  ellipse(c, 0, -40, 5, 10, "#b06a2b");
  c.restore();
  for (let i = 0; i < 10; i++) {
    c.save();
    c.globalAlpha = 0.55 - i * 0.035;
    c.beginPath();
    c.ellipse(0, 63 + i * 12, 70 + i * 14, 4 + i * 0.7, 0, 0, 7);
    c.strokeStyle = "#e9bc62";
    c.lineWidth = 2;
    c.stroke();
    c.restore();
  }
  for (const sign of [-1, 1]) {
    line(
      c,
      [
        [sign * 207, 180],
        [sign * 197, -187],
      ],
      "#a4a35a",
      7,
    );
    for (let y = -170; y < 150; y += 31) {
      line(
        c,
        [
          [sign * 192, y],
          [sign * 208, y],
        ],
        "#e0c772",
        3,
      );
      path(
        c,
        `M${sign * 196} ${y} Q${sign * 249} ${y - 69} ${sign * 263} ${y - 51} Q${sign * 215} ${y - 30} ${sign * 196} ${y}`,
        { fill: true, stroke: "#8b9b4e", depth: false },
      );
    }
  }
  c.save();
  c.translate(-92, 145);
  c.rotate(-0.15);
  path(c, "M-83 -2 Q0 -63 86 -2 L70 35 Q0 56 -70 35Z", { finish });
  for (let i = -6; i <= 6; i++)
    line(
      c,
      [
        [i * 10, -11],
        [i * 10, 30],
      ],
      "#765028",
      1,
    );
  for (let i = 0; i < 6; i++)
    ellipse(
      c,
      -42 + i * 18,
      -3 - Math.sin(i) * 9,
      10,
      13,
      ["#b0a455", "#e9b652", "#d5843c"][i % 3],
    );
  c.restore();
  c.save();
  c.translate(129, 147);
  path(c, "M-23 -37 L23 -37 L20 -11 Q53 29 0 39 Q-53 29 -20 -11Z", { finish });
  ellipse(c, 0, -38, 25, 6, "#b98b4b", "#ffdfa1");
  path(c, "M24 -21 Q66 -37 49 6 L33 23", { fill: false, width: 4 });
  c.restore();
}
export function drawDeity(c, type, finish = "sculpted") {
  c.save();
  if (type === "ganesha") ganesha(c, finish);
  else if (type === "shiva-parvati") shivaParvati(c, finish);
  else if (type === "vishwakarma") vishwakarma(c, finish);
  else if (type === "krishna" || type === "radha-krishna")
    krishna(c, finish, type === "radha-krishna");
  else if (type === "surya") surya(c, finish);
  else if (type === "sages") {
    for (let i = -3; i <= 3; i++) {
      c.save();
      c.translate(i * 62, Math.abs(i) * 17);
      c.scale(0.39, 0.39);
      path(c, "M-48 -9 Q0 -51 48 -9 L98 118 L-98 118Z", { finish });
      face(c, 0, -63, 1, 1, finish);
      path(c, "M-35 -23 Q-26 41 0 54 Q36 26 31 -27 Q10 -1 -35 -23Z", {
        finish,
      });
      c.restore();
    }
    lotus(c, 0, 145, 1.5, finish);
  } else if (type === "remembrance") {
    diya(c, 0, 40, 1.6);
    for (let i = -4; i <= 4; i++) {
      c.save();
      c.translate(i * 27, 116 + Math.abs(i) * 4);
      c.rotate(i * 0.2);
      ellipse(c, 0, 0, 10, 4, gold(c));
      c.restore();
    }
  } else {
    lotus(c, 0, 22, 1.8, finish);
    diya(c, 0, 74, 0.7);
  }
  c.restore();
}
