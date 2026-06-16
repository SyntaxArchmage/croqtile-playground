import { test, expect } from "@playwright/test";
import { waitForMonacoEditor, focusMonacoEditor } from "./helpers";

test.describe("Monaco editor", () => {
  test("typing code updates the editor content", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type(`__co__ void e2e_typed() {
  println("typed in e2e");
}
`);

    await expect(editor.locator(".view-lines")).toContainText("e2e_typed");
    await expect(editor.locator(".view-lines")).toContainText('println("typed in e2e")');
  });

  test("Format Code command via command palette reformats code", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const editor = await focusMonacoEditor(page);
    await page.keyboard.press("Control+a");
    await page.keyboard.type(`__co__ void fmt_e2e() {
println("needs indent");
}
`);

    await page.keyboard.press("Control+p");
    const palette = page.getByRole("dialog", { name: "Command palette" });
    await expect(palette).toBeVisible();
    await page.getByPlaceholder("Type a command...").fill("Format Code");
    await palette.getByText("Format Code").click();
    await expect(palette).not.toBeVisible();

    await expect(editor.locator(".view-lines")).toContainText('  println("needs indent")');
  });

  test("loads different examples from the dropdown", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const exampleSelect = page.getByLabel("Load example code");
    const editor = page.locator(".monaco-editor");

    await exampleSelect.selectOption("hello");
    await expect(editor.locator(".view-lines")).toContainText('println("Hello from Croqtile!")');

    await exampleSelect.selectOption("parallel");
    await expect(editor.locator(".view-lines")).toContainText("parallel_demo");
    await expect(editor.locator(".view-lines")).toContainText("parallel {i} by [4]");

    await exampleSelect.selectOption("dma");
    await expect(editor.locator(".view-lines")).toContainText("dma_demo");
    await expect(editor.locator(".view-lines")).toContainText("dma(A[0:16], B[0:16])");
  });
});

test.describe("Output panel", () => {
  test("output panel tabs switch and show the correct panel", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    const placeholder = page.getByText(/Click .Run. or .Compile. to see output/);
    const outputTab = page.getByRole("tab", { name: "Output" });
    const errorsTab = page.getByRole("tab", { name: "Errors" });
    const astTab = page.getByRole("tab", { name: "AST" });
    const tabpanel = page.getByRole("tabpanel");

    await expect(outputTab).toHaveAttribute("aria-selected", "true");
    await expect(tabpanel).toBeVisible();
    await expect(placeholder).toBeVisible();

    await errorsTab.click();
    await expect(errorsTab).toHaveAttribute("aria-selected", "true");
    await expect(outputTab).toHaveAttribute("aria-selected", "false");
    await expect(placeholder).toBeVisible();

    await astTab.click();
    await expect(astTab).toHaveAttribute("aria-selected", "true");
    await expect(errorsTab).toHaveAttribute("aria-selected", "false");
    await expect(placeholder).toBeVisible();

    await outputTab.click();
    await expect(outputTab).toHaveAttribute("aria-selected", "true");
    await expect(astTab).toHaveAttribute("aria-selected", "false");
    await expect(placeholder).toBeVisible();
  });
});

test.describe("Resizable split", () => {
  test("resizes the split panel via keyboard on the separator", async ({ page }) => {
    await page.goto("/");
    await waitForMonacoEditor(page);

    await page.getByRole("button", { name: "Toggle tutorial panel" }).click();
    await expect(page.getByRole("region", { name: "Tutorials" })).toBeVisible();

    const separator = page.getByRole("separator", { name: "Resize panels" });
    await expect(separator).toBeVisible();

    const initialRatio = Number(await separator.getAttribute("aria-valuenow"));
    expect(initialRatio).toBeGreaterThanOrEqual(20);
    expect(initialRatio).toBeLessThanOrEqual(60);

    await separator.focus();
    await page.keyboard.press("ArrowRight");
    const widerRatio = Number(await separator.getAttribute("aria-valuenow"));
    expect(widerRatio).toBeGreaterThan(initialRatio);

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    const narrowerRatio = Number(await separator.getAttribute("aria-valuenow"));
    expect(narrowerRatio).toBeLessThan(widerRatio);
    expect(narrowerRatio).toBeGreaterThanOrEqual(20);
  });
});
