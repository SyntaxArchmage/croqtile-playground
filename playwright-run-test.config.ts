import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  outputDir: "playwright-results/",
  timeout: 600_000,
  expect: { timeout: 30_000 },
  use: {
    ...devices["Desktop Firefox"],
    baseURL: "http://10.0.16.52:3001",
    trace: "off",
    screenshot: "off",
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
