const { Lunar, Solar } = require("lunar-javascript");
const cityTimezones = require("city-timezones");
const countriesAndTimezones = require("countries-and-timezones");

const STEMS = [
  { ko: "갑", hanja: "甲", pinyin: "Jia", label: "Yang Wood", element: "Wood", yinYang: "Yang" },
  { ko: "을", hanja: "乙", pinyin: "Yi", label: "Yin Wood", element: "Wood", yinYang: "Yin" },
  { ko: "병", hanja: "丙", pinyin: "Bing", label: "Yang Fire", element: "Fire", yinYang: "Yang" },
  { ko: "정", hanja: "丁", pinyin: "Ding", label: "Yin Fire", element: "Fire", yinYang: "Yin" },
  { ko: "무", hanja: "戊", pinyin: "Wu", label: "Yang Earth", element: "Earth", yinYang: "Yang" },
  { ko: "기", hanja: "己", pinyin: "Ji", label: "Yin Earth", element: "Earth", yinYang: "Yin" },
  { ko: "경", hanja: "庚", pinyin: "Geng", label: "Yang Metal", element: "Metal", yinYang: "Yang" },
  { ko: "신", hanja: "辛", pinyin: "Xin", label: "Yin Metal", element: "Metal", yinYang: "Yin" },
  { ko: "임", hanja: "壬", pinyin: "Ren", label: "Yang Water", element: "Water", yinYang: "Yang" },
  { ko: "계", hanja: "癸", pinyin: "Gui", label: "Yin Water", element: "Water", yinYang: "Yin" }
];

const BRANCHES = [
  { ko: "자", hanja: "子", pinyin: "Zi", animal: "Rat", element: "Water" },
  { ko: "축", hanja: "丑", pinyin: "Chou", animal: "Ox", element: "Earth" },
  { ko: "인", hanja: "寅", pinyin: "Yin", animal: "Tiger", element: "Wood" },
  { ko: "묘", hanja: "卯", pinyin: "Mao", animal: "Rabbit", element: "Wood" },
  { ko: "진", hanja: "辰", pinyin: "Chen", animal: "Dragon", element: "Earth" },
  { ko: "사", hanja: "巳", pinyin: "Si", animal: "Snake", element: "Fire" },
  { ko: "오", hanja: "午", pinyin: "Wu", animal: "Horse", element: "Fire" },
  { ko: "미", hanja: "未", pinyin: "Wei", animal: "Goat", element: "Earth" },
  { ko: "신", hanja: "申", pinyin: "Shen", animal: "Monkey", element: "Metal" },
  { ko: "유", hanja: "酉", pinyin: "You", animal: "Rooster", element: "Metal" },
  { ko: "술", hanja: "戌", pinyin: "Xu", animal: "Dog", element: "Earth" },
  { ko: "해", hanja: "亥", pinyin: "Hai", animal: "Pig", element: "Water" }
];

const TEN_GODS = {
  日主: "Day Master",
  比肩: "Peer Star",
  劫财: "Rival Star",
  劫財: "Rival Star",
  食神: "Talent Star",
  伤官: "Rebel Talent",
  傷官: "Rebel Talent",
  偏财: "Dynamic Wealth",
  偏財: "Dynamic Wealth",
  正财: "Stable Wealth",
  正財: "Stable Wealth",
  七杀: "Pressure Star",
  七殺: "Pressure Star",
  偏官: "Pressure Star",
  正官: "Proper Authority",
  偏印: "Mystic Resource",
  正印: "Nurturing Resource"
};

const LIFE_STAGES = {
  长生: "Birth / Growth",
  長生: "Birth / Growth",
  沐浴: "Bath",
  冠带: "Coming Of Age",
  冠帶: "Coming Of Age",
  临官: "Establishment",
  臨官: "Establishment",
  帝旺: "Peak",
  衰: "Decline",
  病: "Illness",
  死: "Death",
  墓: "Tomb",
  绝: "Severance",
  絕: "Severance",
  胎: "Conception",
  养: "Nurture",
  養: "Nurture"
};

const COUNTRY_ALIASES = {
  "United States": "US",
  "United States of America": "US",
  USA: "US",
  Korea: "KR",
  "South Korea": "KR",
  Japan: "JP",
  Canada: "CA",
  "United Kingdom": "GB",
  UK: "GB",
  France: "FR",
  Germany: "DE",
  Spain: "ES",
  Italy: "IT",
  Netherlands: "NL",
  Australia: "AU",
  China: "CN",
  Taiwan: "TW",
  "Hong Kong": "HK",
  Singapore: "SG",
  Thailand: "TH",
  Philippines: "PH",
  Indonesia: "ID",
  India: "IN",
  "United Arab Emirates": "AE",
  UAE: "AE",
  Mexico: "MX",
  Brazil: "BR"
};

const COUNTRY_CENTERS = {
  US: { lat: 39.8283, lng: -98.5795 },
  KR: { lat: 36.5, lng: 127.75 },
  JP: { lat: 36.2048, lng: 138.2529 },
  CA: { lat: 56.1304, lng: -106.3468 },
  GB: { lat: 55.3781, lng: -3.436 },
  FR: { lat: 46.2276, lng: 2.2137 },
  DE: { lat: 51.1657, lng: 10.4515 },
  ES: { lat: 40.4637, lng: -3.7492 },
  IT: { lat: 41.8719, lng: 12.5674 },
  NL: { lat: 52.1326, lng: 5.2913 },
  AU: { lat: -25.2744, lng: 133.7751 },
  CN: { lat: 35.8617, lng: 104.1954 },
  TW: { lat: 23.6978, lng: 120.9605 },
  HK: { lat: 22.3193, lng: 114.1694 },
  SG: { lat: 1.3521, lng: 103.8198 },
  TH: { lat: 15.87, lng: 100.9925 },
  PH: { lat: 12.8797, lng: 121.774 },
  ID: { lat: -0.7893, lng: 113.9213 },
  IN: { lat: 20.5937, lng: 78.9629 },
  AE: { lat: 23.4241, lng: 53.8478 },
  MX: { lat: 23.6345, lng: -102.5528 },
  BR: { lat: -14.235, lng: -51.9253 }
};

const ELEMENT_FLOW = {
  Wood: { produces: "Fire", controls: "Earth", producedBy: "Water", controlledBy: "Metal" },
  Fire: { produces: "Earth", controls: "Metal", producedBy: "Wood", controlledBy: "Water" },
  Earth: { produces: "Metal", controls: "Water", producedBy: "Fire", controlledBy: "Wood" },
  Metal: { produces: "Water", controls: "Wood", producedBy: "Earth", controlledBy: "Fire" },
  Water: { produces: "Wood", controls: "Fire", producedBy: "Metal", controlledBy: "Earth" }
};

function stemByHanja(hanja) {
  return STEMS.find((stem) => stem.hanja === hanja);
}

function branchByHanja(hanja) {
  return BRANCHES.find((branch) => branch.hanja === hanja);
}

function normalizeCountry(country) {
  const raw = String(country || "").trim();
  if (!raw) return null;
  if (COUNTRY_ALIASES[raw]) return COUNTRY_ALIASES[raw];
  const upper = raw.toUpperCase();
  if (countriesAndTimezones.getCountry(upper)) return upper;
  const found = Object.values(countriesAndTimezones.getAllCountries()).find(
    (item) => item.name.toLowerCase() === raw.toLowerCase()
  );
  return found?.id || null;
}

function parsePlace(input) {
  const city = String(input.city || input.birthplace || "").split(",")[0].trim();
  const explicitCountry = input.country || String(input.birthplace || "").split(",").slice(1).join(",").trim();
  return {
    city: city || "Seoul",
    countryCode: normalizeCountry(explicitCountry),
    countryText: explicitCountry || null
  };
}

function resolveLocation(input) {
  if (input.timeZone && Number.isFinite(Number(input.latitude)) && Number.isFinite(Number(input.longitude))) {
    return {
      city: input.city || "Custom location",
      country: input.country || null,
      countryCode: normalizeCountry(input.country),
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
      timeZone: input.timeZone,
      confidence: "exact-coordinates",
      source: "client-coordinates"
    };
  }

  const place = parsePlace(input);
  const candidates = cityTimezones.lookupViaCity(place.city) || [];
  const filtered = place.countryCode
    ? candidates.filter((candidate) => candidate.iso2 === place.countryCode)
    : candidates;
  const selected = [...filtered].sort((a, b) => (b.pop || 0) - (a.pop || 0))[0];
  if (selected) {
    return {
      city: selected.city,
      country: selected.country,
      countryCode: selected.iso2,
      province: selected.province,
      latitude: selected.lat,
      longitude: selected.lng,
      timeZone: selected.timezone,
      confidence: "city-country-match",
      source: "city-timezones"
    };
  }

  if (place.countryCode) {
    const country = countriesAndTimezones.getCountry(place.countryCode);
    const timeZone = country?.timezones?.[0] || "UTC";
    const center = COUNTRY_CENTERS[place.countryCode] || { lat: 0, lng: 0 };
    return {
      city: place.city,
      country: country?.name || place.countryText,
      countryCode: place.countryCode,
      latitude: center.lat,
      longitude: center.lng,
      timeZone,
      confidence: "country-fallback",
      source: "countries-and-timezones"
    };
  }

  return {
    city: place.city,
    country: place.countryText || "Unknown",
    countryCode: null,
    latitude: 0,
    longitude: 0,
    timeZone: "UTC",
    confidence: "unresolved-fallback",
    source: "fallback"
  };
}

function getOffsetMinutes(timeZone, dateParts) {
  const utcGuess = Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day, dateParts.hour, dateParts.minute, 0);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date(utcGuess)).map((part) => [part.type, part.value]));
  const zonedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return Math.round((zonedAsUtc - utcGuess) / 60000);
}

function shiftMinutes(dateParts, deltaMinutes) {
  const shifted = new Date(Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day, dateParts.hour, dateParts.minute + deltaMinutes, 0));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes()
  };
}

function parseBirthDate(input) {
  const [year, month, day] = String(input.date || "2000-07-29").split("-").map(Number);
  const [hour, minute] = String(input.time || "22:01").split(":").map(Number);
  return { year, month, day, hour, minute };
}

function normalizeCalendarInput(input) {
  const calendar = String(input.calendar || "Gregorian").toLowerCase();
  if (!calendar.includes("lunar") && !calendar.includes("음력") && !calendar.includes("农历") && !calendar.includes("旧暦")) {
    return { calculationInput: input, convertedFromLunar: false };
  }
  const original = parseBirthDate(input);
  const solar = Lunar.fromYmdHms(original.year, original.month, original.day, original.hour, original.minute, 0).getSolar();
  const date = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")}`;
  const time = `${String(solar.getHour()).padStart(2, "0")}:${String(solar.getMinute()).padStart(2, "0")}`;
  return {
    calculationInput: { ...input, date, time },
    convertedFromLunar: true,
    originalLunarInput: original,
    convertedSolarDate: { year: solar.getYear(), month: solar.getMonth(), day: solar.getDay(), hour: solar.getHour(), minute: solar.getMinute() }
  };
}

function formatOffset(minutes) {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

function correctBirthTime(input, location) {
  const original = parseBirthDate(input);
  const actualOffset = getOffsetMinutes(location.timeZone, original);
  const timezoneInfo = countriesAndTimezones.getTimezone(location.timeZone);
  const standardOffset = timezoneInfo?.utcOffset ?? actualOffset;
  const dstAdjustmentMinutes = actualOffset - standardOffset;
  const standardMeridian = (standardOffset / 60) * 15;
  const longitudeCorrectionMinutes = Number.isFinite(location.longitude)
    ? Math.round((location.longitude - standardMeridian) * 4)
    : 0;
  const solarCorrectionMinutes = longitudeCorrectionMinutes - dstAdjustmentMinutes;
  const corrected = shiftMinutes(original, input.applySolarCorrection === false ? 0 : solarCorrectionMinutes);
  return {
    original,
    corrected,
    timeZone: location.timeZone,
    actualUtcOffsetMinutes: actualOffset,
    actualUtcOffset: formatOffset(actualOffset),
    standardUtcOffsetMinutes: standardOffset,
    standardUtcOffset: formatOffset(standardOffset),
    standardMeridian,
    dstAdjustmentMinutes,
    longitudeCorrectionMinutes,
    solarCorrectionMinutes: input.applySolarCorrection === false ? 0 : solarCorrectionMinutes,
    appliedSolarCorrection: input.applySolarCorrection !== false
  };
}

function normalizeTenGod(value) {
  return TEN_GODS[value] || value || "Chart Relationship";
}

function normalizeLifeStage(value) {
  return LIFE_STAGES[value] || value || null;
}

function pillarFromEightChar(eightChar, position, methodPrefix) {
  const stem = stemByHanja(eightChar[`get${methodPrefix}Gan`]());
  const branch = branchByHanja(eightChar[`get${methodPrefix}Zhi`]());
  const hiddenStems = (eightChar[`get${methodPrefix}HideGan`]() || []).map((hanja, index) => ({
    ...stemByHanja(hanja),
    tenGod: normalizeTenGod((eightChar[`get${methodPrefix}ShiShenZhi`]() || [])[index])
  }));
  return {
    position,
    stem,
    branch,
    label: `${stem.pinyin}-${branch.pinyin}`,
    tenGod: normalizeTenGod(eightChar[`get${methodPrefix}ShiShenGan`]()),
    branchTenGod: hiddenStems[0]?.tenGod || null,
    hiddenStems,
    lifeStage: normalizeLifeStage(eightChar[`get${methodPrefix}DiShi`]()),
    naYin: eightChar[`get${methodPrefix}NaYin`](),
    xun: eightChar[`get${methodPrefix}Xun`](),
    voidBranches: eightChar[`get${methodPrefix}XunKong`](),
    wuXing: eightChar[`get${methodPrefix}WuXing`]()
  };
}

function countElements(pillars) {
  const visible = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const weighted = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const pillar of pillars) {
    visible[pillar.stem.element] += 1;
    visible[pillar.branch.element] += 1;
    weighted[pillar.stem.element] += 1;
    weighted[pillar.branch.element] += 1;
    for (const hidden of pillar.hiddenStems || []) {
      if (hidden?.element) weighted[hidden.element] += 0.35;
    }
  }
  return { visible, weighted };
}

function relationTags(pillars) {
  const stems = pillars.map((pillar) => pillar.stem.pinyin);
  const branches = pillars.map((pillar) => pillar.branch.pinyin);
  const tags = [];
  const stemCombos = [
    ["Jia", "Ji", "Heavenly Stem Combination to Earth"],
    ["Yi", "Geng", "Heavenly Stem Combination to Metal"],
    ["Bing", "Xin", "Heavenly Stem Combination to Water"],
    ["Ding", "Ren", "Heavenly Stem Combination to Wood"],
    ["Wu", "Gui", "Heavenly Stem Combination to Fire"]
  ];
  const pairs = [
    ["Zi", "Chou", "Six Combination toward Earth"],
    ["Yin", "Hai", "Six Combination toward Wood"],
    ["Mao", "Xu", "Six Combination toward Fire"],
    ["Chen", "You", "Six Combination toward Metal"],
    ["Si", "Shen", "Six Combination toward Water"],
    ["Wu", "Wei", "Six Combination toward Earth"],
    ["Zi", "Wu", "Clash"],
    ["Chou", "Wei", "Clash"],
    ["Yin", "Shen", "Clash"],
    ["Mao", "You", "Clash"],
    ["Chen", "Xu", "Clash"],
    ["Si", "Hai", "Clash"],
    ["Zi", "Wei", "Harm"],
    ["Chou", "Wu", "Harm"],
    ["Yin", "Si", "Harm"],
    ["Mao", "Chen", "Harm"],
    ["Shen", "Hai", "Harm"],
    ["You", "Xu", "Harm"],
    ["Yin", "Wu", "Half Fire Combination"],
    ["Wu", "Xu", "Half Fire Combination"],
    ["Hai", "Mao", "Half Wood Combination"],
    ["Mao", "Wei", "Half Wood Combination"],
    ["Shen", "Zi", "Half Water Combination"],
    ["Zi", "Chen", "Half Water Combination"],
    ["Si", "You", "Half Metal Combination"],
    ["You", "Chou", "Half Metal Combination"]
  ];
  for (const [a, b, label] of stemCombos) {
    if (stems.includes(a) && stems.includes(b)) tags.push(`${a}-${b}: ${label}`);
  }
  for (const [a, b, label] of pairs) {
    if (branches.includes(a) && branches.includes(b)) tags.push(`${a}-${b}: ${label}`);
  }
  if (["Yin", "Si", "Shen"].filter((branch) => branches.includes(branch)).length >= 2) tags.push("Yin-Si-Shen: Fire Penalty pattern");
  if (["Chou", "Xu", "Wei"].filter((branch) => branches.includes(branch)).length >= 2) tags.push("Chou-Xu-Wei: Earth Penalty pattern");
  if (branches.includes("Zi") && branches.includes("Mao")) tags.push("Zi-Mao: Courtesy Penalty pattern");
  if ((branches.includes("Chen") && branches.includes("Hai")) || (branches.includes("Zi") && branches.includes("Wei"))) {
    tags.push("Ghost Gate / Irritation marker");
  }
  return [...new Set(tags)];
}

function symbolicStars(pillars, dayStem) {
  const branches = pillars.map((pillar) => pillar.branch.pinyin);
  const dayBranch = pillars.find((pillar) => pillar.position === "Day").branch.pinyin;
  const stars = [];
  const nobleMap = {
    Jia: ["Chou", "Wei"],
    Wu: ["Chou", "Wei"],
    Geng: ["Chou", "Wei"],
    Yi: ["Zi", "Shen"],
    Ji: ["Zi", "Shen"],
    Bing: ["Hai", "You"],
    Ding: ["Hai", "You"],
    Ren: ["Si", "Mao"],
    Gui: ["Si", "Mao"],
    Xin: ["Yin", "Wu"]
  };
  const groupMap = [
    { group: ["Shen", "Zi", "Chen"], charm: "You", travel: "Yin" },
    { group: ["Yin", "Wu", "Xu"], charm: "Mao", travel: "Shen" },
    { group: ["Si", "You", "Chou"], charm: "Wu", travel: "Hai" },
    { group: ["Hai", "Mao", "Wei"], charm: "Zi", travel: "Si" }
  ];
  const group = groupMap.find((item) => item.group.includes(dayBranch));
  if (group && branches.includes(group.charm)) stars.push("Red Charm Star / Peach Blossom accent");
  if (group && branches.includes(group.travel)) stars.push("Travel Star / movement opens luck");
  if ((nobleMap[dayStem.pinyin] || []).some((branch) => branches.includes(branch))) stars.push("Heavenly Noble / mentor support");
  if (["Xin", "Geng"].includes(dayStem.pinyin) || branches.includes("You")) stars.push("Needle Star / precise words and technical detail");
  if (["Chen", "Xu"].includes(dayBranch) || dayStem.pinyin === "Geng") stars.push("Iron Wall Star / strong backbone");
  return [...new Set(stars)];
}

function deriveBalance(elementCounts) {
  const sorted = Object.entries(elementCounts.weighted).sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0][0];
  const weakest = sorted[sorted.length - 1][0];
  const helpfulElements = [ELEMENT_FLOW[strongest].controls, ELEMENT_FLOW[weakest].producedBy].filter(Boolean);
  return { strongestElement: strongest, weakestElement: weakest, helpfulElements: [...new Set(helpfulElements)] };
}

function calculateSaju(input = {}) {
  const calendarConversion = normalizeCalendarInput(input);
  const calculationInput = calendarConversion.calculationInput;
  const location = resolveLocation(calculationInput);
  const correction = correctBirthTime(calculationInput, location);
  const corrected = correction.corrected;
  const solar = Solar.fromYmdHms(corrected.year, corrected.month, corrected.day, corrected.hour, corrected.minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  if (typeof eightChar.setSect === "function") eightChar.setSect(Number(input.eightCharSect || 2));

  const pillars = [
    pillarFromEightChar(eightChar, "Hour", "Time"),
    pillarFromEightChar(eightChar, "Day", "Day"),
    pillarFromEightChar(eightChar, "Month", "Month"),
    pillarFromEightChar(eightChar, "Year", "Year")
  ];
  const dayMaster = pillars.find((pillar) => pillar.position === "Day").stem;
  const elementCounts = countElements(pillars);
  const balance = deriveBalance(elementCounts);

  return {
    input: {
      name: input.name || "Your",
      date: input.date,
      time: input.time,
      birthplace: input.birthplace,
      city: input.city || location.city,
      country: input.country || location.country,
      locale: input.locale || "en",
      calendar: input.calendar || "Gregorian",
      accuracy: input.accuracy || "Exact time",
      tone: input.tone || "Warm, trendy, and detailed"
    },
    location,
    correction: {
      ...correction,
      note: "IANA timezone, DST, longitude-based solar-time correction, and lunar-javascript solar terms are used for chart calculation. Unknown cities fall back to country-level timezone data."
    },
    manse: {
      solarDate: solar.toYmdHms(),
      lunarDate: lunar.toString(),
      eightCharacters: eightChar.toString(),
      sect: eightChar.getSect(),
      source: "lunar-javascript",
      libraryBacked: true,
      inputCalendar: input.calendar || "Gregorian",
      convertedFromLunar: calendarConversion.convertedFromLunar,
      originalLunarInput: calendarConversion.originalLunarInput || null,
      convertedSolarDate: calendarConversion.convertedSolarDate || null
    },
    dayMaster,
    pillars,
    elements: elementCounts.visible,
    weightedElements: elementCounts.weighted,
    ...balance,
    relationshipTags: relationTags(pillars),
    symbolicStars: symbolicStars(pillars, dayMaster),
    calculationVersion: "sajupop-manse-core-0.3.0"
  };
}

module.exports = {
  calculateSaju,
  resolveLocation,
  correctBirthTime,
  STEMS,
  BRANCHES
};
