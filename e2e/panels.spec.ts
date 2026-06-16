import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Tutorial panel", () => {
  test("opens the tutorial panel via toolbar", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();

    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();
    await expect(page.getByText("Tutorials")).toBeVisible();
    await expect(page.getByLabel("Search tutorials")).toBeVisible();
    await expect(page.getByRole("button", { name: /Hello Croqtile:/ })).toBeVisible();
  });

  test("navigates through a tutorial with Next and Prev", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();

    await expect(page.getByRole("region", { name: /Tutorial: Hello Croqtile/ })).toBeVisible();
    await expect(page.getByText("1 / 3")).toBeVisible();
    await expect(page.getByRole("heading", { name: "The __co__ keyword" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous step" })).toBeDisabled();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Printing output" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous step" })).toBeEnabled();

    await page.getByRole("button", { name: "Previous step" }).click();
    await expect(page.getByText("1 / 3")).toBeVisible();
    await expect(page.getByRole("heading", { name: "The __co__ keyword" })).toBeVisible();
  });

  test('loads code when clicking "Try it" in a tutorial step', async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();
    await page.getByRole("button", { name: "Next step" }).click();

    await expect(page.getByRole("heading", { name: "Printing output" })).toBeVisible();
    await page.getByRole("button", { name: "Try this code example" }).click();

    const editor = page.locator(".monaco-editor");
    await expect(editor.locator(".view-lines")).toContainText("greet");
    await expect(editor.locator(".view-lines")).toContainText('println("Hello,", "world!")');
  });

  test("deep link opens tutorial at the specified step", async ({ page }) => {
    await page.goto("/?tutorial=ch01&step=2");
    await waitForMonacoEditor(page);

    await expect(page.getByRole("region", { name: /Tutorial: Hello Croqtile/ })).toBeVisible();
    await expect(page.getByText("2 / 3")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Printing output" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Toggle tutorial panel" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("Challenge panel", () => {
  test("opens the challenge panel via toolbar", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();

    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();
    await expect(page.getByText("Challenges")).toBeVisible();
    await expect(page.getByLabel("Search challenges")).toBeVisible();
    await expect(page.getByRole("button", { name: /Hello Threads,/ })).toBeVisible();
  });

  test("navigates the challenge list and shows a challenge description", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    await page.getByRole("button", { name: /Hello Threads,/ }).click();

    await expect(page.getByRole("region", { name: /Challenge: Hello Threads/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();
    await expect(page.getByText(/Write a function that prints "Hello from thread X"/)).toBeVisible();
    await expect(page.getByText("Tests")).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset code to starter template" })).toBeVisible();

    await page.getByRole("button", { name: "Back to challenges list" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Hello Threads,/ })).toBeVisible();
  });

  test("filters challenges with All, To Do, and Passed buttons", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();

    const statusGroup = page.getByRole("group", { name: "Filter by status" });

    await expect(page.getByRole("button", { name: /Hello Threads,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Parallel Initialize,/ })).toBeVisible();

    await statusGroup.getByRole("button", { name: "To Do" }).click();
    await expect(statusGroup.getByRole("button", { name: "To Do" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Hello Threads,/ })).toBeVisible();

    await statusGroup.getByRole("button", { name: "Passed" }).click();
    await expect(statusGroup.getByRole("button", { name: "Passed" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("No challenges match")).toBeVisible();

    await statusGroup.getByRole("button", { name: "All" }).click();
    await expect(statusGroup.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Hello Threads,/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Parallel Initialize,/ })).toBeVisible();
  });

  test("deep link opens a challenge detail view", async ({ page }) => {
    await page.goto("/?challenge=c01");
    await waitForMonacoEditor(page);

    await expect(page.getByRole("region", { name: /Challenge: Hello Threads/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();
    await expect(page.getByText(/Use `parallel \{i\} by \[4\]` and `println\(\)`/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Toggle challenge panel" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const editor = page.locator(".monaco-editor");
    await expect(editor.locator(".view-lines")).toContainText("hello_threads");
  });
});
