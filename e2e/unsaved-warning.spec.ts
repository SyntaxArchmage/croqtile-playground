import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Unsaved changes warning", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("shows unsaved indicator after editing code", async ({ page }) => {
    await expect(page.locator('[aria-label="Unsaved changes"]')).not.toBeVisible();

    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type("__co__ void modified() {}");
    await expect(editor.locator(".view-lines")).toContainText("modified");

    await expect(page.locator('[aria-label="Unsaved changes"]')).toBeVisible();
  });

  test("unsaved indicator style is amber/warning color", async ({ page }) => {
    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type("__co__ void color_test() {}");
    await expect(editor.locator(".view-lines")).toContainText("color_test");

    const indicator = page.locator('[aria-label="Unsaved changes"]');
    await expect(indicator).toBeVisible();
    await expect(indicator).toContainText("Unsaved");
  });
});
