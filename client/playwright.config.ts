import { defineConfig, devices } from "@playwright/test";
import path from "path";

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
      command: "bun run dev:test",
      cwd: path.resolve(__dirname, "../server"), // ✅ Absolute path, no ambiguity
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
      timeout: 60000, // ✅ More time for migrations to run first
    },
    {
      command: "bun run dev",
      cwd: path.resolve(__dirname), // ✅ Explicit client path
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
