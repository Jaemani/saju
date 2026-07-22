const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  use: {
    baseURL: "http://127.0.0.1:3101",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npx vercel dev --listen 3101 --yes",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: true,
    timeout: 120_000
  }
});
