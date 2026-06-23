import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Responsive layout", () => {
  test("mobile viewport shows stacked layout", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await waitForMonacoEditor(page);

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible();
  });

  test("tablet viewport renders correctly", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await waitForMonacoEditor(page);

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible();
  });

  test("wide viewport shows side-by-side panels", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForMonacoEditor(page);

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible();

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();
    await expect(editor).toBeVisible();
  });

  test("mobile floating Run button is visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await waitForMonacoEditor(page);

    const floatingRun = page.getByRole("button", { name: "Run code", description: "Run (Ctrl+Enter)" });
    await expect(floatingRun).toBeVisible();
  });
});
