# Festivo3D · India's localized poster studio

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

Routes use hashes and work on static hosting: `/#home`, `/#templates`, `/#create`, `/#editor`, `/#preview`. Slash-prefixed hashes, such as `/#/editor`, work too.

## What's implemented

- Dark, responsive interface with CSS perspective, restrained motion and reduced-motion support
- **36 states and UTs**, **14 poster languages**, **49 occasions**, **86 free template records**, and **18 business categories**
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

Recommendations are curated relevance scores (region, language coverage, business category and recency), not claims about live popularity, sales performance or upcoming festival dates.

## Persistence and privacy

LocalStorage contains business/profile text, preferred colours, typography, output format, editor preferences, state/language/category setup, favourites and recent template IDs. Images are **never written to LocalStorage** and never uploaded. They remain in memory across app routes and disappear on reload, closing the tab or clearing data. This applies to logos too; persistent logo storage is intentionally not implemented.

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
- All 86 template renders and all 14 language/font renders
- Corrupted/oversized images, Canvas failure, export failure and dimension bounds
- Native share supported branch via a controlled browser stub (not a real WhatsApp transmission)
- Permission-granted coarse location suggestion without automatic persistence
- Storage-blocked editing and a real PNG download
- No uncaught browser errors or external requests in the end-to-end journey

Tests create screenshots and sample exports under `tests/`. Physical-device native sharing and OS-specific behaviour should also be smoke-tested on the devices used for rollout.
