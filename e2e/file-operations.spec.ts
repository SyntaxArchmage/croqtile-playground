import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("File operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("File menu button is visible and opens dropdown", async ({ page }) => {
    const fileBtn = page.getByRole("button", { name: "File menu" });
    await expect(fileBtn).toBeVisible();
    await fileBtn.click();
    await expect(page.getByRole("menu", { name: "File" })).toBeVisible();
  });

  test("Download .co triggers file download", async ({ page }) => {
    const fileBtn = page.getByRole("button", { name: "File menu" });
    await fileBtn.click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: "Download .co" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain(".co");
  });

  test("Format code menu item is available", async ({ page }) => {
    const fileBtn = page.getByRole("button", { name: "File menu" });
    await fileBtn.click();

    const formatItem = page.getByRole("menuitem", { name: "Format code" });
    await expect(formatItem).toBeVisible();
  });

  test("Print Code menu item is available", async ({ page }) => {
    const fileBtn = page.getByRole("button", { name: "File menu" });
    await fileBtn.click();

    const printItem = page.getByRole("menuitem", { name: "Print Code" });
    await expect(printItem).toBeVisible();
  });
});
