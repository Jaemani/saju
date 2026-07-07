# Update Notes

## v0.2.0 - Live Reading Engine And Visual Decoder

Date: 2026-07-07

### Added

- Added Vercel serverless API route `api/generate-reading.js`.
- Added prototype Saju chart calculation for pillars, element balance, hidden stems, Ten Gods, relationship tags, and symbolic stars.
- Connected OpenAI Responses API with default `gpt-5-mini`.
- Added two-pass writing flow: chart-based draft, then empathy and encouragement polish.
- Added country/city birth input with dynamic city suggestions and free-text city support.
- Added visual chart snapshot for Day Master, Four Pillars roles, Five Element bars, and plain-English decoding.
- Added Vercel environment sync helper for `OPENAI_API_KEY`.

### Changed

- Renamed brand to `SajuPop - Korean Four Pillars`.
- Simplified user-facing location correction copy. UTC offset and minute-level solar correction are no longer shown in the main form.
- Updated generated result UI so unfamiliar Saju terms are supported by visual structure before long prose sections.

### Notes

- The current Saju calculation layer is a prototype. Production should replace the built-in city/country table and solar-term approximation with a verified Manse calendar engine.

## v0.1.0 - International Saju Baseline

Date: 2026-07-07

### Added

- Created the SajuPop overseas Saju concept.
- Added a responsive static app prototype with product cards, birth data input, chart preview, sample reading, and glossary.
- Added English terminology for Saju, Manse calendar concepts, Five Elements, Heavenly Stems, Earthly Branches, Ten Gods, Twelve Life Stages, Shinsal, and branch/stem relationships.
- Added Saju-i benchmark notes and international adaptation rules.
- Added product specification covering target users, input requirements, report structure, UX modes, monetization, and trust guardrails.
- Added a custom Four Pillars visual asset.

### Design Direction

- Established a Y2K x Gen Z visual direction using chrome, glass, aqua, lime, pink, compact cards, and mobile-first navigation.
- Avoided a dark-purple astrology look so the product feels more like a Korean cultural self-reflection app than a generic horoscope site.

### Next

- Connect a real Manse calendar calculation engine.
- Add city search and timezone/solar-time correction receipts.
- Add localized versions for Spanish, Japanese, and French.
- Add real checkout and Star Credit balance.
