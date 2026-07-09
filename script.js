const termCopy = {
  "Day Master": "The Day Master is the chart's center point. Money, love, work, pressure, and support are all read in relation to it.",
  "Hidden Stems": "Hidden Stems are the inner layer inside each branch. They show what is present but not immediately visible.",
  "Ten Gods": "Ten Gods are relationship labels: self, peers, talent, money, authority, pressure, and support.",
  "Symbolic Stars": "Symbolic Stars add texture, like charm, movement, mentors, sharp insight, or emotional intensity.",
  "Zi-Wei Harm": "A Harm marker shows subtle mismatch. It is less explosive than a clash, but it can quietly drain energy.",
  "Ghost Gate": "Ghost Gate points to hyper-intuition and thought loops. Used well, it becomes creative perception."
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
    tone: "Warm, trendy, and detailed"
  };
}

function updateCitySuggestions() {
  const country = qs("#countryInput")?.value || "United States";
  const cities = countryCities[country] || [];
  const container = qs("#citySuggestions");
  if (!container) return;
  container.innerHTML = cities
    .slice(0, 8)
    .map((city) => `<button type="button" class="city-chip">${city}</button>`)
    .join("");
  qsa(".city-chip").forEach((button) => {
    button.addEventListener("click", () => {
      qs("#cityInput").value = button.textContent;
      qsa(".city-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function startReading() {
  const payload = collectBirthPayload();
  sessionStorage.setItem("sajupop.pendingReading", JSON.stringify(payload));
  window.location.href = "reading.html";
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

qsa(".accordion-trigger").forEach((trigger) => {
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
  qs("#readerName").textContent = event.target.value.trim() || "Your";
});

qs("#countryInput")?.addEventListener("change", updateCitySuggestions);
qs("#generateReadingBtn")?.addEventListener("click", startReading);
qs("#birth-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  startReading();
});

updateCitySuggestions();
