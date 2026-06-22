import { test, expect } from "@playwright/test";

/** Wait for Monaco editor to finish loading asynchronously. */
async function waitForMonacoEditor(page: import("@playwright/test").Page) {
  await expect(page.getByText("Loading editor...")).toBeHidden({ timeout: 30_000 });
  const editor = page.locator(".monaco-editor");
  await expect(editor).toBeVisible({ timeout: 30_000 });
  await expect(editor.locator(".view-lines")).toBeVisible({ timeout: 30_000 });
}

test.describe("Croqtile Playground smoke tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("home page has Croqtile in the title", async ({ page }) => {
    await expect(page).toHaveTitle(/Croqtile/i);
  });

  test("toolbar renders with Run button", async ({ page }) => {
    await expect(page.getByRole("navigation", { name: "Playground toolbar" })).toBeVisible();
    const runBtn = page.getByRole("navigation", { name: "Playground toolbar" }).getByRole("button", { name: "Run code" });
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toContainText("Run");
  });

  test("Monaco editor area loads", async ({ page }) => {
    const editor = page.locator(".monaco-editor");
    await expect(editor).toBeVisible();
    await expect(editor.locator(".view-lines")).toBeVisible();
    await expect(editor.locator(".margin")).toBeVisible();
  });

  test("output panel exists with tabs", async ({ page }) => {
    const tablist = page.getByRole("tablist", { name: "Output panels" });
    await expect(tablist).toBeVisible();
    await expect(page.getByRole("tab", { name: "Output" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Errors" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "AST" })).toBeVisible();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  });

  test("loads an example from the dropdown", async ({ page }) => {
    const exampleSelect = page.getByLabel("Load example code");
    await expect(exampleSelect).toBeVisible();

    await exampleSelect.selectOption("parallel");

    const editor = page.locator(".monaco-editor");
    await expect(editor.locator(".view-lines")).toContainText("parallel_demo");
  });

  test("Share button copies link and shows feedback", async ({ page }) => {
    const shareButton = page.getByRole("button", { name: "Share code" });
    await expect(shareButton).toBeVisible();
    await expect(shareButton).toContainText("Share");

    await shareButton.click();

    await expect(page.getByRole("button", { name: "Link copied to clipboard" })).toContainText("Copied!");
  });

  test("? keyboard shortcut opens shortcuts dialog", async ({ page }) => {
    await expect(page.getByRole("dialog", { name: /keyboard shortcuts/i })).not.toBeVisible();

    await page.keyboard.press("?");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();
    await expect(dialog.getByText("Run code")).toBeVisible();
    await expect(dialog.getByText("Command palette")).toBeVisible();
  });

  test("Ctrl+P opens command palette", async ({ page }) => {
    await expect(page.getByRole("dialog", { name: "Command palette" })).not.toBeVisible();

    await page.keyboard.press("Control+p");

    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await expect(page.getByLabel("Search commands")).toBeVisible();
    await expect(page.getByPlaceholder("Type a command...")).toBeFocused();
    await expect(palette.getByText("Run Code")).toBeVisible();
    await expect(palette.getByText("Share Link")).toBeVisible();
  });
});
