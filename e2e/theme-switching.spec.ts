import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, openSettingsMenu, STORAGE_KEY } from "./helpers";

test.describe("Theme switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("default theme is dark", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("Ctrl+Shift+T toggles between dark and light", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.keyboard.press("Control+Shift+t");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.keyboard.press("Control+Shift+t");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme persists after reload", async ({ page }) => {
    await page.keyboard.press("Control+Shift+t");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();
    await waitForMonacoEditor(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("settings menu theme toggle matches page theme", async ({ page }) => {
    await openSettingsMenu(page);

    const themeCheckbox = page.getByLabel("Toggle light theme");
    await expect(themeCheckbox).not.toBeChecked();

    await themeCheckbox.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(themeCheckbox).toBeChecked();
  });

  test("command palette respects current theme colors", async ({ page }) => {
    await page.keyboard.press("Control+Shift+t");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(palette).not.toBeVisible();
  });
});
