import type { Challenge } from "./challenges";

export interface TestResult {
  passed: boolean;
  ran: boolean;
  description: string;
}

export function checkTests(challenge: Challenge, output: string): TestResult[] {
  if (!output) {
    return challenge.tests.map((t) => ({
      passed: false,
      ran: false,
      description: t.description,
    }));
  }

  const lines = output.trim().replace(/\r\n/g, "\n").split("\n");

  return challenge.tests.map((t) => {
    const expectedLines = t.expectedOutput.trim().split("\n");
    const passed = expectedLines.every((exp) =>
      lines.some((line) => line.trim() === exp.trim())
    );
    return { passed, ran: true, description: t.description };
  });
}
