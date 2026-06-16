import { expect, type Page } from "@playwright/test";

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
