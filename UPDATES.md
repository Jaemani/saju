# Update Notes

## v0.4.1 - Plain-Language Reading Evidence

Date: 2026-07-22

### Changed

- Separated canonical chart notation from reading prose: Hanja and pronunciation labels remain in the visual Manse chart, while the report explains their meaning in natural language.
- Replaced repeated pillar strings such as `丙寅 (Bing-Yin)` with readable descriptions such as `Yang Fire over Tiger (Wood)`.
- Replaced branch-code relationships such as `Yin-Si: Harm` with meaning-led phrases such as `a subtle friction pattern`.
- Rewrote deterministic section evidence around identity, inner qualities, pressure, resources, relationships, and balance instead of repeating all four pillars.
- Clarified strongest and quietest element language and distinguished visible element counts from hidden-layer weighting.

### Quality

- Added output checks for Hanja, pinyin, romanized pillar codes, and excessive technical-pillar repetition in English, Spanish, and Korean prose.
- Added regression coverage based on the reported `丙 (Bing, Yang Fire)`, `Bing-Yin`, `Gui-Si`, and `Yin-Wu` leakage patterns.

## v0.4.0 - Native Voice Locales And UX Audit

Date: 2026-07-22

### Added

- Added complete UI and generated-reading support for English, Korean, Simplified Chinese, Spanish, and Japanese.
- Added locale-specific native voice rules and a quality repair pass for thin or machine-sounding reports.
- Added a deterministic multilingual chart lexicon and section-level evidence layer so generated prose cannot rewrite the displayed Manse facts.
- Added API-backed coverage for 248 countries and more than 7,000 city records.
- Added Playwright coverage for the Korean journey and mobile layout checks across all five locales.
- Added localization voice documentation and a screenshot-backed product design audit.
- Added lunar-date conversion before solar-time correction and Four Pillars calculation.

### Changed

- Removed the remaining label/tone switch from the home page.
- Reworked result hierarchy into overview, chart, full reading, and small actions.
- Hid model names and internal writing-pass labels from customers.
- Moved technical chart evidence into an optional explanation inside each reading section.
- Turned mobile product, education, glossary, and quick-take groups into swipeable rails to reduce page length.
- Reframed the guest account around saving value instead of unfinished management features.
- Updated loading language and timing to support the native-language quality pass.
- Reduced generation from three unconditional writing calls to one final draft plus one conditional repair, with a measured 1-3 minute loading estimate.
- Disabled OpenAI response storage and added checks for misplaced stems, leaked editor instructions, untranslated chart labels, and superstition-shaped object remedies.

## v0.3.2 - Reading UX And Visual Hierarchy

Date: 2026-07-09

### Changed

- Let users generate the first reading before login; login remains for saving and checkout.
- Added quick-take result cards and a visual chart map above the long generated reading.
- Collapsed later generated sections by default so mobile reading feels lighter.
- Moved mobile checkout login CTA below the reading content instead of interrupting the top.
- Reworked guest account page into a value preview for Vault, credits, and private profile.
- Updated loading copy with more human progress states for longer generation times.

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
