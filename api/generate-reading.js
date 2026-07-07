const { calculateSaju } = require("./saju-engine");

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

function buildPrompt(chart) {
  return [
    "You are SajuPop, an English-language Korean Saju/Four Pillars reader.",
    "Write like the user's Korean Saju-i reference: detailed, affectionate, slightly trendy, emotionally specific, sometimes direct, but never cruel.",
    "The objective chart data is already calculated by a library-backed Manse engine. Do not invent pillars, birth data, elements, Ten Gods, symbolic stars, or location correction data.",
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
  const tags = chart.relationshipTags.slice(0, 3).join(", ") || "a calm chart structure";
  const stars = chart.symbolicStars.slice(0, 3).join(", ") || "quiet support markers";
  return {
    headline: `${name}'s ${dm} Day Master is shaped by strong ${strong} and quiet ${weak}`,
    summary: "This fallback reading uses the library-backed Manse chart data without the OpenAI style layer.",
    sections: [
      {
        key: "core_metaphor",
        title: `A ${dm} center learning how to carry ${strong} with grace`,
        body: `${name}, the chart begins with your Day Master, ${dm}. This is the anchor Saju uses before reading work, money, love, family, pressure, and support. Your strongest element is ${strong}, which shows what your system does almost automatically. Your quietest element is ${weak}, which points to the quality life keeps asking you to practice with more tenderness and intention.`,
        technicalBasis: `Eight characters: ${chart.manse.eightCharacters}; Day Master ${chart.dayMaster.pinyin}; weighted elements ${JSON.stringify(chart.weightedElements)}.`
      },
      {
        key: "element_balance",
        title: `${strong} is loud in the chart, so ${weak} needs deliberate space`,
        body: `When ${strong} dominates, you may rely on that element even when another response would be softer or more strategic. This is not a flaw. It is a familiar muscle. The helpful path is to build routines, spaces, and relationships that bring in ${chart.helpfulElements.join(" and ") || weak}. That way your natural strength becomes usable instead of heavy.`,
        technicalBasis: `Strongest element ${strong}; weakest element ${weak}; helpful estimate ${chart.helpfulElements.join(", ")}.`
      },
      {
        key: "day_master",
        title: "Your Day Pillar is the emotional center of the report",
        body: `The Day Pillar shows how the chart reads identity and close relationships. The sky sign is visible style; the ground sign is the emotional floor underneath. Reading both together keeps the report from becoming a shallow personality label. This is why Saju can feel specific when the calculation is handled carefully.`,
        technicalBasis: `Day Pillar ${chart.pillars.find((pillar) => pillar.position === "Day").label}.`
      },
      {
        key: "reality_check",
        title: "The repeated friction is asking for a better container, not self-blame",
        body: `The chart tags include ${tags}. These do not mean a fixed bad outcome. They show where pressure, attraction, interruption, or misunderstanding can repeat. The practical move is to design clearer boundaries around those themes before they become drama. You do not need to become a different person; you need a better operating system for your own sensitivity.`,
        technicalBasis: `Relationship markers: ${chart.relationshipTags.join("; ") || "none detected"}.`
      },
      {
        key: "validation",
        title: "You have been carrying more quietly than people realize",
        body: `The softer markers include ${stars}. At their best, they describe timing, perception, and the ability to notice what others miss. If you have felt tired from always reading the room, that makes sense. Your chart suggests that your sensitivity is not random noise; it is a real instrument. It simply needs rest, warmth, and people who do not punish you for having depth.`,
        technicalBasis: `Symbolic stars: ${chart.symbolicStars.join("; ") || "none detected"}.`
      },
      {
        key: "personality",
        title: "Your personality has a visible layer and a hidden layer",
        body: "The visible stems describe how energy appears first. The hidden stems show what lives underneath. This is why you can look composed while carrying a very different private weather system inside. Your best growth comes from respecting both layers instead of forcing yourself to be simple for other people's comfort.",
        technicalBasis: "Hidden stems are calculated inside each earthly branch."
      },
      {
        key: "career",
        title: "Work improves when your pattern becomes a signature skill",
        body: "The chart is strongest when observation turns into something useful: analysis, design, writing, advising, research, education, strategy, or technical craft. Repetitive work with no ownership may flatten you. A role that lets you refine judgment and produce a visible result will fit the chart better.",
        technicalBasis: `Ten Gods across pillars: ${chart.pillars.map((pillar) => `${pillar.position} ${pillar.tenGod}`).join(", ")}.`
      },
      {
        key: "money",
        title: "Money needs boring systems so your feelings do not have to manage everything",
        body: "The safest money advice here is structure. Separate comfort spending, social spending, and future-building money. When the chart is emotionally responsive, a boring financial system is not restrictive; it is protective. It lets your life feel softer because the basics are already held.",
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
      input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],
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
  if (!response.ok) throw new Error(data.error?.message || `OpenAI request failed with ${response.status}`);
  return JSON.parse(extractOutputText(data));
}

async function callOpenAI(chart) {
  if (!process.env.OPENAI_API_KEY) {
    return { reading: fallbackReading(chart), model: "fallback", source: "fallback", voicePasses: ["fallback"] };
  }
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
  return { reading, model: "fallback", source: "fallback", warning: lastError, voicePasses: ["fallback"] };
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

