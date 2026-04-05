import { test, expect } from "@playwright/test";

test.describe("HOMEPAGE", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("loads successfully and shows hero section", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test("has working navigation links", async ({ page }) => {
    await page.getByRole("link", { name: /login/i }).click();
    await expect(page).toHaveURL(/.*login/);
    
    await page.goBack();
    
    await page.getByRole("link", { name: /register/i }).click();
    await expect(page).toHaveURL(/.*register/);
  });
});