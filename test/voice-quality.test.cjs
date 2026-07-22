const test = require("node:test");
const assert = require("node:assert/strict");
const { postProcessReading, readingQualityIssues } = require("../api/generate-reading");
const { calculateSaju } = require("../api/saju-engine");
const { applyTechnicalEvidence, localizeChartText } = require("../api/locale-chart");

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
  const body = "민아님은 겉으로 차분하게 상황을 정리하지만, 속에서는 주변의 말과 분위기를 빠르게 읽는 편이에요. 수 기운이 강하고 무토 일간이 중심을 잡는 구조라서 섬세한 감각과 현실적인 판단이 함께 움직입니다. 그동안 괜찮은 척 버텨온 순간이 있었다면 약해서가 아니라 놓치고 싶지 않은 것이 많았기 때문일 거예요. 모든 일을 한꺼번에 정리하려 하지 말고, 우선순위를 줄여 몸이 따라올 시간을 남겨주세요. 작은 경계를 세우는 일이 오히려 다정함과 집중력을 오래 지켜줍니다. 오늘은 해야 할 일을 세 가지로 줄이고, 미뤄도 되는 일 하나를 분명하게 골라보세요. 이런 작고 구체적인 선택이 쌓이면 무토의 안정감은 부담이 아니라 믿을 만한 힘으로 자리 잡습니다.";
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

test("Technical evidence is rebuilt from the calculated chart", () => {
  const chart = calculateSaju({
    name: "Mina", date: "2000-07-29", time: "22:01", city: "Los Angeles", country: "United States", locale: "zh-CN"
  });
  const reading = {
    sections: [{ key: "day_master", title: "错误示例", body: "正文", technicalBasis: "年干是癸，Stable Wealth" }]
  };
  const result = applyTechnicalEvidence(reading, chart, "zh-CN");
  assert.equal(result.sections[0].technicalBasis.includes("年干是癸"), false);
  assert.match(result.sections[0].technicalBasis, /戊子/);
  assert.match(result.sections[0].technicalBasis, /日主/);
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
