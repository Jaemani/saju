const test = require("node:test");
const assert = require("node:assert/strict");
const { postProcessReading, readingQualityIssues, normalizeModelReading } = require("../api/generate-reading");
const { calculateSaju } = require("../api/saju-engine");
const { applyTechnicalEvidence, localizeChartText, localizedChartFacts, sectionEvidence, simplifyReadingNotation } = require("../api/locale-chart");

const keys = ["core_metaphor", "element_balance", "day_master", "reality_check", "validation", "personality", "career", "money", "love", "family", "friends", "location", "lucky_actions"];

test("Korean quality gate catches thin and machine-sounding copy", () => {
  const reading = {
    headline: "도드라히 보이는 차트",
    summary: "이 리딩은 요소 구도를 설명합니다.",
    sections: keys.map((key) => ({ key, title: "제목", body: "너무 짧은 본문입니다.", technicalBasis: "elements: Water 4" }))
  };
  const issues = readingQualityIssues(reading, "ko");
  assert.ok(issues.some((issue) => issue.includes("too short")));
  assert.ok(issues.some((issue) => issue.includes("도드라히")));
  assert.ok(issues.some((issue) => issue.includes("technicalBasis")));
});

test("Korean post-processing removes known translation artifacts without changing chart values", () => {
  const reading = {
    headline: "도드라히 보이는 차트 리딩",
    summary: "생존 전략과 감정 흡수를 말합니다.",
    sections: [{ key: "day_master", title: "차트", body: "신경계 조절", technicalBasis: "manse: 庚辰; dayMaster: 戊; elements: Water 5.05" }],
    luckyActions: ["리딩 저장"],
    disclaimer: "차트 안내"
  };
  const result = postProcessReading(reading, "ko");
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes("차트"), false);
  assert.equal(serialized.includes("리딩"), false);
  assert.match(result.sections[0].technicalBasis, /庚辰/);
  assert.match(result.sections[0].technicalBasis, /수 5.05/);
});

test("Post-processing removes duplicated technical evidence from the prose body", () => {
  const reading = {
    headline: "제목",
    summary: "요약",
    sections: [{ key: "day_master", title: "일간", body: "생활에서 먼저 보이는 이야기예요.\n\ntechnicalBasis: dayMaster: 戊", technicalBasis: "dayMaster: 戊" }],
    luckyActions: [],
    disclaimer: ""
  };
  const result = postProcessReading(reading, "ko");
  assert.equal(result.sections[0].body.includes("technicalBasis"), false);
  assert.equal(result.sections[0].body.includes("일간: 戊"), false);
  assert.match(result.sections[0].technicalBasis, /일간: 戊/);
});

test("Detailed natural Korean copy can pass the quality gate", () => {
  const body = "민아님은 겉으로 차분하게 상황을 정리하지만, 속에서는 주변의 말과 분위기를 빠르게 읽는 편이에요. 수 기운이 강하고 무토 일간이 중심을 잡는 구조라서 섬세한 감각과 현실적인 판단이 함께 움직여요. 괜찮은 척 버티는 쪽을 택할 때가 있다면, 약해서라기보다 놓치고 싶지 않은 것이 많을 가능성이 커요. 다만 모든 변수를 직접 정리하려 들면 결정이 늦어지고 가까운 사람에게도 부담을 줄 수 있어요. 우선순위를 줄여 몸이 따라올 시간을 남겨주세요. 작은 경계를 세우는 일이 오히려 다정함과 집중력을 오래 지켜줘요. 오늘은 해야 할 일을 세 가지로 줄이고, 미뤄도 되는 일 하나를 분명하게 골라보세요. 이런 작고 구체적인 선택이 쌓이면 무토의 안정감은 부담이 아니라 믿을 만한 힘으로 자리 잡아요.";
  const reading = {
    headline: "깊은 흐름 속에서도 중심을 지켜온 사람이네요",
    summary: body,
    sections: keys.map((key) => ({ key, title: `영역별 풀이 ${key}`, body, technicalBasis: "만세력 庚辰 癸未 戊子 癸亥, 일간 戊, 수 기운의 분포를 함께 살폈어요." }))
  };
  assert.deepEqual(readingQualityIssues(reading, "ko"), []);
});

test("Spanish post-processing keeps chart facts while localizing visible labels", () => {
  const reading = {
    headline: "Yang Earth Day Master",
    summary: "Water and Fire are balance cues.",
    sections: [{ key: "day_master", title: "Day pillar", body: "Ghost Gate / Irritation marker", technicalBasis: "RelationshipTags: Water 5.05; HelpfulElements: Fire, Wood" }],
    luckyActions: [],
    disclaimer: ""
  };
  const result = postProcessReading(reading, "es");
  const serialized = JSON.stringify(result);
  assert.match(serialized, /Maestro del Día/);
  assert.match(serialized, /Agua 5.05/);
  assert.match(serialized, /pistas de equilibrio/);
  assert.equal(serialized.includes("Day Master"), false);
});

test("Chinese and Japanese localizers cover chart labels that leaked in live samples", () => {
  const source = "Day Master Yang Earth; Stable Wealth; Hidden stems; weightedElements; Zi-Chen: Half Water Combination; Ghost Gate / Irritation marker";
  const chinese = localizeChartText(source, "zh-CN");
  const japanese = localizeChartText(source, "ja");
  assert.equal(chinese.includes("Stable Wealth"), false);
  assert.match(chinese, /日主/);
  assert.match(chinese, /藏干加权五行/);
  assert.equal(japanese.includes("Hidden stems"), false);
  assert.match(japanese, /正財/);
  assert.match(japanese, /水の半合/);
});

test("Quality gate catches editor language and elemental object remedies", () => {
  const body = "まず気持ちを受け止めます。外からの情報に反応しやすい面があります。命式の水が強く、土が支える形です。小さな境界を決めると負担を整理しやすくなります。無理のない範囲で試してください。比喩は一つだけにしておくとよいでしょう。".repeat(3);
  const reading = {
    headline: "四柱リーディング",
    summary: body,
    sections: keys.map((key) => ({ key, title: "見出し", body, technicalBasis: "日主 戊" })),
    luckyActions: ["赤い小物を置いて火を補う"]
  };
  const issues = readingQualityIssues(reading, "ja");
  assert.ok(issues.some((issue) => issue.includes("process language")));
  assert.ok(issues.some((issue) => issue.includes("color, object")));
});

test("Technical evidence is rebuilt from the calculated chart in readable language", () => {
  const chart = calculateSaju({
    name: "Mina", date: "2000-07-29", time: "22:01", city: "Los Angeles", country: "United States", locale: "zh-CN"
  });
  const reading = {
    sections: [{ key: "day_master", title: "错误示例", body: "正文", technicalBasis: "年干是癸，Stable Wealth" }]
  };
  const result = applyTechnicalEvidence(reading, chart, "zh-CN");
  assert.equal(result.sections[0].technicalBasis.includes("年干是癸"), false);
  assert.equal(result.sections[0].technicalBasis.includes("戊子"), false);
  assert.match(result.sections[0].technicalBasis, /阳土/);
  assert.match(result.sections[0].technicalBasis, /自我核心/);
});

test("English chart facts reserve Hanja and pinyin for the visual Manse chart", () => {
  const chart = calculateSaju({
    name: "Jaeman", date: "2002-02-27", time: "09:46", city: "Daegu", country: "South Korea", locale: "en"
  });
  const serialized = JSON.stringify(localizedChartFacts(chart, "en"));
  assert.doesNotMatch(serialized, /[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/);
  assert.doesNotMatch(serialized, /\b(?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)-(?:Zi|Chou|Yin|Mao|Chen|Si|Wu|Wei|Shen|You|Xu|Hai)\b/);
  assert.match(serialized, /Yang Fire|Yang Water|Yin Water/);
  assert.match(serialized, /identity and close relationships/);
  assert.equal(serialized.includes("visibleElementCounts"), false);
  assert.equal(serialized.includes("hiddenStemWeighted"), false);
});

test("Element evidence stays qualitative and hides the five-number inventory", () => {
  const chart = calculateSaju({
    name: "Eunji", date: "1992-04-18", time: "14:20", city: "Seoul", country: "South Korea", locale: "ko"
  });
  const evidence = sectionEvidence(chart, "ko").element_balance.join(" ");
  assert.match(evidence, /두드러|받쳐|잔잔|드러나지/);
  assert.doesNotMatch(evidence, /(?:목|화|토|금|수)\s*\d/);
  assert.doesNotMatch(evidence, /\d+\.\d+/);
});

test("Korean post-processing removes numeric inventories and editor asides", () => {
  const reading = {
    headline: "무토가 중심을 잡는 사람",
    summary: "목2, 화0, 토1, 금4, 수1이고 속까지 합하면 목2, 화0, 토1.35, 금5.05, 수1.7로 나타납니다. 금 기운이 판단을 빠르게 세우는 쪽으로 작용해요.\"",
    sections: [{ key: "element_balance", title: "오행", body: "목2, 화0, 토1, 금4, 수1입니다. (이 한 문장은 지지의 제안입니다.) 결정을 내린 뒤에는 이유를 한 번 더 확인하는 편이 좋아요. 근거: 금 기운이 강한 분포입니다. (일간 표기는 이 한 문장에만 사용했습니다.)", technicalBasis: "목2, 화0, 토1, 금4, 수1" }],
    luckyActions: ["좋아요. 기록해보세요."],
    disclaimer: ""
  };
  const result = postProcessReading(reading, "ko");
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes("목2"), false);
  assert.equal(serialized.includes("5.05"), false);
  assert.equal(serialized.includes("지지의 제안"), false);
  assert.equal(serialized.includes("일간 표기는"), false);
  assert.equal(serialized.includes("근거:"), false);
  assert.match(result.summary, /금 기운/);
  assert.doesNotMatch(result.summary, /[\"”']$/);
  assert.match(result.sections[0].body, /이유를 한 번 더 확인/);
});

test("Korean quality gate rejects blanket reassurance and numeric element prose", () => {
  const body = "지금 방식도 괜찮아요. 천천히 가도 괜찮아요. 이미 충분해요. 지금도 잘하고 있어요. 그대로 해도 좋아요. 목2, 화0, 토1, 금4, 수1로 나타납니다.";
  const reading = {
    headline: "괜찮아요",
    summary: body,
    sections: keys.map((key) => ({ key, title: "위로", body, technicalBasis: "근거" })),
    luckyActions: []
  };
  const issues = readingQualityIssues(reading, "ko");
  assert.ok(issues.some((issue) => issue.includes("위로 표현")));
  assert.ok(issues.some((issue) => issue.includes("numeric Five Element")));
  assert.ok(issues.some((issue) => issue.includes("일방적인 위로")));
});

test("Reading notation is translated into meaning instead of repeated", () => {
  const chart = calculateSaju({
    name: "Jaeman", date: "2002-02-27", time: "09:46", city: "Daegu", country: "South Korea", locale: "en"
  });
  const day = chart.pillars.find((pillar) => pillar.position === "Day");
  const relation = chart.relationshipTags[0];
  const raw = {
    headline: `A story about ${day.stem.hanja} (${day.stem.pinyin}, ${day.stem.label})`,
    summary: `The Day pillar is ${day.stem.hanja}${day.branch.hanja} (${day.label}).`,
    sections: [{ key: "day_master", title: `${day.label} explained`, body: `The full chart is ${chart.manse.eightCharacters}. Its links include ${relation}.`, technicalBasis: relation }],
    luckyActions: [`Remember ${day.label}`],
    disclaimer: ""
  };
  const result = simplifyReadingNotation(raw, chart, "en");
  const serialized = JSON.stringify(result);
  assert.doesNotMatch(serialized, /[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/);
  assert.doesNotMatch(serialized, /\b(?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)-(?:Zi|Chou|Yin|Mao|Chen|Si|Wu|Wei|Shen|You|Xu|Hai)\b/);
  assert.match(serialized, new RegExp(day.stem.label));
  assert.match(serialized, /over/);
  assert.equal(serialized.includes(relation), false);
});

test("English quality gate rejects the raw notation shown in the reported sample", () => {
  const chart = calculateSaju({
    name: "Jaeman", date: "2002-02-27", time: "09:46", city: "Daegu", country: "South Korea", locale: "en"
  });
  const body = "There is a clear daily tension between warmth and pressure. Day Master is 丙 (Bing, Yang Fire), and Day pillar is 丙寅 (Bing-Yin). Hour pillar 癸巳 (Gui-Si) adds another technical label. The links include Yin-Si: Harm and Yin-Wu: Half Fire Combination. A practical pause can keep warmth available without forcing a performance every time. Give the response a little room before deciding what it has to mean.";
  const reading = {
    headline: "A campfire under a rainy sky",
    summary: body,
    sections: keys.map((key) => ({ key, title: "Section", body, technicalBasis: "丙寅 (Bing-Yin)" })),
    luckyActions: []
  };
  const issues = readingQualityIssues(reading, "en", chart);
  assert.ok(issues.some((issue) => issue.includes("pinyin")));
  assert.ok(issues.some((issue) => issue.includes("Hanja")));
  assert.ok(issues.some((issue) => issue.includes("repeated too often")));
});

test("Quality gate catches a stem assigned to the wrong pillar", () => {
  const chart = calculateSaju({
    name: "Mina", date: "2000-07-29", time: "22:01", city: "Los Angeles", country: "United States", locale: "zh-CN"
  });
  const body = "戊土希望稳定承接外部变化，水势较强时也容易同时处理许多信息。可以先把决定写下来，留一点缓冲，再按优先顺序行动。命盘的年、月、时都有癸水，因此需要反复确认界线。这样的安排不是限制，而是让注意力有清楚去处。每次只推进一件具体任务，会比同时回应所有请求更轻松。";
  const reading = {
    headline: "命盘标题",
    summary: body,
    sections: keys.map((key) => ({ key, title: "段落", body, technicalBasis: "日主 戊" })),
    luckyActions: []
  };
  const issues = readingQualityIssues(reading, "zh-CN", chart);
  assert.ok(issues.some((issue) => issue.includes("wrong pillar")));
});

test("Structured section object normalizes to all required keys in order", () => {
  const sections = Object.fromEntries(keys.map((key) => [key, { title: key, body: `${key} body` }]));
  const result = normalizeModelReading({ sections });
  assert.deepEqual(result.sections.map((section) => section.key), keys);
  assert.equal(result.sections[12].title, "lucky_actions");
});
