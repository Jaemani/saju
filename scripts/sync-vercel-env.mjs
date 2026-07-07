import { spawn } from "node:child_process";
import fs from "node:fs";

const envText = fs.readFileSync(".env", "utf8");
const entries = envText
  .split(/\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1)];
  })
  .filter(([key, value]) => key && value && ["OPENAI_API_KEY", "OPENAI_MODEL"].includes(key));

if (entries.length === 0) {
  console.log("No supported env vars found in .env");
  process.exit(0);
}

function addEnv(key, value, target) {
  return new Promise((resolve, reject) => {
    const child = spawn("rtk", ["vercel", "env", "add", key, target], {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => {
      out += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      err += chunk.toString();
    });
    child.on("close", (code) => {
      const redactedOut = out.replaceAll(value, "[redacted]");
      const redactedErr = err.replaceAll(value, "[redacted]");
      if (code === 0 || /already exists/i.test(redactedOut + redactedErr)) {
        console.log(`${key} -> ${target}: ok`);
        resolve();
        return;
      }
      reject(new Error(`${key} -> ${target} failed: ${redactedOut}${redactedErr}`));
    });
    child.stdin.write(`${value}\n`);
    child.stdin.end();
  });
}

const targets = process.argv.includes("--all") ? ["production", "preview", "development"] : ["production"];

for (const [key, value] of entries) {
  for (const target of targets) {
    await addEnv(key, value, target);
  }
}
