import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.TEST_URL || "http://localhost:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base);
await page.getByRole("button", { name: "Explore first, set up later" }).click();
const result = await page.evaluate(async () => {
  const { templates, defaults, templatePalette, outputSize } =
    await import("/src/data/templates.js");
  const { renderPoster } = await import("/src/utils/canvasRenderer.js");
  const { languages, states } = await import("/src/data/regions.js");
  const { localizedCopy, ensurePosterFont } =
    await import("/src/i18n/index.js");
  const { readImage } = await import("/src/utils/imageUtils.js");
  const { exportCanvas } = await import("/src/utils/renderExport.js");
  const { posterBlob } = await import("/src/utils/posterExport.js");
  const c = document.createElement("canvas");
  const fails = [];
  for (const t of templates) {
    try {
      renderPoster(
        c,
        { ...defaults, template: t.id, colors: templatePalette(t) },
        {},
        0.3,
      );
      if (c.getContext("2d").getImageData(0, 0, 1, 1).data[3] !== 255)
        fails.push(t.id);
    } catch (e) {
      fails.push(t.id + ": " + e.message);
    }
  }
  for (const l of languages) {
    await ensurePosterFont(l.code);
    renderPoster(
      c,
      { ...defaults, ...localizedCopy("Diwali", l.code) },
      {},
      0.6,
    );
    if (!c.toDataURL().startsWith("data:image/png")) fails.push(l.code);
  }
  let corrupted = false,
    oversized = false,
    canvasFailed = false,
    downloadFailed = false;
  try {
    await readImage(new File(["corrupt"], "photo.png", { type: "image/png" }));
  } catch (e) {
    corrupted = e.message.includes("try a different");
  }
  try {
    await readImage(
      new File([new Uint8Array(20 * 1024 * 1024 + 1)], "large.png", {
        type: "image/png",
      }),
    );
  } catch (e) {
    oversized = e.message.includes("20 MB");
  }
  const getContext = HTMLCanvasElement.prototype.getContext;
  try {
    HTMLCanvasElement.prototype.getContext = () => null;
    await exportCanvas(defaults, {});
  } catch (e) {
    canvasFailed = e.message.includes("Canvas");
  } finally {
    HTMLCanvasElement.prototype.getContext = getContext;
  }
  try {
    await posterBlob({ toBlob: (cb) => cb(null) });
  } catch (e) {
    downloadFailed = e.message.includes("export");
  }
  return {
    templates: templates.length,
    languages: languages.length,
    states: states.length,
    fails,
    corrupted,
    oversized,
    canvasFailed,
    downloadFailed,
    clamp: outputSize({
      ...defaults,
      size: "Custom",
      customWidth: 999999,
      customHeight: -10,
    }),
  };
});
assert.equal(result.states, 36);
assert.equal(result.languages, 14);
assert.ok(result.templates >= 80);
assert.deepEqual(result.fails, []);
assert.equal(result.corrupted, true);
assert.equal(result.oversized, true);
assert.equal(result.canvasFailed, true);
assert.equal(result.downloadFailed, true);
assert.deepEqual(result.clamp, [2400, 320]);
// Native sharing is platform-dependent. Exercise its supported branch with a controlled browser capability stub.
const sharing = await page.evaluate(async () => {
  const { sharePoster } = await import("/src/utils/posterExport.js");
  const { defaults } = await import("/src/data/templates.js");
  let received;
  Object.defineProperty(navigator, "canShare", {
    configurable: true,
    value: () => true,
  });
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: async (payload) => {
      received = {
        count: payload.files.length,
        type: payload.files[0].type,
        size: payload.files[0].size,
      };
    },
  });
  const c = document.createElement("canvas");
  c.width = 10;
  c.height = 10;
  return { ok: await sharePoster(c, defaults), received };
});
assert.equal(sharing.ok, true);
assert.equal(sharing.received.type, "image/png");
assert.ok(sharing.received.size > 0);
// Optional location: allow a coordinate and verify the estimate requires explicit saving.
const geo = await browser.newContext({
  geolocation: { latitude: 25.1, longitude: 85.31 },
  permissions: ["geolocation"],
});
const gp = await geo.newPage();
await gp.goto(base);
await gp.getByRole("button", { name: "Use my state automatically" }).click();
await expect(
  gp.getByRole("combobox", { name: "Where is your business located?" }),
).toHaveValue("Bihar");
assert.equal(
  await gp.evaluate(() => localStorage.getItem("festivo3d-preferences-v2")),
  null,
);
await expect(gp.locator(".location-hint")).toContainText(
  "Approximate suggestion",
);
await gp.keyboard.press("Escape");
await expect(gp.getByRole("dialog")).toHaveCount(0);
await geo.close();
const blocked = await browser.newContext();
await blocked.addInitScript(() => {
  Storage.prototype.setItem = function () {
    throw new DOMException("Storage disabled", "QuotaExceededError");
  };
});
const bp = await blocked.newPage();
bp.on("pageerror", (e) => errors.push(e.message));
await bp.goto(base);
await bp
  .getByRole("combobox", { name: "Where is your business located?" })
  .selectOption("Bihar");
await bp
  .getByRole("button", { name: "Save my preferences", exact: true })
  .click();
await expect(bp.getByRole("alert")).toBeVisible();
await expect(bp.getByRole("dialog")).toHaveCount(0);
await bp.goto(base + "/#editor");
await bp
  .getByLabel("Business name", { exact: false })
  .first()
  .fill("Private Shop");
let d = bp.waitForEvent("download");
await bp.getByRole("button", { name: "Download Poster", exact: true }).click();
await d;
await blocked.close();
assert.deepEqual(errors, []);
console.log(
  `PASS: ${result.templates} template renders, ${result.languages} local font/language renders, ${result.states} states/UTs; corrupted & oversized images; canvas/export failures; bounded custom sizes; stubbed native-file sharing; geolocation suggestion (not persisted without confirmation); storage-blocked editing and actual download.`,
);
await browser.close();
