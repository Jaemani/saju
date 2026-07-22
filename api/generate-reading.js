const { calculateSaju } = require("./saju-engine");
const { localeVoice } = require("./locale-voice");
const { TERM_MAPS, localizeChartText, localizedChartFacts, sectionEvidence, applyTechnicalEvidence, simplifyReadingNotation } = require("./locale-chart");

const REQUIRED_SECTION_KEYS = [
  "core_metaphor", "element_balance", "day_master", "reality_check", "validation", "personality", "career",
  "money", "love", "family", "friends", "location", "lucky_actions"
];

const SECTION_PURPOSES = {
  core_metaphor: "Give one memorable image, then describe the central emotional contradiction without turning the whole body into poetry.",
  element_balance: "Explain which response is overused and which quality needs room. Use qualitative element relationships only; never print the numeric inventory.",
  day_master: "Describe identity, private standards, and how the person restores a sense of self. Keep technical explanation compact.",
  reality_check: "Show where a once-useful protective pattern becomes tiring, explain why it may have felt safer, and offer a realistic alternative without blame.",
  validation: "This is the emotional center. Recognize quiet effort and pressure in specific language; keep advice to the final sentence.",
  personality: "Show the contrast between visible social style and the private inner layer with recognizable daily examples.",
  career: "Translate expression, resource, authority, and peer markers into work conditions and strengths without declaring one destined job.",
  money: "Discuss resource habits and decision style. Do not promise wealth or prescribe an investment, savings rate, or purchase.",
  love: "Describe closeness, boundaries, communication, and autonomy without predicting a partner or relationship outcome.",
  family: "Discuss roles and boundaries only. Never invent a parent, childhood event, family conflict, or future child.",
  friends: "Describe social energy, trust, reciprocity, and the kind of friendship rhythm that may feel sustainable.",
  location: "Discuss environmental preferences such as pace, privacy, movement, light, or density. Do not name a lucky country, direction, or climate as fate.",
  lucky_actions: "Offer four to six low-risk, measurable experiments that follow from the report and require no purchase."
};

const SECTION_CONTENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "body"],
  properties: {
    title: { type: "string" },
    body: { type: "string", minLength: 200, maxLength: 1100 }
  }
};

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "summary", "sections", "luckyActions", "disclaimer"],
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "object",
      additionalProperties: false,
      required: REQUIRED_SECTION_KEYS,
      properties: Object.fromEntries(REQUIRED_SECTION_KEYS.map((key) => [key, SECTION_CONTENT_SCHEMA]))
    },
    luckyActions: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: { type: "string" }
    },
    disclaimer: { type: "string" }
  }
};

const ELEMENT_COUNT_NAMES = {
  en: ["Wood", "Fire", "Earth", "Metal", "Water"],
  ko: ["목", "화", "토", "금", "수"],
  "zh-CN": ["木", "火", "土", "金", "水"],
  es: ["Madera", "Fuego", "Tierra", "Metal", "Agua"],
  ja: ["木", "火", "土", "金", "水"]
};

function elementCountMentionCount(value, locale) {
  return (ELEMENT_COUNT_NAMES[locale] || ELEMENT_COUNT_NAMES.en).filter((name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`${escaped}\\s*(?:기운\\s*)?[:=]?\\s*\\d+(?:\\.\\d+)?`, "i").test(String(value || ""));
  }).length;
}

function hasNumericElementInventory(value, locale) {
  return String(value || "").split(/(?<=[.!?。！？\n])/).some((sentence) => elementCountMentionCount(sentence, locale) >= 3);
}

function stripNumericElementInventories(value, locale) {
  const protectedDecimals = String(value || "").replace(/(\d)\.(\d)/g, "$1__SAJU_DECIMAL__$2");
  const chunks = protectedDecimals.match(/[^.!?。！？\n]+[.!?。！？]?|\n+/g) || [];
  return chunks
    .filter((chunk) => /^\n+$/.test(chunk) || elementCountMentionCount(chunk, locale) < 3)
    .join("")
    .replaceAll("__SAJU_DECIMAL__", ".")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function voiceRules(voice) {
  return [
    "Voice target: emotionally perceptive, observant, warm, modern, and specific.",
    "The reader should feel understood rather than evaluated. Recognize the lived pressure before giving advice.",
    "Let analysis be the visible form and empathy the underlying stance. Do not substitute reassurance for reasoning.",
    "The person is not automatically right about every habit. Make the reality-check section candid, then add a gentle corrective observation only in two or three domain sections where the evidence clearly supports it. Do not force a downside into every section.",
    "Praise only a specific strength supported by the chart. Mention a tradeoff when it genuinely clarifies that strength, not as a repeated formula. Avoid blanket consolation, automatic absolution, and endings that repeatedly say everything is okay.",
    "Every emotional claim must be traceable to chart data. Do not invent childhood events, trauma, family history, or relationship outcomes.",
    "Describe present tendencies with calibrated language such as may, can, or often. Never invent a past reason for a habit or claim that a coping pattern was necessary earlier in life.",
    "Do not use therapy language such as trauma response, survival strategy, attachment style, nervous-system regulation, emotional absorption, or diagnosis unless the user supplied that context.",
    "The chart's helpfulElements field is a simple visualization heuristic, not a classical Yongshin determination. Call these balance cues, never a definitive remedy, and do not claim that colors, objects, or directions causally change fate.",
    "Do not recommend lucky colors, jewelry, plants, room directions, bed directions, or decorative objects as remedies. Practical actions should be ordinary choices such as scheduling, writing, resting, moving, asking, or setting a boundary.",
    "Make titles personal and inviting, not academic or sensational.",
    "The validation section must recognize what the person may have carried quietly without diagnosing them.",
    "The reality-check section may be direct, but never mocking, scolding, humiliating, or absolute.",
    "Avoid generic reassurance, textbook filler, repeated paragraph templates, and trendy slang that will date quickly.",
    "Never narrate the writing process. Do not say that you are acknowledging feelings, using one metaphor, explaining later, checking a chart, or following instructions.",
    "The user supplied birth data, not a personal story. Never say 'as you described', 'I hear', 'I sense', or pretend the user told you about an experience.",
    "The visual Manse chart already holds the original symbols. Reading prose must translate chart notation into meaning instead of reciting symbols, pronunciations, pillar codes, or branch-code relationships.",
    "Do not repeatedly enumerate the Hour, Day, Month, and Year pillars. Refer to a pillar only when its plain-language role materially helps that section.",
    "Never label a sentence as supportive, analytical, a suggestion, or an interpretation. Do not add editorial asides such as '(this sentence is a supportive suggestion)'. Let its function be clear from the writing itself.",
    "Integrate chart evidence into the observation itself. Do not introduce it with labels such as 'the reason is', 'the evidence is', 'the chart marker says', or announce that a technical term appears only once.",
    "In at least eight sections, begin with a concrete everyday tension or recognizable inner contradiction in ordinary language. Bring in the chart evidence after that opening; do not start every section with a technical term.",
    "The body field is prose only. Never repeat technicalBasis, field names, JSON labels, editorial notes, or a labeled evidence line inside the body.",
    "No deterministic fear language, curses, guaranteed outcomes, or medical, legal, psychological, and financial instructions.",
    voice.address,
    voice.length,
    ...voice.rules
  ].join("\n");
}

function buildPrompt(chart) {
  const voice = localeVoice(chart.input.locale);
  const facts = localizedChartFacts(chart, voice.locale);
  const evidence = sectionEvidence(chart, voice.locale);
  return [
    `You are SajuPop, a Korean Saju/Four Pillars reader writing in ${voice.name}.`,
    `Output locale: ${voice.locale}. Write every user-facing string in that language, including headline, summary, titles, bodies, luckyActions, and disclaimer. Keep JSON keys in English.`,
    "Write with the detail, affection, emotional specificity, and occasional directness of a premium Korean micro-reading, but do not imitate or copy any source text.",
    "The objective chart data is already calculated by a library-backed Manse engine. The localized fact block below is the only factual source you may use.",
    "Do not recount stems, move a marker to another pillar, infer an absent marker, or turn a symbolic star into a promised event. If a fact is not in the block, leave it out.",
    "Explain Korean Saju concepts for a first-time reader in plain language. The visual Manse chart preserves the canonical symbols; never repeat raw pillar strings or pronunciation codes in the reading prose.",
    "For English and Spanish, use zero Hanja, pinyin, or branch codes such as Bing-Yin, Gui-Si, Yin-Wu, or Yin-Si-Shen. Say 'a Yang Fire center', 'Yang Fire over Tiger', 'a subtle friction pattern', or the natural equivalent in the output language.",
    "For Korean, prefer 병화 일간, 병인일주의 흐름, 수 기운, and plain everyday explanations. Do not repeat 丙, 丙寅, Bing, or Bing-Yin. For Chinese and Japanese, native characters may appear when natural, but never add pinyin or romanized pillar codes.",
    "Name the localized identity center naturally in the summary or core section, then connect it once more to behavior in the identity section. Weave it into the sentence, for example '무토가 중심을 잡는 사주라' rather than placing it in a technical aside.",
    "Across the entire report, use the technical label Day Master or its localized equivalent at most once. After that, describe the person's central quality directly.",
    "Use the person's name naturally. Do not repeat it at the start of every section.",
    "Use the person's name in the headline or summary and only a few section titles at most. Most titles should create curiosity through the actual topic, not through repeated direct address.",
    "Safety rules: no medical, legal, psychological diagnosis, guaranteed wealth, guaranteed marriage, curses, or deterministic fear claims.",
    `Return sections as an object with exactly these 13 required properties: ${REQUIRED_SECTION_KEYS.join(", ")}. Each property contains only title and body.`,
    "Do not collapse sections into generic advice. Each one needs at least one concrete chart reference and one recognizable life pattern.",
    "For each section, refer only to the facts listed under that section key in SECTION EVIDENCE. Do not derive parents, childhood, trauma, health, wealth, marriage, or a future event from missing information.",
    "Use no more than one compact chart-evidence sentence in most bodies; the element-balance section may use two. Spend the remaining sentences on lived nuance, emotional recognition, and a grounded adjustment.",
    "Keep each body cohesive. Do not append a second recap paragraph that restates the same evidence, advice, cost, or benefit in different words.",
    "Do not use a symbolic star as proof for a Ten God, a hidden stem as proof for a visible pillar, or a combination as proof that a helper, partner, or event will appear.",
    "Element profiles are intentionally qualitative. Describe what leads, supports, stays quiet, or does not appear in a layer. Never reconstruct or print element counts, decimals, ratios, or a five-item numeric inventory; exact values already live in the visual chart.",
    "Do not write technicalBasis or a labeled evidence line. The server adds verified technical evidence after generation. Never place writing instructions or notes to the editor in any user-facing field.",
    "Write luckyActions as low-risk experiments. Do not include element-colored objects, plants, accessories, directions, percentages, investment instructions, or claims that an action changes fate.",
    "",
    "Voice rules:",
    voiceRules(voice),
    "Return only JSON matching the schema.",
    "",
    "LOCALIZED CHART FACTS:",
    JSON.stringify(facts, null, 2),
    "",
    "SECTION EVIDENCE:",
    JSON.stringify(evidence, null, 2),
    "",
    "SECTION PURPOSES:",
    JSON.stringify(SECTION_PURPOSES, null, 2)
  ].join("\n");
}

function readingQualityIssues(reading, locale, chart) {
  const bodies = (reading.sections || []).map((section) => String(section.body || ""));
  const technical = (reading.sections || []).map((section) => String(section.technicalBasis || ""));
  const averageLength = bodies.length ? bodies.reduce((sum, body) => sum + body.length, 0) / bodies.length : 0;
  const minimumAverage = { ko: 190, "zh-CN": 220, ja: 240, en: 520, es: 520 }[locale] || 480;
  const issues = [];
  const keys = (reading.sections || []).map((section) => section.key);
  const missingKeys = REQUIRED_SECTION_KEYS.filter((key) => !keys.includes(key));
  const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (keys.length !== 13 || missingKeys.length || duplicateKeys.length) {
    issues.push(`The report must contain each required section exactly once. Missing: ${missingKeys.join(", ") || "none"}; duplicates: ${[...new Set(duplicateKeys)].join(", ") || "none"}.`);
  }
  if (averageLength < minimumAverage) issues.push(`Section bodies are too short: average ${Math.round(averageLength)} characters; target at least ${minimumAverage}.`);

  const allText = [reading.headline, reading.summary, ...bodies, ...technical].join("\n");
  if (chart) {
    const prose = [reading.headline, reading.summary, ...bodies].join("\n");
    const positionMarkers = {
      ko: { Hour: ["시주"], Day: ["일주", "일간"], Month: ["월주", "월간"], Year: ["연주", "연간", "년주"] },
      "zh-CN": { Hour: ["时柱", "时干", "时"], Day: ["日柱", "日干"], Month: ["月柱", "月干", "月"], Year: ["年柱", "年干", "年"] },
      es: { Hour: ["pilar de la hora", "hora"], Day: ["pilar del día"], Month: ["pilar del mes", "mes"], Year: ["pilar del año", "año"] },
      ja: { Hour: ["時柱", "時干"], Day: ["日柱", "日干"], Month: ["月柱", "月干"], Year: ["年柱", "年干"] },
      en: { Hour: ["Hour pillar", "Hour stem"], Day: ["Day pillar", "Day stem"], Month: ["Month pillar", "Month stem"], Year: ["Year pillar", "Year stem"] }
    }[locale] || {};
    const verified = chart.pillars.map((pillar) => `${pillar.position} ${pillar.stem.hanja}${pillar.branch.hanja}`).join(", ");
    let foundPillarConflict = false;
    for (const pillar of chart.pillars) {
      for (const other of chart.pillars.filter((item) => item.stem.hanja !== pillar.stem.hanja)) {
        const wrongStem = other.stem.hanja;
        const misplaced = (positionMarkers[pillar.position] || []).some((marker) => {
          const escaped = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const chineseGrouping = locale === "zh-CN" ? "|月|时|都|均|也" : "";
          const connector = `(?:\\s|、|，|,|:|：|的|为|是|有|에|에는|의|은|는${chineseGrouping}){0,10}`;
          return new RegExp(`${escaped}${connector}${wrongStem}|${wrongStem}${connector}${escaped}`, "i").test(prose);
        });
        if (misplaced) {
          issues.push(`A heavenly stem was assigned to the wrong pillar. Verified visible pillars are: ${verified}. Remove or correct the conflicting position claim.`);
          foundPillarConflict = true;
          break;
        }
      }
      if (foundPillarConflict) break;
    }
  }
  const localeTerms = TERM_MAPS[locale] || {};
  const untranslated = Object.entries(localeTerms)
    .filter(([source, translated]) => source !== translated && source.length > 3 && allText.includes(source))
    .map(([source]) => source);
  if (locale !== "en" && untranslated.length) {
    issues.push(`Translate remaining English chart labels into ${locale}: ${[...new Set(untranslated)].slice(0, 12).join(", ")}.`);
  }

  const processLeaks = {
    ko: [/먼저 (?:마음|감정).{0,12}(?:받아|헤아)/, /(?:이 풀이|이 글|이 보고서)에서는/, /뒤에서 .*설명/, /비유는 .*하나/, /이 (?:한 )?문장은.{0,24}(?:제안|조언|지지)/, /지지의 제안/, /(?:일간|용어|표기).{0,24}(?:한 문장|한 번|한번|사용)/, /(?:그 )?근거(?:로는|는|\s*[:：])/, /사주 표시/],
    "zh-CN": [/先承认/, /后文/, /接下来会/, /本报告/, /比喻.{0,8}(?:一个|一处)/],
    es: [/\b(?:Siento|Entiendo) (?:la|el|tu)\b/i, /que describes/i, /en este informe/i, /a continuación/i, /una metáfora por/i],
    ja: [/まず気持ち/, /受け止めます/, /本稿/, /次に説明/, /比喩は.{0,12}(?:一つ|ひとつ)/, /リーディング/]
  }[locale] || [];
  if (processLeaks.some((pattern) => pattern.test(allText))) {
    issues.push("Remove editor-facing process language and address the person's likely experience directly, without pretending they told you a story.");
  }
  const inventedHistoryPatterns = {
    ko: [/과거에.{0,30}(?:필요|배웠|겪었)/, /어린 시절|어릴 때/, /그동안.{0,24}(?:버텨|견뎌|감당해)/],
    en: [/in (?:your|the) past.{0,40}(?:needed|learned|had to)/i, /as a child|in childhood/i],
    es: [/en (?:tu|el) pasado.{0,40}(?:necesit|aprend|tuviste que)/i, /de niñ[oa]|en la infancia/i],
    "zh-CN": [/过去.{0,20}(?:需要|学会|不得不)/, /小时候|童年/],
    ja: [/過去.{0,20}(?:必要|学ん|せざるを得)/, /子どもの頃|幼少期/]
  }[locale] || [];
  if (inventedHistoryPatterns.some((pattern) => pattern.test(allText))) issues.push("Do not invent a past event or reason from birth data. Keep the observation in the present and use calibrated language.");
  if (hasNumericElementInventory(allText, locale)) {
    issues.push("Remove the numeric Five Element inventory from prose. Describe which qualities lead, support, or stay quiet; exact values belong only in the visual chart.");
  }

  const technicalOpeners = {
    ko: /^(?:사주|원국|만세력|일간|일주|오행|[甲乙丙丁戊己庚辛壬癸])/, "zh-CN": /^(?:命盘|八字|日主|日柱|五行|[甲乙丙丁戊己庚辛壬癸])/,
    es: /^(?:La carta|El Maestro del Día|El Pilar del Día|Los cinco elementos)/i,
    ja: /^(?:命式|八字|日主|日柱|五行|[甲乙丙丁戊己庚辛壬癸])/
  }[locale];
  if (technicalOpeners && bodies.filter((body) => technicalOpeners.test(body.trim())).length > 5) {
    issues.push("Too many sections begin like a textbook. Open most sections with an everyday tension or recognizable feeling, then connect it to the verified chart evidence.");
  }

  const actionText = (reading.luckyActions || []).join("\n");
  const remedyPatterns = {
    ko: [/행운의 색/, /(?:빨간색|노란색|흰색).*(?:소품|옷|액세서리)/, /(?:침대|책상).*(?:방향|머리)/, /식물을 .*두/, /(?:소액|실험용)\s*(?:예산|비용)/, /(?:소액|유료)\s*(?:수업|워크숍|강의|모임)/],
    "zh-CN": [/(?:红色|橙色|暖色).*(?:小物|饰品|衣)/, /(?:放|摆).*植物/, /(?:床|桌).*(?:方向|朝向)/, /补[木火土金水](?:能|气)/],
    es: [/(?:color|tono) (?:rojo|naranja|blanco)/i, /(?:accesorio|joya|planta).*(?:equilibr|activar|energ)/i, /dirección (?:afortunada|favorable)/i],
    ja: [/(?:赤|オレンジ|白).*(?:小物|服|アクセサリー)/, /観葉植物.*(?:置|飾)/, /(?:ベッド|机).*(?:方角|向き)/, /[木火土金水]を補う/]
  }[locale] || [];
  if (remedyPatterns.some((pattern) => pattern.test(actionText))) {
    issues.push("Replace color, object, plant, or direction remedies with an ordinary low-risk behavior experiment. Do not claim elemental causation.");
  }

  if (locale === "ko") {
    const banned = ["도드라히", "요소 구도", "리딩", "우주는 당신", "찬란한 꽃", "생존 전략", "감정 흡수", "신경계 조절", "비용 있는 습관", "집착하기 쉽"];
    const found = banned.filter((word) => allText.includes(word));
    if (found.length) issues.push(`Remove unnatural or generic Korean expressions: ${found.join(", ")}.`);
    if ((allText.match(/차트/g) || []).length) issues.push("Replace Korean '차트' with 사주, 원국, or 만세력 according to context.");
    if (technical.some((text) => /^(manse|elements|dayMaster|relationshipTags|helpfulElements):/m.test(text))) {
      issues.push("technicalBasis still uses English property labels; explain those labels in Korean.");
    }
    const shortBodies = bodies.filter((body) => body.length < 160).length;
    if (shortBodies) issues.push(`${shortBodies} Korean section bodies are under 160 characters.`);
    const consolationCount = (allText.match(/괜찮아요|좋아요|충분해요|잘하고 있어요|잘해왔어요/g) || []).length;
    if ((allText.match(/괜찮아요/g) || []).length > 2 || consolationCount > 5) {
      issues.push("허용과 위로 표현이 너무 자주 반복됩니다. '괜찮아요'로 결론내리기보다 근거, 장점의 대가, 조심할 점을 구체적으로 쓰세요.");
    }
    const correctiveBodies = bodies.filter((body) => /다만|그렇다고|문제는|주의|경계|놓치|지치게|부담을 주|미루|고집|과해|결과적으로/.test(body)).length;
    if (correctiveBodies < 2) {
      issues.push("한국어 풀이가 일방적인 위로에 치우쳤습니다. 팩트체크와 근거가 분명한 생활 영역 한두 곳에서는 이해되는 의도와 실제 결과를 함께 짚으세요.");
    }
    if (bodies.some((body) => body.includes(";"))) {
      issues.push("한국어 본문에서 세미콜론으로 분석 문장을 이어 붙이지 말고, 자연스러운 문장 호흡으로 나누세요.");
    }
    if (bodies.filter((body) => /\n\s*\n/.test(body)).length > 2) issues.push("여러 섹션에 반복적인 덧붙임 문단이 생겼습니다. 같은 근거와 조언을 되풀이하지 말고 한 흐름으로 정리하세요.");
    if ((allText.match(/비용|실질적 이득/g) || []).length > 5) issues.push("'비용'과 '실질적 이득'을 분석 공식처럼 반복하지 말고, 영역에 맞는 구체적인 결과를 자연스럽게 쓰세요.");
    if (chart?.input?.name) {
      const nameInTitles = (reading.sections || []).filter((section) => String(section.title || "").includes(chart.input.name)).length;
      if (nameInTitles > 3) issues.push("이름이 너무 많은 섹션 제목에 반복됩니다. 이름 없이도 궁금증이 생기는 영역별 제목을 쓰세요.");
    }
  }
  if (["en", "es"].includes(locale)) {
    const rawPinyin = /\b(?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)-(?:Zi|Chou|Yin|Mao|Chen|Si|Wu|Wei|Shen|You|Xu|Hai)\b|\((?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)(?:,|\))/;
    if (rawPinyin.test(allText)) issues.push("Replace pinyin and romanized pillar codes with plain-language chart meanings.");
    if (chart) {
      const protectedText = [chart.input?.name, chart.input?.city, chart.input?.country].filter(Boolean).reduce((text, value) => text.split(value).join(""), allText);
      const rawGlyphs = new Set(chart.pillars.flatMap((pillar) => [pillar.stem.hanja, pillar.branch.hanja, ...(pillar.hiddenStems || []).map((stem) => stem.hanja)]));
      if ([...rawGlyphs].some((glyph) => protectedText.includes(glyph))) issues.push("Keep Hanja in the visual Manse chart; replace it with plain-language meaning in the reading.");
    }
    const technicalReferences = (allText.match(/\b(?:Day Master|Day pillar|Hour pillar|Month pillar|Year pillar)\b/gi) || []).length;
    if (technicalReferences > 3) issues.push("Technical pillar labels are repeated too often. Explain the qualities they represent instead of recounting the chart.");
  }
  if (locale === "ko" && chart) {
    const protectedText = [chart.input?.name, chart.input?.city, chart.input?.country].filter(Boolean).reduce((text, value) => text.split(value).join(""), allText);
    const rawGlyphs = new Set(chart.pillars.flatMap((pillar) => [pillar.stem.hanja, pillar.branch.hanja, ...(pillar.hiddenStems || []).map((stem) => stem.hanja)]));
    if ([...rawGlyphs].some((glyph) => protectedText.includes(glyph)) || /\b(?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)-(?:Zi|Chou|Yin|Mao|Chen|Si|Wu|Wei|Shen|You|Xu|Hai)\b/.test(allText)) {
      issues.push("한자와 병음은 만세력 표에만 두고, 풀이에서는 병화·병인일주처럼 자연스러운 한국어 의미로 바꾸세요.");
    }
  }
  if (locale === "zh-CN" && (allText.match(/这意味着/g) || []).length > 3) issues.push("'这意味着' is repeated too often.");
  if (locale === "zh-CN" && (allText.match(/承认/g) || []).length > 2) issues.push("'承认' is repeated too often; show understanding directly instead of announcing it.");
  if (locale === "es" && (allText.match(/esto significa/gi) || []).length > 3) issues.push("'esto significa' is repeated too often.");
  if (locale === "ja" && (allText.match(/ということです/g) || []).length > 3) issues.push("'ということです' is repeated too often.");
  return issues;
}

function postProcessReading(reading, locale, chart) {
  const working = simplifyReadingNotation(reading, chart, locale);
  const cleanGeneratedText = (value) => stripNumericElementInventories(value, locale)
    .replace(/[（(]\s*이 (?:한 )?문장은\s*(?:지지의 )?(?:제안|조언|분석)(?:입니다|이에요)\.?\s*[）)]/g, "")
    .replace(/[（(][^（）)]*(?:일간|용어|표기)[^（）)]*(?:한 문장|한 번|한번|사용)[^（）)]*[）)]/g, "")
    .replace(/이 (?:한 )?문장은\s*(?:지지의 )?(?:제안|조언|분석)(?:입니다|이에요)\.?/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/([.!?。！？])[\"”']+$/g, "$1")
    .trim();
  const stripEmbeddedEvidence = (value) => String(value || "")
    .replace(/\n+\s*(?:technicalBasis|technical basis|기술 근거|技术依据|技術的根拠)\s*[:：][\s\S]*$/i, "")
    .replace(/\n+\s*[（(](?:근거|依据|根拠|base técnica)\s*[:：][\s\S]*[）)]\s*$/i, "")
    .replace(/\s*(?:근거|분석 근거)\s*[:：][^\n]*$/i, "")
    .trim();
  const transform = (replaceText, replaceTechnical = replaceText) => ({
    ...working,
    headline: cleanGeneratedText(replaceText(working.headline)),
    summary: cleanGeneratedText(replaceText(working.summary)),
    sections: (working.sections || []).map((section) => ({
      ...section,
      title: cleanGeneratedText(replaceText(section.title)),
      body: stripEmbeddedEvidence(cleanGeneratedText(replaceText(section.body))),
      technicalBasis: cleanGeneratedText(replaceTechnical(section.technicalBasis))
    })),
    luckyActions: (working.luckyActions || []).map((action) => cleanGeneratedText(replaceText(action))),
    disclaimer: cleanGeneratedText(replaceText(working.disclaimer))
  });

  if (locale === "en") return transform((value) => String(value || ""));

  const replaceLocalizedTerms = (value) => {
    let text = localizeChartText(value, locale);
    if (locale === "ko") {
      text = text
        .replaceAll("도드라히", "도드라지게")
        .replaceAll("요소 구도", "오행의 흐름")
        .replaceAll("리딩", "풀이")
        .replaceAll("차트", "사주")
        .replaceAll("생존 전략", "스스로를 지키려는 반응")
        .replaceAll("감정 흡수", "주변 분위기를 받아들이는 일")
        .replaceAll("신경계 조절", "마음의 속도를 가라앉히는 일")
        .replaceAll("숨은줄기", "지장간")
        .replaceAll("숨은간", "지장간")
        .replaceAll("숨겨진간", "지장간")
        .replaceAll("내부 규준", "내 기준")
        .replaceAll("비용 있는 습관", "오래 이어지면 지치는 습관")
        .replaceAll("에너지를 아끼", "힘을 아끼")
        .replaceAll("내부 에너지", "속의 힘")
        .replaceAll("외부 정보", "주변에서 들어오는 정보")
        .replaceAll("가시적 오행", "보이는 오행")
        .replaceAll("수우세", "수 기운 우세")
        .replaceAll("합작용", "합의 작용")
        .replaceAll("수적 연결", "수 기운의 관계")
        .replaceAll("소액·단기간", "작은 범위·짧은 기간")
        .replace(/이 풀이에서는\s*/g, "")
        .replace(/([A-Za-z가-힣])\s+님/g, "$1님");
    }
    if (locale === "zh-CN") {
      text = text
        .replaceAll("图表", "命盘")
        .replace(/平衡(?:提示|参考)（平衡(?:提示|参考)(?:（平衡参考）)?）/g, "平衡参考")
        .replaceAll("天贵", "天乙贵人");
    }
    if (locale === "es") {
      text = text
        .replace(/pistas de equilibrio\s*\(pistas de equilibrio\)/gi, "pistas de equilibrio")
        .replace(/pistas de equilibrio\s*:\s*pistas de equilibrio/gi, "pistas de equilibrio:");
    }
    if (locale === "ja") {
      text = text
        .replaceAll("四柱リーディング", "四柱推命の読み解き")
        .replaceAll("リーディング", "読み解き")
        .replaceAll("元素", "五行")
        .replaceAll("日主（日主）", "日主")
        .replace(/バランスの参考\s*[（(]バランスの参考[）)]/g, "バランスの参考");
    }
    return text;
  };

  if (locale !== "ko") return transform(replaceLocalizedTerms);
  const replaceKorean = (value) => String(value || "")
    .replaceAll("도드라히", "도드라지게")
    .replaceAll("요소 구도", "오행의 흐름")
    .replaceAll("리딩", "풀이")
    .replaceAll("차트", "사주")
    .replaceAll("생존 전략", "스스로를 지키려는 반응")
    .replaceAll("감정 흡수", "주변 분위기를 받아들이는 일")
    .replaceAll("신경계 조절", "마음의 속도를 가라앉히는 일")
    .replace(/(?:그 )?근거(?:로는|는)\s*/g, "")
    .replaceAll("사주 표시", "사주 흐름")
    .replace(/([목화토금수]|물|불|흙|쇠)기운/g, "$1 기운")
    .replace(/;\s*/g, ". ");
  const replaceTechnical = (value) => replaceKorean(value)
    .replace(/\bmanse:/gi, "만세력:")
    .replace(/\belements:/gi, "오행 분포:")
    .replace(/\bweightedElements:/gi, "지장간 가중 오행:")
    .replace(/\bdayMaster:/gi, "일간:")
    .replace(/\bDay pillar:/gi, "일주:")
    .replace(/\brelationshipTags:/gi, "합·충·해 등 관계:")
    .replace(/\bhelpfulElements\b:?/gi, "균형 참고 기운:");
  return transform((value) => replaceLocalizedTerms(replaceKorean(value)), (value) => replaceLocalizedTerms(replaceTechnical(value)));
}

function buildRepairPrompt(chart, reading, issues) {
  const voice = localeVoice(chart.input.locale);
  const facts = localizedChartFacts(chart, voice.locale);
  const evidence = sectionEvidence(chart, voice.locale);
  return [
    `The previous ${voice.name} polish did not pass the product's native-voice checks. Repair the JSON once.`,
    "Keep all chart facts and section keys unchanged. Return sections as an object whose 13 required properties each contain only title and body; the server adds key and technicalBasis later. The localized fact block is the only factual source.",
    "Fix every listed issue. Expand thin sections with chart-specific emotional detail and practical nuance, not filler.",
    "Do not describe the editing process, mention these checks, or repeat phrases from these instructions in the output.",
    "Never claim the user described an experience. Never recommend colors, objects, plants, directions, or elemental remedies.",
    "Keep canonical symbols in the visual Manse chart only. Remove Hanja, pinyin, raw pillar strings, and branch-code relationships from prose, and replace them with natural plain-language meanings.",
    "Do not print numeric Five Element inventories. Do not label any sentence as support, analysis, or a suggestion. Replace blanket reassurance with evidence-led warmth. Keep direct correction selective; never append formulaic sentences about cost or practical benefit to every section, repeat the person's name in every title, or add recap paragraphs just to satisfy length.",
    "Do not mention this quality check in the output.",
    "",
    "Failed checks:",
    issues.map((issue) => `- ${issue}`).join("\n"),
    "",
    "Voice rules:",
    voiceRules(voice),
    "",
    "LOCALIZED CHART FACTS:",
    JSON.stringify(facts, null, 2),
    "",
    "SECTION EVIDENCE:",
    JSON.stringify(evidence, null, 2),
    "",
    "SECTION PURPOSES:",
    JSON.stringify(SECTION_PURPOSES, null, 2),
    "",
    "Reading JSON to repair:",
    JSON.stringify(reading, null, 2),
    "",
    "Return only JSON matching the schema."
  ].join("\n");
}

function fallbackReading(chart) {
  const name = chart.input.name || "You";
  const dm = chart.dayMaster.label;
  const strong = chart.strongestElement;
  const weak = chart.weakestElement;
  const tags = chart.relationshipTags.slice(0, 3).join(", ") || "a calm chart structure";
  const stars = chart.symbolicStars.slice(0, 3).join(", ") || "quiet support markers";
  return {
    headline: `${name}'s ${dm} Day Master is shaped by strong ${strong} and quiet ${weak}`,
    summary: "This reading begins with the calculated Manse chart and keeps every interpretation tied to that structure.",
    sections: [
      {
        key: "core_metaphor",
        title: `A ${dm} center learning how to carry ${strong} with grace`,
        body: `${name}, the chart begins with your Day Master, ${dm}. This is the anchor Saju uses before reading work, money, love, family, pressure, and support. Your strongest element is ${strong}, which shows what your system does almost automatically. Your quietest element is ${weak}, which points to the quality life keeps asking you to practice with more tenderness and intention.`,
        technicalBasis: `Eight characters: ${chart.manse.eightCharacters}; Day Master ${chart.dayMaster.pinyin}; weighted elements ${JSON.stringify(chart.weightedElements)}.`
      },
      {
        key: "element_balance",
        title: `${strong} is loud in the chart, so ${weak} needs deliberate space`,
        body: `When ${strong} dominates, you may rely on that element even when another response would be softer or more strategic. This is not a flaw. It is a familiar muscle. The helpful path is to build routines, spaces, and relationships that bring in ${chart.helpfulElements.join(" and ") || weak}. That way your natural strength becomes usable instead of heavy.`,
        technicalBasis: `Strongest element ${strong}; weakest element ${weak}; helpful estimate ${chart.helpfulElements.join(", ")}.`
      },
      {
        key: "day_master",
        title: "Your Day Pillar is the emotional center of the report",
        body: `The Day Pillar shows how the chart reads identity and close relationships. The sky sign is visible style; the ground sign is the emotional floor underneath. Reading both together keeps the report from becoming a shallow personality label. This is why Saju can feel specific when the calculation is handled carefully.`,
        technicalBasis: `Day Pillar ${chart.pillars.find((pillar) => pillar.position === "Day").label}.`
      },
      {
        key: "reality_check",
        title: "The repeated friction is asking for a better container, not self-blame",
        body: `The chart tags include ${tags}. These do not mean a fixed bad outcome. They show where pressure, attraction, interruption, or misunderstanding can repeat. The practical move is to design clearer boundaries around those themes before they become drama. You do not need to become a different person; you need a better operating system for your own sensitivity.`,
        technicalBasis: `Relationship markers: ${chart.relationshipTags.join("; ") || "none detected"}.`
      },
      {
        key: "validation",
        title: "You have been carrying more quietly than people realize",
        body: `The softer markers include ${stars}. At their best, they describe timing, perception, and the ability to notice what others miss. If you have felt tired from always reading the room, that makes sense. Your chart suggests that your sensitivity is not random noise; it is a real instrument. It simply needs rest, warmth, and people who do not punish you for having depth.`,
        technicalBasis: `Symbolic stars: ${chart.symbolicStars.join("; ") || "none detected"}.`
      },
      {
        key: "personality",
        title: "Your personality has a visible layer and a hidden layer",
        body: "The visible stems describe how energy appears first. The hidden stems show what lives underneath. This is why you can look composed while carrying a very different private weather system inside. Your best growth comes from respecting both layers instead of forcing yourself to be simple for other people's comfort.",
        technicalBasis: "Hidden stems are calculated inside each earthly branch."
      },
      {
        key: "career",
        title: "Work improves when your pattern becomes a signature skill",
        body: "The chart is strongest when observation turns into something useful: analysis, design, writing, advising, research, education, strategy, or technical craft. Repetitive work with no ownership may flatten you. A role that lets you refine judgment and produce a visible result will fit the chart better.",
        technicalBasis: `Ten Gods across pillars: ${chart.pillars.map((pillar) => `${pillar.position} ${pillar.tenGod}`).join(", ")}.`
      },
      {
        key: "money",
        title: "Money needs boring systems so your feelings do not have to manage everything",
        body: "The safest money advice here is structure. Separate comfort spending, social spending, and future-building money. When the chart is emotionally responsive, a boring financial system is not restrictive; it is protective. It lets your life feel softer because the basics are already held.",
        technicalBasis: `Wealth-related Ten Gods are interpreted relative to ${chart.dayMaster.pinyin}.`
      }
    ],
    luckyActions: [
      `Use ${chart.helpfulElements[0] || weak} colors or materials as daily anchors.`,
      "Keep one written rule for spending and one written rule for rest.",
      "Choose bright, well-ventilated spaces when your thoughts feel heavy.",
      "Review yearly timing as a planning tool, not as a verdict."
    ],
    disclaimer: "Saju is a traditional interpretive system for reflection and entertainment. This reading is not medical, legal, financial, or psychological advice."
  };
}

function extractOutputText(data) {
  if (data.output_text) return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
    }
  }
  return chunks.join("\n");
}

function normalizeModelReading(reading) {
  if (Array.isArray(reading.sections)) return reading;
  return {
    ...reading,
    sections: REQUIRED_SECTION_KEYS.map((key) => ({ key, ...(reading.sections?.[key] || {}) }))
  };
}

async function requestStructuredReading(model, prompt, instructions) {
  const payload = {
    model,
    instructions,
    input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
    max_output_tokens: 10000,
    store: false,
    text: {
      format: {
        type: "json_schema",
        name: "saju_pop_reading",
        strict: true,
        schema: RESPONSE_SCHEMA
      }
    }
  };
  if (/^gpt-5/i.test(model)) payload.reasoning = { effort: process.env.OPENAI_REASONING_EFFORT || "low" };
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `OpenAI request failed with ${response.status}`);
  return normalizeModelReading(JSON.parse(extractOutputText(data)));
}

async function callOpenAI(chart) {
  const voice = localeVoice(chart.input.locale);
  if (!process.env.OPENAI_API_KEY) {
    return { reading: fallbackReading(chart), model: "fallback", source: "fallback", voicePasses: ["fallback"] };
  }
  const preferred = process.env.OPENAI_MODEL || "gpt-5-mini";
  const candidates = [...new Set([preferred, "gpt-5-mini", "gpt-5.1-mini", "gpt-4.1-mini"])];
  let lastError = null;
  for (const model of candidates) {
    try {
      let reading = await requestStructuredReading(
        model,
        buildPrompt(chart),
        `Write a final, native-quality Korean Saju/Four Pillars reading in ${voice.name}. Use only the supplied localized facts and silently self-edit before returning the structured response.`
      );
      reading = applyTechnicalEvidence(postProcessReading(reading, voice.locale, chart), chart, voice.locale);
      const voicePasses = [`${voice.locale}-native-draft`];
      let issues = readingQualityIssues(reading, voice.locale, chart);
      const repairLimit = 1;
      for (let repairIndex = 0; repairIndex < repairLimit && issues.length; repairIndex += 1) {
        try {
          reading = await requestStructuredReading(
            model,
            buildRepairPrompt(chart, reading, issues),
            `Repair a ${voice.name} Saju reading using only verified localized evidence. Remove machine-writing patterns and return the final structured response.`
          );
          reading = applyTechnicalEvidence(postProcessReading(reading, voice.locale, chart), chart, voice.locale);
          voicePasses.push(`${voice.locale}-native-quality-repair-${repairIndex + 1}`);
          issues = readingQualityIssues(reading, voice.locale, chart);
        } catch (repairError) {
          return {
            reading,
            model,
            source: "openai",
            voicePasses,
            warning: `Native quality repair failed; returned the last verified pass: ${repairError.message}`
          };
        }
      }
      return {
        reading,
        model,
        source: "openai",
        voicePasses,
        warning: issues.length ? `Native voice checks still flagged: ${issues.join(" ")}` : undefined
      };
    } catch (error) {
      lastError = error.message || "OpenAI request failed";
      if (/model|not found|does not exist|unsupported/i.test(lastError)) continue;
      throw error;
    }
  }
  const reading = fallbackReading(chart);
  return { reading, model: "fallback", source: "fallback", warning: lastError, voicePasses: ["fallback"] };
}

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const voice = localeVoice(body.locale);
    const chart = calculateSaju({ ...body, locale: voice.locale });
    const result = await callOpenAI(chart);
    result.reading = postProcessReading(result.reading, voice.locale, chart);
    res.status(200).json({ ok: true, chart, ...result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Unable to generate reading" });
  }
}

module.exports = handler;
module.exports.calculateSaju = calculateSaju;
module.exports.fallbackReading = fallbackReading;
module.exports.readingQualityIssues = readingQualityIssues;
module.exports.postProcessReading = postProcessReading;
module.exports.normalizeModelReading = normalizeModelReading;
