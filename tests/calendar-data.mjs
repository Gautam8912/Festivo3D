import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(process.env.TEST_URL || "http://localhost:5173");
const r = await page.evaluate(async () => {
  const { september2026 } = await import("/src/data/festivalCatalogue.js");
  const { templates, defaults, templatePalette } =
    await import("/src/data/templates.js");
  const { states } = await import("/src/data/regions.js");
  const { stateClusters } = await import("/src/data/targeting.js");
  const { indiaToday, filterCalendar } =
    await import("/src/utils/calendarEngine.js");
  const { renderPoster } = await import("/src/utils/canvasRenderer.js");
  const { localizedCopy, ensurePosterFont } =
    await import("/src/i18n/index.js");
  const ids = new Set(templates.map((t) => t.id));
  const malformed = september2026.filter(
    (e) =>
      e.country !== "India" ||
      e.languages.length !== 14 ||
      !e.presets.length ||
      e.presets.some((id) => !ids.has(id)) ||
      !e.supportedStates.every((s) => states.some((st) => st.name === s)),
  );
  const missingClusters = states.filter((s) => !stateClusters[s.name]?.length);
  const core = [
    "Janmashtami",
    "Hartalika Teej",
    "Ganesh Chaturthi",
    "Rishi Panchami",
    "Vishwakarma Puja",
    "Kanya Sankranti",
    "Radha Ashtami",
    "Parsva Ekadashi",
    "Anant Chaturdashi",
    "Ganesh Visarjan",
    "Pitru Paksha",
  ];
  const dates = Object.fromEntries(
    core.map((n) => [n, september2026.find((e) => e.name === n)?.date]),
  );
  let differences = [];
  const c = document.createElement("canvas");
  await ensurePosterFont("hi");
  for (const id of [
    "ganesh-chaturthi",
    "hartalika-teej",
    "vishwakarma-puja",
    "janmashtami",
    "radha-ashtami",
    "chhath-puja",
  ]) {
    const t = templates.find((t) => t.id === id),
      results = [];
    for (const artFinish of ["sculpted", "engraved", "antique"]) {
      renderPoster(
        c,
        {
          ...defaults,
          ...localizedCopy(t.festival, "hi"),
          template: t.id,
          colors: templatePalette(t),
          artFinish,
        },
        {},
        0.3,
      );
      results.push(c.toDataURL());
    }
    differences.push(new Set(results).size);
  }
  const data = {
    ...defaults,
    ...localizedCopy("Ganesh Chaturthi", "hi"),
    template: "ganesh-chaturthi",
    colors: templatePalette(templates.find((t) => t.id === "ganesh-chaturthi")),
  };
  renderPoster(c, data, {}, 0.4);
  const first = c.toDataURL();
  renderPoster(c, data, {}, 0.4);
  const deterministic = first === c.toDataURL();
  let widths = [];
  for (const [w, h] of [
    [2400, 320],
    [320, 2400],
    [1080, 1080],
    [1080, 1920],
  ]) {
    renderPoster(
      c,
      { ...data, size: "Custom", customWidth: w, customHeight: h },
      {},
      0.1,
    );
    widths.push([
      c.width,
      c.height,
      c.getContext("2d").getImageData(0, 0, 1, 1).data[3],
    ]);
  }
  return {
    malformed: malformed.map((e) => e.name),
    missingClusters: missingClusters.map((e) => e.name),
    dates,
    differences,
    deterministic,
    widths,
    purnima: september2026.find((e) => e.name === "Purnima Shraddha").date,
    timezone: indiaToday(new Date("2026-09-13T19:00:00Z")),
    filtered: filterCalendar({
      state: "Tamil Nadu",
      regionOnly: true,
      query: "Hartalika",
    }).length,
  };
});
assert.deepEqual(r.malformed, []);
assert.deepEqual(r.missingClusters, []);
assert.deepEqual(r.dates, {
  Janmashtami: "2026-09-04",
  "Hartalika Teej": "2026-09-14",
  "Ganesh Chaturthi": "2026-09-14",
  "Rishi Panchami": "2026-09-15",
  "Vishwakarma Puja": "2026-09-17",
  "Kanya Sankranti": "2026-09-17",
  "Radha Ashtami": "2026-09-19",
  "Parsva Ekadashi": "2026-09-22",
  "Anant Chaturdashi": "2026-09-25",
  "Ganesh Visarjan": "2026-09-25",
  "Pitru Paksha": "2026-09-27",
});
assert.equal(r.purnima, "2026-09-26");
assert.equal(r.timezone, "2026-09-14");
assert.deepEqual(r.differences, [3, 3, 3, 3, 3, 3]);
assert.equal(r.deterministic, true);
assert.equal(r.filtered, 0);
assert.deepEqual(r.widths, [
  [240, 32, 255],
  [32, 240, 255],
  [108, 108, 255],
  [108, 192, 255],
]);
console.log(
  "PASS: all requested September dates; complete state/cluster/preset links; India timezone boundaries; 6 deity compositions × 3 distinct finishes; deterministic rendering; square/story and extreme custom dimensions.",
);
await browser.close();
