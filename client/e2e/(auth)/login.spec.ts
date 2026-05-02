import { test, expect } from "@playwright/test";

import { E2EUserCredentials, registerE2EUser } from "../helpers/auth";

test.describe("LOGIN PAGE FLOW", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
  });

  test.describe("REGISTED USER LOGIN", () => {
    let user: E2EUserCredentials = { email: "", username: "", password: "" };

    test.beforeAll(async ({ request }) => {
      user = await registerE2EUser(request);
    });

    test("Account not verified", async ({ page }) => {
      await page.getByLabel(/email/i).fill(user.email);
      await page.getByLabel(/password/i).fill(user.password);
      await page.getByRole("button", { name: "Login", exact: true }).click();

      await expect(page.getByText(/account not verified/i)).toBeVisible();
    });
  });

  test.describe("UNREGISTED USER LOGIN", () => {
    test("Shows error for unregistered user", async ({ page }) => {
      await page.getByLabel(/email/i).fill("testuser");
      await page.getByLabel(/password/i).fill("TestPass123!");
      await page.getByRole("button", { name: "Login", exact: true }).click();

      await expect(page.getByText(/user not found/i)).toBeVisible();
    });
  });
});
