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

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function startLoadingTimer() {
  const startedAt = Date.now();
  const progress = qs("#loadingProgress");
  const elapsed = qs("#elapsedSeconds");
  const steps = qsa(".loading-steps li");
  const titles = [
    "Locating the birth city and timezone.",
    "Building the Four Pillars from the Manse calendar.",
    "Checking elements, Ten Gods, and chart links.",
    "Drafting the interpretation.",
    "Polishing the voice for empathy."
  ];
  return window.setInterval(() => {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    const stage = Math.min(4, Math.floor(seconds / 14));
    const percent = Math.min(92, 8 + seconds * 1.25);
    elapsed.textContent = String(seconds);
    progress.style.width = `${percent}%`;
    qs("#loadingTitle").textContent = titles[stage];
    steps.forEach((step, index) => {
      step.classList.toggle("active", index <= stage);
    });
  }, 1000);
}

function stopLoadingTimer(timer) {
  window.clearInterval(timer);
  qs("#loadingProgress").style.width = "100%";
  qsa(".loading-steps li").forEach((step) => step.classList.add("active"));
}

function renderPillarSnapshot(chart) {
  return (chart.pillars || [])
    .map((pillar) => {
      const element = pillar.stem.element.toLowerCase();
      return `
        <article class="snapshot-pillar ${element}">
          <span>${pillar.position}</span>
          <strong>${pillar.stem.hanja}${pillar.branch.hanja}</strong>
          <small>${pillar.stem.pinyin}-${pillar.branch.pinyin}</small>
          <em>${pillarMeanings[pillar.position]}</em>
        </article>
      `;
    })
    .join("");
}

function renderElementBars(chart) {
  const max = Math.max(...Object.values(chart.elements), 1);
  return Object.entries(chart.elements)
    .map(([element, count]) => {
      const width = Math.max(8, Math.round((count / max) * 100));
      return `
        <div class="element-bar-row ${element.toLowerCase()}">
          <span>${element}<small>${elementMeanings[element]}</small></span>
          <div><i style="width:${width}%"></i></div>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join("");
}

function sectionMarkup(section) {
  return `
    <article class="generated-section">
      <button class="accordion-trigger generated-trigger" type="button">
        ${section.title}
        <span>-</span>
      </button>
      <div class="accordion-body generated-body">
        <p>${section.body}</p>
        <small>${section.technicalBasis}</small>
      </div>
    </article>
  `;
}

function renderGenerated(payload) {
  const result = qs("#generatedResult");
  const { reading, chart, model, source, voicePasses, warning } = payload;
  const tags = [...(chart.relationshipTags || []), ...(chart.symbolicStars || [])]
    .slice(0, 10)
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  result.innerHTML = `
    <div class="generated-hero">
      <div>
        <p class="eyebrow">${source === "openai" ? `Generated with ${model}` : "Generated with local fallback"}</p>
        <h3>${reading.headline}</h3>
        <p>${reading.summary}</p>
      </div>
      <div class="voice-meter">
        <span>Voice passes</span>
        <strong>${(voicePasses || []).join(" -> ")}</strong>
      </div>
    </div>
    <div class="chart-snapshot">
      <article class="snapshot-core ${chart.dayMaster.element.toLowerCase()}">
        <span>Center of the chart</span>
        <strong>${chart.dayMaster.hanja} ${chart.dayMaster.pinyin}</strong>
        <small>${chart.dayMaster.label} Day Master</small>
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
      <span>Strongest: ${chart.strongestElement} (${elementMeanings[chart.strongestElement]})</span>
      <span>Quietest: ${chart.weakestElement} (${elementMeanings[chart.weakestElement]})</span>
      <span>Helpful: ${(chart.helpfulElements || []).join(", ") || "balance habits"}</span>
      <span>Location: ${chart.location.city}, ${chart.location.country}</span>
    </div>
    <div class="tag-strip">${tags || "<span>No major chart link detected</span>"}</div>
    <div class="generated-list">${reading.sections.map(sectionMarkup).join("")}</div>
    <div class="lucky-box">
      <h3>Lucky Actions</h3>
      <ul>${reading.luckyActions.map((action) => `<li>${action}</li>`).join("")}</ul>
    </div>
    <div class="checkout-note">
      <strong>Checkout will require login.</strong>
      <p>This result page is ready for the later account and payment gate: save to Vault, unlock full report, or buy Star Credits after login.</p>
    </div>
    <p class="disclaimer">${reading.disclaimer}</p>
    ${warning ? `<p class="warning">${warning}</p>` : ""}
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
        <p>${error.message}</p>
        <a class="primary-link" href="index.html#birth-form">Try again</a>
      </div>
    `;
  }
}

runReading();

