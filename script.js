const termKeys = {
  "Day Master": "termHelp.dayMaster",
  "Hidden Stems": "termHelp.hiddenStems",
  "Ten Gods": "termHelp.tenGods",
  "Symbolic Stars": "termHelp.stars",
  "Zi-Wei Harm": "termHelp.harm",
  "Ghost Gate": "termHelp.ghostGate"
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

function t(key, variables) {
  return window.SajuPopI18n?.t(key, variables) || key;
}

function collectBirthPayload() {
  const city = qs("#cityInput")?.value?.trim() || "Los Angeles";
  const countrySelect = qs("#countryInput");
  const country = countrySelect?.value || "US";
  const selectedOption = countrySelect?.selectedOptions?.[0];
  const payload = {
    name: qs("#nameInput")?.value?.trim() || "Your",
    date: qs("#dateInput")?.value || "2000-07-29",
    time: qs("#timeInput")?.value || "22:01",
    birthplace: `${city}, ${selectedOption?.dataset.countryName || selectedOption?.textContent || country}`,
    city,
    country,
    countryName: selectedOption?.dataset.countryName || selectedOption?.textContent || country,
    calendar: qs("#calendarInput")?.value || "Gregorian",
    accuracy: qs("#accuracyInput")?.value || "Exact time",
    locale: window.SajuPopI18n?.getLocale() || "en"
  };
  const cityInput = qs("#cityInput");
  if (cityInput?.dataset.timeZone) {
    payload.timeZone = cityInput.dataset.timeZone;
    payload.latitude = Number(cityInput.dataset.latitude);
    payload.longitude = Number(cityInput.dataset.longitude);
  }
  return payload;
}

function renderCitySuggestions(cities) {
  const container = qs("#citySuggestions");
  if (!container) return;
  container.innerHTML = cities
    .slice(0, 8)
    .map((item) => {
      const city = typeof item === "string" ? item : item.city;
      const meta = typeof item === "string" ? "" : ` data-time-zone="${item.timeZone || ""}" data-latitude="${item.latitude ?? ""}" data-longitude="${item.longitude ?? ""}"`;
      return `<button type="button" class="city-chip"${meta}>${city}</button>`;
    })
    .join("");
  qsa(".city-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const input = qs("#cityInput");
      input.value = button.textContent;
      input.dataset.timeZone = button.dataset.timeZone || "";
      input.dataset.latitude = button.dataset.latitude || "";
      input.dataset.longitude = button.dataset.longitude || "";
      qsa(".city-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

async function updateCitySuggestions() {
  const country = qs("#countryInput")?.value || "US";
  const query = qs("#cityInput")?.value?.trim() || "";
  if (/^[A-Z]{2}$/.test(country)) {
    try {
      const response = await fetch(`/api/locations?country=${encodeURIComponent(country)}&q=${encodeURIComponent(query)}`);
      const payload = await response.json();
      if (payload.ok) {
        renderCitySuggestions(payload.cities || []);
        return;
      }
    } catch (error) {
      console.warn("City lookup unavailable:", error.message);
    }
  }
  renderCitySuggestions(countryCities[country] || countryCities[qs("#countryInput")?.selectedOptions?.[0]?.dataset.countryName] || []);
}

async function populateCountries() {
  const select = qs("#countryInput");
  if (!select) return;
  const legacyCodes = { "United States": "US", "South Korea": "KR", Japan: "JP", Canada: "CA", "United Kingdom": "GB", France: "FR", Germany: "DE", Spain: "ES", Italy: "IT", Netherlands: "NL", Australia: "AU", China: "CN", Taiwan: "TW", "Hong Kong": "HK", Singapore: "SG", Thailand: "TH", Philippines: "PH", Indonesia: "ID", India: "IN", "United Arab Emirates": "AE", Mexico: "MX", Brazil: "BR" };
  const current = legacyCodes[select.value] || select.value || "US";
  try {
    const response = await fetch("/api/locations?mode=countries");
    const payload = await response.json();
    if (!payload.ok) return;
    const locale = window.SajuPopI18n?.getLocale() || "en";
    const displayNames = new Intl.DisplayNames([locale], { type: "region" });
    select.innerHTML = payload.countries
      .map((country) => `<option value="${country.code}" data-country-name="${country.name}">${displayNames.of(country.code) || country.name}</option>`)
      .join("");
    select.value = current;
    await updateCitySuggestions();
  } catch (error) {
    console.warn("Country list unavailable:", error.message);
  }
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
    pop.textContent = t(termKeys[button.dataset.term] || "chart.tapTerm");
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

qs("#countryInput")?.addEventListener("change", () => {
  const input = qs("#cityInput");
  input.value = "";
  input.dataset.timeZone = "";
  input.dataset.latitude = "";
  input.dataset.longitude = "";
  updateCitySuggestions();
});
let cityLookupTimer;
qs("#cityInput")?.addEventListener("input", () => {
  const input = qs("#cityInput");
  input.dataset.timeZone = "";
  input.dataset.latitude = "";
  input.dataset.longitude = "";
  window.clearTimeout(cityLookupTimer);
  cityLookupTimer = window.setTimeout(updateCitySuggestions, 220);
});
qs("#generateReadingBtn")?.addEventListener("click", startReading);
qs("#birth-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  startReading();
});

window.addEventListener("sajupop-locale-changed", populateCountries);
populateCountries();
