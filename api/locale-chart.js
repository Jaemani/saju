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

const ANIMAL_MAPS = {
  ko: { Rat: "쥐", Ox: "소", Tiger: "호랑이", Rabbit: "토끼", Dragon: "용", Snake: "뱀", Horse: "말", Goat: "양", Monkey: "원숭이", Rooster: "닭", Dog: "개", Pig: "돼지" },
  "zh-CN": { Rat: "鼠", Ox: "牛", Tiger: "虎", Rabbit: "兔", Dragon: "龙", Snake: "蛇", Horse: "马", Goat: "羊", Monkey: "猴", Rooster: "鸡", Dog: "狗", Pig: "猪" },
  es: { Rat: "Rata", Ox: "Buey", Tiger: "Tigre", Rabbit: "Conejo", Dragon: "Dragón", Snake: "Serpiente", Horse: "Caballo", Goat: "Cabra", Monkey: "Mono", Rooster: "Gallo", Dog: "Perro", Pig: "Cerdo" },
  ja: { Rat: "ねずみ", Ox: "うし", Tiger: "とら", Rabbit: "うさぎ", Dragon: "たつ", Snake: "へび", Horse: "うま", Goat: "ひつじ", Monkey: "さる", Rooster: "とり", Dog: "いぬ", Pig: "いのしし" }
};

const POSITION_FOCUS = {
  en: { Hour: "private self and later aims", Day: "identity and close relationships", Month: "social role and work setting", Year: "roots and early environment" },
  ko: { Hour: "혼자 있을 때의 모습과 앞으로의 지향", Day: "나의 중심과 가까운 관계", Month: "사회에서 맡는 역할과 일의 환경", Year: "뿌리와 처음 익힌 환경" },
  "zh-CN": { Hour: "私下的自己与后来的志向", Day: "自我核心与亲密关系", Month: "社会角色与工作环境", Year: "根基与早期环境" },
  es: { Hour: "mundo privado y aspiraciones", Day: "identidad y vínculos cercanos", Month: "rol social y entorno laboral", Year: "raíces y entorno temprano" },
  ja: { Hour: "内面とこれからの志向", Day: "自分の軸と親しい関係", Month: "社会での役割と仕事環境", Year: "ルーツと初期環境" }
};

const TEN_GOD_MEANINGS = {
  en: {
    "Day Master": "identity and self-direction", "Peer Star": "independence and equal-footed connection", "Rival Star": "competition and shared momentum",
    "Talent Star": "practical expression and steady output", "Rebel Talent": "original expression and questioning conventions",
    "Dynamic Wealth": "flexible resource decisions and opportunity", "Stable Wealth": "steady resource care and practical follow-through",
    "Pressure Star": "challenge, urgency, and performance pressure", "Proper Authority": "structure, responsibility, and clear expectations",
    "Mystic Resource": "intuitive learning and private reflection", "Nurturing Resource": "supportive learning and patient preparation", "Chart Relationship": "a secondary relationship quality"
  },
  ko: {
    "Day Master": "나답게 판단하고 방향을 잡는 힘", "Peer Star": "독립심과 대등한 관계", "Rival Star": "경쟁심과 함께 움직이는 힘",
    "Talent Star": "꾸준히 표현하고 결과를 만드는 힘", "Rebel Talent": "관습을 의심하고 새롭게 표현하는 힘",
    "Dynamic Wealth": "기회를 살피며 유연하게 자원을 쓰는 감각", "Stable Wealth": "생활과 자원을 안정적으로 관리하는 감각",
    "Pressure Star": "도전과 긴장 속에서 성과를 내려는 힘", "Proper Authority": "규칙과 책임을 분명히 다루는 힘",
    "Mystic Resource": "직관적으로 배우고 깊이 생각하는 힘", "Nurturing Resource": "차분히 배우고 준비하는 힘", "Chart Relationship": "주변과 관계 맺는 보조적인 성향"
  },
  "zh-CN": {
    "Day Master": "自我判断与行动方向", "Peer Star": "独立性与平等相处", "Rival Star": "竞争感与共同推进",
    "Talent Star": "稳定表达并做出成果", "Rebel Talent": "打破惯例的原创表达", "Dynamic Wealth": "灵活调配资源并捕捉机会",
    "Stable Wealth": "稳妥管理资源并落实计划", "Pressure Star": "在挑战与紧迫感中回应要求", "Proper Authority": "重视规则、责任与清晰标准",
    "Mystic Resource": "凭直觉学习并独自深思", "Nurturing Resource": "耐心学习与充分准备", "Chart Relationship": "辅助性的人际倾向"
  },
  es: {
    "Day Master": "identidad y dirección propia", "Peer Star": "independencia y vínculos entre iguales", "Rival Star": "competencia e impulso compartido",
    "Talent Star": "expresión práctica y resultados constantes", "Rebel Talent": "expresión original y revisión de las normas",
    "Dynamic Wealth": "decisiones flexibles sobre recursos y oportunidades", "Stable Wealth": "cuidado estable de los recursos y constancia práctica",
    "Pressure Star": "reto, urgencia y presión por rendir", "Proper Authority": "estructura, responsabilidad y expectativas claras",
    "Mystic Resource": "aprendizaje intuitivo y reflexión privada", "Nurturing Resource": "aprendizaje paciente y preparación", "Chart Relationship": "una cualidad relacional secundaria"
  },
  ja: {
    "Day Master": "自分らしい判断と方向づけ", "Peer Star": "自立心と対等なつながり", "Rival Star": "競争心と一緒に進む力",
    "Talent Star": "着実な表現と成果づくり", "Rebel Talent": "慣例を問い直す独自の表現", "Dynamic Wealth": "機会を見ながら資源を柔軟に動かす感覚",
    "Stable Wealth": "資源を安定して管理し形にする力", "Pressure Star": "挑戦や緊張の中で応える力", "Proper Authority": "規律、責任、明確な基準",
    "Mystic Resource": "直感的な学びと内省", "Nurturing Resource": "落ち着いた学びと準備", "Chart Relationship": "補助的な対人傾向"
  }
};

const STAR_MEANINGS = {
  en: {
    "Red Charm Star / Peach Blossom accent": "a marker of social magnetism", "Travel Star / movement opens luck": "a marker of movement and adaptability",
    "Heavenly Noble / mentor support": "a marker of timely support and mentorship", "Needle Star / precise words and technical detail": "a marker of verbal and technical precision",
    "Iron Wall Star / strong backbone": "a marker of firm inner resolve"
  },
  ko: {
    "Red Charm Star / Peach Blossom accent": "사람의 시선을 끄는 자연스러운 매력", "Travel Star / movement opens luck": "이동과 변화에 적응하는 힘",
    "Heavenly Noble / mentor support": "필요한 때 도움을 주고받는 흐름", "Needle Star / precise words and technical detail": "말과 기술의 세밀함",
    "Iron Wall Star / strong backbone": "쉽게 흔들리지 않는 속의 중심"
  },
  "zh-CN": {
    "Red Charm Star / Peach Blossom accent": "自然吸引他人注意的魅力", "Travel Star / movement opens luck": "适应移动与变化的能力",
    "Heavenly Noble / mentor support": "在需要时获得或给予支持的倾向", "Needle Star / precise words and technical detail": "语言与技术细节上的精准",
    "Iron Wall Star / strong backbone": "不易动摇的内在定力"
  },
  es: {
    "Red Charm Star / Peach Blossom accent": "un indicador de magnetismo social", "Travel Star / movement opens luck": "un indicador de movimiento y adaptación",
    "Heavenly Noble / mentor support": "un indicador de apoyo oportuno y mentoría", "Needle Star / precise words and technical detail": "un indicador de precisión verbal y técnica",
    "Iron Wall Star / strong backbone": "un indicador de firmeza interior"
  },
  ja: {
    "Red Charm Star / Peach Blossom accent": "自然と人の目を引く魅力", "Travel Star / movement opens luck": "移動や変化への適応力",
    "Heavenly Noble / mentor support": "必要な時に助けを得たり渡したりする流れ", "Needle Star / precise words and technical detail": "言葉と技術面の細やかさ",
    "Iron Wall Star / strong backbone": "簡単には揺らがない内側の軸"
  }
};

const RELATION_MEANINGS = {
  en: {
    Clash: "a direct push-pull pattern", Harm: "a subtle friction pattern", "Half Fire Combination": "a partial combination that reinforces Fire",
    "Half Wood Combination": "a partial combination that reinforces Wood", "Half Water Combination": "a partial combination that reinforces Water",
    "Half Metal Combination": "a partial combination that reinforces Metal", "Fire Penalty pattern": "a repeating friction pattern around Fire",
    "Earth Penalty pattern": "a repeating friction pattern around Earth", "Courtesy Penalty pattern": "a pattern of sensitivity around tone and boundaries",
    "Ghost Gate / Irritation marker": "a heightened-sensitivity marker"
  },
  ko: {
    Clash: "서로 다른 힘이 정면으로 당기는 흐름", Harm: "겉으로 잘 보이지 않는 미묘한 마찰", "Half Fire Combination": "화 기운을 북돋우는 부분적인 결합",
    "Half Wood Combination": "목 기운을 북돋우는 부분적인 결합", "Half Water Combination": "수 기운을 북돋우는 부분적인 결합",
    "Half Metal Combination": "금 기운을 북돋우는 부분적인 결합", "Fire Penalty pattern": "화 기운을 둘러싼 반복적인 긴장",
    "Earth Penalty pattern": "토 기운을 둘러싼 반복적인 긴장", "Courtesy Penalty pattern": "말투와 경계에 예민해지기 쉬운 흐름",
    "Ghost Gate / Irritation marker": "감각과 생각이 섬세해지는 표식"
  },
  "zh-CN": {
    Clash: "两股力量直接拉扯的关系", Harm: "不易察觉的细微摩擦", "Half Fire Combination": "增强火势的局部结合",
    "Half Wood Combination": "增强木势的局部结合", "Half Water Combination": "增强水势的局部结合", "Half Metal Combination": "增强金势的局部结合",
    "Fire Penalty pattern": "围绕火势反复出现的紧张", "Earth Penalty pattern": "围绕土势反复出现的紧张",
    "Courtesy Penalty pattern": "容易对语气和界限敏感的关系", "Ghost Gate / Irritation marker": "感受与思绪格外细腻的标记"
  },
  es: {
    Clash: "un patrón directo de fuerzas opuestas", Harm: "un patrón de fricción sutil", "Half Fire Combination": "una combinación parcial que refuerza el Fuego",
    "Half Wood Combination": "una combinación parcial que refuerza la Madera", "Half Water Combination": "una combinación parcial que refuerza el Agua",
    "Half Metal Combination": "una combinación parcial que refuerza el Metal", "Fire Penalty pattern": "una tensión repetida alrededor del Fuego",
    "Earth Penalty pattern": "una tensión repetida alrededor de la Tierra", "Courtesy Penalty pattern": "una sensibilidad especial al tono y los límites",
    "Ghost Gate / Irritation marker": "un indicador de sensibilidad acentuada"
  },
  ja: {
    Clash: "異なる力が正面から引き合う関係", Harm: "表に出にくい細かな摩擦", "Half Fire Combination": "火の性質を支える部分的な結びつき",
    "Half Wood Combination": "木の性質を支える部分的な結びつき", "Half Water Combination": "水の性質を支える部分的な結びつき",
    "Half Metal Combination": "金の性質を支える部分的な結びつき", "Fire Penalty pattern": "火をめぐって繰り返しやすい緊張",
    "Earth Penalty pattern": "土をめぐって繰り返しやすい緊張", "Courtesy Penalty pattern": "言葉の調子や境界に敏感になりやすい関係",
    "Ghost Gate / Irritation marker": "感覚と思考が繊細に働く印"
  }
};

const EVIDENCE_LABELS = {
  en: { center: "Center", elementPattern: "Element picture", visible: "Visible elements", weighted: "Inner weighting", balance: "Balance cues", identity: "Identity pattern", inner: "Inner layer", links: "Relationship patterns", support: "Supporting markers", roles: "Visible roles", social: "Social-role layer", private: "Private-aim layer", resources: "Resource pattern", close: "Close-relationship pattern", roots: "Roots layer", peers: "Peer pattern", birthplace: "Birthplace", environment: "Environment pattern", none: "no prominent marker in this layer", chart: "the four calculated pillars shown in the Manse chart" },
  ko: { center: "중심", elementPattern: "오행의 큰 흐름", visible: "겉으로 드러난 오행", weighted: "속 기운까지 더한 분포", balance: "균형을 위한 참고 기운", identity: "나의 중심을 보여주는 흐름", inner: "속에 자리한 기운", links: "기운 사이의 관계", support: "보조 표식", roles: "겉으로 드러난 역할", social: "사회적 역할의 자리", private: "혼자 품는 지향", resources: "자원을 다루는 흐름", close: "가까운 관계의 자리", roots: "뿌리를 보여주는 자리", peers: "대등한 관계의 흐름", birthplace: "출생지", environment: "환경과 맞닿는 흐름", none: "이 층에서는 두드러진 표식이 보이지 않음", chart: "만세력 표에 계산된 네 기둥" },
  "zh-CN": { center: "核心", elementPattern: "五行大势", visible: "表层五行", weighted: "计入内层后的分布", balance: "平衡参考", identity: "自我核心的结构", inner: "内在层次", links: "命盘关系", support: "辅助标记", roles: "外显角色", social: "社会角色层", private: "私下志向层", resources: "资源倾向", close: "亲密关系层", roots: "根基层", peers: "同辈关系", birthplace: "出生地", environment: "环境倾向", none: "这一层没有明显标记", chart: "万年历中计算出的四柱" },
  es: { center: "Centro", elementPattern: "Panorama elemental", visible: "Elementos visibles", weighted: "Peso de la capa interior", balance: "Pistas de equilibrio", identity: "Patrón de identidad", inner: "Capa interior", links: "Patrones de relación", support: "Indicadores de apoyo", roles: "Roles visibles", social: "Capa del rol social", private: "Capa de aspiraciones privadas", resources: "Patrón de recursos", close: "Patrón de vínculos cercanos", roots: "Capa de las raíces", peers: "Patrón entre iguales", birthplace: "Lugar de nacimiento", environment: "Patrón ambiental", none: "sin un indicador destacado en esta capa", chart: "los cuatro pilares calculados que aparecen en la carta Manse" },
  ja: { center: "中心", elementPattern: "五行の大きな流れ", visible: "表に見える五行", weighted: "内側を含めた配分", balance: "バランスの参考", identity: "自分の軸を示す構成", inner: "内側の層", links: "命式内の関係", support: "補助的な印", roles: "表に出る役割", social: "社会的な役割の層", private: "内側に持つ志向", resources: "資源との関わり", close: "親しい関係の層", roots: "ルーツの層", peers: "対等な関係の傾向", birthplace: "出生地", environment: "環境との相性", none: "この層には目立つ印がない", chart: "万世暦に算出された四柱" }
};

function localizeChartText(value, localeValue) {
  const locale = normalizeLocale(localeValue);
  if (locale === "en") return String(value || "");
  const terms = TERM_MAPS[locale] || TERM_MAPS.ko;
  return Object.entries(terms)
    .sort(([a], [b]) => b.length - a.length)
    .reduce((text, [source, translated]) => text.replace(new RegExp(`\\b${source.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "g"), translated), String(value || ""));
}

function joinElementNames(values, locale) {
  const names = values.map((element) => localizeChartText(element, locale));
  if (locale === "ko") return names.join("·");
  if (locale === "zh-CN" || locale === "ja") return names.join("、");
  if (names.length < 2) return names[0] || "";
  const conjunction = locale === "es" ? " y " : " and ";
  return `${names.slice(0, -1).join(", ")}${conjunction}${names.at(-1)}`;
}

function elementProfile(counts, localeValue) {
  const locale = normalizeLocale(localeValue);
  const entries = Object.entries(counts || {});
  const positive = entries.filter(([, value]) => Number(value) > 0);
  const maximum = Math.max(...positive.map(([, value]) => Number(value)), 0);
  const leading = positive.filter(([, value]) => Number(value) === maximum).map(([element]) => element);
  const supporting = positive.filter(([, value]) => Number(value) !== maximum && Number(value) >= maximum * 0.45).map(([element]) => element);
  const quiet = positive.filter(([, value]) => Number(value) !== maximum && Number(value) < maximum * 0.45).map(([element]) => element);
  const absent = entries.filter(([, value]) => Number(value) === 0).map(([element]) => element);
  const groups = { leading, supporting, quiet, absent };
  const parts = [];

  if (locale === "ko") {
    if (leading.length) parts.push(`${joinElementNames(leading, locale)} 기운이 가장 두드러짐`);
    if (supporting.length) parts.push(`${joinElementNames(supporting, locale)} 기운이 함께 받쳐줌`);
    if (quiet.length) parts.push(`${joinElementNames(quiet, locale)} 기운은 비교적 잔잔함`);
    if (absent.length) parts.push(`${joinElementNames(absent, locale)} 기운은 이 층에 드러나지 않음`);
  } else if (locale === "zh-CN") {
    if (leading.length) parts.push(`${joinElementNames(leading, locale)}最突出`);
    if (supporting.length) parts.push(`${joinElementNames(supporting, locale)}形成支撑`);
    if (quiet.length) parts.push(`${joinElementNames(quiet, locale)}相对安静`);
    if (absent.length) parts.push(`${joinElementNames(absent, locale)}未在这一层显现`);
  } else if (locale === "es") {
    if (leading.length) parts.push(`${joinElementNames(leading, locale)} tiene la mayor presencia`);
    if (supporting.length) parts.push(`${joinElementNames(supporting, locale)} ofrece apoyo visible`);
    if (quiet.length) parts.push(`${joinElementNames(quiet, locale)} queda en segundo plano`);
    if (absent.length) parts.push(`${joinElementNames(absent, locale)} no aparece en esta capa`);
  } else if (locale === "ja") {
    if (leading.length) parts.push(`${joinElementNames(leading, locale)}が最も強く表れる`);
    if (supporting.length) parts.push(`${joinElementNames(supporting, locale)}が支えになる`);
    if (quiet.length) parts.push(`${joinElementNames(quiet, locale)}は比較的静か`);
    if (absent.length) parts.push(`${joinElementNames(absent, locale)}はこの層に表れない`);
  } else {
    if (leading.length) parts.push(`${joinElementNames(leading, locale)} has the strongest presence`);
    if (supporting.length) parts.push(`${joinElementNames(supporting, locale)} provides visible support`);
    if (quiet.length) parts.push(`${joinElementNames(quiet, locale)} stays in the background`);
    if (absent.length) parts.push(`${joinElementNames(absent, locale)} does not appear in this layer`);
  }

  return { groups, description: parts.join(locale === "zh-CN" || locale === "ja" ? "；" : "; ") };
}

function friendlyStem(stem, localeValue) {
  const locale = normalizeLocale(localeValue);
  if (locale === "ko") return `${stem.ko}${localizeChartText(stem.element, locale)}`;
  return localizeChartText(stem.label, locale);
}

function friendlyBranch(branch, localeValue) {
  const locale = normalizeLocale(localeValue);
  const animal = ANIMAL_MAPS[locale]?.[branch.animal] || branch.animal;
  const element = localizeChartText(branch.element, locale);
  if (locale === "ko") return `${branch.ko}${element}(${animal})`;
  if (locale === "zh-CN" || locale === "ja") return `${animal}（${element}）`;
  return `${animal} (${element})`;
}

function friendlyPillar(pillar, localeValue) {
  const locale = normalizeLocale(localeValue);
  const stem = friendlyStem(pillar.stem, locale);
  const branch = friendlyBranch(pillar.branch, locale);
  if (locale === "ko") return `${stem}가 ${branch} 위에 놓인 흐름`;
  if (locale === "zh-CN") return `${stem}坐${branch}的结构`;
  if (locale === "es") return `${stem} sobre ${branch}`;
  if (locale === "ja") return `${stem}が${branch}に重なる構成`;
  return `${stem} over ${branch}`;
}

function friendlyTenGod(value, localeValue) {
  const locale = normalizeLocale(localeValue);
  return TEN_GOD_MEANINGS[locale]?.[value] || TEN_GOD_MEANINGS.en[value] || localizeChartText(value, locale);
}

function friendlyRelationship(value, localeValue) {
  const locale = normalizeLocale(localeValue);
  const meaning = String(value || "").includes(":") ? String(value).split(":").slice(1).join(":").trim() : String(value || "");
  const direct = RELATION_MEANINGS[locale]?.[meaning];
  if (direct) return direct;
  const localizedElement = (element) => localizeChartText(element, locale);
  const stemMatch = meaning.match(/^Heavenly Stem Combination to (Wood|Fire|Earth|Metal|Water)$/);
  const sixMatch = meaning.match(/^Six Combination toward (Wood|Fire|Earth|Metal|Water)$/);
  if (stemMatch) {
    const element = localizedElement(stemMatch[1]);
    return ({ ko: `두 겉기운이 만나 ${element} 기운을 향하는 결합`, "zh-CN": `两股表层力量结合并趋向${element}`, es: `una combinación de fuerzas visibles que se orienta hacia ${element}`, ja: `表に出る二つの力が結びつき${element}へ向かう関係` }[locale] || `a visible-sign combination that leans toward ${element}`);
  }
  if (sixMatch) {
    const element = localizedElement(sixMatch[1]);
    return ({ ko: `두 바탕기운이 만나 ${element} 기운을 향하는 결합`, "zh-CN": `两股根基力量结合并趋向${element}`, es: `una combinación de fuerzas de base que se orienta hacia ${element}`, ja: `土台となる二つの力が結びつき${element}へ向かう関係` }[locale] || `a grounding combination that leans toward ${element}`);
  }
  return localizeChartText(meaning, locale);
}

function friendlyStar(value, localeValue) {
  const locale = normalizeLocale(localeValue);
  return STAR_MEANINGS[locale]?.[value] || localizeChartText(value, locale);
}

function elementContrast(facts, locale) {
  if (locale === "ko") return `${facts.strongestElement} 기운이 가장 강하고 ${facts.quietestElement} 기운이 가장 잔잔함`;
  if (locale === "zh-CN") return `${facts.strongestElement}最强，${facts.quietestElement}最弱`;
  if (locale === "es") return `${facts.strongestElement} tiene más presencia; ${facts.quietestElement} es el más discreto`;
  if (locale === "ja") return `${facts.strongestElement}が最も強く、${facts.quietestElement}が最も静か`;
  return `${facts.strongestElement} is strongest; ${facts.quietestElement} is quietest`;
}

function pillarFact(pillar, locale) {
  return {
    position: localizeChartText(pillar.position, locale),
    focus: POSITION_FOCUS[normalizeLocale(locale)]?.[pillar.position] || POSITION_FOCUS.en[pillar.position],
    pattern: friendlyPillar(pillar, locale),
    skyQuality: friendlyStem(pillar.stem, locale),
    groundQuality: friendlyBranch(pillar.branch, locale),
    relationshipMeaning: friendlyTenGod(pillar.tenGod, locale),
    innerLayer: (pillar.hiddenStems || []).map((stem) => `${friendlyStem(stem, locale)} — ${friendlyTenGod(stem.tenGod, locale)}`)
  };
}

function localizedChartFacts(chart, localeValue) {
  const locale = normalizeLocale(localeValue);
  return {
    person: { name: chart.input.name, date: chart.input.date, time: chart.input.time, city: chart.input.city, country: chart.input.country },
    chartPattern: EVIDENCE_LABELS[locale].chart,
    identityCenter: friendlyStem(chart.dayMaster, locale),
    pillars: chart.pillars.map((pillar) => pillarFact(pillar, locale)),
    visibleElementProfile: elementProfile(chart.elements, locale).description,
    innerElementProfile: elementProfile(chart.weightedElements, locale).description,
    strongestElement: localizeChartText(chart.strongestElement, locale),
    quietestElement: localizeChartText(chart.weakestElement, locale),
    balanceCues: chart.helpfulElements.map((element) => localizeChartText(element, locale)),
    relationships: chart.relationshipTags.map((tag) => friendlyRelationship(tag, locale)),
    symbolicStars: chart.symbolicStars.map((star) => friendlyStar(star, locale))
  };
}

function sectionEvidence(chart, localeValue) {
  const locale = normalizeLocale(localeValue);
  const facts = localizedChartFacts(chart, locale);
  const labels = EVIDENCE_LABELS[locale];
  const pillars = Object.fromEntries(chart.pillars.map((pillar) => [pillar.position, pillarFact(pillar, locale)]));
  const relationships = facts.relationships.join("; ") || labels.none;
  const stars = facts.symbolicStars.join("; ") || labels.none;
  const balance = facts.balanceCues.join(", ");
  const visibleRoles = facts.pillars.map((pillar) => `${pillar.focus}: ${pillar.relationshipMeaning}`).join("; ");
  const resourceRoles = chart.pillars.filter((pillar) => /Wealth/.test(pillar.tenGod)).map((pillar) => friendlyTenGod(pillar.tenGod, locale));
  const peerRoles = chart.pillars.filter((pillar) => /Peer|Rival/.test(pillar.tenGod)).map((pillar) => friendlyTenGod(pillar.tenGod, locale));
  const unique = (values) => [...new Set(values)].join("; ") || labels.none;
  return {
    core_metaphor: [`${labels.center}: ${facts.identityCenter}`, `${labels.elementPattern}: ${elementContrast(facts, locale)}`],
    element_balance: [`${labels.visible}: ${facts.visibleElementProfile}`, `${labels.weighted}: ${facts.innerElementProfile}`, `${labels.balance}: ${balance}`],
    day_master: [`${labels.identity}: ${pillars.Day.pattern}`, `${labels.inner}: ${pillars.Day.innerLayer.join("; ")}`],
    reality_check: [`${labels.links}: ${relationships}`],
    validation: [`${labels.support}: ${stars}`, `${labels.elementPattern}: ${elementContrast(facts, locale)}`],
    personality: [`${labels.roles}: ${visibleRoles}`, `${labels.inner}: ${unique(facts.pillars.flatMap((pillar) => pillar.innerLayer))}`],
    career: [`${labels.social}: ${pillars.Month.relationshipMeaning}`, `${labels.private}: ${pillars.Hour.relationshipMeaning}`],
    money: [`${labels.resources}: ${unique(resourceRoles)}`, `${labels.balance}: ${balance}`],
    love: [`${labels.close}: ${pillars.Day.pattern}`, `${labels.links}: ${relationships}`],
    family: [`${labels.roots}: ${pillars.Year.pattern}; ${pillars.Year.relationshipMeaning}`, `${labels.social}: ${pillars.Month.pattern}; ${pillars.Month.relationshipMeaning}`],
    friends: [`${labels.peers}: ${unique(peerRoles)}`, `${labels.roles}: ${visibleRoles}`],
    location: [`${labels.birthplace}: ${chart.input.city}, ${chart.input.country}`, `${labels.environment}: ${elementContrast(facts, locale)}`],
    lucky_actions: [`${labels.balance}: ${balance}`, `${labels.elementPattern}: ${elementContrast(facts, locale)}`]
  };
}

function simplifyReadingNotation(reading, chart, localeValue) {
  if (!reading || !chart) return reading;
  const locale = normalizeLocale(localeValue);
  const labels = EVIDENCE_LABELS[locale];
  const fullPattern = labels.chart;
  const replacements = [];
  const add = (source, target) => {
    if (source && target && source !== target) replacements.push([String(source), String(target)]);
  };

  add(chart.manse?.eightCharacters, fullPattern);
  add(String(chart.manse?.eightCharacters || "").replace(/\s/g, ""), fullPattern);
  for (const pillar of chart.pillars || []) {
    const pair = `${pillar.stem.hanja}${pillar.branch.hanja}`;
    const friendly = friendlyPillar(pillar, locale);
    add(`${pair} (${pillar.label})`, friendly);
    add(`${pair}（${pillar.label}）`, friendly);
    add(`${pillar.label} (${pair})`, friendly);
    add(pair, friendly);
    add(pillar.label, friendly);
    add(`${pillar.stem.hanja} (${pillar.stem.pinyin}, ${pillar.stem.label})`, friendlyStem(pillar.stem, locale));
    add(`${pillar.stem.hanja} (${pillar.stem.pinyin})`, friendlyStem(pillar.stem, locale));
    add(`${pillar.branch.hanja} (${pillar.branch.pinyin})`, friendlyBranch(pillar.branch, locale));
  }
  for (const tag of chart.relationshipTags || []) {
    add(tag, friendlyRelationship(tag, locale));
    if (tag.includes(":")) add(tag.split(":")[0], friendlyRelationship(tag, locale));
  }
  for (const star of chart.symbolicStars || []) add(star, friendlyStar(star, locale));
  replacements.sort(([a], [b]) => b.length - a.length);

  const protectedValues = [chart.input?.name, chart.input?.city, chart.input?.country].filter(Boolean);
  const simplifyText = (value) => {
    let text = String(value || "");
    const protectedText = [];
    for (const protectedValue of protectedValues) {
      const index = protectedText.push(protectedValue) - 1;
      text = text.split(protectedValue).join(`__SAJU_PROTECTED_${index}__`);
    }
    for (const [source, target] of replacements) text = text.split(source).join(target);

    const chartStems = [...new Map((chart.pillars || []).flatMap((pillar) => [pillar.stem, ...(pillar.hiddenStems || [])]).map((stem) => [stem.hanja, stem])).values()];
    const chartBranches = [...new Map((chart.pillars || []).map((pillar) => [pillar.branch.hanja, pillar.branch])).values()];
    if (["en", "es", "ko"].includes(locale)) {
      for (const stem of chartStems) text = text.split(stem.hanja).join(friendlyStem(stem, locale));
      for (const branch of chartBranches) text = text.split(branch.hanja).join(friendlyBranch(branch, locale));
      const basicTerms = locale === "ko"
        ? { 八字: "사주", 日主: "나의 중심", 日柱: "나의 중심을 보여주는 자리", 時柱: "혼자일 때의 자리", 月柱: "사회적 역할의 자리", 年柱: "뿌리를 보여주는 자리" }
        : locale === "es"
          ? { 八字: "carta de los Cuatro Pilares", 日主: "centro de identidad", 日柱: "patrón de identidad", 時柱: "capa privada", 月柱: "capa del rol social", 年柱: "capa de las raíces" }
          : { 八字: "Four Pillars chart", 日主: "identity center", 日柱: "identity pattern", 時柱: "private layer", 月柱: "social-role layer", 年柱: "roots layer" };
      for (const [source, target] of Object.entries(basicTerms)) text = text.split(source).join(target);
    }
    text = text
      .replace(/\s*\((?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)(?:-(?:Zi|Chou|Yin|Mao|Chen|Si|Wu|Wei|Shen|You|Xu|Hai))?(?:,\s*[^)]*)?\)/g, "")
      .replace(/\b(?:Jia|Yi|Bing|Ding|Wu|Ji|Geng|Xin|Ren|Gui)-(?:Zi|Chou|Yin|Mao|Chen|Si|Wu|Wei|Shen|You|Xu|Hai)\b/g, fullPattern)
      .replace(/\(\s*\)/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .trim();
    protectedText.forEach((protectedValue, index) => {
      text = text.split(`__SAJU_PROTECTED_${index}__`).join(protectedValue);
    });
    return text;
  };

  return {
    ...reading,
    headline: simplifyText(reading.headline),
    summary: simplifyText(reading.summary),
    sections: (reading.sections || []).map((section) => ({ ...section, title: simplifyText(section.title), body: simplifyText(section.body), technicalBasis: simplifyText(section.technicalBasis) })),
    luckyActions: (reading.luckyActions || []).map(simplifyText),
    disclaimer: simplifyText(reading.disclaimer)
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

module.exports = {
  TERM_MAPS,
  localizeChartText,
  localizedChartFacts,
  sectionEvidence,
  applyTechnicalEvidence,
  simplifyReadingNotation,
  friendlyStem,
  friendlyPillar,
  friendlyRelationship
};
