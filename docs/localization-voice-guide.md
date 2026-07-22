# SajuPop Localization And Voice Guide

## Supported Locales

| Locale | UI | Generated reading | Default register |
| --- | --- | --- | --- |
| `en` | Complete | Complete | Clear, warm international English |
| `ko` | Complete | Complete | Natural Korean `해요체` |
| `zh-CN` | Complete | Complete | Restrained, modern Simplified Chinese |
| `es` | Complete | Complete | Neutral international Spanish with `tú` |
| `ja` | Complete | Complete | Gentle Japanese `です・ます` style |

The selected locale is stored in `localStorage` and included in the reading request. Changing the language on the result page regenerates the report so the long-form reading and the interface stay in the same language.

## Voice Pipeline

1. The Manse engine calculates the chart without prose.
2. The server creates a compact fact block in the selected language and assigns allowed evidence to each section.
3. One model pass writes the final report with locale-specific rhythm, empathy, and clarity.
4. The server checks section density, terminology, pillar placement, editor-language leakage, and common machine-writing signals.
5. A report that misses the locale threshold receives one native-quality repair pass.
6. The server replaces every `technicalBasis` field with deterministic, plain-language evidence from the calculated chart.

The product uses two presentation layers. The visual Manse chart preserves canonical Hanja and pronunciation labels so a knowledgeable reader can verify the calculation. Reading titles, bodies, actions, and expandable evidence translate those markers into meaning: `Yang Fire over Tiger (Wood)`, `structure and responsibility`, or `a subtle friction pattern`. Raw eight-character strings, pinyin pillar codes, and branch-code relationships do not belong in prose.

Dates, element counts, pillar ownership, Ten God relationships, and relationship markers must not change during the writing passes. The server may change notation only by replacing a calculated marker with its locale-specific semantic equivalent.

Colors, jewelry, plants, room directions, and similar objects are not presented as causal remedies. Suggested actions must be ordinary, low-risk experiments such as changing a schedule, writing down a decision, asking for help, or setting a boundary.

## Shared Voice Rules

- Recognize the pressure or contradiction before offering advice.
- Tie emotional observations to a chart marker. Do not invent biography, trauma, or family events.
- Keep direct sections protective. No humiliation, scolding, or deterministic claims.
- Use one useful metaphor rather than stacking poetic images.
- Vary paragraph order and sentence length so sections do not share one template.
- Avoid medical, legal, psychological, and financial certainty.
- Treat balancing elements as interpretive cues, not a definitive `용신` diagnosis.

## Korean

The Korean rules incorporate the local `humanize-korean` quick rules: remove translation-shaped phrases, repeated formal nouns, mechanical connectors, uniform endings, inflated reassurance, and unnecessary English words. The product uses a steady `해요체`, limits repeated `거든요` and `답니다`, and prefers `풀이` over `리딩` and `오행/기운` over the generic `요소` when discussing the chart.

Korean prose uses forms such as `병화`, `병인일주의 흐름`, and `수 기운` instead of repeatedly showing `丙`, `丙寅`, or `Bing-Yin`. Chinese and Japanese may use native characters when they improve readability, but never add pinyin or romanized pillar codes. English and Spanish prose use no chart Hanja.

The Fast Path review artifact is saved at `_workspace/2026-07-22-001/final.md`.

## Simplified Chinese

Use modern standard Mandarin with natural subject omission. Avoid stacks of four-character phrases, internet slang, exclamation marks, repeated `这意味着`, and grand statements about fate. Explain a technical term once in plain language, then continue without textbook repetition.

## Spanish

Use neutral international Spanish and natural `tú`. Avoid English calques, unnecessary gender marking, abstract noun chains, repeated `esto significa`, and self-help cliches. Prefer concrete verbs and readable sentence variation.

## Japanese

Use `です・ます` as the base register while varying sentence endings naturally. Avoid repeating `あなた`, `ということです`, and explicit subjects that Japanese would normally omit. Keep metaphors restrained and explain technical terms in place.

## Reference Material

- Local Korean humanization taxonomy and quick rules: `/Users/jaeman/Codes/im-not-ai/codex/skills/humanize-korean/references/quick-rules.md`
- Microsoft Writing Style Guide: https://learn.microsoft.com/en-us/style-guide/welcome/
- Google developer documentation style guide: https://developers.google.com/style
- W3C Requirements for Chinese Text Layout: https://www.w3.org/TR/clreq/
- W3C Requirements for Japanese Text Layout: https://www.w3.org/TR/jlreq/
- FundéuRAE language recommendations: https://www.fundeu.es/
- Real Academia Española, Diccionario panhispánico de dudas: https://www.rae.es/dpd

These references guide clarity, punctuation, terminology, and layout. SajuPop's emotional voice rules are product-specific and are tested against generated samples rather than presented as rules from those organizations.
