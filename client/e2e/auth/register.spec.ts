import { test, expect, request } from "@playwright/test";

const resetDb = async () => {
  const ctx = await request.newContext();
  const response = await ctx.delete("http://localhost:3001/test/reset");
  if (!response.ok()) {
    throw new Error(
      `Failed to reset DB: ${response.status()} ${response.statusText()}`,
    );
  }
  await ctx.dispose();
};

test.describe("REGISTER PAGE", () => {
  test.beforeEach(async ({ page }) => {
    const testdb = await resetDb();
    console.log("TEST DELETE", testdb);
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
