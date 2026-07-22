const pillarMeanings = {
  Hour: "pillar.private",
  Day: "pillar.identity",
  Month: "pillar.social",
  Year: "pillar.roots"
};

const elementMeanings = {
  Wood: "element.growth",
  Fire: "element.spark",
  Earth: "element.ground",
  Metal: "element.edge",
  Water: "element.flow"
};

const loadingStages = [
  "loading.stage1",
  "loading.stage2",
  "loading.stage3",
  "loading.stage4",
  "loading.stage5",
  "loading.long"
];

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function t(key, variables) {
  return window.SajuPopI18n?.t(key, variables) || key;
}

function locale() {
  return window.SajuPopI18n?.getLocale() || "en";
}

function elementLabel(element) {
  return t(`element.${String(element || "").toLowerCase()}`);
}

function balanceCueLabel() {
  return { en: "Balance cues", ko: "균형 참고", "zh-CN": "平衡参考", es: "Pistas de equilibrio", ja: "バランスの参考" }[locale()] || "Balance cues";
}

function localizeChartTag(tag) {
  const replacements = {
    ko: [["Heavenly Stem Combination to", "천간합 →"], ["Six Combination toward", "육합 →"], ["Half Fire Combination", "화 반합"], ["Half Wood Combination", "목 반합"], ["Half Water Combination", "수 반합"], ["Half Metal Combination", "금 반합"], ["Clash", "충"], ["Harm", "해"], ["Penalty pattern", "형의 흐름"], ["Ghost Gate / Irritation marker", "귀문·예민함"], ["Red Charm Star / Peach Blossom accent", "도화의 매력"], ["Travel Star / movement opens luck", "역마·이동운"], ["Heavenly Noble / mentor support", "천을귀인·도움운"], ["Needle Star / precise words and technical detail", "현침살·정교한 감각"], ["Iron Wall Star / strong backbone", "괴강·강한 중심"]],
    "zh-CN": [["Heavenly Stem Combination to", "天干合化"], ["Six Combination toward", "六合趋向"], ["Half Fire Combination", "火半合"], ["Half Wood Combination", "木半合"], ["Half Water Combination", "水半合"], ["Half Metal Combination", "金半合"], ["Clash", "冲"], ["Harm", "害"], ["Penalty pattern", "刑的模式"], ["Ghost Gate / Irritation marker", "鬼门·敏感标记"], ["Red Charm Star / Peach Blossom accent", "桃花"], ["Travel Star / movement opens luck", "驿马·移动"], ["Heavenly Noble / mentor support", "天乙贵人"], ["Needle Star / precise words and technical detail", "悬针·精准表达"], ["Iron Wall Star / strong backbone", "魁罡·强韧中心"]],
    es: [["Heavenly Stem Combination to", "Combinación celeste hacia"], ["Six Combination toward", "Combinación de seis hacia"], ["Half Fire Combination", "Media combinación de Fuego"], ["Half Wood Combination", "Media combinación de Madera"], ["Half Water Combination", "Media combinación de Agua"], ["Half Metal Combination", "Media combinación de Metal"], ["Clash", "Choque"], ["Harm", "Daño"], ["Penalty pattern", "patrón de Castigo"], ["Ghost Gate / Irritation marker", "Puerta Fantasma · sensibilidad"], ["Red Charm Star / Peach Blossom accent", "Estrella de encanto"], ["Travel Star / movement opens luck", "Estrella de movimiento"], ["Heavenly Noble / mentor support", "Noble celestial · apoyo"], ["Needle Star / precise words and technical detail", "Estrella Aguja · precisión"], ["Iron Wall Star / strong backbone", "Muro de Hierro · firmeza"]],
    ja: [["Heavenly Stem Combination to", "干合 →"], ["Six Combination toward", "六合 →"], ["Half Fire Combination", "火の半合"], ["Half Wood Combination", "木の半合"], ["Half Water Combination", "水の半合"], ["Half Metal Combination", "金の半合"], ["Clash", "冲"], ["Harm", "害"], ["Penalty pattern", "刑の流れ"], ["Ghost Gate / Irritation marker", "鬼門・繊細さ"], ["Red Charm Star / Peach Blossom accent", "桃花の魅力"], ["Travel Star / movement opens luck", "駅馬・移動運"], ["Heavenly Noble / mentor support", "天乙貴人・助け"], ["Needle Star / precise words and technical detail", "懸針・精密な感覚"], ["Iron Wall Star / strong backbone", "魁罡・強い軸"]]
  };
  const localized = (replacements[locale()] || []).reduce((text, [from, to]) => text.replace(from, to), String(tag || ""));
  return Object.keys(elementMeanings).reduce(
    (text, element) => text.replace(new RegExp(`\\b${element}\\b`, "g"), elementLabel(element)),
    localized
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function compactText(value, maxLength = 170) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
}

function startLoadingTimer() {
  const startedAt = Date.now();
  const progress = qs("#loadingProgress");
  const elapsed = qs("#elapsedSeconds");
  const steps = qsa(".loading-steps li");
  const hint = qs("#loadingHint") || qs(".loading-copy p");

  const tick = () => {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    const stage = seconds > 92 ? 5 : Math.min(4, Math.floor(seconds / 16));
    const percent = Math.min(94, 8 + seconds * 1.05);
    const copyKey = loadingStages[stage];

    if (elapsed) elapsed.textContent = String(seconds);
    if (progress) progress.style.width = `${percent}%`;
    if (qs("#loadingTitle")) qs("#loadingTitle").textContent = t(copyKey);
    if (hint) hint.textContent = stage === 5 ? t("loading.long") : t("loading.intro");
    steps.forEach((step, index) => {
      step.classList.toggle("active", index <= Math.min(stage, 4));
    });
  };

  tick();
  return window.setInterval(tick, 1000);
}

function stopLoadingTimer(timer) {
  window.clearInterval(timer);
  if (qs("#loadingProgress")) qs("#loadingProgress").style.width = "100%";
  qsa(".loading-steps li").forEach((step) => step.classList.add("active"));
}

function renderPillarSnapshot(chart) {
  return (chart.pillars || [])
    .map((pillar) => {
      const element = pillar.stem?.element?.toLowerCase() || "earth";
      return `
        <article class="snapshot-pillar ${element}">
          <span>${escapeHtml(t(`pillar.${pillar.position.toLowerCase()}`))}</span>
          <strong>${escapeHtml(pillar.stem?.hanja)}${escapeHtml(pillar.branch?.hanja)}</strong>
          <small>${escapeHtml(pillar.stem?.pinyin)}-${escapeHtml(pillar.branch?.pinyin)}</small>
          <em>${escapeHtml(t(pillarMeanings[pillar.position] || "result.marker"))}</em>
        </article>
      `;
    })
    .join("");
}

function renderElementBars(chart) {
  const elements = chart.elements || chart.weightedElements || {};
  const max = Math.max(...Object.values(elements), 1);
  return Object.entries(elements)
    .map(([element, count]) => {
      const width = Math.max(8, Math.round((Number(count) / max) * 100));
      return `
        <div class="element-bar-row ${element.toLowerCase()}">
          <span>${escapeHtml(elementLabel(element))}<small>${escapeHtml(t(elementMeanings[element] || "result.marker"))}</small></span>
          <div><i style="width:${width}%"></i></div>
          <strong>${escapeHtml(count)}</strong>
        </div>
      `;
    })
    .join("");
}

function findSection(reading, key) {
  return (reading.sections || []).find((section) => section.key === key);
}

function renderBriefCards(reading, chart) {
  const validation = findSection(reading, "validation") || findSection(reading, "personality");
  const reality = findSection(reading, "reality_check") || findSection(reading, "element_balance");
  const firstAction = reading.luckyActions?.[0] || "Choose one small action that adds warmth and structure today.";
  const helpful = (chart.helpfulElements || []).map(elementLabel).join(" + ") || elementLabel(chart.weakestElement);
  const cards = [
    {
      label: t("result.seen"),
      title: validation?.title || "The chart starts by naming what you have carried quietly.",
      body: compactText(validation?.body || reading.summary, 150)
    },
    {
      label: t("result.pattern"),
      title: `${elementLabel(chart.strongestElement)} / ${elementLabel(chart.weakestElement)}`,
      body: compactText(reality?.body || "The reading separates a real chart pattern from self-blame.", 150)
    },
    {
      label: t("result.move"),
      title: helpful,
      body: compactText(firstAction, 150)
    }
  ];

  return `
    <div class="result-brief" id="readingOverview" aria-label="Reading quick take">
      ${cards
        .map(
          (card, index) => `
            <article class="brief-card brief-${index + 1}">
              <span>${escapeHtml(card.label)}</span>
              <h4>${escapeHtml(card.title)}</h4>
              <p>${escapeHtml(card.body)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function sectionMarkup(section, index) {
  const closed = index > 1;
  return `
    <article class="generated-section ${closed ? "closed" : ""}">
      <button class="accordion-trigger generated-trigger" type="button">
        <small>${String(index + 1).padStart(2, "0")}</small>
        <b>${escapeHtml(section.title)}</b>
        <span>${closed ? "+" : "-"}</span>
      </button>
      <div class="accordion-body generated-body">
        <p>${escapeHtml(section.body)}</p>
        <details class="technical-note">
          <summary>${escapeHtml(t("result.why"))}</summary>
          <small>${escapeHtml(section.technicalBasis)}</small>
        </details>
      </div>
    </article>
  `;
}

function renderGenerated(payload) {
  const result = qs("#generatedResult");
  const { reading, chart, model, source, voicePasses, warning } = payload;
  const tags = [...(chart.relationshipTags || []), ...(chart.symbolicStars || [])]
    .slice(0, 10)
    .map((tag) => `<span>${escapeHtml(localizeChartTag(tag))}</span>`)
    .join("");
  const location = [chart.location?.city, chart.location?.country].filter(Boolean).join(", ");
  const personLine = [chart.input?.name, chart.input?.date, location].filter(Boolean).join(" · ");

  result.innerHTML = `
    <div class="generated-hero">
      <div>
        <p class="eyebrow">${escapeHtml(personLine)}</p>
        <h3>${escapeHtml(reading.headline)}</h3>
        <p>${escapeHtml(reading.summary)}</p>
      </div>
    </div>
    ${renderBriefCards(reading, chart)}
    <div class="section-divider" id="readingChart"><span>${escapeHtml(t("result.chart"))}</span></div>
    <div class="chart-snapshot">
      <article class="snapshot-core ${chart.dayMaster?.element?.toLowerCase() || "earth"}">
        <span>${escapeHtml(t("result.center"))}</span>
        <strong>${escapeHtml(chart.dayMaster?.hanja)} ${escapeHtml(chart.dayMaster?.pinyin)}</strong>
        <small>${escapeHtml(t("terms.dayMaster"))}</small>
        <p>${escapeHtml(t("termHelp.dayMaster"))}</p>
      </article>
      <div class="snapshot-pillars">${renderPillarSnapshot(chart)}</div>
      <article class="snapshot-elements">
        <h3>${escapeHtml(t("result.elementBalance"))}</h3>
        ${renderElementBars(chart)}
      </article>
    </div>
    <div class="plain-decoder">
      <strong>${escapeHtml(t("result.plain"))}</strong>
      <span>${escapeHtml(t("result.strongest"))}: ${escapeHtml(elementLabel(chart.strongestElement))}</span>
      <span>${escapeHtml(t("result.quietest"))}: ${escapeHtml(elementLabel(chart.weakestElement))}</span>
      <span>${escapeHtml(balanceCueLabel())}: ${escapeHtml((chart.helpfulElements || []).map(elementLabel).join(", "))}</span>
      <span>${escapeHtml(t("result.location"))}: ${escapeHtml(location)}</span>
    </div>
    <div class="tag-strip">${tags || `<span>${escapeHtml(t("result.noLinks"))}</span>`}</div>
    <div class="section-divider" id="readingDetails"><span>${escapeHtml(t("result.reading"))}</span></div>
    <div class="generated-list">${(reading.sections || []).map(sectionMarkup).join("")}</div>
    <div class="lucky-box">
      <h3>${escapeHtml(t("result.actionsTitle"))}</h3>
      <ul>${(reading.luckyActions || []).map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ul>
    </div>
    <div class="checkout-note">
      <strong>${escapeHtml(t("result.saveTitle"))}</strong>
      <p>${escapeHtml(t("result.saveBody"))}</p>
      <button type="button" data-auth-action="login">${escapeHtml(t("result.saveCta"))}</button>
    </div>
    <p class="disclaimer">${escapeHtml(reading.disclaimer || t("result.disclaimer"))}</p>
  `;

  if (warning) console.warn(warning);

  qsa(".generated-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".generated-section");
      item.classList.toggle("closed");
      trigger.querySelector("span").textContent = item.classList.contains("closed") ? "+" : "-";
    });
  });
}

async function runReading() {
  const raw = sessionStorage.getItem("sajupop.pendingReading");
  if (!raw) {
    qs("#loadingView").classList.add("hidden");
    qs("#emptyView").classList.remove("hidden");
    return;
  }

  const payload = JSON.parse(raw);
  const timer = startLoadingTimer();

  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 240000);
    const response = await fetch("/api/generate-reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    window.clearTimeout(timeout);
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Unable to generate reading");
    stopLoadingTimer(timer);
    renderGenerated(result);
    qs("#loadingView").classList.add("hidden");
    qs("#resultView").classList.remove("hidden");
  } catch (error) {
    window.clearInterval(timer);
    qs("#loadingView").innerHTML = `
      <div class="error-panel">
        <strong>${escapeHtml(t("result.retryTitle"))}</strong>
        <p>${escapeHtml(error.message)}</p>
        <a class="primary-link" href="index.html#birth-form">${escapeHtml(t("result.retry"))}</a>
      </div>
    `;
  }
}

window.addEventListener("sajupop-locale-changed", (event) => {
  const raw = sessionStorage.getItem("sajupop.pendingReading");
  if (!raw) return;
  const pending = JSON.parse(raw);
  if (pending.locale === event.detail.locale) return;
  pending.locale = event.detail.locale;
  sessionStorage.setItem("sajupop.pendingReading", JSON.stringify(pending));
  window.location.reload();
});

runReading();
