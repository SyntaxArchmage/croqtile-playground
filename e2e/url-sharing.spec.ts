import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor, STORAGE_KEY } from "./helpers";

test.describe("URL sharing and restoration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload();
    await waitForMonacoEditor(page);
  });

  test("Share button updates URL hash which restores code on reload", async ({ page }) => {
    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type('__co__ void shared_fn() {\n  println("shared");\n}\n');
    await expect(editor.locator(".view-lines")).toContainText("shared_fn");

    const shareButton = page.getByRole("button", { name: "Share code" });
    await shareButton.click();
    await expect(page.getByRole("button", { name: "Link copied to clipboard" })).toContainText("Copied!");

    const urlAfterShare = await page.evaluate(() => window.location.href);
    expect(urlAfterShare).toContain("#b64:");

    await page.reload();
    await waitForMonacoEditor(page);

    const editorAfterReload = page.locator(".monaco-editor");
    await expect(editorAfterReload.locator(".view-lines")).toContainText("shared_fn");
    await expect(editorAfterReload.locator(".view-lines")).toContainText('println("shared")');
  });

  test("navigating to a URL hash restores the shared code", async ({ page }) => {
    const testCode = '__co__ void hash_restore() {\n  println("restored");\n}\n';
    const encoded = await page.evaluate((code) => {
      const binary = unescape(encodeURIComponent(code));
      const b64 = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return "b64:" + b64;
    }, testCode);

    await page.goto(`/#${encoded}`);
    await waitForMonacoEditor(page);

    const editor = page.locator(".monaco-editor");
    await expect(editor.locator(".view-lines")).toContainText("hash_restore", { timeout: 15_000 });
    await expect(editor.locator(".view-lines")).toContainText('println("restored")');
  });
});
