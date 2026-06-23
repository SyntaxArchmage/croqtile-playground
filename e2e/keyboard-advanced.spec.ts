import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor } from "./helpers";

test.describe("Advanced keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("Ctrl+Shift+T toggles theme from any focus context", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.keyboard.press("Control+Shift+t");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("Ctrl+P opens command palette from any context", async ({ page }) => {
    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).not.toBeVisible();
  });

  test("Escape closes command palette without side effects", async ({ page }) => {
    await page.keyboard.press("Control+p");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Command palette" })).not.toBeVisible();

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible();
  });

  test("? key opens shortcuts dialog when not in editor", async ({ page }) => {
    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await page.keyboard.press("?");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
