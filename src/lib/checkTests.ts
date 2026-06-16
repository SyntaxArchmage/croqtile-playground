import type { Challenge } from "./challenges";

export interface TestResult {
  passed: boolean;
  ran: boolean;
  description: string;
  expected?: string;
  actual?: string;
}

export function checkTests(challenge: Challenge, output: string): TestResult[] {
  const trimmedOutput = output.trim();
  if (!trimmedOutput) {
    return challenge.tests.map((t) => ({
      passed: false,
      ran: false,
      description: t.description,
      expected: t.expectedOutput.trim(),
    }));
  }

  const lines = trimmedOutput.replace(/\r\n/g, "\n").split("\n");

  return challenge.tests.map((t) => {
    const expectedRaw = t.expectedOutput.trim();
    const expectedLines = expectedRaw === "" ? [] : expectedRaw.split("\n");
    let searchFrom = 0;
    const passed = expectedLines.every((exp) => {
      const idx = lines.findIndex((line, i) => i >= searchFrom && line.trim() === exp.trim());
      if (idx === -1) return false;
      searchFrom = idx + 1;
      return true;
    });
    return {
      passed,
      ran: true,
      description: t.description,
      expected: t.expectedOutput.trim(),
      actual: trimmedOutput,
    };
  });
}
