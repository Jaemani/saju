import crypto from "node:crypto";
import fs from "node:fs";
import { spawn } from "node:child_process";

const SERVICE_ACCOUNT =
  process.argv.find((arg) => arg.endsWith(".json")) ||
  fs.readdirSync(".").find((file) => /^sajupop-.*\.json$/.test(file));

if (!SERVICE_ACCOUNT) {
  throw new Error("No service account JSON found. Put sajupop-*.json in the project root or pass its path.");
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT, "utf8"));
const projectId = serviceAccount.project_id;
const extraAuthorizedDomains = String(process.env.FIREBASE_AUTH_EXTRA_DOMAINS || "")
  .split(",")
  .map((domain) => domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""))
  .filter(Boolean);

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function getAccessToken(scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: serviceAccount.client_email,
    scope: scopes.join(" "),
    aud: serviceAccount.token_uri,
    exp: now + 3600,
    iat: now
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(serviceAccount.private_key, "base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  const jwt = `${unsigned}.${signature}`;
  const response = await fetch(serviceAccount.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`OAuth token failed: ${body.error_description || body.error}`);
  return body.access_token;
}

async function googleFetch(token, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const message = body.error?.message || body.error_description || text || response.statusText;
    throw new Error(`${options.method || "GET"} ${url} failed: ${message}`);
  }
  return body;
}

async function ensureWebApp(token) {
  const list = await googleFetch(token, `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`);
  const existing = (list.apps || []).find((app) => app.displayName === "SajuPop Web") || (list.apps || [])[0];
  if (existing) return existing;

  const op = await googleFetch(token, `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`, {
    method: "POST",
    body: JSON.stringify({ displayName: "SajuPop Web" })
  });
  let operation = op;
  for (let i = 0; i < 20 && !operation.done; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    operation = await googleFetch(token, `https://firebase.googleapis.com/v1beta1/${op.name}`);
  }
  if (!operation.done) throw new Error("Timed out creating Firebase Web App.");
  return operation.response;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"], ...options });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => {
      out += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      err += chunk.toString();
    });
    child.on("close", (code) => {
      if (code === 0 || options.allowFailure) resolve({ code, out, err });
      else reject(new Error(`${command} ${args.join(" ")} failed: ${out}${err}`));
    });
    if (options.stdin) child.stdin.write(options.stdin);
    child.stdin.end();
  });
}

async function setVercelEnv(key, value) {
  await run("rtk", ["vercel", "env", "rm", key, "production", "--yes"], { allowFailure: true });
  await run("rtk", ["vercel", "env", "add", key, "production"], { stdin: `${value}\n` });
  console.log(`${key}: synced to Vercel production`);
}

async function tryEnableIdentityToolkit(token) {
  try {
    await googleFetch(token, `https://serviceusage.googleapis.com/v1/projects/${projectId}/services/identitytoolkit.googleapis.com:enable`, {
      method: "POST",
      body: "{}"
    });
    console.log("identitytoolkit.googleapis.com: enable requested");
  } catch (error) {
    console.log(`identitytoolkit enable skipped: ${error.message}`);
  }

  try {
    await googleFetch(
      token,
      `https://identitytoolkit.googleapis.com/v2/projects/${projectId}/identityPlatform:initializeAuth`,
      {
        method: "POST",
        body: "{}"
      }
    );
    console.log("Firebase Authentication: initialized");
  } catch (error) {
    console.log(`Firebase Authentication initialize skipped: ${error.message}`);
  }

  try {
    await googleFetch(
      token,
      `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired,authorizedDomains`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: `projects/${projectId}/config`,
          signIn: {
            email: {
              enabled: true,
              passwordRequired: true
            }
          },
          authorizedDomains: [
            "localhost",
            `${projectId}.firebaseapp.com`,
            `${projectId}.web.app`,
            "saju-pop.vercel.app",
            "saju-sable-nine.vercel.app",
            ...extraAuthorizedDomains
          ]
        })
      }
    );
    console.log("Email/password auth: enabled");
  } catch (error) {
    console.log(`Email/password auth enable skipped: ${error.message}`);
  }
}

const token = await getAccessToken([
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/firebase",
  "https://www.googleapis.com/auth/identitytoolkit"
]);

const webApp = await ensureWebApp(token);
const appId = webApp.appId || webApp.name.split("/").pop();
const config = await googleFetch(token, `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`);

const envMap = {
  FIREBASE_API_KEY: config.apiKey,
  FIREBASE_AUTH_DOMAIN: config.authDomain,
  FIREBASE_PROJECT_ID: config.projectId,
  FIREBASE_STORAGE_BUCKET: config.storageBucket,
  FIREBASE_MESSAGING_SENDER_ID: config.messagingSenderId,
  FIREBASE_APP_ID: config.appId,
  FIREBASE_MEASUREMENT_ID: config.measurementId || ""
};

if (process.argv.includes("--write-local")) {
  const localPath = ".env.local";
  const existingLines = fs.existsSync(localPath) ? fs.readFileSync(localPath, "utf8").split(/\r?\n/) : [];
  const pending = new Map(Object.entries(envMap).filter(([, value]) => value));
  const updatedLines = existingLines.map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (!match || !pending.has(match[1])) return line;
    const value = pending.get(match[1]);
    pending.delete(match[1]);
    return `${match[1]}=${JSON.stringify(value)}`;
  });
  for (const [key, value] of pending) updatedLines.push(`${key}=${JSON.stringify(value)}`);
  fs.writeFileSync(localPath, `${updatedLines.filter((line, index, lines) => line || index < lines.length - 1).join("\n")}\n`);
  console.log("Firebase web config: written to ignored .env.local");
}

for (const [key, value] of Object.entries(envMap)) {
  if (value) await setVercelEnv(key, value);
}

try {
  await run("rtk", ["env", `GOOGLE_APPLICATION_CREDENTIALS=${SERVICE_ACCOUNT}`, "firebase", "deploy", "--only", "firestore:rules", "--project", projectId]);
  console.log("Firestore rules: deployed");
} catch (error) {
  console.log(`Firestore rules deploy skipped: ${error.message}`);
}

await tryEnableIdentityToolkit(token);

console.log(
  JSON.stringify(
    {
      projectId,
      webAppId: appId,
      authDomain: config.authDomain,
      configuredEnvKeys: Object.keys(envMap).filter((key) => envMap[key])
    },
    null,
    2
  )
);
