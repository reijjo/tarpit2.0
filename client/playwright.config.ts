import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "NODE_ENV=test bun run dev", // Your backend
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI, // Reuse in local dev, fresh in CI
      timeout: 30000,
    },
    {
      command: "bun run dev", // Your Next.js frontend
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
