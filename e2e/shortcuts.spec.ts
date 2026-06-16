import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("Ctrl+P opens command palette", async ({ page }) => {
    await expect(page.getByRole("dialog", { name: "Command palette" })).not.toBeVisible();

    await page.keyboard.press("Control+p");

    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await expect(page.getByLabel("Search commands")).toBeVisible();
    await expect(page.getByPlaceholder("Type a command...")).toBeFocused();
    await expect(palette.getByText("Run Code")).toBeVisible();
  });

  test("Ctrl+K opens command palette", async ({ page }) => {
    await expect(page.getByRole("dialog", { name: "Command palette" })).not.toBeVisible();

    await page.keyboard.press("Control+k");

    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await expect(page.getByPlaceholder("Type a command...")).toBeFocused();
  });

  test("? opens keyboard shortcuts dialog", async ({ page }) => {
    await expect(page.getByRole("dialog", { name: /keyboard shortcuts/i })).not.toBeVisible();

    await page.keyboard.press("?");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();
    await expect(dialog.getByText("Run code")).toBeVisible();
    await expect(dialog.getByText("Command palette")).toBeVisible();
  });

  test("Escape closes command palette and shortcuts dialog", async ({ page }) => {
    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(palette).not.toBeVisible();

    await page.keyboard.press("?");
    const shortcuts = page.getByRole("dialog");
    await expect(shortcuts).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(shortcuts).not.toBeVisible();
  });
});
