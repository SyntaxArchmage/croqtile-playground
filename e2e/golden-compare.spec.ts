import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { resolve } from "path";

test.use({ viewport: { width: 1440, height: 900 } });

const goldenPath = resolve(__dirname, "../src/__tests__/golden/mock-outputs.json");
const goldens: Record<string, string> = JSON.parse(
  readFileSync(goldenPath, "utf-8")
);

const KNOWN_WASM_SKIP = new Set([
  "async-dma",
]);

function sortedLines(text: string): string {
  return text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .sort()
    .join("\n");
}

test("WASM output matches native golden output for all examples", async ({
  page,
}) => {
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

  const exampleOptions = await page.$$eval(
    'select[aria-label="Load example code"] option[value]:not([value=""])',
    (opts) =>
      opts.map((o) => ({
        id: (o as HTMLOptionElement).value,
        name: o.textContent || "",
      }))
  );

  const mismatches: {
    id: string;
    name: string;
    wasmOutput: string;
    goldenOutput: string;
  }[] = [];

  for (const ex of exampleOptions) {
    if (!goldens[ex.id] || KNOWN_WASM_SKIP.has(ex.id)) continue;

    await exampleSelect.selectOption(ex.id);
    await page.waitForTimeout(300);

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
      mismatches.push({
        id: ex.id,
        name: ex.name,
        wasmOutput: "TIMEOUT",
        goldenOutput: goldens[ex.id].substring(0, 100),
      });
      continue;
    }

    await page.waitForTimeout(200);
    await page.locator("#output-tab").click();
    await page.waitForTimeout(100);
    const wasmOutput =
      (await page
        .locator("#output-tabpanel pre")
        .textContent()
        .catch(() => "")) || "";

    const wasmSorted = sortedLines(wasmOutput);
    const goldenSorted = sortedLines(goldens[ex.id]);

    if (wasmSorted !== goldenSorted) {
      mismatches.push({
        id: ex.id,
        name: ex.name,
        wasmOutput: wasmOutput.substring(0, 200),
        goldenOutput: goldens[ex.id].substring(0, 200),
      });
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(
    `Golden comparison: ${exampleOptions.length - mismatches.length}/${exampleOptions.length} match`
  );
  console.log(`${"=".repeat(60)}`);

  for (const m of mismatches) {
    console.log(`\n  MISMATCH: ${m.name} (${m.id})`);
    console.log(`    WASM:   ${m.wasmOutput.replace(/\n/g, " | ")}`);
    console.log(`    Golden: ${m.goldenOutput.replace(/\n/g, " | ")}`);
  }

  expect(
    mismatches.length,
    `${mismatches.length} examples have WASM/native output mismatch`
  ).toBe(0);
});
