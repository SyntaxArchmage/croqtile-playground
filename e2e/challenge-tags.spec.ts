import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Challenge tag filter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);
    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();
  });

  test("topic filter buttons are visible", async ({ page }) => {
    const topicGroup = page.getByRole("group", { name: "Filter by topic" });
    await expect(topicGroup).toBeVisible();
    await expect(topicGroup.getByRole("button", { name: "All Topics" })).toBeVisible();
    await expect(topicGroup.getByRole("button", { name: "parallel" })).toBeVisible();
    await expect(topicGroup.getByRole("button", { name: "matrix" })).toBeVisible();
  });

  test("clicking a topic filter shows only matching challenges", async ({ page }) => {
    const topicGroup = page.getByRole("group", { name: "Filter by topic" });

    await topicGroup.getByRole("button", { name: "pipeline" }).click();
    await expect(topicGroup.getByRole("button", { name: "pipeline" })).toHaveAttribute("aria-pressed", "true");

    const progressSummary = page.getByTestId("challenge-progress-summary");
    await expect(progressSummary).toBeVisible();
  });

  test("tag badges are visible on challenge cards", async ({ page }) => {
    const firstCard = page.getByRole("button", { name: /Hello Threads/ });
    await expect(firstCard).toBeVisible();

    const tagBadge = firstCard.locator("span").filter({ hasText: /^(parallel|foreach|dma|pipeline|matrix|array|reduction|math|string|pattern)$/ });
    await expect(tagBadge.first()).toBeVisible();
  });

  test("All Topics resets the filter", async ({ page }) => {
    const topicGroup = page.getByRole("group", { name: "Filter by topic" });

    await topicGroup.getByRole("button", { name: "dma" }).click();
    await expect(topicGroup.getByRole("button", { name: "dma" })).toHaveAttribute("aria-pressed", "true");

    await topicGroup.getByRole("button", { name: "All Topics" }).click();
    await expect(topicGroup.getByRole("button", { name: "All Topics" })).toHaveAttribute("aria-pressed", "true");
    await expect(topicGroup.getByRole("button", { name: "dma" })).toHaveAttribute("aria-pressed", "false");
  });
});
