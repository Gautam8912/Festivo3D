# Festivo3D · The Divine Atelier

A working **zero-backend** React/Vite poster studio for local Indian businesses. Original Canvas artwork, local image processing, regional recommendations, multilingual phrases and PNG export. No account, API key, cloud database, analytics, remote image assets or server-side rendering.

## Run and deploy

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

Deploy **`dist/`** to Vercel, Netlify or Cloudflare Pages using the Vite preset. Build command: `npm run build`; output directory: `dist`. No environment variables or server rewrites are needed. Vite is a local development/static-preview tool, not an application backend.

Routes use hashes and work on static hosting: `/#home`, `/#templates`, `/#create`, `/#editor`, `/#preview`, `/#calendar`. Slash-prefixed hashes, such as `/#/editor`, work too.

## What's implemented

- Dark, responsive interface with CSS perspective, restrained motion and reduced-motion support
- **36 states and UTs**, **14 poster languages**, **89 occasions**, **140 free template records**, and **18 business categories**
- First-visit state/language/category setup, state-recommended language, automatic restoration and preferences accessible from the navbar
- Personalized homepage, regional festival suggestions and deterministic gallery ranking
- Search by occasion, regional aliases, native name, design or business; occasion/category filters, favourites, recent templates and incremental gallery loading
- Large 3/2/1-column gallery, aspect-preserving thumbnails and large template preview modal
- Quick Create with structured fields and an optional **explicitly rule-based** brief reader. No AI claims, AI model or API
- Saved business profile with owner, phone, WhatsApp, address, city, website, Instagram and Facebook
- Native-language greeting, headline, discount, tagline and CTA; business names and contact values remain unchanged
- Local logo, product, owner and additional photo uploads; replace, remove, position, rotate, scale, zoom, fill/fit cropping and reset
- Palette presets and custom colours; heading typography, padding, spacing, corner radius, border/decorations and photo-shadow controls
- Live, lower-resolution Canvas preview, separate full-resolution export using the same deterministic renderer
- Optional 3D presentation, mobile bottom toolbar, collapsible editing controls and dedicated final-preview route
- Social formats and bounded custom dimensions (320–2400 pixels per side)
- Actual PNG downloads, native file sharing when available, automatic download fallback and optional WhatsApp message links
- Friendly validation and storage/file/render/export failure handling

## Localization: what's local, and what's deliberately not claimed

Poster copy is a **curated phrase library**, not live translation. All 14 languages have offer, discount, greeting and CTA wording. Common and regionally relevant festival names are localized. A festival without a curated local name retains its English name alongside the selected language's phrases. Custom user text is never machine-translated. Business names and phone numbers are never translated.

The interface controls remain in English. Native-script Canvas text uses bundled Noto fonts; Latin text uses the selected device display font. The Noto fonts are served from this app's own `public/fonts/` directory and loaded on demand. Each font's SIL Open Font License is included alongside it. Export awaits the needed fonts, including scripts detected in user-entered business text.

Optional browser geolocation uses **coarse local state centres**, not an external reverse-geocoding service or a precise state boundary database. It gives a visibly labelled approximate suggestion requiring the user's confirmation. Border areas, coastal cities and small UTs can yield a nearby state rather than the correct one. Manual selection is always available; raw coordinates are not stored. Some states' recommended language is English where the catalogue does not include the region's primary language.

Recommendations are curated relevance scores (region, language coverage, business category and recency), not claims about live popularity or sales performance. September recommendations also use the dated reference catalogue; dates are not dynamically calculated.

## Persistence and privacy

LocalStorage contains regional targeting, selected September event/preset, business/profile text, preferred colours, typography, output format, editor preferences, state/language/category setup, favourites and recent template IDs. Images are **never written to LocalStorage** and never uploaded. They remain in memory across app routes and disappear on reload, closing the tab or clearing data. This applies to logos too; persistent logo storage is intentionally not implemented.

Input files: JPEG, PNG and WEBP, up to 20 MB. Images are decoded locally and resized to a maximum longest side of 1800 pixels. Cropping is non-destructive: sliders modify render settings, not the source photo.

**Clear Saved Data** in the editor requires confirmation and removes the app's profile/settings, preferences, favourites, recents and current in-memory photos. Subsequent editing starts a new saved draft. If storage is blocked/full, the current session remains usable and the UI reports the saving failure.

The app makes no external requests during poster creation or export. Sharing is an explicit user action. Native sharing opens the OS chooser, which may include WhatsApp. If native file sharing is unavailable, the PNG downloads and instructions explain how to attach it manually. Opening a WhatsApp link sends the displayed promotional message to WhatsApp. A supplied WhatsApp number is normalized for the link only; a 10-digit number is prefixed with India's `91`. The number shown on the poster is not modified. Geolocation may use the browser/OS location provider after consent, but the app sends no coordinates to a service.

## Architecture

- `src/data/regions.js`: states/UTs, language recommendations, regional preferences and coarse geolocation suggestions
- `src/data/templates.js`: templates, motifs, variants, presets, business categories and output-size definitions
- `src/data/festivalCatalogue.js`: structured occasion records with supported regions, language phrases and template IDs
- `src/data/aliases.js`: regional occasion-name aliases
- `src/i18n/`: 14 editorial language dictionaries, native names, copy generation and local-font readiness
- `src/hooks/StudioContext.jsx`: shared session state (including in-memory images)
- `src/components/`: reusable onboarding, gallery, modal, editor, image, colour, layout and format controls
- `src/pages/`: landing, quick creation and final preview; the editor is lazy-loaded
- `src/utils/canvasRenderer.js` and `festivalDecorations.js`: deterministic canvas artwork and regional vector motifs
- `src/utils/renderExport.js`: validated, font-ready, full-resolution rendering
- `src/utils/whatsapp.js`, `posterExport.js`, `imageUtils.js`, `preferences.js`, `storage.js`, `ranking.js`, `briefParser.js`: isolated client-side helpers
- `src/styles/`: dark studio system and local font declarations (base responsive styles are in `src/styles.css`)

Templates contain names, occasions, supported states/languages, category metadata, layouts, motifs and a `premium` flag. All are currently free. Additional templates, language packs and design layouts can be added without a backend. No future payments, authentication or premium restrictions are simulated.

## Tests

Install Chromium once:

```sh
npx playwright install --with-deps chromium
```

With the development server on port 5173:

```sh
node tests/flow.mjs
node tests/engine-errors.mjs
```

Test the **production build** with `npm run build`, start `npm run preview`, then:

```sh
TEST_URL=http://localhost:4173 node tests/flow.mjs
```

`TEST_URL` can point the flow test at another port. `engine-errors.mjs` uses Vite source-module imports and must run against the development server, not the production build.

### Verified browser coverage

- State setup/restore and state-recommended languages; Hindi, Tamil and Odia editor text
- Gallery, category/occasion filters, search, favourites, preview modal and template selection
- Business-name preservation and full profile editing
- Image upload, replacement, removal, rotation and zoom
- Colours, fonts, layout and exact custom PNG dimensions
- Actual downloaded PNG file, unsupported-sharing download fallback and WhatsApp URL generation
- In-memory photos across editor/preview routes; settings restoration after reload
- Empty-name/phone validation, Quick Create and deterministic brief extraction
- 375, 390, 768, 1024 and 1440 pixel responsive overflow checks
- Clear-data confirmation and onboarding returning afterward
- All 140 template renders and all 14 language/font renders
- Corrupted/oversized images, Canvas failure, export failure and dimension bounds
- Native share supported branch via a controlled browser stub (not a real WhatsApp transmission)
- Permission-granted coarse location suggestion without automatic persistence
- Storage-blocked editing and a real PNG download
- No uncaught browser errors or external requests in the end-to-end journey

Tests create screenshots and sample exports under `tests/`. Physical-device native sharing and OS-specific behaviour should also be smoke-tested on the devices used for rollout.

## Divine Atelier upgrade · September 2026

The default renderer is now the royal atelier. All current presets use layered royalty-inspired artwork, gradient gold type, vignette depth, filigree, brass bells and a translucent gold-bordered business footer. The four new colour presets are Royal Velvet Maroon (`#2A0812`), Imperial Navy (`#040B22`), Emerald Forest (`#042215`) and Dark Saffron Glow (`#3A1200`). The original six colour choices and an explicit Classic renderer option remain available for existing workflows.

### Artwork

Original, stylized **Canvas 2D / Path2D illustrations**, not stock deity photographs, a 3D model or generated-image API:

- Ganesha: sculpted elephant-headed figure, crown, curled trunk, four arms, modak platter, Mushak, trishul and mandala
- Shiva–Parvati: paired silhouettes, floral swing, marigold toran, green bangles and botanical edging
- Vishwakarma: crowned artisan figure, beard, hammer, anvil, gears, blueprint lines and golden chariot
- Krishna / Radha–Krishna: flute, peacock feather, butter pot, kadamba tree and lotus setting
- Surya / Chhath: radiant sun figure, water ripples, sugarcane frame, offering basket and brass lota
- Additional sacred-lotus, sage and remembrance designs; other festival motifs now have a royal vector treatment too

Three artwork finishes are selectable: **Sculpted gold**, **Temple engraving** and **Antique bronze**. Metallic heading treatment, aura intensity and artwork size are editable. The art is a respectful symbolic interpretation, not a claim of religious or iconographic authority. Native-script names for the core divine festivals are held in `src/i18n/divineNames.js`.

### Calendar and regional targeting

`/#calendar` contains **44 listed September 2026 observances**, including all 11 separately represented major events in the brief. It is a curated reference month, **not an exhaustive calendar for every Indian community or a calculated panchang**. Civil date records and source provenance live in `src/data/septemberObservances.js`; `src/data/festivalCatalogue.js` exports the enriched `september2026` dataset with states, clusters, languages, business categories and preset IDs.

The hierarchy is India → State/UT → optional regional cluster → language → active observance → divine preset. `src/data/targeting.js` defines editorial clusters for all 36 states/UTs. They are not administrative boundaries or demographic claims. Cluster and language preferences **rank relevance**; the “My region only” filter limits state availability without restricting which language a user can choose. Pan-India observances remain available everywhere.

State, cluster, language, active event and preset are remembered in LocalStorage. Calendar targeting does not overwrite an existing poster until a preset is chosen. Changing only a region in the preferences dialog preserves custom poster text; changing the poster language applies localized starting copy. Business names and contact numbers are always preserved.

The calendar has grid/list views, day selection, search (including aliases and native names), region/highlight filters, a large live preset preview, source notes and an actual **ICS download** of the filtered events. ICS files use all-day dates and UTF-8-aware line folding. The reference month is fixed to September 2026; “Today” uses the browser clock in `Asia/Kolkata`, not a hardcoded day.

### September reference dates

| Date         | Major observance                                     |
| ------------ | ---------------------------------------------------- |
| 4 September  | Janmashtami / Krishna Jayanti                        |
| 14 September | Hartalika Teej; Ganesh Chaturthi / Vinayaka Chavithi |
| 15 September | Rishi Panchami                                       |
| 17 September | Vishwakarma Puja; Kanya Sankranti                    |
| 19 September | Radha Ashtami                                        |
| 22 September | Parsva / Parivartini Ekadashi                        |
| 25 September | Anant Chaturdashi; Ganesh Visarjan                   |
| 26 September | Purnima Shraddha (listed separately)                 |
| 27 September | Pitru Paksha / Pratipada Shraddha                    |

Sources: [2](https://news.abplive.com/religion/september-2026-vrat-festival-list-know-dates-of-ganesh-chaturthi-pitru-paksha-hartalika-teej-and-more-1864441), [3](https://www.news18.com/lifestyle/spirituality/when-is-pitru-paksha-2026-check-dates-significance-and-rituals-ws-l-10311650.html). Reference reviewed 14 September 2026. Regional, sectarian and family observances can differ. In particular, some calendars count Purnima Shraddha on 26 September as the beginning of the ancestral period, while Pratipada is 27 September. Both are shown with this qualification. The app supplies **no puja times, tithi calculations or muhurat advice**.

Remembrance templates default to a quiet lamp composition and no sale/discount/CTA copy. Users can still edit their own poster text.

### Rendering and export

- `src/utils/royalRenderer.js`: adaptive square/portrait composition, metallic text, photo blending and glass-look footer
- `src/utils/art/gold.js`: deterministic gold, glow, filigree and brass primitives
- `src/utils/art/deities.js`: deity-inspired vector compositions
- `src/utils/art/royalMotifs.js`: royal treatments for the remaining festival motifs
- `src/utils/calendarEngine.js`: filtering, relevance, India date handling and ICS export
- `src/components/TargetingBar.jsx`, `CalendarTeaser.jsx`, `src/pages/Calendar.jsx`: actual calendar-to-editor workflow

The final-preview screen has one-click **WhatsApp Status 1080×1920** and **Instagram Square 1080×1080** PNG export buttons. They render from vectors at the requested resolution; they do not upscale the lower-resolution preview. Uploaded raster photos remain limited by their original quality. Very wide custom sizes centre a square royal composition on an ambient background rather than distort the deity or script. Typography auto-fits longer headings around artwork and the footer.

All fonts continue to be **bundled Noto fonts originally distributed through Google Fonts**, loaded from this app’s own static files before rendering. No Google Fonts network requests or backend service are required at runtime.

### Additional verification

With `npm run dev` running:

```sh
node tests/royal-calendar.mjs
node tests/calendar-data.mjs
```

Against a running production preview:

```sh
TEST_URL=http://localhost:4173 node tests/royal-calendar.mjs
```

Coverage includes all major supplied dates, reference links, all state/cluster/preset connections, India timezone boundaries, every primary deity in three distinct art finishes, deterministic rendering, wide/tall custom canvases, remembered targeting, live calendar-to-editor selection, Bengali copy, no-sale remembrance defaults, uploaded logo, filters/views/empty days, actual ICS files, exact HD PNG dimensions and responsive layouts from 375–1440 pixels. The production browser journey also checks for console errors and external requests. Source-module tests (`calendar-data.mjs` and `engine-errors.mjs`) require the development server.
