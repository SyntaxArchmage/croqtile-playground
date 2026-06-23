import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor } from "./helpers";

test.describe("Status bar information", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("shows cursor position Ln and Col", async ({ page }) => {
    await focusMonacoEditor(page);

    await expect(page.getByText(/Ln \d+, Col \d+/)).toBeVisible();
  });

  test("shows line count", async ({ page }) => {
    await expect(page.getByText(/\d+ lines/)).toBeVisible();
  });

  test("shows target indicator", async ({ page }) => {
    await expect(page.getByText("Target: cc")).toBeVisible();

    await page.getByLabel("Compilation target").selectOption("cute");
    await expect(page.getByText("Target: cute")).toBeVisible();
  });

  test("shows compiler status indicator", async ({ page }) => {
    const statusBar = page.locator("div").filter({ hasText: /Ready|Loading WASM|Error/ }).last();
    await expect(statusBar).toBeVisible();
  });

  test("shows keyboard shortcuts hint", async ({ page }) => {
    await expect(page.getByText("Ctrl+Enter: Run")).toBeVisible();
  });

  test("shows unsaved indicator after editing", async ({ page }) => {
    await expect(page.getByText("Unsaved")).not.toBeVisible();

    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type("__co__ void unsaved_test() {}");
    await expect(editor.locator(".view-lines")).toContainText("unsaved_test");

    await expect(page.locator('[aria-label="Unsaved changes"]')).toBeVisible();
  });

  test("shows progress summary when challenge panel is open", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    await expect(page.getByText(/\d+\/\d+ challenges passed/)).toBeVisible();
  });

  test("shows progress summary when tutorial panel is open", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();

    await expect(page.getByText(/\d+\/\d+ tutorials completed/)).toBeVisible();
  });
});
