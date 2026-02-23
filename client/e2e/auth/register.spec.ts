import { test, expect, request } from "@playwright/test";

const resetDb = async () => {
  const ctx = await request.newContext();
  await ctx.delete("http://localhost:3001/test/reset");
  await ctx.dispose();
};

test.describe("REGISTER PAGE", () => {
  test.beforeEach(async ({ page }) => {
    const test = await resetDb();
    console.log("TEST DELETE", test);
    await page.goto("/register");
  });

  test("shows register form", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /create your account/i }),
    ).toBeVisible();
  });

  test("fill email field and go to step 2", async ({ page }) => {
    await page.fill('[name="email"]', "test@test.com");
    await page.click('button[type="submit"]');

    await expect(
      page.getByRole("heading", { name: /this is the last step/i }),
    ).toBeVisible();
  });
});
