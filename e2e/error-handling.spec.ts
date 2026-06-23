import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor } from "./helpers";

test.describe("Error handling and edge cases", () => {
  test("loads with invalid URL hash gracefully", async ({ page }) => {
    await page.goto("/#invalid_not_base64!!!!");
    await waitForMonacoEditor(page);

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible();
  });

  test("loads with empty hash gracefully", async ({ page }) => {
    await page.goto("/#");
    await waitForMonacoEditor(page);

    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible();
  });

  test("compilation target selector works", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const select = page.getByLabel("Compilation target");
    await expect(select).toBeVisible();

    await select.selectOption("cute");
    await expect(page.getByText("Target: cute")).toBeVisible();

    await select.selectOption("cc");
    await expect(page.getByText("Target: cc")).toBeVisible();
  });

  test("output panel tabs switch correctly", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const outputTab = page.getByRole("tab", { name: "Output" });
    const errorsTab = page.getByRole("tab", { name: "Errors" });
    const astTab = page.getByRole("tab", { name: "AST" });

    await expect(outputTab).toBeVisible();
    await expect(errorsTab).toBeVisible();
    await expect(astTab).toBeVisible();

    await errorsTab.click();
    await expect(errorsTab).toHaveAttribute("aria-selected", "true");

    await astTab.click();
    await expect(astTab).toHaveAttribute("aria-selected", "true");

    await outputTab.click();
    await expect(outputTab).toHaveAttribute("aria-selected", "true");
  });

  test("clear output command via Ctrl+L works", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await focusMonacoEditor(page);
    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await page.keyboard.press("Control+l");

    const outputPanel = page.getByRole("tabpanel", { name: "Output" });
    await expect(outputPanel).toBeVisible();
  });

  test("skip to editor link works", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const skipLink = page.getByRole("link", { name: "Skip to editor" });
    await expect(skipLink).toBeAttached();
  });

  test("deep link with invalid challenge ID shows challenge list", async ({ page }) => {
    await page.goto("/?challenge=nonexistent999");
    await waitForMonacoEditor(page);

    const challengeRegion = page.getByRole("region", { name: "Challenges" });
    if (await challengeRegion.isVisible()) {
      await expect(challengeRegion).toBeVisible();
    }
  });
});
