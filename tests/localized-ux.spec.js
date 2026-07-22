const { test, expect } = require("@playwright/test");
const { calculateSaju } = require("../api/saju-engine");

const birth = {
  name: "민아",
  date: "2000-07-29",
  time: "22:01",
  birthplace: "Los Angeles, United States",
  city: "Los Angeles",
  country: "US",
  calendar: "Gregorian",
  accuracy: "Exact time",
  locale: "ko"
};

function koreanReading(chart) {
  const titles = [
    "잔잔해 보여도 마음속에서는 늘 여러 갈래의 흐름을 읽고 있어요",
    "물이 강한 사주라서 따뜻한 추진력을 의식적으로 챙겨야 해요",
    "무토 일간의 든든함은 책임을 떠안으라는 뜻이 아니에요",
    "괜찮은 척 버티는 시간이 길어지면 마음이 먼저 지칠 수 있어요",
    "남들이 모르는 무게까지 조용히 감당해온 사람이네요",
    "차분한 겉모습 안에 빠르고 섬세한 감각이 함께 있어요",
    "정리하는 힘과 사람의 마음을 읽는 감각을 함께 쓰는 일이 잘 맞아요",
    "돈은 감각보다 지켜주는 규칙이 있을 때 더 편안하게 모여요",
    "마음을 알아맞히는 사람보다 솔직하게 대화할 수 있는 사람이 좋아요",
    "가족을 사랑하는 마음과 내 삶의 경계는 함께 지킬 수 있어요",
    "넓은 인맥보다 마음이 놓이는 몇 사람이 더 중요해요",
    "햇볕과 움직임이 있는 환경에서 생각도 가벼워져요",
    "오늘은 거창한 변화보다 생활에 온기 하나를 더해보세요"
  ];
  const keys = ["core_metaphor", "element_balance", "day_master", "reality_check", "validation", "personality", "career", "money", "love", "family", "friends", "location", "lucky_actions"];
  const body = "민아님은 겉으로는 차분하게 상황을 정리하지만, 속에서는 다른 사람의 말과 분위기를 빠르게 받아들이는 편이에요. 수 기운이 강하고 무토 일간이 중심을 잡는 구조라서, 흔들리지 않으려는 책임감과 섬세한 감각이 함께 움직입니다. 그동안 괜찮은 척 버텨온 순간이 있었다면 약해서가 아니라 놓치고 싶지 않은 것이 많았기 때문일 거예요. 이제는 모든 일을 혼자 정리하려 하지 말고, 우선순위를 줄여 몸이 따라올 시간을 남겨주세요. 작은 경계를 세우는 일이 오히려 민아님의 다정함을 오래 지켜줍니다.";
  return {
    headline: "민아님, 깊은 물결 속에서도 자기 자리를 지켜온 사람이네요",
    summary: "이 사주는 감정을 세밀하게 읽는 수의 기운과 현실을 단단히 붙잡는 무토의 힘이 함께 보여요. 남들이 보는 안정감 뒤에 생각이 많아지는 시간이 있었겠지만, 그 섬세함은 제대로 쉬고 경계를 세울 때 분명한 판단력으로 바뀝니다.",
    sections: keys.map((key, index) => ({ key, title: titles[index], body, technicalBasis: `만세력 ${chart.manse.eightCharacters}, 일간 ${chart.dayMaster.hanja}, ${key}와 관련된 오행·십신·지지 관계를 함께 살폈어요.` })),
    luckyActions: ["아침 햇볕을 10분쯤 쬐어 몸의 속도를 깨워보세요.", "해야 할 일을 세 가지로 줄여 적어보세요.", "돈과 휴식에는 감정 대신 지켜주는 규칙을 하나씩 두세요.", "마음에 걸리는 말은 오래 묵히기 전에 짧고 솔직하게 꺼내보세요."],
    disclaimer: "사주는 성찰과 재미를 위한 전통적인 해석 체계입니다. 이 풀이는 의료, 법률, 재정, 심리 상담을 대신하지 않습니다."
  };
}

async function setLocale(page, locale) {
  await page.addInitScript((value) => localStorage.setItem("sajupop.locale", value), locale);
}

test.beforeEach(async ({ page }) => {
  await page.route("**/api/firebase-config", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ configured: false }) }));
});

test("Korean home and account stay readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setLocale(page, "ko");
  await page.goto("/index.html");
  await expect(page.getByRole("heading", { name: /사주를 풀어드릴게요/ })).toBeVisible();
  await expect(page.locator("#countryInput option")).toHaveCount(248);
  await page.screenshot({ path: "docs/audits/2026-07-22/08-home-ko-mobile.png", fullPage: true });
  await page.goto("/account.html");
  await expect(page.getByRole("heading", { name: /마음에 남은 풀이/ })).toBeVisible();
  await page.screenshot({ path: "docs/audits/2026-07-22/09-account-ko-mobile.png", fullPage: true });
});

test("Korean loading and result present a clear reading flow", async ({ page }) => {
  const chart = calculateSaju(birth);
  const apiResponse = { ok: true, chart, reading: koreanReading(chart), model: "gpt-5-mini", source: "openai", voicePasses: ["chart-draft", "ko-native-empathy-polish"] };
  await setLocale(page, "ko");
  await page.goto("/index.html");
  await page.evaluate((payload) => sessionStorage.setItem("sajupop.pendingReading", JSON.stringify(payload)), birth);
  await page.route("**/api/generate-reading", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(apiResponse) });
  });
  await page.goto("/reading.html");
  await expect(page.getByText("사주를 읽고 있어요")).toBeVisible();
  await page.screenshot({ path: "docs/audits/2026-07-22/10-loading-ko-desktop.png", fullPage: true });
  await expect(page.locator("#resultView")).toBeVisible();
  await expect(page.getByText("이렇게 읽은 이유").first()).toBeVisible();
  await expect(page.locator(".reading-group")).toHaveCount(4);
  await expect(page.getByText("진로와 일", { exact: true })).toBeVisible();
  await expect(page.getByText("재물과 소비", { exact: true })).toBeVisible();
  await expect(page.getByText("연애와 친밀감", { exact: true })).toBeVisible();
  await expect(page.getByText("대인관계", { exact: true })).toBeVisible();
  await page.screenshot({ path: "docs/audits/2026-07-22/11-result-ko-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "docs/audits/2026-07-22/12-result-ko-mobile.png", fullPage: true });
});

for (const [locale, heading] of [["zh-CN", /把韩国四柱讲清楚/], ["es", /Una lectura coreana/], ["ja", /韓国の四柱/]]) {
  test(`${locale} core UI fits mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await setLocale(page, locale);
    await page.goto("/index.html");
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  });
}
