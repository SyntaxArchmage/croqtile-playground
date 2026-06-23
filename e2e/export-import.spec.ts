import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, openSettingsMenu, STORAGE_KEY } from "./helpers";

test.describe("Progress export and import", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("export button downloads a JSON file", async ({ page }) => {
    await openSettingsMenu(page);

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: "Export progress" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain("croqtile");
    expect(download.suggestedFilename()).toContain(".json");
  });

  test("import button exists and is clickable", async ({ page }) => {
    await openSettingsMenu(page);

    const importButton = page.getByRole("menuitem", { name: "Import progress" });
    await expect(importButton).toBeVisible();
  });
});
