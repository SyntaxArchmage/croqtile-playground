import { test, expect } from "@playwright/test";
import { waitForMonacoEditor } from "./helpers";

test.describe("Tutorial list search", () => {
  test("search filters tutorials by title", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();

    const searchInput = page.getByLabel("Search tutorials");
    await expect(searchInput).toBeVisible();

    await expect(page.getByRole("button", { name: /Hello Croqtile:/ })).toBeVisible();

    await searchInput.fill("Parallel");
    await expect(page.getByRole("button", { name: /Parallel Execution:/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Hello Croqtile:/ })).not.toBeVisible();

    await searchInput.fill("zzzznotfound");
    await expect(page.getByText("No tutorials match")).toBeVisible();

    await searchInput.clear();
    await expect(page.getByRole("button", { name: /Hello Croqtile:/ })).toBeVisible();
  });
});

test.describe("Challenge list search", () => {
  test("search filters challenges by title", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    const searchInput = page.getByLabel("Search challenges");
    await expect(searchInput).toBeVisible();

    await expect(page.getByRole("button", { name: /Hello Threads/ })).toBeVisible();

    await searchInput.fill("Dot Product");
    await expect(page.getByRole("button", { name: /Dot Product/ }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Hello Threads/ })).not.toBeVisible();

    await searchInput.fill("zzzznotfound");
    await expect(page.getByText("No challenges match")).toBeVisible();

    await searchInput.clear();
    await expect(page.getByRole("button", { name: /Hello Threads/ })).toBeVisible();
  });

  test("difficulty filter works with search", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle challenge panel" }).click();
    await expect(page.getByRole("region", { name: "Challenges" })).toBeVisible();

    const difficultyGroup = page.getByRole("group", { name: "Filter by difficulty" });
    await difficultyGroup.getByRole("button", { name: /Hard/ }).click();
    await expect(difficultyGroup.getByRole("button", { name: /Hard/ })).toHaveAttribute("aria-pressed", "true");

    await expect(page.getByText(/\d+\/\d+ passed/)).toBeVisible();
  });
});
