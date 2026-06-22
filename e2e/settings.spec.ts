import { test, expect } from "@playwright/test";
import {
  getStoredSettings,
  openSettingsMenu,
  waitForMonacoEditor,
  STORAGE_KEY,
} from "./helpers";

test.describe("Settings persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("font size persists after reload", async ({ page }) => {
    await openSettingsMenu(page);

    const increaseFont = page.getByLabel("Increase font size");
    await increaseFont.click();
    await increaseFont.click();
    await expect(page.getByRole("menu", { name: "Settings" })).toContainText("16");

    const stored = await getStoredSettings(page);
    expect(stored).toMatchObject({ fontSize: 16 });

    await page.reload();
    await waitForMonacoEditor(page);

    await openSettingsMenu(page);
    await expect(page.getByRole("menu", { name: "Settings" })).toContainText("16");

    const storedAfterReload = await getStoredSettings(page);
    expect(storedAfterReload).toMatchObject({ fontSize: 16 });
  });

  test("theme toggle persists after reload", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await openSettingsMenu(page);
    await page.getByLabel("Toggle light theme").check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();
    await waitForMonacoEditor(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await getStoredSettings(page)).toMatchObject({ theme: "light" });

    await openSettingsMenu(page);
    await page.getByLabel("Toggle light theme").uncheck();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await waitForMonacoEditor(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await getStoredSettings(page)).toMatchObject({ theme: "dark" });
  });

  test("tab size persists after reload", async ({ page }) => {
    await openSettingsMenu(page);

    const increaseTab = page.getByLabel("Increase tab size");
    await increaseTab.click();
    await increaseTab.click();
    await expect(page.getByRole("menu", { name: "Settings" })).toContainText("4");

    expect(await getStoredSettings(page)).toMatchObject({ tabSize: 4 });

    await page.reload();
    await waitForMonacoEditor(page);

    await openSettingsMenu(page);
    await expect(page.getByRole("menu", { name: "Settings" })).toContainText("4");
    expect(await getStoredSettings(page)).toMatchObject({ tabSize: 4 });
  });
});
