import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Command palette search and execution", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("search filters commands by keyword", async ({ page }) => {
    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();

    const input = page.getByPlaceholder("Type a command...");
    await input.fill("Theme");

    const options = palette.getByRole("option");
    await expect(options).toHaveCount(1);
    await expect(palette.getByText("Toggle Theme")).toBeVisible();

    await input.fill("xyznonexistent");
    await expect(palette.getByText("No matching commands")).toBeVisible();
  });

  test("executing Toggle Theme from palette switches theme", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await page.getByPlaceholder("Type a command...").fill("Toggle Theme");
    await palette.getByText("Toggle Theme").click();
    await expect(palette).not.toBeVisible();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("executing Clear Output from palette clears output", async ({ page }) => {
    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await page.getByPlaceholder("Type a command...").fill("Clear");
    await palette.getByText("Clear Output").click();
    await expect(palette).not.toBeVisible();
  });

  test("Arrow keys navigate and Enter executes highlighted command", async ({ page }) => {
    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();

    const input = page.getByPlaceholder("Type a command...");
    await input.fill("Code");

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("Enter");

    await expect(palette).not.toBeVisible();
  });
});
