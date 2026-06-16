import { expect, type Page } from "@playwright/test";

export const STORAGE_KEY = "croqtile-playground-settings";

/** Clear persisted settings before navigation (use with page.goto in beforeEach). */
export async function clearSettingsStorage(page: Page) {
  await page.addInitScript((key) => {
    localStorage.removeItem(key);
  }, STORAGE_KEY);
}

/** Open the toolbar settings dropdown menu. */
export async function openSettingsMenu(page: Page) {
  await page.getByRole("button", { name: "Settings menu" }).click();
  await expect(page.getByRole("menu", { name: "Settings" })).toBeVisible();
}

/** Read parsed settings from localStorage. */
export async function getStoredSettings(page: Page): Promise<Record<string, unknown>> {
  const raw = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(raw).not.toBeNull();
  return JSON.parse(raw!) as Record<string, unknown>;
}

/** Wait for Monaco editor to finish loading asynchronously. */
export async function waitForMonacoEditor(page: Page) {
  await expect(page.getByText("Loading editor...")).toBeHidden({ timeout: 30_000 });
  const editor = page.locator(".monaco-editor");
  await expect(editor).toBeVisible({ timeout: 30_000 });
  await expect(editor.locator(".view-lines")).toBeVisible({ timeout: 30_000 });
}

/** Focus the Monaco editor content area for keyboard input. */
export async function focusMonacoEditor(page: Page) {
  const editor = page.locator(".monaco-editor");
  await editor.click();
  return editor;
}
