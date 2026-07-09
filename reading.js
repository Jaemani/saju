const pillarMeanings = {
  Hour: "private self",
  Day: "identity",
  Month: "social role",
  Year: "roots"
};

const elementMeanings = {
  Wood: "growth",
  Fire: "spark",
  Earth: "ground",
  Metal: "edge",
  Water: "flow"
};

const loadingStages = [
  {
    title: "Locating the birth city and timezone.",
    note: "We are correcting the chart first so the reading feels personal, not generic."
  },
  {
    title: "Building the Four Pillars.",
    note: "The Manse layer turns birth data into sky signs, ground signs, hidden stems, and timing markers."
  },
  {
    title: "Reading elements, Ten Gods, and chart links.",
    note: "This is where the app finds the emotional pattern behind the technical chart."
  },
  {
    title: "Drafting the interpretation.",
    note: "The first pass translates chart data into plain English with concrete life areas."
  },
  {
    title: "Polishing for empathy.",
    note: "The second pass softens the voice so the reading feels specific, warm, and human."
  },
  {
    title: "Still polishing the personal tone.",
    note: "Longer readings can take a little more time. The page is still working."
  }
];

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
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
    const copy = loadingStages[stage];

    if (elapsed) elapsed.textContent = String(seconds);
    if (progress) progress.style.width = `${percent}%`;
    if (qs("#loadingTitle")) qs("#loadingTitle").textContent = copy.title;
    if (hint) hint.textContent = copy.note;
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
          <span>${escapeHtml(pillar.position)}</span>
          <strong>${escapeHtml(pillar.stem?.hanja)}${escapeHtml(pillar.branch?.hanja)}</strong>
          <small>${escapeHtml(pillar.stem?.pinyin)}-${escapeHtml(pillar.branch?.pinyin)}</small>
          <em>${escapeHtml(pillarMeanings[pillar.position] || "marker")}</em>
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
          <span>${escapeHtml(element)}<small>${escapeHtml(elementMeanings[element] || "tone")}</small></span>
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
  const helpful = (chart.helpfulElements || []).join(" + ") || chart.weakestElement || "balance";
  const cards = [
    {
      label: "Seen First",
      title: validation?.title || "The chart starts by naming what you have carried quietly.",
      body: compactText(validation?.body || reading.summary, 150)
    },
    {
      label: "Pattern",
      title: `${chart.strongestElement || "Strong"} is loud, ${chart.weakestElement || "quiet"} asks for care.`,
      body: compactText(reality?.body || "The reading separates a real chart pattern from self-blame.", 150)
    },
    {
      label: "Move Today",
      title: `Add ${helpful} on purpose.`,
      body: compactText(firstAction, 150)
    }
  ];

  return `
    <div class="result-brief" aria-label="Reading quick take">
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

function renderResultMap(chart) {
  const topTag = chart.relationshipTags?.[0] || chart.symbolicStars?.[0] || "plain chart flow";
  const helpful = (chart.helpfulElements || []).join(", ") || "small daily balance";
  return `
    <div class="result-map" aria-label="Visual chart map">
      <article class="map-node map-master">
        <span>Day Master</span>
        <strong>${escapeHtml(chart.dayMaster?.hanja)} ${escapeHtml(chart.dayMaster?.pinyin)}</strong>
        <p>${escapeHtml(chart.dayMaster?.label)} center</p>
      </article>
      <article class="map-node map-elements">
        <span>Energy Shape</span>
        <strong>${escapeHtml(chart.strongestElement)} / ${escapeHtml(chart.weakestElement)}</strong>
        <p>what is loud / what needs support</p>
      </article>
      <article class="map-node map-help">
        <span>Useful Remedy</span>
        <strong>${escapeHtml(helpful)}</strong>
        <p>habits that make the chart easier to live</p>
      </article>
      <article class="map-node map-link">
        <span>Chart Link</span>
        <strong>${escapeHtml(topTag)}</strong>
        <p>why the reading feels smooth, tense, magnetic, or complex</p>
      </article>
    </div>
  `;
}

function sectionMarkup(section, index) {
  const closed = index > 2;
  return `
    <article class="generated-section ${closed ? "closed" : ""}">
      <button class="accordion-trigger generated-trigger" type="button">
        <small>${String(index + 1).padStart(2, "0")}</small>
        <b>${escapeHtml(section.title)}</b>
        <span>${closed ? "+" : "-"}</span>
      </button>
      <div class="accordion-body generated-body">
        <p>${escapeHtml(section.body)}</p>
        <small>${escapeHtml(section.technicalBasis)}</small>
      </div>
    </article>
  `;
}

function renderGenerated(payload) {
  const result = qs("#generatedResult");
  const { reading, chart, model, source, voicePasses, warning } = payload;
  const tags = [...(chart.relationshipTags || []), ...(chart.symbolicStars || [])]
    .slice(0, 10)
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
  const voiceLabel = (voicePasses || []).join(" -> ") || "chart draft -> empathy polish";
  const location = [chart.location?.city, chart.location?.country].filter(Boolean).join(", ");

  result.innerHTML = `
    <div class="generated-hero">
      <div>
        <p class="eyebrow">${source === "openai" ? `Generated with ${escapeHtml(model)}` : "Generated with local fallback"}</p>
        <h3>${escapeHtml(reading.headline)}</h3>
        <p>${escapeHtml(reading.summary)}</p>
      </div>
      <div class="voice-meter">
        <span>Writing engine</span>
        <strong>${escapeHtml(voiceLabel)}</strong>
        <small>chart data first, emotional polish second</small>
      </div>
    </div>
    ${renderBriefCards(reading, chart)}
    ${renderResultMap(chart)}
    <div class="chart-snapshot">
      <article class="snapshot-core ${chart.dayMaster?.element?.toLowerCase() || "earth"}">
        <span>Center of the chart</span>
        <strong>${escapeHtml(chart.dayMaster?.hanja)} ${escapeHtml(chart.dayMaster?.pinyin)}</strong>
        <small>${escapeHtml(chart.dayMaster?.label)} Day Master</small>
        <p>Every money, work, love, pressure, and support marker is interpreted relative to this center.</p>
      </article>
      <div class="snapshot-pillars">${renderPillarSnapshot(chart)}</div>
      <article class="snapshot-elements">
        <h3>Element Balance</h3>
        ${renderElementBars(chart)}
      </article>
    </div>
    <div class="plain-decoder">
      <strong>Plain English</strong>
      <span>Strongest: ${escapeHtml(chart.strongestElement)} (${escapeHtml(elementMeanings[chart.strongestElement] || "main mood")})</span>
      <span>Quietest: ${escapeHtml(chart.weakestElement)} (${escapeHtml(elementMeanings[chart.weakestElement] || "growth edge")})</span>
      <span>Helpful: ${escapeHtml((chart.helpfulElements || []).join(", ") || "balance habits")}</span>
      <span>Location: ${escapeHtml(location || "birthplace correction")}</span>
    </div>
    <div class="tag-strip">${tags || "<span>No major chart link detected</span>"}</div>
    <div class="generated-list">${(reading.sections || []).map(sectionMarkup).join("")}</div>
    <div class="lucky-box">
      <h3>Tiny Actions</h3>
      <ul>${(reading.luckyActions || []).map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ul>
    </div>
    <div class="checkout-note">
      <strong>Login is only required when you save or unlock checkout.</strong>
      <p>This reading is visible first. Create an account when you want to save it to Vault, unlock the full report, or buy Star Credits.</p>
      <button type="button" data-auth-action="login">Login to save or unlock checkout</button>
    </div>
    <p class="disclaimer">${escapeHtml(reading.disclaimer)}</p>
    ${warning ? `<p class="warning">${escapeHtml(warning)}</p>` : ""}
  `;

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
    const response = await fetch("/api/generate-reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
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
        <strong>Reading failed</strong>
        <p>${escapeHtml(error.message)}</p>
        <a class="primary-link" href="index.html#birth-form">Try again</a>
      </div>
    `;
  }
}

runReading();
