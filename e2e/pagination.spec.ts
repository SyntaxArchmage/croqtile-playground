import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Challenge list pagination", () => {
  test("loads more challenges when clicking Show more", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    const showMore = page.getByTestId("show-more-challenges");
    await expect(showMore).toBeVisible();
    await expect(showMore).toContainText("remaining");

    const challengeButtons = page.getByRole("region", { name: "Challenges" }).locator("button").filter({ has: page.locator("span.text-sm") });
    const initialCount = await challengeButtons.count();
    expect(initialCount).toBeGreaterThan(0);
    expect(initialCount).toBeLessThanOrEqual(22);

    await showMore.click();

    const afterCount = await challengeButtons.count();
    expect(afterCount).toBeGreaterThan(initialCount);
  });
});
