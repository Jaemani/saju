# SajuPop Product Spec v0.1

## Product Idea

SajuPop is an international Saju app that turns a corrected Four Pillars chart into a detailed, emotionally resonant English reading. The product keeps the low-price, high-detail feeling of Korean micro-fortune services, but adds education for users who are new to Saju.

## Core Promise

Enter your birth date, birth time, birthplace, and timezone. SajuPop calculates a corrected Korean Four Pillars chart, explains the technical markers, and translates them into a detailed reading across personality, career, money, love, family, friends, location, timing, and lucky habits.

## Target Users

- Astrology-curious Gen Z and millennials.
- K-culture fans who want a Korean metaphysical system beyond Western zodiac.
- BaZi/Four Pillars learners who want softer, consumer-friendly English.
- Couples, friends, founders, and creators who want compatibility readings.
- Users who are willing to pay a small price for a detailed novelty/self-reflection report.

## Positioning

SajuPop should sit between:

- `Traditional` - uses real Saju concepts and chart logic.
- `Accessible` - explains unfamiliar terms as it goes.
- `Emotional` - gives users memorable language about themselves.
- `Affordable` - a $0.99 entry product keeps the first purchase friction low.
- `Beautiful` - the interface feels like a nostalgic, glossy digital charm.

## International Naming

Recommended naming system:

- Brand: `SajuPop`
- Main product: `$0.99 Birth Chart`
- Credits: `Star Credits`
- Chat upsell: `Ask The Reader`
- Saved readings: `Vault`
- Daily free reading: `Daily Spark`

## Input System

Required fields:

- Name or nickname.
- Birth date.
- Birth time.
- Birth country.
- Birth city.
- Birth calendar: Gregorian, lunar, unknown.
- Time accuracy: exact, approximate, unknown.
- Optional relationship role: self, friend, partner, family, client.

Critical calculation requirement:

- Store original local birth time.
- Resolve birthplace to timezone.
- Correct daylight saving time when relevant.
- Apply longitude-based solar-time correction when enabled.
- Keep UTC and minute-level correction hidden from the default consumer UI.
- Show a simplified `location correction included` message, with detailed correction available only in a technical/debug layer.

Current v0.3 implementation note:

- The Manse core uses `lunar-javascript` for Four Pillars and solar-term-backed chart data.
- City and country are resolved with `city-timezones` and `countries-and-timezones`.
- IANA timezone, DST offset, and longitude correction are applied before chart generation.
- For cities that cannot be resolved, the app falls back to country-level timezone data and flags the location confidence internally.

## Main Screen Structure

1. Top app bar: brand, mode toggle, primary action.
2. Birth input panel: date, time, city, correction status.
3. Product rail: $0.99 reading, compatibility, decade, date picker, year ahead, daily free, ask.
4. Chart preview: Four Pillars, Ten Gods, hidden stems, life stages.
5. Reading preview: accordion sections with polished titles.
6. Glossary drawer/section: Saju basics, chart parts, stars, branch dynamics.
7. Bottom mobile navigation.

## Reading Sections

Default report sections:

- Core Metaphor
- Five Element Balance
- Day Master And Identity
- Reality Check
- Warm Validation
- Personality
- Career
- Money
- Love
- Family
- Friends
- Travel And Location
- Lucky Actions

## Content Logic

The writing engine should separate objective markers from prose:

- Objective markers: element counts, day master, month branch, Ten Gods, hidden stems, combinations, clashes, harms, punishments, Shinsal, luck cycles.
- Interpretation layer: use templates and LLM rewriting to create human prose.
- Voice layer: run a second empathy polish pass so the output feels caring, specific, and emotionally perceptive instead of generic.
- Guardrails: no diagnosis, no guaranteed outcome, no financial instruction framed as certainty.

## UI Modes

The app uses three label modes:

- `Simple` - plain-English labels only.
- `Technical` - Korean/Chinese concepts with English translation.
- `Poetic` - consumer-facing metaphors and warmer titles.

Future implementation should persist this preference per user.

## Visual Direction

The interface should combine:

- Y2K: chrome highlights, glossy buttons, high-contrast accent colors, pixel-grid texture.
- Frutiger Aero: glassy panels, optimistic aqua, breathable whitespace, soft reflections.
- Modern app UX: compact cards, segmented controls, clear CTAs, mobile-first nav.

Avoid:

- Heavy mystic cliches.
- Dark purple-only astrology palettes.
- Overly serious occult branding.
- Long educational blocks before the user can interact.

## Safety And Trust

Include these trust elements:

- Cultural explanation of Korean Saju.
- Transparent time correction.
- Clear refund/support entry.
- Privacy note for birth data.
- Entertainment and self-reflection disclaimer.

Suggested disclaimer:

> Saju is a traditional interpretive system used for reflection and entertainment. SajuPop does not provide medical, legal, financial, or psychological advice.
