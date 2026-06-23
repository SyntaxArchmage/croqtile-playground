import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, openSettingsMenu } from "./helpers";

test.describe("Progress visualization charts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
    await openSettingsMenu(page);
  });

  test("progress section exists with tutorial and challenge bars", async ({ page }) => {
    const progressSection = page.getByTestId("progress-section");
    await expect(progressSection).toBeVisible();
    await expect(progressSection.getByText("Tutorials")).toBeVisible();
    await expect(progressSection.getByText("Challenges")).toBeVisible();
  });

  test("difficulty chart shows E/M/H bars", async ({ page }) => {
    const chart = page.getByTestId("difficulty-chart");
    await expect(chart).toBeVisible();

    await expect(chart.getByText("E")).toBeVisible();
    await expect(chart.getByText("M")).toBeVisible();
    await expect(chart.getByText("H")).toBeVisible();
  });

  test("topic chart shows tag progress bars", async ({ page }) => {
    const topicChart = page.getByTestId("topic-chart");
    await expect(topicChart).toBeVisible();

    const bars = topicChart.locator("div").filter({ hasText: /\d+%/ });
    await expect(bars.first()).toBeVisible();
  });
});
