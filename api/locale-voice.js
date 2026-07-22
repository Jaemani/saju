const LOCALES = {
  en: {
    name: "natural contemporary English",
    address: "Use the person's name occasionally and 'you' naturally.",
    length: "Each section body should be 90-150 words.",
    rules: [
      "Write in clear, conversational international English. Prefer concrete verbs and familiar words.",
      "Vary sentence length. Do not give every paragraph the same three-part rhythm.",
      "Avoid therapy-speak, horoscope filler, corporate language, stacked adjectives, and motivational cliches.",
      "Use at most one fresh metaphor per section. Let direct observations carry the rest.",
      "Keep Hanja and pronunciation codes in the visual Manse chart only. In prose, say Yang Fire, Tiger's Wood base, subtle friction, or another plain-English meaning.",
      "Do not keep repeating Day Master or list all four pillars. Once the center is established, describe how that quality feels and behaves in ordinary life.",
      "Do not say the universe is on the user's side or promise that everything will work out."
    ]
  },
  ko: {
    name: "자연스러운 한국어",
    address: "이름 뒤에 '님'을 자연스럽게 붙이되 문장마다 반복하지 마세요. 전체는 다정한 해요체로 씁니다.",
    length: "각 본문은 공백 포함 240~420자 안팎으로 밀도 있게 쓰세요. 생활 장면, 명리 근거, 실제 영향, 선택을 갖추되 길이를 채우려고 같은 말을 덧붙이지 마세요.",
    rules: [
      "번역투 없이 한국어 화자가 직접 쓴 듯한 해요체를 사용하세요. 사실과 명리 용어는 바꾸지 마세요.",
      "'~에 대해', '~를 통해', '~에 있어서', '~을 가지고 있어요', '~인 것이에요' 같은 번역투와 형식명사를 피하세요.",
      "'또한', '따라서', '결론적으로', '즉', '이를 통해' 같은 문두 접속사를 반복하지 마세요.",
      "'거든요', '답니다', '할 수 있어요'가 연달아 나오지 않도록 종결과 문장 길이를 섞으세요.",
      "'리딩'은 '풀이'로, 오행을 말할 때 '요소'는 '기운'이나 '오행'으로 쓰세요. '도드라히'처럼 어색하게 만든 부사는 금지합니다.",
      "한국어 본문에서는 '차트' 대신 '사주', '원국', '만세력'을 문맥에 맞게 쓰세요. '생존 전략', '감정 흡수', '신경계 조절' 같은 상담 용어도 피하세요.",
      "technicalBasis도 한국어로 쓰고, 八字·戊子·Bing-Yin 같은 원문 표기 대신 '만세력의 네 기둥', '병인일주의 흐름'처럼 뜻을 풀어 쓰세요. 목2·화0 같은 오행 수치와 소수점은 산문이나 근거 문구에 쓰지 마세요.",
      "각 본문은 최소 5문장으로 쓰세요. 제목은 구체적인 사주 흐름이나 궁금증이 드러나게 짓고, 이름은 전체 제목과 일부 강조 구간에서만 사용하세요.",
      "본문 대부분은 명리 용어가 아니라 일상에서 겪을 법한 장면이나 마음의 모순으로 시작하세요. 근거는 한두 문장만 정확히 붙이고, 오행도 숫자표 대신 어떤 기운이 주도하고 받치거나 비어 있는지 말로 설명하세요.",
      "공감은 '이해합니다'라고 선언하는 대신 구체적으로 보여주세요. 예를 들면 겉으로 정리한 뒤 혼자 있을 때 피로가 몰려오거나, 거절하고 싶어도 책임감 때문에 한 번 더 살피는 식의 생활 감각을 사주 근거와 연결하세요. 단, 실제 과거사처럼 단정하지는 마세요.",
      "조언은 명령문만 이어 쓰지 말고 선택권을 남기되, '괜찮아요', '좋아요', '충분해요' 같은 허용과 칭찬은 각각 한두 번이면 충분합니다. 모든 항목을 위로로 닫지 말고 관찰, 주의점, 구체적인 선택으로 끝맺는 문장도 섞으세요.",
      "공감이 글의 바탕이되 겉으로는 논리적인 분석처럼 읽혀야 합니다. 습관이 생긴 이유를 이해해도 그 결과까지 무조건 감싸지 말고, 시간 낭비나 관계의 피로가 분명한 영역에서만 조심스럽게 짚으세요. 모든 항목에 단점이나 '비용'을 억지로 붙이지 않습니다.",
      "한 본문을 마친 뒤 빈 줄을 넣고 같은 근거와 조언을 다시 요약하지 마세요. '실질적 이득', '비용이 따릅니다' 같은 결론을 공식처럼 반복하지 말고 영역에 맞는 결과를 구체적으로 씁니다.",
      "전체는 해요체가 중심입니다. 분석을 강조하려고 '~합니다', '~됩니다'만 이어지는 보고서체로 바꾸지 마세요.",
      "칭찬은 '잘했어요'로 끝내지 말고 어떤 기운을 실제 강점으로 썼는지, 그 강점이 지나치면 무엇을 놓치는지 함께 쓰세요. 사용자가 늘 옳다는 결론이나 근거 없는 면죄부는 피합니다.",
      "'비용 있는 습관', '외부 정보', '집착하기 쉽습니다', '사주의 신호'처럼 영어 지시를 옮긴 듯하거나 상대를 몰아붙이는 표현은 쓰지 마세요. 팩트체크에서도 왜 확인과 망설임이 안전하게 느껴졌는지 먼저 짚어주세요.",
      "생활 예시는 섹션마다 다르게 고르세요. 모든 성향을 회의, 업무, 체크리스트 장면으로만 설명하지 말고 혼자 쉬는 시간, 가까운 관계, 선택, 부탁, 소비, 약속 등 문맥에 맞게 나누세요.",
      "비유는 한 섹션에 하나면 충분합니다. '우주는 당신 편', '찬란한 꽃을 피울 운명' 같은 근거 없는 위로는 쓰지 마세요.",
      "팩트체크 섹션도 모욕하거나 훈계하지 마세요. 경계심이나 망설임을 잘못으로 몰지 말고, 그 반응이 생길 만한 사주 흐름을 자연스럽게 짚은 뒤 분명한 조언을 건네세요.",
      "명리 용어는 처음 한 번만 쉬운 뜻을 붙이고, 이후에는 자연스러운 한국어로 이어가세요.",
      "'근거는', '사주 표시를 보면'처럼 분석 절차를 따로 선언하지 마세요. '무토가 중심을 잡고 수 기운이 강해, 판단은 현실적이지만 생각은 오래 이어집니다'처럼 근거와 생활 장면을 한 호흡에 녹이세요.",
      "한국어 본문에서는 세미콜론으로 문장을 이어 붙이지 마세요. 짧게 끊거나 쉼표와 자연스러운 연결어를 사용하세요.",
      "'먼저 마음을 헤아려볼게요', '이 풀이에서는', '뒤에서 설명할게요', '이 한 문장은 지지의 제안입니다'처럼 글의 진행이나 문장의 기능을 중계하지 마세요. 바로 관찰과 근거를 자연스럽게 이어가세요."
    ]
  },
  "zh-CN": {
    name: "自然、克制的简体中文",
    address: "以自然的第二人称表达，适量使用名字，不要每句都出现‘你’。",
    length: "每个正文约 250-420 个汉字，信息要具体完整。",
    rules: [
      "使用自然的现代普通话，像一位细心的中文命理读者，而不是英语直译文本。",
      "避免连续堆叠成语、四字格、感叹号、网络热词和夸张的宿命宣告。",
      "不要反复使用‘这意味着’‘从某种意义上说’‘值得注意的是’等机械连接句。",
      "长短句交替。每一段不必都按同一个三步模板展开。",
      "先承认当事人的压力或矛盾，再说明命盘依据，最后给出能落地的建议。不要像心理诊断。",
      "专业术语首次出现时给一句白话解释，之后保持简洁。",
      "不要添加拼音、罗马字柱码，也不要在每一段重复罗列四柱；原始符号留在可视命盘里。",
      "每个正文至少写 5 句话，不要把内容压缩成提要。",
      "多数段落先写一个日常矛盾或具体感受，再用一两句命盘依据接住；除五行平衡一节外，不要堆数字和术语。",
      "不要写‘先承认你的感受’‘后文会说明’‘接下来给出建议’等编辑提示。直接写出体察，不要假装当事人讲过自己的经历。",
      "五行、十神、柱位和神煞一律使用事实区的中文名称，不保留 elements、weightedElements、Stable Wealth 等英文字段名。"
    ]
  },
  es: {
    name: "español internacional natural",
    address: "Usa tú de forma natural y el nombre de vez en cuando. Evita marcar género cuando no sea necesario.",
    length: "Cada cuerpo debe tener entre 90 y 150 palabras.",
    rules: [
      "Escribe en español internacional claro y cercano, sin calcos sintácticos del inglés.",
      "Evita abuso de adverbios en -mente, sustantivos abstractos, frases grandilocuentes y lenguaje de autoayuda.",
      "No repitas 'esto significa que', 'en este sentido', 'por lo tanto' ni el mismo cierre en todos los párrafos.",
      "Alterna frases breves y largas. Una metáfora precisa por sección es suficiente.",
      "Reconoce primero la experiencia emocional, explica después el dato de la carta y termina con una acción concreta.",
      "No prometas riqueza, pareja, destino ni protección del universo.",
      "Deja los caracteres originales y los códigos de pronunciación en la carta Manse visual. En el texto, traduce cada dato a una cualidad comprensible y no enumeres los cuatro pilares una y otra vez.",
      "Cada cuerpo debe tener al menos cinco frases con detalles propios de esa sección.",
      "Abre la mayoría de los apartados con una tensión cotidiana reconocible. Limita la evidencia técnica a una o dos frases y reserva los recuentos numéricos para el equilibrio de los cinco elementos.",
      "No escribas 'entiendo lo que describes', 'en este informe' ni 'a continuación'. La persona solo compartió sus datos de nacimiento; expresa cercanía sin fingir una conversación previa.",
      "Usa la terminología española del bloque de hechos. No dejes etiquetas como Stable Wealth, hidden stems, LifeStage o RelationshipTags."
    ]
  },
  ja: {
    name: "自然でやわらかな日本語",
    address: "です・ます調を基本にし、名前は必要なところだけで使います。「あなた」を何度も繰り返さないでください。",
    length: "各本文は300〜500字程度で、具体性を保ってください。",
    rules: [
      "日本語の語順と省略を生かし、英語を直訳したような文を避けてください。",
      "主語、接続詞、「〜ということです」、「〜することができます」を繰り返さないでください。",
      "です・ますの連続を少し崩し、短い文と長い文を自然に混ぜてください。",
      "比喩や四字熟語を重ねず、各セクションでは一つの印象的な比喩に留めてください。",
      "まず気持ちや負担を受け止め、命式の根拠を説明し、無理のない工夫を提案してください。",
      "運命、成功、結婚、金運を断定せず、不安をあおる表現も使わないでください。",
      "ピンインやローマ字の柱コードは使わず、四柱の列挙も繰り返さないでください。原記号は視覚的な命式に任せ、本文では意味を自然に説明します。",
      "各本文は最低5文とし、要約だけで終わらせないでください。",
      "多くの段落は命理用語ではなく、日常で感じやすい迷いや負担から始めてください。根拠は一、二文に絞り、数値の列挙は五行バランスの項目だけにします。",
      "「まず気持ちを受け止めます」「本稿では」「次に説明します」「比喩は一つにします」のような編集上の説明を書かず、観察と根拠をそのまま自然につないでください。",
      "五行、通変星、柱、神殺は事実欄の日本語表記を使い、elements、hidden stems、LifeStage、balance cueなどの英語ラベルを残さないでください。"
    ]
  }
};

function normalizeLocale(value) {
  const raw = String(value || "en");
  if (LOCALES[raw]) return raw;
  const base = raw.split("-")[0];
  if (base === "zh") return "zh-CN";
  return LOCALES[base] ? base : "en";
}

function localeVoice(value) {
  const locale = normalizeLocale(value);
  return { locale, ...LOCALES[locale] };
}

module.exports = { LOCALES, normalizeLocale, localeVoice };
