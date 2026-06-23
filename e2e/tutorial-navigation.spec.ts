import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Tutorial step dots and breadcrumb navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await page.getByRole("button", { name: /Hello Croqtile:/ }).click();
    await expect(page.getByRole("region", { name: /Tutorial: Hello Croqtile/ })).toBeVisible();
  });

  test("clickable step dots navigate to specific steps", async ({ page }) => {
    await expect(page.getByText("1 / 3")).toBeVisible();

    const dots = page.getByTestId("tutorial-step-dot");
    await expect(dots).toHaveCount(3);

    await dots.nth(2).click();
    await expect(page.getByText("3 / 3")).toBeVisible();

    await dots.nth(0).click();
    await expect(page.getByText("1 / 3")).toBeVisible();
  });

  test("breadcrumb navigation returns to list or first step", async ({ page }) => {
    const breadcrumb = page.getByTestId("tutorial-breadcrumb");
    await expect(breadcrumb).toBeVisible();

    await expect(breadcrumb.getByText("Tutorials")).toBeVisible();
    await expect(breadcrumb.getByText("Hello Croqtile")).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();

    await breadcrumb.getByText("Hello Croqtile").click();
    await expect(page.getByText("1 / 3")).toBeVisible();

    await breadcrumb.getByText("Tutorials").click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Hello Croqtile:/ })).toBeVisible();
  });

  test("progress bar updates as steps are visited", async ({ page }) => {
    const progressBar = page.getByRole("progressbar", { name: "Tutorial progress" });
    await expect(progressBar).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("2 / 3")).toBeVisible();

    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("3 / 3")).toBeVisible();

    await expect(page.getByTestId("tutorial-completion-message")).toBeVisible();
    await expect(page.getByText("Tutorial complete!")).toBeVisible();
  });

  test("Load Code button loads current step code into editor", async ({ page }) => {
    await page.getByRole("button", { name: "Load step code into editor" }).click();

    const editor = page.locator(".monaco-editor");
    await expect(editor.locator(".view-lines")).not.toBeEmpty();
  });
});
