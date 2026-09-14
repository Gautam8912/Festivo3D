import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_URL || "http://localhost:5173";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [],
  external = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("request", (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
    external.push(r.url());
});
await page.goto(base);
await page.getByLabel("Where is your business located?").selectOption("Bihar");
await page.getByLabel("Preference regional cluster").selectOption("Magadh");
await page
  .getByRole("button", { name: "Save my preferences", exact: true })
  .click();
await page
  .getByRole("link", { name: "September Calendar", exact: true })
  .click();
await page.locator(".calendar-page").waitFor();
await expect(page.getByLabel("Calendar state")).toHaveValue("Bihar");
await expect(page.getByLabel("Regional cluster", { exact: true })).toHaveValue(
  "Magadh",
);
await expect(page.getByLabel("Calendar language")).toHaveValue("hi");
await page.getByLabel("My region only").check();
await page.getByRole("button", { name: /September 14, 2026/ }).click();
await expect(page.locator(".calendar-event")).toHaveCount(2);
await page
  .locator(".calendar-event")
  .filter({ hasText: "Hartalika Teej" })
  .click();
await page
  .getByLabel("Divine template preset")
  .selectOption("hartalika-teej-temple");
await page
  .getByLabel("Regional cluster", { exact: true })
  .selectOption("Mithila");
await page.getByLabel("Calendar language").selectOption("bn");
await page.locator(".calendar-poster canvas[data-ready=true]").waitFor();
await page.screenshot({
  path: "tests/royal-calendar-flow.png",
  fullPage: true,
});
const engraved = await page
  .locator(".calendar-poster canvas")
  .evaluate((c) => c.toDataURL());
await page
  .getByLabel("Divine template preset")
  .selectOption("hartalika-teej-heritage");
await page.locator(".calendar-poster canvas[data-ready=true]").waitFor();
const antique = await page
  .locator(".calendar-poster canvas")
  .evaluate((c) => c.toDataURL());
assert.notEqual(engraved, antique, "Distinct finish should change the artwork");
await page
  .getByLabel("Divine template preset")
  .selectOption("hartalika-teej-temple");
let pending = page.waitForEvent("download");
await page
  .getByRole("button", {
    name: "Download selected calendar (.ics)",
    exact: true,
  })
  .click();
let dl = await pending;
await dl.saveAs("tests/september-filtered.ics");
const ics = await fs.readFile("tests/september-filtered.ics", "utf8");
assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 2);
assert.ok(ics.includes("DTSTART;VALUE=DATE:20260914"));
assert.ok(ics.includes("DTEND;VALUE=DATE:20260915"));
assert.ok(ics.includes("Hartalika Teej"));
await page
  .getByRole("button", { name: "Use this divine preset", exact: true })
  .click();
await page.waitForURL("**/#editor");
await page
  .getByLabel("Business name", { exact: false })
  .first()
  .fill("Mithila Silks");
await page.getByLabel("Phone number", { exact: true }).fill("9876543210");
await expect(page.getByLabel("Festival date", { exact: true })).toHaveValue(
  "2026-09-14",
);
await page.getByRole("tab", { name: "Style", exact: true }).click();
await expect(page.getByLabel("Divine artwork finish")).toHaveValue("engraved");
await page.getByLabel("Divine artwork finish").selectOption("sculpted");
await page.getByLabel("Aura intensity").fill("85");
await page.getByLabel("Divine artwork size").fill("95");
await page
  .getByRole("button", { name: "Royal Velvet Maroon", exact: true })
  .click();
await page.getByLabel("Metallic gold typography").uncheck();
await page.getByLabel("Metallic gold typography").check();
await page.getByRole("tab", { name: "Photos", exact: true }).click();
const image = await page.locator(".editor-preview canvas").screenshot();
await page
  .getByLabel("Upload Business logo", { exact: true })
  .setInputFiles({
    name: "local-logo.png",
    mimeType: "image/png",
    buffer: image,
  });
await page
  .getByRole("img", { name: "Uploaded Business logo", exact: true })
  .waitFor();
await page
  .getByRole("button", { name: "Generate Poster", exact: true })
  .click();
await page.waitForURL("**/#preview");
await page.locator(".final-preview-art canvas[data-ready=true]").waitFor();
await page.screenshot({
  path: "tests/royal-final-preview.png",
  fullPage: true,
});
for (const [button, w, h, name] of [
  ["WhatsApp Status · 1080 × 1920", 1080, 1920, "royal-status.png"],
  ["Instagram Square · 1080 × 1080", 1080, 1080, "royal-square.png"],
]) {
  pending = page.waitForEvent("download");
  await page.getByRole("button", { name: button, exact: true }).click();
  dl = await pending;
  await dl.saveAs("tests/" + name);
  const bytes = await fs.readFile("tests/" + name);
  assert.equal(bytes.readUInt32BE(16), w);
  assert.equal(bytes.readUInt32BE(20), h);
}
await page.goto(base + "/#calendar");
await page.reload();
await page.locator(".calendar-page").waitFor();
await expect(page.getByLabel("Calendar state")).toHaveValue("Bihar");
await expect(page.getByLabel("Regional cluster", { exact: true })).toHaveValue(
  "Mithila",
);
await expect(page.getByLabel("Calendar language")).toHaveValue("bn");
await expect(page.getByLabel("Divine template preset")).toHaveValue(
  "hartalika-teej-temple",
);
assert.equal(await page.getByRole("dialog").count(), 0);
await page.getByLabel("Search September observances").fill("Pitru");
await expect(page.locator(".calendar-event")).toHaveCount(1);
await page
  .getByRole("button", { name: "Use this divine preset", exact: true })
  .click();
await page.waitForURL("**/#editor");
await expect(page.getByLabel("Discount / highlight")).toHaveValue("");
await expect(
  page.getByLabel("Business name", { exact: false }).first(),
).toHaveValue("Mithila Silks");
await expect(page.getByLabel("Festival date")).toHaveValue("2026-09-27");
await page.goto(base + "/#calendar");
await page.getByLabel("Calendar state").selectOption("Tamil Nadu");
await expect(page.getByLabel("Regional cluster", { exact: true })).toHaveValue(
  "",
);
await expect(page.getByLabel("Calendar language")).toHaveValue("ta");
await page.getByLabel("My region only").check();
await page.getByLabel("Search September observances").fill("Hartalika");
await expect(page.locator(".calendar-event")).toHaveCount(0);
await page.getByRole("button", { name: "Reset filters", exact: true }).click();
await page.getByRole("button", { name: /September 10, 2026/ }).click();
await expect(page.locator(".calendar-event")).toHaveCount(0);
await page
  .getByRole("button", { name: "Show the full month", exact: true })
  .click();
await expect(page.locator(".calendar-event")).toHaveCount(44);
await page
  .getByRole("button", { name: "Calendar list view", exact: true })
  .click();
await expect(page.locator(".month-grid")).toHaveCount(0);
await page.getByLabel("Major highlights").check();
await expect(page.locator(".calendar-event")).toHaveCount(11);
await page
  .getByRole("button", { name: "Calendar grid view", exact: true })
  .click();
await page.locator(".month-grid").waitFor();
for (const route of ["calendar", "home", "editor"]) {
  await page.goto(base + "/#" + route);
  for (const width of [375, 390, 768, 1024, 1366, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      route + " overflow at " + width,
    );
  }
}
await page.goto(base + "/#calendar");
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "tests/royal-mobile-final.png", fullPage: true });
assert.deepEqual(errors, []);
assert.deepEqual(external, []);
console.log(
  "PASS: September calendar; state → cluster → language → festival → divine preset; saved targeting; alternate art finishes; respectful remembrance copy; region/day/search/view filters; valid ICS; logo upload; metallic styling; actual 1080×1920 and 1080×1080 PNG downloads; responsive 375–1440; no console errors or external requests.",
);
await browser.close();
