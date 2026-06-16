import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Challenge flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
  });

  test("selecting a challenge loads starter code and shows test results", async ({ page }) => {
    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    await page.getByRole("button", { name: /Hello Threads,/ }).click();

    await expect(page.getByRole("region", { name: /Challenge: Hello Threads/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();

    const editor = page.locator(".monaco-editor");
    await expect(editor.locator(".view-lines")).toContainText("hello_threads");
    await expect(editor.locator(".view-lines")).toContainText("parallel {i} by [4]");

    const testResults = page.getByRole("list", { name: "Test results" });
    await expect(testResults).toBeVisible();
    await expect(page.getByText("Tests")).toBeVisible();
    await expect(page.getByTestId("test-result")).toHaveCount(3);
    await expect(testResults.getByText("Thread 0 prints its greeting")).toBeVisible();
    await expect(testResults.getByText("All 4 threads print in order")).toBeVisible();
  });
});
