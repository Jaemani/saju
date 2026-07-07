# Update Notes

## v0.3.1 - Focused Login Providers

Date: 2026-07-07

### Changed

- Limited member login to Google and email/password.
- Removed unused social provider copy from account screens and Firebase setup docs.
- Removed unused social provider icon styles.

## v0.3.0 - Library-Backed Manse Core And Reading Room

Date: 2026-07-07

### Added

- Added `lunar-javascript` for library-backed Four Pillars, solar terms, hidden stems, Ten Gods, life stages, Na Yin, and void branches.
- Added `city-timezones` and `countries-and-timezones` for country/city disambiguation, IANA timezone lookup, DST-aware offset handling, and longitude correction.
- Added dedicated `reading.html` result page with loading animation, estimated time, elapsed time, and generation steps.
- Added login-ready checkout gate on the result page.
- Added button-based city suggestions so suggested cities remain readable and styleable.
- Added Firebase Auth client for Google and email/password login.
- Added Firestore member management model at `members/{uid}`.
- Added account page for profile, credits, plan, and saved reading placeholders.
- Added `/api/firebase-config` for Vercel-managed Firebase client config.
- Added Firestore security rules for user-scoped member documents.

### Changed

- Removed the Reading Tone selector. The product now uses one opinionated SajuPop voice.
- Split home/explanation and generated result into separate pages.
- Replaced text-heavy guide cards with visual pillar tiles, element icons, relationship map nodes, and chart chip icons.
- Replaced the internal prototype calculation layer with a library-backed Manse calculation module.

## v0.2.0 - Live Reading Engine And Visual Decoder

Date: 2026-07-07

### Added

- Added Vercel serverless API route `api/generate-reading.js`.
- Added Saju chart calculation for pillars, element balance, hidden stems, Ten Gods, relationship tags, and symbolic stars.
- Connected OpenAI Responses API with default `gpt-5-mini`.
- Added two-pass writing flow: chart-based draft, then empathy and encouragement polish.
- Added country/city birth input with dynamic city suggestions and free-text city support.
- Added visual chart snapshot for Day Master, Four Pillars roles, Five Element bars, and plain-English decoding.
- Added Vercel environment sync helper for `OPENAI_API_KEY`.

### Changed

- Renamed brand to `SajuPop - Korean Four Pillars`.
- Simplified user-facing location correction copy. UTC offset and minute-level solar correction are no longer shown in the main form.
- Updated generated result UI so unfamiliar Saju terms are supported by visual structure before long prose sections.

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
