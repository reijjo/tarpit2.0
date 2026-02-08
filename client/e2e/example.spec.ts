import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  // Expect page to have a heading
  await expect(page.locator("h1")).toBeVisible();
});
