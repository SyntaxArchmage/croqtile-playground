import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Example loading", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("examples dropdown has multiple options", async ({ page }) => {
    const select = page.getByLabel("Load example code");
    await expect(select).toBeVisible();

    const options = await select.locator("option").count();
    expect(options).toBeGreaterThan(10);
  });

  test("selecting Hello World example loads code into editor", async ({ page }) => {
    const select = page.getByLabel("Load example code");
    await select.selectOption("Hello World");

    const editor = page.locator(".monaco-editor").first();
    await expect(editor.locator(".view-lines")).toContainText("__co__", { timeout: 5000 });
  });

  test("selecting Parallel Loop example loads different code", async ({ page }) => {
    const select = page.getByLabel("Load example code");
    await select.selectOption("Parallel Loop");

    const editor = page.locator(".monaco-editor").first();
    await expect(editor.locator(".view-lines")).toContainText("__co__", { timeout: 5000 });
  });

  test("examples dropdown resets to placeholder after loading", async ({ page }) => {
    const select = page.getByLabel("Load example code");
    await select.selectOption("Hello World");

    await page.waitForTimeout(500);
    const selectedValue = await select.inputValue();
    expect(selectedValue).toBe("");
  });
});
