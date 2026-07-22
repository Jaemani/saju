# SajuPop UX And Design Audit

Date: 2026-07-22

## Scope

Combined UX, visual, responsive, and screenshot-based accessibility review of the main journey: home, birth setup, loading, generated result, login boundary, and guest account. Desktop was reviewed at `1440 x 1000`; mobile at `390 x 844`.

## Overall Verdict

The visual identity was recognizable and the birth form was usable, but the first version became a long sequence of similar white cards. The generated result repeated the same chart summary across too many panels, exposed implementation language such as model and writing-pass names, and became especially dense on mobile. The guest account looked like a large management dashboard before the user had anything to manage.

The revised flow keeps the existing Y2K color and chrome language while making the product easier to scan: one opinionated reading voice, a visible language selector, horizontal learning rails on mobile, fewer duplicate result panels, folded technical evidence, and a smaller account promise.

## Flow Steps

1. **Home and entry point - healthy after revision.** The birth form remains visible beside the main promise on desktop. The reading-tone switch was removed, proof points were added, and mobile learning/product cards now scroll horizontally instead of creating a very long page.
2. **Birth setup - healthy with a remaining edge case.** Country coverage now comes from 248 country records and city search from more than 7,000 city records. Country and city are enough for the user; raw UTC and solar-minute calculations stay hidden. Lunar dates are converted before the Four Pillars calculation. Leap lunar month input still needs a dedicated control.
3. **Loading - healthy.** The screen gives an honest 1-3 minute estimate and explains progress in user language. Developer phrases such as “empathy polish” were replaced with calm steps. The page now has reduced-motion behavior, but live-region timing still needs a screen-reader pass.
4. **Generated result - materially improved.** Model names and internal pass labels are gone. The order is now overview, chart, full reading, and small actions. Only two sections open initially, and technical evidence sits under “Why the chart says this.” Mobile quick-take cards swipe horizontally rather than stacking seven panels before the chart.
5. **Login and account - healthy for the current product stage.** Reading remains available before login. Login is required only for saving and checkout. The guest account now describes the value of Vault, credits, and privacy without implying that unfinished payment features already work.

## Accessibility Notes

- Visible focus treatment and reduced-motion handling were added.
- Form labels remain programmatically associated with inputs, and status/loading regions keep semantic live updates.
- Horizontal rails preserve full card width and do not clip text, but they should receive an explicit touch and keyboard usability check on real devices.
- Screenshot review cannot confirm screen-reader output, keyboard order across every modal state, or WCAG contrast ratios. Those require automated contrast checks plus VoiceOver/NVDA testing.

## Evidence

Before: `01-home-desktop.png`, `02-home-mobile.png`, `03-loading-desktop.png`, `04-result-desktop.png`, `05-account-desktop.png`, `06-account-mobile.png`, `07-result-mobile.png`.

After: `08-home-ko-mobile.png`, `09-account-ko-mobile.png`, `10-loading-ko-desktop.png`, `11-result-ko-desktop.png`, `12-result-ko-mobile.png`, `13-home-en-desktop.png`, `14-account-en-desktop.png`.

## Highest-Priority Follow-Ups

1. Add a lunar leap-month control and birth-time uncertainty treatment to the result.
2. Persist saved readings to Firestore and replace account preview text with real empty states.
3. Run VoiceOver/NVDA and automated contrast checks before payment launch.
4. Add locale-specific golden samples so writing regressions fail before deployment.
