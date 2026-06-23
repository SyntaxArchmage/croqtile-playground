import { test, expect } from "@playwright/test";
import {
  waitForMonacoEditor,
  openSettingsMenu,
  getStoredSettings,
  STORAGE_KEY,
} from "./helpers";

test.describe("Extra settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("word wrap toggle persists after reload", async ({ page }) => {
    await openSettingsMenu(page);

    const wordWrapCheckbox = page.getByLabel("Toggle word wrap");
    const initialChecked = await wordWrapCheckbox.isChecked();
    await wordWrapCheckbox.click();
    const newChecked = !initialChecked;

    const stored = await getStoredSettings(page);
    expect(stored.wordWrap).toBe(newChecked);

    await page.reload();
    await waitForMonacoEditor(page);

    await openSettingsMenu(page);
    if (newChecked) {
      await expect(page.getByLabel("Toggle word wrap")).toBeChecked();
    } else {
      await expect(page.getByLabel("Toggle word wrap")).not.toBeChecked();
    }
  });

  test("minimap toggle persists after reload", async ({ page }) => {
    await openSettingsMenu(page);

    const minimapCheckbox = page.getByLabel("Toggle minimap");
    const initialChecked = await minimapCheckbox.isChecked();
    await minimapCheckbox.click();
    const newChecked = !initialChecked;

    const stored = await getStoredSettings(page);
    expect(stored.minimap).toBe(newChecked);

    await page.reload();
    await waitForMonacoEditor(page);

    await openSettingsMenu(page);
    if (newChecked) {
      await expect(page.getByLabel("Toggle minimap")).toBeChecked();
    } else {
      await expect(page.getByLabel("Toggle minimap")).not.toBeChecked();
    }
  });

  test("font family selector persists after reload", async ({ page }) => {
    await openSettingsMenu(page);

    const fontSelect = page.getByLabel("Editor font family");
    await expect(fontSelect).toBeVisible();

    const options = await fontSelect.locator("option").allTextContents();
    expect(options.length).toBeGreaterThanOrEqual(2);

    if (options.length >= 2) {
      await fontSelect.selectOption({ index: 1 });
      const stored = await getStoredSettings(page);
      expect(stored.fontFamily).toBeTruthy();

      await page.reload();
      await waitForMonacoEditor(page);
      const storedAfter = await getStoredSettings(page);
      expect(storedAfter.fontFamily).toBe(stored.fontFamily);
    }
  });
});
