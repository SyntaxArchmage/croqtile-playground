import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Output panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("output panel is visible with tabs", async ({ page }) => {
    const tablist = page.getByRole("tablist", { name: "Output panels" });
    await expect(tablist).toBeVisible();

    await expect(page.getByRole("tab", { name: "Output" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Errors" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "AST" })).toBeVisible();
  });

  test("default output panel shows placeholder text", async ({ page }) => {
    const panel = page.getByRole("tabpanel", { name: "Output" });
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/Run.*Compile.*output/i);
  });

  test("resize handle is visible and accessible", async ({ page }) => {
    const resizeHandle = page.getByRole("separator", { name: "Resize output panel height" });
    await expect(resizeHandle).toBeVisible();
  });

  test("switching to Errors tab shows error content area", async ({ page }) => {
    await page.getByRole("tab", { name: "Errors" }).click();
    const panel = page.getByRole("tabpanel", { name: "Errors" });
    await expect(panel).toBeVisible();
  });

  test("switching to AST tab shows AST content area", async ({ page }) => {
    await page.getByRole("tab", { name: "AST" }).click();
    const panel = page.getByRole("tabpanel", { name: "AST" });
    await expect(panel).toBeVisible();
  });
});
