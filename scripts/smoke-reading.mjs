import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);

if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1);
    process.env[key] ||= value;
  }
}

const handler = require("../api/generate-reading.js");

const req = {
  method: "POST",
  body: {
    name: "Mina",
    date: "2000-07-29",
    time: "22:01",
    birthplace: "Los Angeles, United States",
    calendar: "Gregorian",
    accuracy: "Exact time",
    locale: process.env.SMOKE_LOCALE || "en"
  }
};

const res = {
  statusCode: 200,
  headers: {},
  setHeader(key, value) {
    this.headers[key] = value;
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    const summary = {
      statusCode: this.statusCode,
      ok: payload.ok,
      source: payload.source,
      model: payload.model,
      voicePasses: payload.voicePasses,
      locale: payload.chart?.input?.locale,
      headline: payload.reading?.headline,
      pillars: payload.chart?.pillars?.map((pillar) => `${pillar.position}:${pillar.label}`),
      sectionCount: payload.reading?.sections?.length,
      warning: payload.warning,
      error: payload.error
    };
    if ((process.env.VERBOSE_READING === "1" || process.argv.includes("--verbose")) && payload.reading) {
      summary.summary = payload.reading.summary;
      summary.sections = payload.reading.sections.slice(0, 4).map((section) => ({
        key: section.key,
        title: section.title,
        body: section.body,
        technicalBasis: section.technicalBasis
      }));
      summary.luckyActions = payload.reading.luckyActions;
    }
    console.log(JSON.stringify(summary, null, 2));
  }
};

await handler(req, res);
