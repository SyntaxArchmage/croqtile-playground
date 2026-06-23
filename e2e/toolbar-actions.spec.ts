import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("Toolbar actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("Compile button is visible and clickable", async ({ page }) => {
    const compileBtn = page.getByRole("button", { name: "Compile code" });
    await expect(compileBtn).toBeVisible();
    await compileBtn.click();
  });

  test("AST button is visible and clickable", async ({ page }) => {
    const astBtn = page.getByRole("button", { name: "Dump AST" });
    await expect(astBtn).toBeVisible();
    await astBtn.click();

    await expect(page.getByRole("tab", { name: "AST" })).toHaveAttribute("aria-selected", "true");
  });

  test("Share button copies link and shows feedback", async ({ page }) => {
    const shareBtn = page.getByRole("button", { name: "Share code" });
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();

    await expect(page.getByRole("button", { name: "Link copied to clipboard" })).toContainText("Copied!");
  });

  test("tutorial and challenge panel toggles work", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).not.toBeVisible();

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).not.toBeVisible();
  });

  test("Run button is enabled", async ({ page }) => {
    const runBtn = page.getByRole("button", { name: "Run code" }).first();
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeEnabled();
  });
});
