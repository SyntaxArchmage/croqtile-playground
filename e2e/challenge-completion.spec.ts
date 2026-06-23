import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Challenge completion flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();
  });

  test("selecting a challenge shows detail view with description and tests", async ({ page }) => {
    await page.getByRole("button", { name: /Hello Threads/ }).click();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();

    await expect(page.getByText("Tests")).toBeVisible();
  });

  test("challenge detail shows starter code loaded notification", async ({ page }) => {
    await page.getByRole("button", { name: /Hello Threads/ }).click();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();

    const editor = page.locator(".monaco-editor").first();
    await expect(editor.locator(".view-lines")).not.toBeEmpty();
  });

  test("back button returns to challenge list", async ({ page }) => {
    await page.getByRole("button", { name: /Hello Threads/ }).click();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();

    const backBtn = page.getByRole("button", { name: /back|Back to challenges/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    await expect(page.getByRole("button", { name: /Hello Threads/ })).toBeVisible();
  });

  test("challenge progress counter updates", async ({ page }) => {
    const summary = page.getByTestId("challenge-progress-summary");
    await expect(summary).toBeVisible();
    await expect(summary).toContainText(/\d+\/\d+ passed/);
  });

  test("deep link opens challenge directly", async ({ page }) => {
    await page.goto("/?challenge=c01");
    await waitForMonacoEditor(page);

    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();
  });
});
