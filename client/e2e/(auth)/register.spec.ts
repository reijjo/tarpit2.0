import { test, expect } from "@playwright/test";

test.describe("REGISTER PAGE FLOW", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });
  });

  test("loads correctly with email form", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /create your account/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /use this email/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
  });

  test("shows validation error for invalid email format", async ({ page }) => {
    await page.getByLabel(/email/i).fill("notanemail@aaa");
    await page.getByRole("button", { name: /use this email/i }).click();

    await expect(page.getByText("Invalid email")).toBeVisible();
  });

  test("submitting email advances to credentials form", async ({ page }) => {
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByRole("button", { name: /use this email/i }).click();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("advances to credentials step with valid available email", async ({
    page,
  }) => {
    // Use unique test email that will not conflict
    const testEmail = `e2e-test-${Date.now()}@test.local`;

    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByRole("button", { name: /use this email/i }).click();

    // Verify we moved to step 2
    await expect(page.getByLabel(/username/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /register/i })).toBeVisible();
  });

  test("can go back to email step from credentials step", async ({ page }) => {
    const testEmail = `e2e-test-${Date.now()}@test.local`;

    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByRole("button", { name: /use this email/i }).click();
    await expect(page.getByLabel(/username/i)).toBeVisible();

    // Click back button
    await page.getByRole("button", { name: /go back/i }).click();

    // Verify we are back at email step
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toHaveValue(testEmail);
  });

  test("shows correct validation errors", async ({ page }) => {
    const testEmail = `e2e-test-${Date.now()}@test.local`;

    // Advance to credentials step first
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByRole("button", { name: /use this email/i }).click();
    await expect(page.getByLabel(/username/i)).toBeVisible();

    await page.getByLabel(/username/i).fill("tester123");

    // Test too short password
    await page.getByLabel(/password/i).fill("short");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("Min 8 characters")).toBeVisible();

    // Test missing uppercase
    await page.getByLabel(/password/i).fill("alllower123!");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(
      page.getByText("Must contain one uppercase letter"),
    ).toBeVisible();
  });

  test("successfully creates new user account", async ({ page }) => {
    const testEmail = `e2e-test-${Date.now()}@test.local`;
    const testUsername = `u${Date.now().toString().slice(-8)}`;
    const validPassword = "TestPass123!";

    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByRole("button", { name: /use this email/i }).click();
    await expect(page.getByLabel(/username/i)).toBeVisible();

    await page.getByLabel(/username/i).fill(testUsername);
    await page.getByLabel(/password/i).fill(validPassword);
    await page.getByRole("button", { name: /register/i }).click();

    // Verify successful registration shows confirmation message
    await expect(page.getByText(/check your email to validate your account/i)).toBeVisible();
  });

  test("login navigation link works correctly", async ({ page }) => {
    await page.getByRole("link", { name: /log in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
