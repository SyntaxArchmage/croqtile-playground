import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Challenge hints", () => {
  test("shows progressive hints one at a time", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    await page.getByRole("button", { name: /Hello Threads,/ }).click();
    await expect(page.getByRole("heading", { name: "Hello Threads" })).toBeVisible();

    const hintSection = page.getByTestId("hint-section");
    const showHintBtn = page.getByRole("button", { name: "Show hint" });

    if (await showHintBtn.isVisible()) {
      await showHintBtn.click();

      await expect(page.getByTestId("hint-counter")).toBeVisible();
      await expect(page.getByTestId("hint-content")).toBeVisible();

      const nextHintBtn = page.getByTestId("next-hint-button");
      if (await nextHintBtn.isVisible()) {
        await nextHintBtn.click();
        await expect(page.getByTestId("hint-counter")).toContainText("2 of");
      }
    } else {
      expect(await hintSection.count()).toBe(0);
    }
  });
});
