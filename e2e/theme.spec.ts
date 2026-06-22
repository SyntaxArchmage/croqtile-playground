import { test, expect, type Page } from "@playwright/test";
import { waitForMonacoEditor, STORAGE_KEY } from "./helpers";

const DARK_COLORS = {
  bgPrimary: "#1e1e2e",
  textPrimary: "#cdd6f4",
};

const LIGHT_COLORS = {
  bgPrimary: "#eff1f5",
  textPrimary: "#4c4f69",
};

async function getCssVariable(page: Page, name: string) {
  return page.evaluate(
    (varName) => getComputedStyle(document.documentElement).getPropertyValue(varName).trim(),
    name,
  );
}

async function openSettingsMenu(page: Page) {
  await page.getByRole("button", { name: "Settings menu" }).click();
  await expect(page.getByRole("menu", { name: "Settings" })).toBeVisible();
}

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("page loads with dark theme by default", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await getCssVariable(page, "--bg-primary")).toBe(DARK_COLORS.bgPrimary);
    expect(await getCssVariable(page, "--text-primary")).toBe(DARK_COLORS.textPrimary);
  });

  test("opening settings menu shows the light theme toggle", async ({ page }) => {
    await openSettingsMenu(page);

    await expect(page.getByText("Light theme")).toBeVisible();
    const themeToggle = page.getByLabel("Toggle light theme");
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();
  });

  test("toggling light theme changes CSS variables", async ({ page }) => {
    await openSettingsMenu(page);
    await page.getByLabel("Toggle light theme").check();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await getCssVariable(page, "--bg-primary")).toBe(LIGHT_COLORS.bgPrimary);
    expect(await getCssVariable(page, "--text-primary")).toBe(LIGHT_COLORS.textPrimary);
  });

  test("theme persists across page reload (stored in localStorage)", async ({ page }) => {
    await openSettingsMenu(page);
    await page.getByLabel("Toggle light theme").check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await page.reload();
    await waitForMonacoEditor(page);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await getCssVariable(page, "--bg-primary")).toBe(LIGHT_COLORS.bgPrimary);

    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toMatchObject({ theme: "light" });
  });

  test("toggling back to dark theme restores original colors", async ({ page }) => {
    expect(await getCssVariable(page, "--bg-primary")).toBe(DARK_COLORS.bgPrimary);
    expect(await getCssVariable(page, "--text-primary")).toBe(DARK_COLORS.textPrimary);

    await openSettingsMenu(page);
    await page.getByLabel("Toggle light theme").check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await getCssVariable(page, "--bg-primary")).toBe(LIGHT_COLORS.bgPrimary);

    await page.getByLabel("Toggle light theme").uncheck();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await getCssVariable(page, "--bg-primary")).toBe(DARK_COLORS.bgPrimary);
    expect(await getCssVariable(page, "--text-primary")).toBe(DARK_COLORS.textPrimary);
  });
});
