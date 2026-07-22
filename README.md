# SajuPop International Saju App

SajuPop is an overseas version of a low-price Korean Saju reading service. It benchmarks the Saju-i style of product packaging, but reframes the experience for English-speaking users who do not know Saju, BaZi, the Manse calendar, Ten Gods, Shinsal, branch relationships, or Korean fortune vocabulary.

## What Is Included

- `index.html` - responsive home, birth setup, product cards, chart education, and glossary.
- `reading.html` - dedicated generated reading room with loading progress, result page, and login-ready checkout gate.
- `account.html` - Firebase-backed member management page for profile, credits, plan, and saved reading placeholders.
- `styles.css` - Y2K x Gen Z visual system with glossy chrome, aqua, lime, pink, and compact product cards.
- `i18n.js` - complete interface localization for English, Korean, Simplified Chinese, Spanish, and Japanese.
- `script.js` - category filtering, glossary filtering, accordions, country/city birth input, chart snapshots, and API rendering.
- `reading.js` - result-page generation, progress state, and generated report rendering.
- `auth.js` - Firebase Auth client for Google and email/password login.
- `api/firebase-config.js` - Vercel endpoint that exposes public Firebase web config from env vars.
- `api/saju-engine.js` - library-backed Manse core using `lunar-javascript`, city timezone lookup, IANA timezone offsets, DST handling, and longitude correction.
- `api/generate-reading.js` - Vercel serverless endpoint for chart calculation and OpenAI reading generation.
- `api/locale-voice.js` - language-specific voice, empathy, rhythm, and anti-translation rules.
- `api/locale-chart.js` - deterministic chart terminology, localized fact blocks, and section evidence for all supported languages.
- `api/locations.js` - searchable country and city data for birthplace selection.
- `firestore.rules` - user-scoped member document access rules.
- `assets/pillars-orbit.svg` - reusable chart visual asset.
- `docs/product-spec.md` - overseas product strategy, UX, monetization, and content logic.
- `docs/benchmark-sajui.md` - benchmark notes from Saju-i and international adaptation rules.
- `docs/saju-glossary-en.md` - English label system for Saju, Manse calendar, Ten Gods, stars, combinations, clashes, harms, and sample Korean terms.
- `UPDATES.md` - version notes.
- `tests/localized-ux.spec.js` - Playwright checks for localized home, loading, result, and account flows.

## Open The App

Open `index.html` directly for the static UI. To use live generated readings, deploy to Vercel or run `vercel dev` with `OPENAI_API_KEY` in `.env`.

## Reading Engine

The current implementation separates chart structure from prose:

1. The Manse core calculates year, month, day, and hour pillars, element balance, hidden stems, Ten Gods, symbolic stars, and relationship tags.
2. The server turns the chart into a compact localized fact block and assigns verified evidence to each reading section.
3. The OpenAI Responses API writes a native-language structured report from only those allowed facts and self-edits once before returning it.
4. Reports that miss density, terminology, factual-placement, or native-language checks receive one repair pass.
5. Technical evidence is rebuilt from the Manse result after generation, so model prose cannot alter pillars, counts, or relationship tags.

The default model is `gpt-5-mini`; set `OPENAI_MODEL` to override it. GPT-5 requests use low reasoning effort to reduce latency, and API responses are not stored by OpenAI (`store: false`). Generated reports and interface copy support `en`, `ko`, `zh-CN`, `es`, and `ja`.

## Local Verification

Run `npx vercel dev --listen 3101 --yes` for the static pages and serverless APIs. Run `npm run test:e2e` for localized Playwright checks.

Writing and localization rules are documented in `docs/localization-voice-guide.md`. The latest visual audit is in `docs/audits/2026-07-22/audit.md`.

## Auth And Members

SajuPop uses Firebase Authentication and Firestore for account management. The UI supports Google and email/password login. Checkout is intentionally login-gated, and member documents are stored at `members/{uid}`.

Firebase setup details are in `docs/firebase-setup.md`.

## Positioning

The product should feel like:

- A $0.99 entry point, not an expensive mystical consultation.
- A culturally respectful introduction to Korean Saju/Four Pillars.
- A detailed, warm, trend-aware reading that turns objective chart data into useful life-language.
- A visual hybrid between late-1990s/early-2000s glossy digital culture and modern mobile-first app UX.

## Design References

The visual direction references:

- CARI Y2K Aesthetic: glossy surfaces, gradients, chrome, blobby digital optimism.
- CARI Frutiger Aero: glassy UI, optimistic tech, humanist interface cues, bright tertiary color.
- Current Gen Z maximalism: expressive color, playful type hierarchy, personal narrative, and nostalgic tech cues.

These are used as visual principles only. No external image assets were copied.
