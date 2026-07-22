const { normalizeLocale } = require("./locale-voice");

const TERM_MAPS = {
  ko: {
    "Heavenly Stem Combination to Earth": "천간합으로 토 기운을 지향",
    "Heavenly Stem Combination to Metal": "천간합으로 금 기운을 지향",
    "Heavenly Stem Combination to Water": "천간합으로 수 기운을 지향",
    "Heavenly Stem Combination to Wood": "천간합으로 목 기운을 지향",
    "Heavenly Stem Combination to Fire": "천간합으로 화 기운을 지향",
    "Six Combination toward Earth": "육합으로 토 기운을 지향",
    "Six Combination toward Metal": "육합으로 금 기운을 지향",
    "Six Combination toward Water": "육합으로 수 기운을 지향",
    "Six Combination toward Wood": "육합으로 목 기운을 지향",
    "Six Combination toward Fire": "육합으로 화 기운을 지향",
    "Half Earth Combination": "토 반합", "Half Metal Combination": "금 반합",
    "Half Water Combination": "수 반합", "Half Wood Combination": "목 반합", "Half Fire Combination": "화 반합",
    "Fire Penalty pattern": "인사신 형살 흐름", "Earth Penalty pattern": "축술미 형살 흐름", "Courtesy Penalty pattern": "자묘 형살 흐름",
    "Ghost Gate / Irritation marker": "귀문관살 / 예민한 감각", "Red Charm Star / Peach Blossom accent": "도화의 매력",
    "Travel Star / movement opens luck": "역마 / 이동성", "Heavenly Noble / mentor support": "천을귀인 / 조력자 운",
    "Needle Star / precise words and technical detail": "현침살 / 정밀한 표현", "Iron Wall Star / strong backbone": "괴강의 단단한 기질",
    "Day Master": "일간", "Day pillar": "일주", "Day Pillar": "일주", "Hidden stems": "지장간", "Hidden stem": "지장간",
    RelationshipTags: "합·충·해 등 관계", HelpfulElements: "균형 참고 기운", weightedElements: "지장간 가중 오행",
    symbolicStars: "신살 참고", elements: "오행", "balance cues": "균형 참고 기운", LifeStage: "십이운성",
    "Peer Star": "비견", "Rival Star": "겁재", "Talent Star": "식신", "Rebel Talent": "상관",
    "Dynamic Wealth": "편재", "Stable Wealth": "정재", "Pressure Star": "편관", "Proper Authority": "정관",
    "Mystic Resource": "편인", "Nurturing Resource": "정인", "Chart Relationship": "십성 관계",
    "Birth / Growth": "장생", Bath: "목욕", "Coming Of Age": "관대", Establishment: "건록", Peak: "제왕",
    Decline: "쇠", Illness: "병", Death: "사", Tomb: "묘", Severance: "절", Conception: "태", Nurture: "양",
    Clash: "충", Harm: "해", Combination: "합", Penalty: "형살",
    "Yang Wood": "양목", "Yin Wood": "음목", "Yang Fire": "양화", "Yin Fire": "음화",
    "Yang Earth": "양토", "Yin Earth": "음토", "Yang Metal": "양금", "Yin Metal": "음금",
    "Yang Water": "양수", "Yin Water": "음수", Wood: "목", Fire: "화", Earth: "토", Metal: "금", Water: "수",
    "None detected": "두드러진 표식 없음", Hour: "시주", Day: "일주", Month: "월주", Year: "연주", Yang: "양", Yin: "음"
  },
  "zh-CN": {
    "Heavenly Stem Combination to Earth": "天干合土", "Heavenly Stem Combination to Metal": "天干合金",
    "Heavenly Stem Combination to Water": "天干合水", "Heavenly Stem Combination to Wood": "天干合木", "Heavenly Stem Combination to Fire": "天干合火",
    "Six Combination toward Earth": "六合化土倾向", "Six Combination toward Metal": "六合化金倾向", "Six Combination toward Water": "六合化水倾向",
    "Six Combination toward Wood": "六合化木倾向", "Six Combination toward Fire": "六合化火倾向",
    "Half Earth Combination": "土半合", "Half Metal Combination": "金半合", "Half Water Combination": "水半合", "Half Wood Combination": "木半合", "Half Fire Combination": "火半合",
    "Fire Penalty pattern": "寅巳申刑", "Earth Penalty pattern": "丑戌未刑", "Courtesy Penalty pattern": "子卯刑",
    "Ghost Gate / Irritation marker": "鬼门关 / 敏锐感受", "Red Charm Star / Peach Blossom accent": "桃花 / 人际吸引力",
    "Travel Star / movement opens luck": "驿马 / 流动性", "Heavenly Noble / mentor support": "天乙贵人 / 外界助力",
    "Needle Star / precise words and technical detail": "悬针 / 精细表达", "Iron Wall Star / strong backbone": "魁罡 / 坚定气质",
    "Day Master": "日主", "Day pillar": "日柱", "Day Pillar": "日柱", "Hidden stems": "藏干", "Hidden stem": "藏干",
    RelationshipTags: "命盘关系", HelpfulElements: "平衡参考", weightedElements: "藏干加权五行", symbolicStars: "神煞参考",
    elements: "五行", "balance cues": "平衡参考", LifeStage: "十二长生",
    "Peer Star": "比肩", "Rival Star": "劫财", "Talent Star": "食神", "Rebel Talent": "伤官",
    "Dynamic Wealth": "偏财", "Stable Wealth": "正财", "Pressure Star": "七杀", "Proper Authority": "正官",
    "Mystic Resource": "偏印", "Nurturing Resource": "正印", "Chart Relationship": "十神关系",
    "Birth / Growth": "长生", Bath: "沐浴", "Coming Of Age": "冠带", Establishment: "临官", Peak: "帝旺",
    Decline: "衰", Illness: "病", Death: "死", Tomb: "墓", Severance: "绝", Conception: "胎", Nurture: "养",
    Clash: "冲", Harm: "害", Combination: "合", Penalty: "刑",
    "Yang Wood": "阳木", "Yin Wood": "阴木", "Yang Fire": "阳火", "Yin Fire": "阴火",
    "Yang Earth": "阳土", "Yin Earth": "阴土", "Yang Metal": "阳金", "Yin Metal": "阴金",
    "Yang Water": "阳水", "Yin Water": "阴水", Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水",
    "None detected": "未见明显标记", Hour: "时柱", Day: "日柱", Month: "月柱", Year: "年柱", Yang: "阳", Yin: "阴"
  },
  es: {
    "Heavenly Stem Combination to Earth": "combinación de troncos hacia Tierra", "Heavenly Stem Combination to Metal": "combinación de troncos hacia Metal",
    "Heavenly Stem Combination to Water": "combinación de troncos hacia Agua", "Heavenly Stem Combination to Wood": "combinación de troncos hacia Madera",
    "Heavenly Stem Combination to Fire": "combinación de troncos hacia Fuego", "Six Combination toward Earth": "combinación de seis hacia Tierra",
    "Six Combination toward Metal": "combinación de seis hacia Metal", "Six Combination toward Water": "combinación de seis hacia Agua",
    "Six Combination toward Wood": "combinación de seis hacia Madera", "Six Combination toward Fire": "combinación de seis hacia Fuego",
    "Half Earth Combination": "media combinación de Tierra", "Half Metal Combination": "media combinación de Metal",
    "Half Water Combination": "media combinación de Agua", "Half Wood Combination": "media combinación de Madera", "Half Fire Combination": "media combinación de Fuego",
    "Fire Penalty pattern": "patrón de penalidad de Fuego", "Earth Penalty pattern": "patrón de penalidad de Tierra", "Courtesy Penalty pattern": "patrón de penalidad Zi-Mao",
    "Ghost Gate / Irritation marker": "Puerta Fantasma / sensibilidad", "Red Charm Star / Peach Blossom accent": "Flor de Melocotón / magnetismo social",
    "Travel Star / movement opens luck": "Estrella Viajera / movimiento", "Heavenly Noble / mentor support": "Noble Celestial / apoyo oportuno",
    "Needle Star / precise words and technical detail": "Estrella Aguja / precisión", "Iron Wall Star / strong backbone": "Estrella Muro / firmeza",
    "Day Master": "Maestro del Día", "Day pillar": "Pilar del Día", "Day Pillar": "Pilar del Día", "Hidden stems": "troncos ocultos", "Hidden stem": "tronco oculto",
    RelationshipTags: "relaciones de la carta", HelpfulElements: "pistas de equilibrio", weightedElements: "cinco elementos ponderados",
    symbolicStars: "estrellas simbólicas", elements: "cinco elementos", "balance cues": "pistas de equilibrio", LifeStage: "fase vital",
    "Peer Star": "Estrella Par", "Rival Star": "Estrella Rival", "Talent Star": "Estrella de Talento", "Rebel Talent": "Talento Rebelde",
    "Dynamic Wealth": "Riqueza Dinámica", "Stable Wealth": "Riqueza Estable", "Pressure Star": "Estrella de Presión", "Proper Authority": "Autoridad Correcta",
    "Mystic Resource": "Recurso Intuitivo", "Nurturing Resource": "Recurso Protector", "Chart Relationship": "relación de la carta",
    "Birth / Growth": "nacimiento y crecimiento", Bath: "baño", "Coming Of Age": "maduración", Establishment: "establecimiento", Peak: "apogeo",
    Decline: "declive", Illness: "fragilidad", Death: "reposo", Tomb: "almacenamiento", Severance: "corte", Conception: "gestación", Nurture: "crianza",
    Clash: "choque", Harm: "daño sutil", Combination: "combinación", Penalty: "penalidad",
    "Yang Wood": "Madera Yang", "Yin Wood": "Madera Yin", "Yang Fire": "Fuego Yang", "Yin Fire": "Fuego Yin",
    "Yang Earth": "Tierra Yang", "Yin Earth": "Tierra Yin", "Yang Metal": "Metal Yang", "Yin Metal": "Metal Yin",
    "Yang Water": "Agua Yang", "Yin Water": "Agua Yin", Wood: "Madera", Fire: "Fuego", Earth: "Tierra", Metal: "Metal", Water: "Agua",
    "None detected": "sin marcadores destacados", Hour: "Hora", Day: "Día", Month: "Mes", Year: "Año"
  },
  ja: {
    "Heavenly Stem Combination to Earth": "天干合で土へ向かう関係", "Heavenly Stem Combination to Metal": "天干合で金へ向かう関係",
    "Heavenly Stem Combination to Water": "天干合で水へ向かう関係", "Heavenly Stem Combination to Wood": "天干合で木へ向かう関係", "Heavenly Stem Combination to Fire": "天干合で火へ向かう関係",
    "Six Combination toward Earth": "六合で土へ向かう関係", "Six Combination toward Metal": "六合で金へ向かう関係", "Six Combination toward Water": "六合で水へ向かう関係",
    "Six Combination toward Wood": "六合で木へ向かう関係", "Six Combination toward Fire": "六合で火へ向かう関係",
    "Half Earth Combination": "土の半合", "Half Metal Combination": "金の半合", "Half Water Combination": "水の半合", "Half Wood Combination": "木の半合", "Half Fire Combination": "火の半合",
    "Fire Penalty pattern": "寅巳申の刑", "Earth Penalty pattern": "丑戌未の刑", "Courtesy Penalty pattern": "子卯の刑",
    "Ghost Gate / Irritation marker": "鬼門関 / 繊細な感覚", "Red Charm Star / Peach Blossom accent": "桃花 / 対人面の魅力",
    "Travel Star / movement opens luck": "駅馬 / 移動性", "Heavenly Noble / mentor support": "天乙貴人 / 周囲の助け",
    "Needle Star / precise words and technical detail": "懸針 / 精密な表現", "Iron Wall Star / strong backbone": "魁罡 / 芯の強さ",
    "Day Master": "日主", "Day pillar": "日柱", "Day Pillar": "日柱", "Hidden stems": "蔵干", "Hidden stem": "蔵干",
    RelationshipTags: "命式内の関係", HelpfulElements: "バランスの参考", weightedElements: "蔵干を含む五行", symbolicStars: "神殺の参考",
    elements: "五行", "balance cues": "バランスの参考", LifeStage: "十二運",
    "Peer Star": "比肩", "Rival Star": "劫財", "Talent Star": "食神", "Rebel Talent": "傷官",
    "Dynamic Wealth": "偏財", "Stable Wealth": "正財", "Pressure Star": "偏官", "Proper Authority": "正官",
    "Mystic Resource": "偏印", "Nurturing Resource": "印綬", "Chart Relationship": "通変星の関係",
    "Birth / Growth": "長生", Bath: "沐浴", "Coming Of Age": "冠帯", Establishment: "建禄", Peak: "帝旺",
    Decline: "衰", Illness: "病", Death: "死", Tomb: "墓", Severance: "絶", Conception: "胎", Nurture: "養",
    Clash: "冲", Harm: "害", Combination: "合", Penalty: "刑",
    "Yang Wood": "陽の木", "Yin Wood": "陰の木", "Yang Fire": "陽の火", "Yin Fire": "陰の火",
    "Yang Earth": "陽の土", "Yin Earth": "陰の土", "Yang Metal": "陽の金", "Yin Metal": "陰の金",
    "Yang Water": "陽の水", "Yin Water": "陰の水", Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水",
    "None detected": "目立つ表示なし", Hour: "時柱", Day: "日柱", Month: "月柱", Year: "年柱", Yang: "陽", Yin: "陰"
  }
};

function localizeChartText(value, localeValue) {
  const locale = normalizeLocale(localeValue);
  if (locale === "en") return String(value || "");
  const terms = TERM_MAPS[locale] || TERM_MAPS.ko;
  return Object.entries(terms)
    .sort(([a], [b]) => b.length - a.length)
    .reduce((text, [source, translated]) => text.replace(new RegExp(`\\b${source.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "g"), translated), String(value || ""));
}

function localizedElementCounts(counts, locale) {
  return Object.fromEntries(Object.entries(counts || {}).map(([element, count]) => [
    localizeChartText(element, locale),
    Number.isInteger(count) ? count : Number(Number(count).toFixed(2))
  ]));
}

function pillarFact(pillar, locale) {
  return {
    position: localizeChartText(pillar.position, locale),
    characters: `${pillar.stem.hanja}${pillar.branch.hanja}`,
    romanization: pillar.label,
    skySign: `${pillar.stem.hanja} (${pillar.stem.pinyin}, ${localizeChartText(pillar.stem.label, locale)})`,
    groundSign: `${pillar.branch.hanja} (${pillar.branch.pinyin})`,
    tenGod: localizeChartText(pillar.tenGod, locale),
    hiddenStems: (pillar.hiddenStems || []).map((stem) => `${stem.hanja} (${stem.pinyin}, ${localizeChartText(stem.tenGod, locale)})`),
    lifeStage: localizeChartText(pillar.lifeStage, locale)
  };
}

function localizedChartFacts(chart, localeValue) {
  const locale = normalizeLocale(localeValue);
  return {
    person: { name: chart.input.name, date: chart.input.date, time: chart.input.time, city: chart.input.city, country: chart.input.country },
    eightCharacters: chart.manse.eightCharacters,
    dayMaster: `${chart.dayMaster.hanja} (${chart.dayMaster.pinyin}, ${localizeChartText(chart.dayMaster.label, locale)})`,
    pillars: chart.pillars.map((pillar) => pillarFact(pillar, locale)),
    visibleFiveElements: localizedElementCounts(chart.elements, locale),
    hiddenStemWeightedFiveElements: localizedElementCounts(chart.weightedElements, locale),
    strongestElement: localizeChartText(chart.strongestElement, locale),
    quietestElement: localizeChartText(chart.weakestElement, locale),
    balanceCues: chart.helpfulElements.map((element) => localizeChartText(element, locale)),
    relationships: chart.relationshipTags.map((tag) => localizeChartText(tag, locale)),
    symbolicStars: chart.symbolicStars.map((star) => localizeChartText(star, locale))
  };
}

function sectionEvidence(chart, localeValue) {
  const locale = normalizeLocale(localeValue);
  const facts = localizedChartFacts(chart, locale);
  const pillars = Object.fromEntries(chart.pillars.map((pillar) => [pillar.position, pillarFact(pillar, locale)]));
  const allPillars = facts.pillars.map((pillar) => `${pillar.position} ${pillar.characters} (${pillar.romanization}), ${pillar.tenGod}`).join("; ");
  const visible = Object.entries(facts.visibleFiveElements).map(([name, value]) => `${name} ${value}`).join(", ");
  const weighted = Object.entries(facts.hiddenStemWeightedFiveElements).map(([name, value]) => `${name} ${value}`).join(", ");
  const relationships = facts.relationships.join("; ") || localizeChartText("None detected", locale);
  const stars = facts.symbolicStars.join("; ") || localizeChartText("None detected", locale);
  const balance = facts.balanceCues.join(", ");
  return {
    core_metaphor: [`${facts.eightCharacters}`, `${localizeChartText("Day Master", locale)}: ${facts.dayMaster}`, `${facts.strongestElement} / ${facts.quietestElement}`],
    element_balance: [visible, weighted, `${localizeChartText("balance cues", locale)}: ${balance}`],
    day_master: [`${localizeChartText("Day Master", locale)}: ${facts.dayMaster}`, `${pillars.Day.position} ${pillars.Day.characters} (${pillars.Day.romanization})`, `${localizeChartText("Hidden stems", locale)}: ${pillars.Day.hiddenStems.join(", ")}`],
    reality_check: [relationships],
    validation: [stars, `${localizeChartText("Day Master", locale)}: ${facts.dayMaster}`],
    personality: [allPillars, `${localizeChartText("Hidden stems", locale)}: ${facts.pillars.flatMap((pillar) => pillar.hiddenStems).join(", ")}`],
    career: [allPillars],
    money: [allPillars],
    love: [`${pillars.Day.position} ${pillars.Day.characters}`, relationships],
    family: [`${pillars.Year.position} ${pillars.Year.characters}`, `${pillars.Month.position} ${pillars.Month.characters}`],
    friends: [allPillars],
    location: [`${chart.input.city}, ${chart.input.country}`, `${facts.eightCharacters}`],
    lucky_actions: [`${localizeChartText("balance cues", locale)}: ${balance}`, `${facts.strongestElement} / ${facts.quietestElement}`]
  };
}

function applyTechnicalEvidence(reading, chart, localeValue) {
  const evidence = sectionEvidence(chart, localeValue);
  return {
    ...reading,
    sections: (reading.sections || []).map((section) => ({
      ...section,
      technicalBasis: (evidence[section.key] || []).join(" · ")
    }))
  };
}

module.exports = { TERM_MAPS, localizeChartText, localizedChartFacts, sectionEvidence, applyTechnicalEvidence };
