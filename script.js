const termCopy = {
  "Day Master":
    "The Day Master is the heavenly stem of the day pillar. It is the reference point for identity and all Ten Gods.",
  "Hidden Stems":
    "Hidden Stems are inner energies stored inside each Earthly Branch. They explain what is not obvious at first glance.",
  "Ten Gods":
    "Ten Gods are relationship labels between the Day Master and other stems: peers, talent, wealth, pressure, and resources.",
  "Symbolic Stars":
    "Symbolic Stars, or Shinsal, are traditional interpretive accents. They add texture but should not be treated as fixed fate.",
  "Zi-Wei Harm":
    "Zi-Wei Harm, or Rat-Goat Harm, points to subtle mismatch, emotional friction, or practical tension that needs care.",
  "Ghost Gate":
    "Ghost Gate suggests hyper-intuition, obsessive thought loops, and unusual perception. It is best used as creative insight."
};

const pillarIds = {
  Hour: ["hourStem", "hourStemLabel", "hourBranch", "hourBranchLabel"],
  Day: ["dayStem", "dayStemLabel", "dayBranch", "dayBranchLabel"],
  Month: ["monthStem", "monthStemLabel", "monthBranch", "monthBranchLabel"],
  Year: ["yearStem", "yearStemLabel", "yearBranch", "yearBranchLabel"]
};

const pillarMeanings = {
  Hour: "private habits",
  Day: "identity",
  Month: "work climate",
  Year: "roots"
};

const elementMeanings = {
  Wood: "growth",
  Fire: "spark",
  Earth: "ground",
  Metal: "edge",
  Water: "flow"
};

const countryCities = {
  "United States": ["Los Angeles", "San Francisco", "New York", "Chicago", "Seattle", "Austin", "Miami", "Boston"],
  "South Korea": ["Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Jeju"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Fukuoka", "Sapporo", "Yokohama"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh", "Glasgow"],
  France: ["Paris", "Lyon", "Marseille", "Nice", "Toulouse"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao"],
  Italy: ["Rome", "Milan", "Naples", "Florence", "Venice"],
  Netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  China: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
  Taiwan: ["Taipei", "Kaohsiung", "Taichung", "Tainan"],
  "Hong Kong": ["Hong Kong"],
  Singapore: ["Singapore"],
  Thailand: ["Bangkok", "Chiang Mai", "Phuket"],
  Philippines: ["Manila", "Cebu", "Davao"],
  Indonesia: ["Jakarta", "Bali", "Surabaya", "Bandung"],
  India: ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Mexico: ["Mexico City", "Guadalajara", "Monterrey", "Tijuana"],
  Brazil: ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador"]
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function collectBirthPayload() {
  const city = qs("#cityInput")?.value?.trim() || "Los Angeles";
  const country = qs("#countryInput")?.value || "United States";
  return {
    name: qs("#nameInput")?.value?.trim() || "Your",
    date: qs("#dateInput")?.value || "2000-07-29",
    time: qs("#timeInput")?.value || "22:01",
    birthplace: `${city}, ${country}`,
    city,
    country,
    calendar: qs("#calendarInput")?.value || "Gregorian",
    accuracy: qs("#accuracyInput")?.value || "Exact time",
    tone: qs("#toneInput")?.value || "Warm, trendy, and detailed"
  };
}

function updateCitySuggestions() {
  const country = qs("#countryInput")?.value || "United States";
  const cities = countryCities[country] || [];
  const list = qs("#cityList");
  if (!list) return;
  list.innerHTML = cities.map((city) => `<option value="${city}"></option>`).join("");
  const cityInput = qs("#cityInput");
  if (cityInput && cities.length && !cities.includes(cityInput.value)) {
    cityInput.placeholder = `Try ${cities[0]}`;
  }
}

function setButtonLoading(isLoading) {
  const button = qs("#generateReadingBtn");
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? "Reading the chart..." : "Generate My Reading";
}

function renderChart(chart) {
  if (!chart) return;
  for (const pillar of chart.pillars || []) {
    const ids = pillarIds[pillar.position];
    if (!ids) continue;
    const [stemId, stemLabelId, branchId, branchLabelId] = ids;
    qs(`#${stemId}`).textContent = pillar.stem.hanja;
    qs(`#${stemLabelId}`).textContent = pillar.position === "Day" ? `${pillar.stem.pinyin} Day Master` : pillar.tenGod;
    qs(`#${branchId}`).textContent = pillar.branch.hanja;
    qs(`#${branchLabelId}`).textContent = `${pillar.branch.pinyin} ${pillar.branch.element}`;
  }

  const meta = qs("#chartMeta");
  if (meta) {
    const correction = chart.correction;
    meta.innerHTML = `
      <span>${chart.input.birthplace || correction.city}</span>
      <span>Location-corrected chart</span>
      <span>Hour pillar adjusted in background</span>
    `;
  }
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

function renderGenerated(payload) {
  const result = qs("#generatedResult");
  if (!result || !payload?.reading) return;
  const { reading, chart, model, source, voicePasses, warning } = payload;
  const tags = [...(chart.relationshipTags || []), ...(chart.symbolicStars || [])]
    .slice(0, 8)
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  result.classList.remove("empty");
  result.innerHTML = `
    <div class="generated-hero">
      <div>
        <p class="eyebrow">Generated with ${source === "openai" ? model : "local fallback"}</p>
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
        <p>This is the reference point. Every money, work, love, pressure, and support marker is interpreted relative to this.</p>
      </article>
      <div class="snapshot-pillars">
        ${renderPillarSnapshot(chart)}
      </div>
      <article class="snapshot-elements">
        <h3>Element Balance</h3>
        ${renderElementBars(chart)}
      </article>
    </div>
    <div class="plain-decoder">
      <strong>Plain English:</strong>
      <span>Strongest: ${chart.strongestElement} (${elementMeanings[chart.strongestElement]})</span>
      <span>Quietest: ${chart.weakestElement} (${elementMeanings[chart.weakestElement]})</span>
      <span>Helpful: ${(chart.helpfulElements || []).join(", ") || "balance habits"}</span>
    </div>
    <div class="tag-strip">${tags || "<span>No chart tension tags detected</span>"}</div>
    <div class="generated-list">
      ${reading.sections.map(sectionMarkup).join("")}
    </div>
    <div class="lucky-box">
      <h3>Lucky Actions</h3>
      <ul>${reading.luckyActions.map((action) => `<li>${action}</li>`).join("")}</ul>
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
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function generateReading() {
  setButtonLoading(true);
  const result = qs("#generatedResult");
  if (result) {
    result.classList.remove("empty");
    result.innerHTML = `
      <div class="loading-panel">
        <strong>Calculating pillars first...</strong>
        <p>Then the voice engine drafts the reading and polishes it for empathy, encouragement, and emotional specificity.</p>
      </div>
    `;
  }

  try {
    const response = await fetch("/api/generate-reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collectBirthPayload())
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to generate reading");
    renderChart(payload.chart);
    renderGenerated(payload);
  } catch (error) {
    if (result) {
      result.innerHTML = `
        <div class="error-panel">
          <strong>Reading failed</strong>
          <p>${error.message}</p>
        </div>
      `;
    }
  } finally {
    setButtonLoading(false);
  }
}

qsa("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    qs(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

qsa(".mode-pill").forEach((button) => {
  button.addEventListener("click", () => {
    qsa(".mode-pill").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.mode;
    const title = qs("#workspace-title");
    if (mode === "technical") {
      title.textContent = "A Korean Saju chart with stems, branches, Ten Gods, Shinsal, and timing explained.";
    } else if (mode === "poetic") {
      title.textContent = "A glossy little mirror for your timing, temperament, and lucky direction.";
    } else {
      title.textContent = "A Korean Saju reading that explains the chart while it reads you.";
    }
  });
});

qsa(".category-tab").forEach((button) => {
  button.addEventListener("click", () => {
    qsa(".category-tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    qsa(".product-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

qsa(".chart-tags button").forEach((button) => {
  button.addEventListener("click", () => {
    const pop = qs("#termPop");
    pop.textContent = termCopy[button.dataset.term] || "This marker adds interpretive texture to the chart.";
  });
});

qsa(".accordion-trigger:not(.generated-trigger)").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".reading-item");
    item.classList.toggle("open");
    trigger.querySelector("span").textContent = item.classList.contains("open") ? "-" : "+";
  });
});

qsa(".glossary-filter").forEach((button) => {
  button.addEventListener("click", () => {
    qsa(".glossary-filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.glossary;
    qsa(".glossary-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.group !== filter);
    });
  });
});

qs("#nameInput")?.addEventListener("input", (event) => {
  const value = event.target.value.trim() || "Your";
  qs("#readerName").textContent = value;
});

qs("#generateReadingBtn")?.addEventListener("click", generateReading);
qs("#birth-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  generateReading();
});
qs("#countryInput")?.addEventListener("change", updateCitySuggestions);
updateCitySuggestions();
