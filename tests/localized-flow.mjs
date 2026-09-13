import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.TEST_URL || "http://localhost:5173";
const browser = await chromium.launch({ headless: true });
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
const dialog = page.getByRole("dialog", {
  name: "State and language preferences",
});
await dialog.waitFor();
await page.screenshot({ path: "tests/setup-v2.png", fullPage: false });
await page.getByLabel("Where is your business located?").selectOption("Bihar");
assert.equal(
  await page.getByLabel("Which language should your posters use?").inputValue(),
  "hi",
);
await page
  .getByRole("combobox", { name: "Your business category", exact: true })
  .selectOption("Clothing");
await page
  .getByRole("button", { name: "Save my preferences", exact: true })
  .click();
await page.getByText("Made for", { exact: false }).first().waitFor();
await page.screenshot({ path: "tests/home-v2.png", fullPage: true });
await page.reload();
assert.equal(await page.getByRole("dialog").count(), 0);
await page
  .getByRole("link", { name: "Templates", exact: true })
  .first()
  .click();
await page.locator(".full-gallery").waitFor();
await page.getByLabel("Filter by occasion").selectOption("Diwali");
await page.getByLabel("Filter by business category").selectOption("Clothing");
await expect(page.locator(".large-template-card")).toHaveCount(2);
await page
  .locator(".large-template-card")
  .filter({
    has: page.getByRole("heading", { name: "Diwali Dhamaka", exact: true }),
  })
  .getByRole("button", { name: "Favourite Diwali", exact: true })
  .click();
await page.getByRole("button", { name: "Favourites", exact: true }).click();
await expect(page.locator(".large-template-card")).toHaveCount(1);
await page
  .getByRole("button", { name: "Preview Diwali template", exact: true })
  .click();
await page.getByRole("dialog", { name: "Diwali template preview" }).waitFor();
await page.screenshot({ path: "tests/large-preview-v2.png", fullPage: false });
await page
  .getByRole("button", { name: "Use This Template", exact: true })
  .click();
await page
  .getByLabel("Business name", { exact: false })
  .first()
  .fill("Gupta Fashion");
await page
  .getByLabel("Offer / festive greeting", { exact: false })
  .first()
  .fill("दीपावली विशेष ऑफर");
await page.getByLabel("Discount / highlight").fill("40% तक की छूट");
await page.getByLabel("WhatsApp number").fill("9876543210");
await page.getByLabel("Owner name").fill("Ravi Gupta");
await page.getByLabel("City", { exact: true }).fill("Patna");
await page.getByRole("tab", { name: "Photos", exact: true }).click();
await page.locator(".editor-preview canvas[data-ready=true]").waitFor();
const png = await page.locator(".editor-preview canvas").screenshot();
await page
  .getByLabel("Upload Business logo", { exact: true })
  .setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: png });
await page
  .getByRole("img", { name: "Uploaded Business logo", exact: true })
  .waitFor();
await page
  .getByLabel("Upload Product photo", { exact: true })
  .setInputFiles({ name: "product.png", mimeType: "image/png", buffer: png });
await page
  .getByRole("img", { name: "Uploaded Product photo", exact: true })
  .waitFor();
await page.getByLabel("Product photo Rotate", { exact: true }).fill("20");
await page.getByLabel("Product photo Zoom / crop", { exact: true }).fill("130");
await page
  .getByRole("button", { name: "Remove Product photo", exact: true })
  .click();
assert.equal(
  await page
    .getByRole("img", { name: "Uploaded Product photo", exact: true })
    .count(),
  0,
);
await page
  .getByLabel("Upload Product photo", { exact: true })
  .setInputFiles({
    name: "replacement.png",
    mimeType: "image/png",
    buffer: png,
  });
await page
  .getByRole("img", { name: "Uploaded Product photo", exact: true })
  .waitFor();
await page.getByRole("tab", { name: "Style", exact: true }).click();
await page
  .getByRole("button", { name: "Festival Orange", exact: true })
  .click();
await page.getByLabel("Font family").selectOption("Arial");
await page.getByLabel("Font size").fill("70");
await page.getByLabel("Canvas padding").fill("45");
await page.getByLabel("Show border").uncheck();
await page.getByLabel("Festival decorations").uncheck();
await page.getByLabel("Festival decorations").check();
await page.getByLabel("Poster size").selectOption("Custom");
await page.getByLabel("Width (px)").fill("1080");
await page.getByLabel("Height (px)").fill("1350");
await page
  .getByRole("button", { name: "Generate Poster", exact: true })
  .click();
await page.waitForURL("**/#preview");
await page.locator(".final-preview-art canvas[data-ready=true]").waitFor();
await page.screenshot({ path: "tests/final-preview-v2.png", fullPage: true });
let promise = page.waitForEvent("download");
await page.getByRole("button", { name: "Download PNG", exact: true }).click();
let download = await promise;
await download.saveAs("tests/localized-export.png");
const bytes = await fs.readFile("tests/localized-export.png");
assert.equal(bytes.readUInt32BE(16), 1080);
assert.equal(bytes.readUInt32BE(20), 1350);
assert.equal(
  download.suggestedFilename(),
  "festivo3d-diwali-gupta-fashion.png",
);
promise = page.waitForEvent("download");
await page.getByRole("button", { name: "Share poster", exact: true }).click();
await promise;
const whatsapp = page.getByRole("link", {
  name: "Open WhatsApp",
  exact: false,
});
await whatsapp.waitFor();
const url = await whatsapp.getAttribute("href");
assert.ok(url.startsWith("https://wa.me/919876543210?text="));
assert.ok(decodeURIComponent(url).includes("Gupta Fashion"));
await page.getByRole("link", { name: "Back to editor", exact: false }).click();
assert.equal(
  await page.getByLabel("Business name", { exact: false }).first().inputValue(),
  "Gupta Fashion",
);
await page.getByRole("tab", { name: "Photos", exact: true }).click();
assert.equal(
  await page
    .getByRole("img", { name: "Uploaded Business logo", exact: true })
    .count(),
  1,
);
await page.reload();
await page.getByLabel("Business name", { exact: false }).first().waitFor();
assert.equal(
  await page.getByLabel("Business name", { exact: false }).first().inputValue(),
  "Gupta Fashion",
);
assert.equal(await page.getByLabel("Poster size").inputValue(), "Custom");
await page.getByLabel("Phone number", { exact: true }).fill("123");
await page
  .getByRole("button", { name: "Generate Poster", exact: true })
  .click();
await page.getByRole("alert").waitFor();
await page.getByLabel("Phone number", { exact: true }).fill("9876543210");
await page.getByLabel("Business name", { exact: false }).first().fill("");
await page
  .getByRole("button", { name: "Generate Poster", exact: true })
  .click();
await page.getByRole("alert").waitFor();
await page
  .getByLabel("Business name", { exact: false })
  .first()
  .fill("Gupta Fashion");
await page
  .getByRole("button", { name: "Change State & Language", exact: true })
  .first()
  .click();
await page
  .getByLabel("Where is your business located?")
  .selectOption("Tamil Nadu");
assert.equal(
  await page.getByLabel("Which language should your posters use?").inputValue(),
  "ta",
);
await page
  .getByRole("button", { name: "Save my preferences", exact: true })
  .click();
assert.match(
  await page
    .getByLabel("Offer / festive greeting", { exact: false })
    .first()
    .inputValue(),
  /தீபாவளி/,
);
assert.equal(
  await page.getByLabel("Business name", { exact: false }).first().inputValue(),
  "Gupta Fashion",
);
await page
  .getByRole("button", { name: "Change State & Language", exact: true })
  .first()
  .click();
await page.getByLabel("Where is your business located?").selectOption("Odisha");
await page
  .getByRole("button", { name: "Save my preferences", exact: true })
  .click();
assert.match(
  await page
    .getByLabel("Offer / festive greeting", { exact: false })
    .first()
    .inputValue(),
  /ଦୀପାବଳି/,
);
await page.getByRole("tab", { name: "Template", exact: true }).click();
await page.getByLabel("Festival / occasion").selectOption("rath-yatra");
await page.getByRole("tab", { name: "Business", exact: true }).click();
assert.match(
  await page
    .getByLabel("Offer / festive greeting", { exact: false })
    .first()
    .inputValue(),
  /ରଥଯାତ୍ରା/,
);
await page.locator(".editor-preview canvas[data-ready=true]").waitFor();
await page.screenshot({ path: "tests/editor-odia-v2.png", fullPage: true });
for (const width of [375, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "editor overflow " + width,
  );
}
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "tests/editor-mobile-v2.png", fullPage: true });
await page.goto(base + "/#create");
await page
  .getByLabel("1. Choose an occasion")
  .selectOption({ label: "Diwali" });
await page.locator(".brief-card summary").click();
await page
  .getByLabel("Your brief")
  .fill("Diwali offer for clothing, 20% discount, portrait");
await page.getByRole("button", { name: "Read my brief", exact: true }).click();
await page
  .getByRole("button", { name: "Apply these details", exact: false })
  .click();
assert.equal(
  await page.getByLabel("3. Discount percentage").inputValue(),
  "20",
);
assert.equal(
  await page.getByLabel("5. Pick a format").inputValue(),
  "WhatsApp Status",
);
await page
  .getByRole("button", { name: "Create & open editor", exact: true })
  .click();
await page.waitForURL("**/#editor");
await page.getByRole("tab", { name: "Photos", exact: true }).click();
await page
  .getByLabel("Upload Product photo", { exact: true })
  .setInputFiles({
    name: "bad.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
await page.getByRole("alert").waitFor();
await page.goto(base + "/#templates");
await page.getByLabel("Search templates").fill("Rath Yatra");
await expect(page.locator(".large-template-card")).toHaveCount(3);
for (const width of [375, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "gallery overflow " + width,
  );
}
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "tests/gallery-mobile-v2.png", fullPage: true });
await page.goto(base + "/#home");
for (const width of [375, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "home overflow " + width,
  );
}
await page.goto(base + "/#editor");
page.once("dialog", (d) => d.accept());
await page
  .getByRole("button", { name: "Clear Saved Data", exact: true })
  .click();
await page.reload();
await page
  .getByRole("dialog", { name: "State and language preferences" })
  .waitFor();
assert.equal(
  await page.evaluate(() => localStorage.getItem("festivo3d-favourites")),
  null,
);
assert.equal(
  await page.evaluate(() => localStorage.getItem("festivo3d-preferences-v2")),
  null,
);
assert.equal(errors.length, 0, errors.join("\n"));
assert.equal(external.length, 0, external.join("\n"));
console.log(
  "PASS: remembered setup; Hindi/Tamil/Odia copy; large preview; favourites; regional filters; preserved business identity; upload/replace/remove; colors/fonts/layout; custom PNG dimensions; share/download fallback and WhatsApp number URL; route memory; restore; validation; structured quick create; responsive at 375/390/768/1024/1440; clear data. No uncaught errors or external requests.",
);
await browser.close();
