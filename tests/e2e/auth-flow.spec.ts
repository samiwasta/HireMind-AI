import { expect, test } from "@playwright/test";

function uniqueEmail(prefix: string) {
  return `${prefix}.${Date.now()}@example.com`;
}

function uniquePassword() {
  return `Pwd!${Date.now()}Aa`;
}

test("candidate registration validates resume before submit", async ({ page }) => {
  await page.goto("/registration");

  await page.getByLabel("First name").fill("Jane");
  await page.getByLabel("Last name").fill("Doe");
  await page.getByLabel("Email").fill(uniqueEmail("candidate"));
  await page.getByPlaceholder("At least 8 characters").fill(uniquePassword());

  await page.getByRole("button", { name: "Create candidate account" }).click();

  await expect(page.getByText(/Upload your resume/i)).toBeVisible();
});

test("hiremind registration -> first login password change -> login succeeds", async ({ page }) => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  test.skip(
    !adminEmail || !adminPassword,
    "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to an Admin companyRole user to run this test."
  );

  const email = uniqueEmail("first-login");
  const initialPassword = uniquePassword();
  const updatedPassword = uniquePassword();

  await page.goto("/login");
  await page.getByLabel("Email").fill(adminEmail!);
  await page.getByPlaceholder("Enter your password").fill(adminPassword!);
  await page.getByRole("button", { name: "Login" }).click();

  await page.goto("/hiremind/registration");

  await page.getByLabel("First name").fill("Play");
  await page.getByLabel("Last name").fill("Wright");
  await page.getByLabel("Email").fill(email);
  await page.getByPlaceholder("Enter a secure password").fill(initialPassword);
  await page.getByLabel("Company role").fill("Recruiter");
  await page.getByLabel("Privilage role").fill("Admin");
  await page.locator("#setPasswordAfterFirstLogin").click();
  await expect(page.locator("#setPasswordAfterFirstLogin")).toBeChecked();

  await page.getByRole("button", { name: "Register user" }).click();
  await expect(page.getByText("User registered successfully.")).toBeVisible();

  await page.goto("/logout");
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(initialPassword);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/set-password\?email=/);
  await page.getByPlaceholder("Enter new password").fill(updatedPassword);
  await page.getByPlaceholder("Confirm new password").fill(updatedPassword);
  await page.getByRole("button", { name: "Update Password" }).click();

  await expect(page).toHaveURL("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(updatedPassword);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("/overview");
});
