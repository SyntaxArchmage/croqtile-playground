import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync } from "fs";
import { resolve } from "path";
import { EXAMPLES } from "@/lib/examples";

const execAsync = promisify(exec);

const CO_MOCK =
  process.env.CO_MOCK_BIN || "/home/albert/workspace/croqtile/build/co-mock";

const goldenPath = resolve(
  __dirname,
  "golden/mock-outputs.json"
);
let goldens: Record<string, string> = {};
try {
  goldens = JSON.parse(readFileSync(goldenPath, "utf-8"));
} catch {
  // golden file missing — skip golden checks
}

async function runMock(
  code: string,
  target: string = "cc"
): Promise<{ stdout: string; stderr: string }> {
  const escaped = code.replace(/'/g, "'\\''");
  const { stdout, stderr } = await execAsync(
    `echo '${escaped}' | ${CO_MOCK} -t ${target} -`,
    { timeout: 30000, maxBuffer: 1024 * 1024 }
  );
  return { stdout, stderr };
}

function sortedLines(text: string): string {
  return text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .sort()
    .join("\n");
}

describe("Mock interpreter runs all examples", () => {
  for (const ex of EXAMPLES) {
    test.concurrent(
      `[${ex.id}] ${ex.name}`,
      async () => {
        const { stdout, stderr } = await runMock(ex.code, ex.target || "cc");

        const filteredStderr = stderr
          .split("\n")
          .filter(
            (l) => !/warning:\s*mock:\s*unhandled expression type/.test(l)
          )
          .join("\n")
          .trim();

        expect(filteredStderr).not.toMatch(/syntax error/);
        expect(filteredStderr).not.toMatch(/Parsing failed/);
        expect(filteredStderr).not.toMatch(/Interpretation failed/);
        expect(filteredStderr).not.toMatch(/Interpreter error/);
        expect(filteredStderr).not.toMatch(/Exception:/);

        expect(stdout.trim().length).toBeGreaterThan(0);

        if (goldens[ex.id]) {
          expect(sortedLines(stdout)).toBe(sortedLines(goldens[ex.id]));
        }
      },
      30000
    );
  }
});
