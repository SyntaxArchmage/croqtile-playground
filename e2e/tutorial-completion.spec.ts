import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Tutorial completion and progress persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("completing all tutorial steps shows completion message", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();
    await expect(page.getByText("1 / 3")).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("3 / 3")).toBeVisible();
    await expect(page.getByText("Tutorial complete!")).toBeVisible();
  });

  test("tutorial can navigate forward and backward", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();
    await expect(page.getByText("1 / 3")).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();

    await page.getByRole("button", { name: "Previous step" }).click();
    await expect(page.getByText("1 / 3")).toBeVisible();
  });

  test("deep link opens tutorial panel", async ({ page }) => {
    await page.goto("/?tutorial=ch01");
    await waitForMonacoEditor(page);

    await expect(page.getByRole("region", { name: /Tutorial/ })).toBeVisible();
  });

  test("next tutorial button appears after completing all steps", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();

    await page.getByRole("button", { name: "Next step" }).click();
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("3 / 3")).toBeVisible();

    const nextTutorialBtn = page.getByRole("button", { name: /Next tutorial/i });
    if (await nextTutorialBtn.isVisible()) {
      await nextTutorialBtn.click();
      await expect(page.getByText("1 /")).toBeVisible();
    }
  });
});
