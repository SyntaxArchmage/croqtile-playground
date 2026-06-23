import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Monaco editor integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("editor shows line numbers", async ({ page }) => {
    const lineNumbers = page.locator(".monaco-editor .line-numbers");
    await expect(lineNumbers.first()).toBeVisible();
  });

  test("typing code updates view-lines", async ({ page }) => {
    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type("__co__ void integration_test() {}");
    await expect(editor.locator(".view-lines")).toContainText("integration_test");
  });

  test("Ctrl+Z undoes typed text", async ({ page }) => {
    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("End");
    await page.keyboard.type("_undo_test_");
    await expect(editor.locator(".view-lines")).toContainText("_undo_test_");

    await page.keyboard.press("Control+z");
    await page.keyboard.press("Control+z");
    await page.keyboard.press("Control+z");
    await expect(editor.locator(".view-lines")).not.toContainText("_undo_test_");
  });

  test("font size controls are accessible", async ({ page }) => {
    await page.getByRole("button", { name: "Settings menu" }).click();

    const decreaseBtn = page.getByRole("menuitem", { name: "Decrease font size" });
    const increaseBtn = page.getByRole("menuitem", { name: "Increase font size" });
    await expect(decreaseBtn).toBeVisible();
    await expect(increaseBtn).toBeVisible();
  });

  test("editor has visible cursor", async ({ page }) => {
    await focusMonacoEditor(page);
    const cursor = page.locator(".monaco-editor .cursor");
    await expect(cursor.first()).toBeVisible();
  });
});
