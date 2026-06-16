import type { Challenge } from "./challenges";

export interface TestResult {
  passed: boolean;
  ran: boolean;
  description: string;
  expected?: string;
  actual?: string;
}

function normalizeLines(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized === "") return [];
  return normalized.split("\n");
}

function testDescription(description: string, index: number): string {
  const trimmed = description.trim();
  return trimmed || `Test ${index + 1}`;
}

export function checkTests(challenge: Challenge, output: string): TestResult[] {
  const trimmedOutput = output.trim();
  if (!trimmedOutput) {
    return challenge.tests.map((t, i) => ({
      passed: false,
      ran: false,
      description: testDescription(t.description, i),
      expected: t.expectedOutput.trim(),
    }));
  }

  const lines = normalizeLines(trimmedOutput);

  return challenge.tests.map((t, i) => {
    const expectedLines = normalizeLines(t.expectedOutput);
    let searchFrom = 0;
    const passed = expectedLines.every((exp) => {
      const idx = lines.findIndex((line, lineIdx) => lineIdx >= searchFrom && line.trim() === exp.trim());
      if (idx === -1) return false;
      searchFrom = idx + 1;
      return true;
    });
    return {
      passed,
      ran: true,
      description: testDescription(t.description, i),
      expected: t.expectedOutput.trim(),
      actual: trimmedOutput,
    };
  });
}
