import { test } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

const DEMO_EXAMPLES = [
  "hello",
  "array-init",
  "histogram",
  "matmul",
  "fibonacci",
  "while-loop",
  "2d-parallel",
  "stencil",
  "nested-parallel",
  "math-builtins",
];

test("Screenshot demo of example runs", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(3000);

  const overlay = page.locator(".welcome-overlay");
  if (await overlay.isVisible().catch(() => false)) {
    await page.mouse.click(10, 10);
    await page.waitForTimeout(500);
  }

  const exampleSelect = page.locator(
    'select[aria-label="Load example code"]'
  );
  await exampleSelect.waitFor({ state: "visible", timeout: 10000 });

  for (const exId of DEMO_EXAMPLES) {
    await exampleSelect.selectOption(exId);
    await page.waitForTimeout(500);

    const runBtn = page.locator(
      'button.toolbar-btn-run[aria-label="Run code"]'
    );
    await runBtn.click();

    try {
      await page.waitForFunction(
        () => {
          const btn = document.querySelector(
            'button.toolbar-btn-run[aria-label="Run code"]'
          ) as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 15000 }
      );
    } catch {
      console.log(`TIMEOUT: ${exId}`);
    }

    await page.waitForTimeout(300);
    await page.locator("#output-tab").click();
    await page.waitForTimeout(200);

    await page.screenshot({
      path: `playwright-results/demo-${exId}.png`,
      fullPage: false,
    });
    console.log(`Screenshot saved: demo-${exId}.png`);
  }
});
