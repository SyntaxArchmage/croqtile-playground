import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

test("Run all examples via WASM mockRun", async ({ page }) => {
  await page.goto("/");

  // Wait for page and dismiss overlay
  await page.waitForTimeout(3000);
  const overlay = page.locator(".welcome-overlay");
  if (await overlay.isVisible().catch(() => false)) {
    await page.mouse.click(10, 10);
    await page.waitForTimeout(500);
  }

  // Wait for example select to be visible
  const exampleSelect = page.locator('select[aria-label="Load example code"]');
  await exampleSelect.waitFor({ state: "visible", timeout: 10000 });

  const exampleOptions = await page.$$eval(
    'select[aria-label="Load example code"] option[value]:not([value=""])',
    (opts) => opts.map((o) => ({ id: (o as HTMLOptionElement).value, name: o.textContent || "" }))
  );

  console.log(`Found ${exampleOptions.length} examples to test`);

  const results: { id: string; name: string; output: string; errors: string; status: string }[] = [];

  for (const ex of exampleOptions) {
    await exampleSelect.selectOption(ex.id);
    await page.waitForTimeout(300);

    const runBtn = page.locator('button.toolbar-btn-run[aria-label="Run code"]');
    await runBtn.click();

    try {
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button.toolbar-btn-run[aria-label="Run code"]') as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 15000 }
      );
    } catch {
      results.push({ id: ex.id, name: ex.name, output: "", errors: "TIMEOUT", status: "TIMEOUT" });
      continue;
    }

    await page.waitForTimeout(200);

    // Read output
    await page.locator("#output-tab").click();
    await page.waitForTimeout(100);
    const output = (await page.locator("#output-tabpanel pre").textContent().catch(() => "")) || "";

    // Read errors
    await page.locator("#errors-tab").click();
    await page.waitForTimeout(100);
    const errors = (await page.locator("#output-tabpanel pre").textContent().catch(() => "")) || "";

    const hasError =
      errors.includes("syntax error") ||
      errors.includes("Parsing failed") ||
      errors.includes("Interpretation failed") ||
      errors.includes("Interpreter error") ||
      errors.includes("Exception:");

    const status = hasError ? "FAIL" : output.trim().length > 0 ? "OK" : "NO_OUTPUT";
    results.push({
      id: ex.id,
      name: ex.name,
      output: output.substring(0, 100).replace(/\n/g, " | "),
      errors: errors.substring(0, 200),
      status,
    });
  }

  const ok = results.filter((r) => r.status === "OK");
  const fail = results.filter((r) => r.status === "FAIL");
  const noOutput = results.filter((r) => r.status === "NO_OUTPUT");
  const timeout = results.filter((r) => r.status === "TIMEOUT");

  console.log(`\n${"=".repeat(60)}`);
  console.log(`OK: ${ok.length}  FAIL: ${fail.length}  NO_OUTPUT: ${noOutput.length}  TIMEOUT: ${timeout.length}`);
  console.log(`${"=".repeat(60)}\n`);

  for (const r of fail) {
    console.log(`  FAIL: ${r.name} (${r.id})`);
    console.log(`    Errors: ${r.errors.substring(0, 150)}`);
  }
  for (const r of noOutput) {
    console.log(`  NO_OUTPUT: ${r.name} (${r.id}) errors: ${r.errors.substring(0, 100)}`);
  }
  for (const r of timeout) {
    console.log(`  TIMEOUT: ${r.name} (${r.id})`);
  }
  for (const r of ok) {
    console.log(`  OK: ${r.name} (${r.id}) → ${r.output.substring(0, 60)}`);
  }

  expect(fail.length, `${fail.length} examples failed`).toBe(0);
});
