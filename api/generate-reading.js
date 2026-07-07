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

const HIDDEN_STEMS = {
  Zi: ["Gui"],
  Chou: ["Ji", "Gui", "Xin"],
  Yin: ["Jia", "Bing", "Wu"],
  Mao: ["Yi"],
  Chen: ["Wu", "Yi", "Gui"],
  Si: ["Bing", "Wu", "Geng"],
  Wu: ["Ding", "Ji"],
  Wei: ["Ji", "Ding", "Yi"],
  Shen: ["Geng", "Ren", "Wu"],
  You: ["Xin"],
  Xu: ["Wu", "Xin", "Ding"],
  Hai: ["Ren", "Jia"]
};

const ELEMENT_FLOW = {
  Wood: { produces: "Fire", controls: "Earth", producedBy: "Water", controlledBy: "Metal" },
  Fire: { produces: "Earth", controls: "Metal", producedBy: "Wood", controlledBy: "Water" },
  Earth: { produces: "Metal", controls: "Water", producedBy: "Fire", controlledBy: "Wood" },
  Metal: { produces: "Water", controls: "Wood", producedBy: "Earth", controlledBy: "Fire" },
  Water: { produces: "Wood", controls: "Fire", producedBy: "Metal", controlledBy: "Earth" }
};

const CITY_PROFILES = [
  ["los angeles", "United States", -7, -118.2437],
  ["san francisco", "United States", -7, -122.4194],
  ["seattle", "United States", -7, -122.3321],
  ["new york", "United States", -4, -74.006],
  ["chicago", "United States", -5, -87.6298],
  ["austin", "United States", -5, -97.7431],
  ["miami", "United States", -4, -80.1918],
  ["boston", "United States", -4, -71.0589],
  ["toronto", "Canada", -4, -79.3832],
  ["vancouver", "Canada", -7, -123.1207],
  ["montreal", "Canada", -4, -73.5673],
  ["calgary", "Canada", -6, -114.0719],
  ["seoul", "South Korea", 9, 126.978],
  ["busan", "South Korea", 9, 129.0756],
  ["daegu", "South Korea", 9, 128.6014],
  ["incheon", "South Korea", 9, 126.7052],
  ["jeju", "South Korea", 9, 126.5312],
  ["tokyo", "Japan", 9, 139.6503],
  ["osaka", "Japan", 9, 135.5023],
  ["kyoto", "Japan", 9, 135.7681],
  ["fukuoka", "Japan", 9, 130.4017],
  ["beijing", "China", 8, 116.4074],
  ["shanghai", "China", 8, 121.4737],
  ["guangzhou", "China", 8, 113.2644],
  ["shenzhen", "China", 8, 114.0579],
  ["hong kong", "Hong Kong", 8, 114.1694],
  ["taipei", "Taiwan", 8, 121.5654],
  ["singapore", "Singapore", 8, 103.8198],
  ["bangkok", "Thailand", 7, 100.5018],
  ["manila", "Philippines", 8, 120.9842],
  ["cebu", "Philippines", 8, 123.8854],
  ["jakarta", "Indonesia", 7, 106.8456],
  ["bali", "Indonesia", 8, 115.1889],
  ["sydney", "Australia", 10, 151.2093],
  ["melbourne", "Australia", 10, 144.9631],
  ["brisbane", "Australia", 10, 153.0251],
  ["perth", "Australia", 8, 115.8575],
  ["london", "United Kingdom", 1, -0.1276],
  ["manchester", "United Kingdom", 1, -2.2426],
  ["edinburgh", "United Kingdom", 1, -3.1883],
  ["paris", "France", 2, 2.3522],
  ["lyon", "France", 2, 4.8357],
  ["marseille", "France", 2, 5.3698],
  ["berlin", "Germany", 2, 13.405],
  ["munich", "Germany", 2, 11.582],
  ["hamburg", "Germany", 2, 9.9937],
  ["madrid", "Spain", 2, -3.7038],
  ["barcelona", "Spain", 2, 2.1734],
  ["rome", "Italy", 2, 12.4964],
  ["milan", "Italy", 2, 9.19],
  ["amsterdam", "Netherlands", 2, 4.9041],
  ["rotterdam", "Netherlands", 2, 4.4777],
  ["dubai", "United Arab Emirates", 4, 55.2708],
  ["abu dhabi", "United Arab Emirates", 4, 54.3773],
  ["mumbai", "India", 5.5, 72.8777],
  ["delhi", "India", 5.5, 77.1025],
  ["bengaluru", "India", 5.5, 77.5946],
  ["sao paulo", "Brazil", -3, -46.6333],
  ["rio de janeiro", "Brazil", -3, -43.1729],
  ["mexico city", "Mexico", -6, -99.1332],
  ["guadalajara", "Mexico", -6, -103.3496]
].map(([name, country, utcOffset, longitude]) => ({ name, country, utcOffset, longitude }));

const COUNTRY_DEFAULTS = [
  ["United States", -5, -95.7129],
  ["South Korea", 9, 127.7669],
  ["Japan", 9, 138.2529],
  ["Canada", -5, -106.3468],
  ["United Kingdom", 1, -3.436],
  ["France", 2, 2.2137],
  ["Germany", 2, 10.4515],
  ["Spain", 2, -3.7492],
  ["Italy", 2, 12.5674],
  ["Netherlands", 2, 5.2913],
  ["Australia", 10, 133.7751],
  ["China", 8, 104.1954],
  ["Taiwan", 8, 120.9605],
  ["Hong Kong", 8, 114.1694],
  ["Singapore", 8, 103.8198],
  ["Thailand", 7, 100.9925],
  ["Philippines", 8, 121.774],
  ["Indonesia", 7, 113.9213],
  ["India", 5.5, 78.9629],
  ["United Arab Emirates", 4, 53.8478],
  ["Mexico", -6, -102.5528],
  ["Brazil", -3, -51.9253]
].map(([country, utcOffset, longitude]) => ({ country, utcOffset, longitude }));

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "summary", "sections", "luckyActions", "disclaimer"],
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      minItems: 8,
      maxItems: 13,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["key", "title", "body", "technicalBasis"],
        properties: {
          key: { type: "string" },
          title: { type: "string" },
          body: { type: "string" },
          technicalBasis: { type: "string" }
        }
      }
    },
    luckyActions: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: { type: "string" }
    },
    disclaimer: { type: "string" }
  }
};

const VOICE_RULES = [
  "Voice target: emotionally intelligent, observant, trend-aware, and deeply reassuring.",
  "The user should feel seen, not judged. Name the pressure first, then explain the chart basis, then give one concrete way forward.",
  "Use vivid metaphors like a Korean Saju micro-reading service, but keep them elegant in English.",
  "Every title should feel clickable and personal, not academic.",
  "Include a warm validation section that makes the user feel understood for what they have carried quietly.",
  "Include a reality-check section that is direct but protective, never humiliating.",
  "Avoid generic phrases such as 'you are unique', 'trust the process', or 'everything happens for a reason' unless grounded in the chart.",
  "Do not overuse slang. A little modern rhythm is good; meme language should be rare.",
  "No deterministic fear language, no curses, no guaranteed outcomes, and no hard financial/medical/legal advice."
].join("\n");

function stemByPinyin(pinyin) {
  return STEMS.find((stem) => stem.pinyin === pinyin);
}

function sexagenary(index) {
  const normalized = ((index % 60) + 60) % 60;
  const stem = STEMS[normalized % 10];
  const branch = BRANCHES[normalized % 12];
  return { index: normalized, stem, branch, label: `${stem.pinyin}-${branch.pinyin}` };
}

function julianDayNumber(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function shiftDate({ year, month, day }, deltaDays) {
  const date = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function findCityProfile(place, country) {
  const normalized = String(place || "").toLowerCase();
  const countryName = String(country || "").toLowerCase();
  const cityMatch = CITY_PROFILES.find((city) => normalized.includes(city.name));
  if (cityMatch) return cityMatch;
  const countryMatch = COUNTRY_DEFAULTS.find((item) => item.country.toLowerCase() === countryName || normalized.includes(item.country.toLowerCase()));
  if (countryMatch) {
    return {
      name: place || countryMatch.country,
      country: countryMatch.country,
      utcOffset: countryMatch.utcOffset,
      longitude: countryMatch.longitude
    };
  }
  return {
    name: place || "Unknown city",
    country: country || "Unknown country",
    utcOffset: 0,
    longitude: 0
  };
}

function solarTermMonth(date) {
  const md = date.month * 100 + date.day;
  if (md >= 1207) return { branchIndex: 0, offsetFromYin: 10, season: "deep winter Water" };
  if (md >= 1107) return { branchIndex: 11, offsetFromYin: 9, season: "early winter Water" };
  if (md >= 1008) return { branchIndex: 10, offsetFromYin: 8, season: "late autumn Earth" };
  if (md >= 908) return { branchIndex: 9, offsetFromYin: 7, season: "autumn Metal" };
  if (md >= 808) return { branchIndex: 8, offsetFromYin: 6, season: "early autumn Metal" };
  if (md >= 707) return { branchIndex: 7, offsetFromYin: 5, season: "late summer Earth" };
  if (md >= 606) return { branchIndex: 6, offsetFromYin: 4, season: "summer Fire" };
  if (md >= 506) return { branchIndex: 5, offsetFromYin: 3, season: "early summer Fire" };
  if (md >= 405) return { branchIndex: 4, offsetFromYin: 2, season: "late spring Earth" };
  if (md >= 306) return { branchIndex: 3, offsetFromYin: 1, season: "spring Wood" };
  if (md >= 204) return { branchIndex: 2, offsetFromYin: 0, season: "early spring Wood" };
  if (md >= 106) return { branchIndex: 1, offsetFromYin: 11, season: "late winter Earth" };
  return { branchIndex: 0, offsetFromYin: 10, season: "deep winter Water" };
}

function getYearPillar(date) {
  const sajuYear = date.month * 100 + date.day < 204 ? date.year - 1 : date.year;
  return { ...sexagenary(sajuYear - 4), sajuYear };
}

function getMonthPillar(date, yearStemIndex) {
  const monthInfo = solarTermMonth(date);
  const firstYinStem = [2, 4, 6, 8, 0][yearStemIndex % 5];
  const stemIndex = (firstYinStem + monthInfo.offsetFromYin) % 10;
  const branch = BRANCHES[monthInfo.branchIndex];
  return {
    index: null,
    stem: STEMS[stemIndex],
    branch,
    label: `${STEMS[stemIndex].pinyin}-${branch.pinyin}`,
    season: monthInfo.season
  };
}

function getDayPillar(date) {
  const jd = julianDayNumber(date.year, date.month, date.day);
  return { ...sexagenary(jd + 11), julianDay: jd };
}

function getHourPillar(solarMinutes, dayStemIndex) {
  const branchIndex = Math.floor((((solarMinutes + 60) % 1440) + 1440) % 1440 / 120) % 12;
  const startStemIndex = [0, 2, 4, 6, 8][dayStemIndex % 5];
  const stemIndex = (startStemIndex + branchIndex) % 10;
  const branch = BRANCHES[branchIndex];
  return {
    index: null,
    stem: STEMS[stemIndex],
    branch,
    label: `${STEMS[stemIndex].pinyin}-${branch.pinyin}`
  };
}

function tenGod(dayStem, targetStem) {
  const relation = ELEMENT_FLOW[dayStem.element];
  const samePolarity = dayStem.yinYang === targetStem.yinYang;
  if (targetStem.element === dayStem.element) return samePolarity ? "Peer Star" : "Rival Star";
  if (targetStem.element === relation.produces) return samePolarity ? "Talent Star" : "Rebel Talent";
  if (targetStem.element === relation.controls) return samePolarity ? "Dynamic Wealth" : "Stable Wealth";
  if (targetStem.element === relation.controlledBy) return samePolarity ? "Pressure Star" : "Proper Authority";
  if (targetStem.element === relation.producedBy) return samePolarity ? "Mystic Resource" : "Nurturing Resource";
  return "Chart Relationship";
}

function countElements(pillars) {
  const counts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  pillars.forEach((pillar) => {
    counts[pillar.stem.element] += 1;
    counts[pillar.branch.element] += 1;
  });
  return counts;
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
  const branchCombos = [
    ["Zi", "Chou", "Six Combination toward Earth"],
    ["Yin", "Hai", "Six Combination toward Wood"],
    ["Mao", "Xu", "Six Combination toward Fire"],
    ["Chen", "You", "Six Combination toward Metal"],
    ["Si", "Shen", "Six Combination toward Water"],
    ["Wu", "Wei", "Six Combination toward Earth"]
  ];
  const clashes = [
    ["Zi", "Wu", "Clash"],
    ["Chou", "Wei", "Clash"],
    ["Yin", "Shen", "Clash"],
    ["Mao", "You", "Clash"],
    ["Chen", "Xu", "Clash"],
    ["Si", "Hai", "Clash"]
  ];
  const harms = [
    ["Zi", "Wei", "Harm"],
    ["Chou", "Wu", "Harm"],
    ["Yin", "Si", "Harm"],
    ["Mao", "Chen", "Harm"],
    ["Shen", "Hai", "Harm"],
    ["You", "Xu", "Harm"]
  ];
  const halfCombos = [
    ["Yin", "Wu", "Half Fire Combination"],
    ["Wu", "Xu", "Half Fire Combination"],
    ["Hai", "Mao", "Half Wood Combination"],
    ["Mao", "Wei", "Half Wood Combination"],
    ["Shen", "Zi", "Half Water Combination"],
    ["Zi", "Chen", "Half Water Combination"],
    ["Si", "You", "Half Metal Combination"],
    ["You", "Chou", "Half Metal Combination"]
  ];

  stemCombos.forEach(([a, b, label]) => {
    if (stems.includes(a) && stems.includes(b)) tags.push(`${a}-${b}: ${label}`);
  });
  [...branchCombos, ...clashes, ...harms, ...halfCombos].forEach(([a, b, label]) => {
    if (branches.includes(a) && branches.includes(b)) tags.push(`${a}-${b}: ${label}`);
  });
  if (["Yin", "Si", "Shen"].filter((branch) => branches.includes(branch)).length >= 2) {
    tags.push("Yin-Si-Shen: Fire Penalty pattern");
  }
  if (["Chou", "Xu", "Wei"].filter((branch) => branches.includes(branch)).length >= 2) {
    tags.push("Chou-Xu-Wei: Earth Penalty pattern");
  }
  if (branches.includes("Zi") && branches.includes("Mao")) {
    tags.push("Zi-Mao: Courtesy Penalty pattern");
  }
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
  if ((nobleMap[dayStem.pinyin] || []).some((branch) => branches.includes(branch))) {
    stars.push("Heavenly Noble / mentor support");
  }
  if (["Xin", "Geng"].includes(dayStem.pinyin) || branches.includes("You")) {
    stars.push("Needle Star / precise words and technical detail");
  }
  if (["Chen", "Xu"].includes(dayBranch) || dayStem.pinyin === "Geng") {
    stars.push("Iron Wall Star / strong backbone");
  }
  return [...new Set(stars)];
}

function calculateSaju(input) {
  const [year, month, day] = String(input.date || "2000-07-29").split("-").map(Number);
  const [hour, minute] = String(input.time || "22:01").split(":").map(Number);
  const city = findCityProfile(input.birthplace, input.country);
  const localMinutes = hour * 60 + minute;
  const standardMeridian = city.utcOffset * 15;
  const solarAdjustmentMinutes = Math.round((city.longitude - standardMeridian) * 4);
  const adjustedMinutesRaw = localMinutes + solarAdjustmentMinutes;
  const dayShift = Math.floor(adjustedMinutesRaw / 1440);
  const solarMinutes = ((adjustedMinutesRaw % 1440) + 1440) % 1440;
  const solarDate = shiftDate({ year, month, day }, dayShift);

  const yearPillar = { position: "Year", ...getYearPillar(solarDate) };
  const monthPillar = { position: "Month", ...getMonthPillar(solarDate, yearPillar.stem ? STEMS.indexOf(yearPillar.stem) : yearPillar.index % 10) };
  const dayPillar = { position: "Day", ...getDayPillar(solarDate) };
  const hourPillar = { position: "Hour", ...getHourPillar(solarMinutes, dayPillar.index % 10) };
  const pillars = [hourPillar, dayPillar, monthPillar, yearPillar];
  const dayMaster = dayPillar.stem;

  const enrichedPillars = pillars.map((pillar) => ({
    position: pillar.position,
    stem: pillar.stem,
    branch: pillar.branch,
    tenGod: pillar.position === "Day" ? "Day Master" : tenGod(dayMaster, pillar.stem),
    branchTenGod: tenGod(dayMaster, stemByPinyin(HIDDEN_STEMS[pillar.branch.pinyin][0])),
    hiddenStems: HIDDEN_STEMS[pillar.branch.pinyin].map((pinyin) => {
      const stem = stemByPinyin(pinyin);
      return { ...stem, tenGod: tenGod(dayMaster, stem) };
    }),
    label: pillar.label,
    season: pillar.season || null
  }));

  const elements = countElements(enrichedPillars);
  const sortedElements = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const strongest = sortedElements[0][0];
  const weakest = sortedElements[sortedElements.length - 1][0];
  const helpfulElements = [ELEMENT_FLOW[strongest].controls, ELEMENT_FLOW[weakest].producedBy].filter(Boolean);

  return {
    input: {
      name: input.name || "Your",
      date: input.date,
      time: input.time,
      birthplace: input.birthplace,
      city: input.city || null,
      country: input.country || null,
      calendar: input.calendar || "Gregorian",
      accuracy: input.accuracy || "Exact time",
      tone: input.tone || "Warm, trendy, and detailed"
    },
    correction: {
      city: city.name,
      utcOffset: city.utcOffset,
      longitude: city.longitude,
      standardMeridian,
      solarAdjustmentMinutes,
      adjustedSolarTime: `${String(Math.floor(solarMinutes / 60)).padStart(2, "0")}:${String(solarMinutes % 60).padStart(2, "0")}`,
      dayShift,
      note: "Prototype correction uses a built-in city table and longitude-based solar-time adjustment. A production Manse engine should use verified timezone, DST, and solar-term tables."
    },
    dayMaster,
    pillars: enrichedPillars,
    elements,
    strongestElement: strongest,
    weakestElement: weakest,
    helpfulElements: [...new Set(helpfulElements)],
    relationshipTags: relationTags(enrichedPillars),
    symbolicStars: symbolicStars(enrichedPillars, dayMaster),
    calculationVersion: "prototype-saju-core-0.2"
  };
}

function buildPrompt(chart) {
  return [
    "You are SajuPop, an English-language Korean Saju/Four Pillars reader.",
    "Write like the user's Korean Saju-i reference: detailed, affectionate, slightly trendy, emotionally specific, sometimes direct, but never cruel.",
    "The objective chart data is already calculated. Do not invent pillars, birth data, or technical markers outside the provided JSON.",
    "Explain Korean Saju concepts for users who do not know Saju. Pair technical basis with plain English.",
    "Use the user's name naturally. If the name is missing, use 'you'.",
    "Tone rules: warm, polished, modern, vivid metaphors, practical advice, no generic horoscope filler.",
    "Safety rules: no medical, legal, psychological diagnosis, guaranteed wealth, guaranteed marriage, curses, or deterministic fear claims.",
    "Every section body should be 90-150 words. Make it feel worth a micro-payment.",
    "Required section keys: core_metaphor, element_balance, day_master, reality_check, validation, personality, career, money, love, family, friends, location, lucky_actions.",
    "",
    "Voice rules:",
    VOICE_RULES,
    "Return only JSON matching the schema.",
    "",
    "Chart JSON:",
    JSON.stringify(chart, null, 2)
  ].join("\n");
}

function buildPolishPrompt(chart, reading) {
  return [
    "Rewrite this Saju reading JSON into the final SajuPop voice.",
    "Keep every factual chart reference consistent with the chart JSON. Do not change pillars, elements, Ten Gods, symbolic stars, dates, or correction data.",
    "Keep the same JSON shape and section keys, but improve titles and bodies.",
    "The user must feel empathy, encouragement, and understanding. This is the product's core value.",
    "Make each section sound like it was written by a perceptive reader who can translate technical Saju markers into emotional language.",
    "Pattern for most bodies: 1) name the emotional pattern, 2) explain the chart basis in plain English, 3) give a practical life adjustment.",
    "The validation section should be especially comforting and specific.",
    "The reality_check section should be frank, but the user should still feel protected after reading it.",
    "Remove generic, shallow, or textbook-sounding sentences.",
    "",
    "Voice rules:",
    VOICE_RULES,
    "",
    "Chart JSON:",
    JSON.stringify(chart, null, 2),
    "",
    "Draft reading JSON:",
    JSON.stringify(reading, null, 2),
    "",
    "Return only JSON matching the schema."
  ].join("\n");
}

function fallbackReading(chart) {
  const name = chart.input.name || "You";
  const dm = chart.dayMaster.label;
  const strong = chart.strongestElement;
  const weak = chart.weakestElement;
  const tags = chart.relationshipTags.slice(0, 3).join(", ") || "a clean pillar structure";
  const stars = chart.symbolicStars.slice(0, 3).join(", ") || "quiet support markers";
  return {
    headline: `${name}'s chart carries ${dm} energy under a strong ${strong} sky`,
    summary: `This is a prototype fallback reading from the calculated chart. It uses the Four Pillars, element balance, Ten Gods, symbolic stars, and relationship tags before the OpenAI interpretation layer is available.`,
    sections: [
      {
        key: "core_metaphor",
        title: `A ${dm} Day Master learning to balance ${strong} and ${weak}`,
        body: `${name}, your Day Master is ${dm}, so the reading begins with your core operating style. The chart shows ${strong} as the loudest element and ${weak} as the quietest one, which creates the main tension of the report. Think of this as a weather map rather than a fixed destiny: the strongest element shows what comes naturally, while the missing element shows what your life keeps asking you to practice.`,
        technicalBasis: `Day Master ${chart.dayMaster.pinyin}; element counts ${JSON.stringify(chart.elements)}.`
      },
      {
        key: "element_balance",
        title: `The chart's loudest element is ${strong}`,
        body: `When ${strong} dominates, your instincts can become very clear in that direction. The advantage is consistency and recognizable energy. The risk is overusing the same response even when life needs a different tool. Your helpful elements are ${chart.helpfulElements.join(" and ") || weak}, so the practical remedy is to build habits, people, places, and routines that bring those qualities into daily life.`,
        technicalBasis: `Strongest element ${strong}; weakest element ${weak}; helpful element estimate ${chart.helpfulElements.join(", ")}.`
      },
      {
        key: "day_master",
        title: `Your Day Pillar is the center of the whole reading`,
        body: `The Day Pillar is where Saju looks for identity, relationship style, and the emotional center of the chart. Your Day Master does not describe everything about you, but it becomes the reference point for Ten Gods such as wealth, talent, authority, peers, and resources. That is why the same branch can mean different things for different people.`,
        technicalBasis: `Day Pillar ${chart.pillars.find((pillar) => pillar.position === "Day").label}.`
      },
      {
        key: "reality_check",
        title: "The reality check is to stop fighting your own pattern",
        body: `The chart tags include ${tags}. These markers do not mean something bad must happen. They mean certain frictions repeat until they are handled consciously. If you notice the same relationship tension, money habit, or overthinking loop returning, treat it as a design problem. Build a better container instead of blaming your personality.`,
        technicalBasis: `Relationship markers: ${chart.relationshipTags.join("; ") || "none detected in prototype layer"}.`
      },
      {
        key: "validation",
        title: "You have already been carrying more than people can see",
        body: `A good Saju reading should not only point out flaws. It should also name the strength that made you survive your own chart. The presence of ${stars} suggests that your sensitivity and timing are not random. They are part of how you read rooms, sense openings, and recover after pressure. The task is to use that perception with gentleness.`,
        technicalBasis: `Symbolic stars: ${chart.symbolicStars.join("; ") || "none detected in prototype layer"}.`
      },
      {
        key: "personality",
        title: "Your personality works best when it has both freedom and structure",
        body: `You are not meant to be read as one flat trait. The pillars show visible energy, hidden stems, and branch dynamics, so your outside behavior and inside weather can feel different. Give yourself systems that let you move without losing shape: clear goals, flexible methods, and fewer people who demand instant emotional access.`,
        technicalBasis: `Hidden stems across branches create the inner layer of the reading.`
      },
      {
        key: "career",
        title: "Career luck improves when your technical edge becomes a signature",
        body: `The chart supports work that turns observation into value. That can be analysis, product thinking, writing, design, advising, research, education, strategy, or any field where people pay for your refined judgment. Repetitive work with no authorship may drain you faster than it drains others, so build a visible skill stack.`,
        technicalBasis: `Ten Gods and symbolic star mix: ${chart.pillars.map((pillar) => `${pillar.position} ${pillar.tenGod}`).join(", ")}.`
      },
      {
        key: "money",
        title: "Money grows when emotion and systems stop sharing one wallet",
        body: `Your money advice should be practical, not dramatic. Separate comfort spending, social spending, and future-building money. The more intense the chart feels, the more boring the money system should be. Autopay, buckets, written rules, and slow decisions protect you from moods pretending to be strategy.`,
        technicalBasis: `Wealth-related Ten Gods are interpreted relative to ${chart.dayMaster.pinyin}.`
      }
    ],
    luckyActions: [
      `Use ${chart.helpfulElements[0] || weak} colors or materials as daily anchors.`,
      "Keep one written rule for spending and one written rule for rest.",
      "Choose bright, well-ventilated spaces when your thoughts feel heavy.",
      "Review yearly timing as a planning tool, not as a verdict."
    ],
    disclaimer: "Saju is a traditional interpretive system for reflection and entertainment. This reading is not medical, legal, financial, or psychological advice."
  };
}

function extractOutputText(data) {
  if (data.output_text) return data.output_text;
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
    }
  }
  return chunks.join("\n");
}

async function requestStructuredReading(model, prompt, instructions) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: prompt }]
          }
        ],
        max_output_tokens: 5200,
        text: {
          format: {
            type: "json_schema",
            name: "saju_pop_reading",
            strict: true,
            schema: RESPONSE_SCHEMA
          }
        }
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message || `OpenAI request failed with ${response.status}`);
    }

    const outputText = extractOutputText(data);
    return JSON.parse(outputText);
}

async function callOpenAI(chart) {
  if (!process.env.OPENAI_API_KEY) return { reading: fallbackReading(chart), model: "fallback", source: "fallback", voicePasses: ["fallback"] };
  const preferred = process.env.OPENAI_MODEL || "gpt-5-mini";
  const candidates = [...new Set([preferred, "gpt-5-mini", "gpt-5.1-mini", "gpt-4.1-mini"])];
  let lastError = null;

  for (const model of candidates) {
    try {
      const draft = await requestStructuredReading(
        model,
        buildPrompt(chart),
        "Generate a structured Korean Saju/Four Pillars reading for a consumer app."
      );
      try {
        const polished = await requestStructuredReading(
          model,
          buildPolishPrompt(chart, draft),
          "Polish a structured Saju reading into a warmer, more empathetic, more premium consumer voice."
        );
        return { reading: polished, model, source: "openai", voicePasses: ["chart-draft", "empathy-polish"] };
      } catch (polishError) {
        return {
          reading: draft,
          model,
          source: "openai",
          voicePasses: ["chart-draft"],
          warning: `Voice polish failed, returned draft: ${polishError.message}`
        };
      }
    } catch (error) {
      lastError = error.message || "OpenAI request failed";
      if (/model|not found|does not exist|unsupported/i.test(lastError)) continue;
      throw error;
    }
  }

  const reading = fallbackReading(chart);
  reading.summary = `${reading.summary} OpenAI fallback reason: ${lastError || "unknown error"}.`;
  return { reading, model: "fallback", source: "fallback", warning: lastError };
}

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const chart = calculateSaju(body);
    const result = await callOpenAI(chart);
    res.status(200).json({ ok: true, chart, ...result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Unable to generate reading" });
  }
}

module.exports = handler;
module.exports.calculateSaju = calculateSaju;
module.exports.fallbackReading = fallbackReading;
