# SajuPop International Saju App

SajuPop is an overseas version of a low-price Korean Saju reading service. It benchmarks the Saju-i style of product packaging, but reframes the experience for English-speaking users who do not know Saju, BaZi, the Manse calendar, Ten Gods, Shinsal, branch relationships, or Korean fortune vocabulary.

## What Is Included

- `index.html` - responsive home, birth setup, product cards, chart education, and glossary.
- `reading.html` - dedicated generated reading room with loading progress, result page, and login-ready checkout gate.
- `styles.css` - Y2K x Gen Z visual system with glossy chrome, aqua, lime, pink, and compact product cards.
- `script.js` - category filtering, glossary filtering, accordions, country/city birth input, chart snapshots, and API rendering.
- `reading.js` - result-page generation, progress state, and generated report rendering.
- `api/saju-engine.js` - library-backed Manse core using `lunar-javascript`, city timezone lookup, IANA timezone offsets, DST handling, and longitude correction.
- `api/generate-reading.js` - Vercel serverless endpoint for chart calculation and OpenAI reading generation.
- `assets/pillars-orbit.svg` - reusable chart visual asset.
- `docs/product-spec.md` - overseas product strategy, UX, monetization, and content logic.
- `docs/benchmark-sajui.md` - benchmark notes from Saju-i and international adaptation rules.
- `docs/saju-glossary-en.md` - English label system for Saju, Manse calendar, Ten Gods, stars, combinations, clashes, harms, and sample Korean terms.
- `UPDATES.md` - version notes.

## Open The App

Open `index.html` directly for the static UI. To use live generated readings, deploy to Vercel or run `vercel dev` with `OPENAI_API_KEY` in `.env`.

## Reading Engine

The current implementation separates chart structure from prose:

1. The Manse core calculates year, month, day, and hour pillars, element balance, hidden stems, Ten Gods, symbolic stars, and relationship tags.
2. The OpenAI Responses API generates a structured reading from the chart JSON.
3. A second OpenAI pass rewrites the same JSON for empathy, encouragement, and polished Saju-i-style emotional tone.

Set `OPENAI_MODEL` to override the default model. The default is `gpt-5-mini`.

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
