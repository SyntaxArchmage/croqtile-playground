import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("page has app title visible in toolbar", async ({ page }) => {
    const toolbar = page.getByRole("navigation", { name: "Playground toolbar" });
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByText("Croqtile")).toBeVisible();
    await expect(toolbar.getByText("Playground")).toBeVisible();
  });

  test("all interactive elements have accessible names", async ({ page }) => {
    const runButton = page.getByRole("button", { name: "Run code" }).first();
    await expect(runButton).toBeVisible();

    const settingsButton = page.getByRole("button", { name: "Settings menu" });
    await expect(settingsButton).toBeVisible();

    const shareButton = page.getByRole("button", { name: "Share code" });
    await expect(shareButton).toBeVisible();
  });

  test("keyboard navigation works on toolbar buttons", async ({ page }) => {
    const fileBtn = page.getByRole("button", { name: "File menu" });
    await fileBtn.focus();
    await expect(fileBtn).toBeFocused();

    await page.keyboard.press("Tab");
    const nextFocused = page.locator(":focus");
    await expect(nextFocused).toBeVisible();
  });

  test("ARIA regions are properly labeled", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();

    const closeBtn = page.getByRole("button", { name: /close.*tutorial|tutorial.*close/i });
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
    } else {
      await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    }

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();
  });

  test("progress bars have proper ARIA attributes", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();

    const progressBar = page.getByRole("progressbar").first();
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute("aria-valuenow", /.*/);
  });

  test("shortcuts dialog is modal with proper role", async ({ page }) => {
    // Focus body first to ensure ? isn't intercepted by Monaco
    await page.locator("body").click({ position: { x: 10, y: 10 } });
    await page.keyboard.press("?");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(page.getByText("Keyboard Shortcuts")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
