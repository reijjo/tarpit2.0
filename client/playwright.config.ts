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
      command: "APP_ENV=test cargo run",
      cwd: path.resolve(__dirname, "../rust-server"),
      // 🦀 Explicit 127.0.0.1 — avoids the macOS localhost → ::1 resolution
      // that causes reuseExistingServer to silently fail
      url: "http://127.0.0.1:3001/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    // playwright.config.ts
    {
      command: "bun run dev",
      cwd: path.resolve(__dirname),
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
      env: {
        PORT: "3000", // 👈 pin this explicitly so CI's PORT=3001 doesn't leak in
      },
    },
  ],
});
