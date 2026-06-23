import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, openSettingsMenu, STORAGE_KEY } from "./helpers";

test.describe("Reset progress", () => {
  test("requires double-click confirmation to reset progress", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);

    await openSettingsMenu(page);

    const resetButton = page.getByRole("menuitem", {
      name: "Reset all tutorial and challenge progress",
    });
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toContainText("Reset progress");

    await resetButton.click();

    const confirmButton = page.getByRole("menuitem", {
      name: "Confirm reset of all tutorial and challenge progress",
    });
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toContainText("Confirm?");
  });

  test("reset confirmation times out after 3 seconds", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);

    await openSettingsMenu(page);

    const resetButton = page.getByRole("menuitem", {
      name: "Reset all tutorial and challenge progress",
    });
    await resetButton.click();
    await expect(page.getByText("Confirm?")).toBeVisible();

    await page.waitForTimeout(3500);

    await expect(page.getByText("Reset progress")).toBeVisible();
  });
});
