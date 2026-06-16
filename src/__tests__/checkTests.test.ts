import { checkTests } from "@/lib/checkTests";
import type { Challenge } from "@/lib/challenges";
import { CHALLENGES } from "@/lib/challenges";

function makeChallenge(tests: { expectedOutput: string; description: string }[]): Challenge {
  return {
    id: "test",
    title: "Test",
    difficulty: "easy",
    description: "test challenge",
    starterCode: "",
    tests: tests.map((t) => ({ ...t })),
  };
}

describe("checkTests", () => {
  it("returns all not-ran when output is empty", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "prints hello" },
    ]);
    const results = checkTests(c, "");
    expect(results).toHaveLength(1);
    expect(results[0].ran).toBe(false);
    expect(results[0].passed).toBe(false);
  });

  it("passes when single-line output matches", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "prints hello" },
    ]);
    const results = checkTests(c, "hello\n");
    expect(results[0].passed).toBe(true);
    expect(results[0].ran).toBe(true);
  });

  it("fails when output does not match", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "prints hello" },
    ]);
    const results = checkTests(c, "goodbye\n");
    expect(results[0].passed).toBe(false);
    expect(results[0].ran).toBe(true);
  });

  it("handles multiple tests against same output", () => {
    const c = makeChallenge([
      { expectedOutput: "line1", description: "test 1" },
      { expectedOutput: "line2", description: "test 2" },
    ]);
    const results = checkTests(c, "line1\nline2\n");
    expect(results[0].passed).toBe(true);
    expect(results[1].passed).toBe(true);
  });

  it("handles multi-line expected output", () => {
    const c = makeChallenge([
      { expectedOutput: "a\nb", description: "multi-line" },
    ]);
    const results = checkTests(c, "a\nb\nc\n");
    expect(results[0].passed).toBe(true);
  });

  it("trims whitespace when comparing", () => {
    const c = makeChallenge([
      { expectedOutput: "  hello  ", description: "trimmed" },
    ]);
    const results = checkTests(c, "hello\n");
    expect(results[0].passed).toBe(true);
  });

  it("normalizes CRLF line endings", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "crlf" },
    ]);
    const results = checkTests(c, "hello\r\n");
    expect(results[0].passed).toBe(true);
  });

  it("fails one test while passing another", () => {
    const c = makeChallenge([
      { expectedOutput: "yes", description: "present" },
      { expectedOutput: "no", description: "absent" },
    ]);
    const results = checkTests(c, "yes\nmaybe\n");
    expect(results[0].passed).toBe(true);
    expect(results[1].passed).toBe(false);
  });

  it("requires multi-line expected lines in order", () => {
    const c = makeChallenge([
      { expectedOutput: "a\nb", description: "ordered" },
    ]);
    const results = checkTests(c, "b\na\n");
    expect(results[0].passed).toBe(false);
  });

  it("matches expected lines that appear non-consecutively in output", () => {
    const c = makeChallenge([
      { expectedOutput: "start\nend", description: "non-consecutive" },
    ]);
    const results = checkTests(c, "start\nmiddle\nend\n");
    expect(results[0].passed).toBe(true);
  });

  it("fails when expected output is a subset but in wrong order", () => {
    const c = makeChallenge([
      { expectedOutput: "second\nfirst", description: "wrong order" },
    ]);
    const results = checkTests(c, "first\nsecond\n");
    expect(results[0].passed).toBe(false);
  });

  it("handles numeric output matching", () => {
    const c = makeChallenge([
      { expectedOutput: "sum = 36.0", description: "numeric" },
    ]);
    const results = checkTests(c, "sum = 36.0\n");
    expect(results[0].passed).toBe(true);
  });

  it("returns expected and actual in results", () => {
    const c = makeChallenge([
      { expectedOutput: "expected", description: "with details" },
    ]);
    const results = checkTests(c, "actual");
    expect(results[0].expected).toBe("expected");
    expect(results[0].actual).toBe("actual");
  });

  it("all real challenges pass when given their expected output", () => {
    for (const c of CHALLENGES) {
      const fullExpected = c.tests.map((t) => t.expectedOutput).join("\n");
      const results = checkTests(c, fullExpected);
      for (const r of results) {
        expect(r.passed).toBe(true);
        expect(r.ran).toBe(true);
      }
    }
  });

  it("all real challenges fail when given empty output", () => {
    for (const c of CHALLENGES) {
      const results = checkTests(c, "");
      for (const r of results) {
        expect(r.ran).toBe(false);
        expect(r.passed).toBe(false);
      }
    }
  });

  it("treats whitespace-only output as not run", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "prints hello" },
    ]);
    for (const output of ["   ", "\n\n", "  \t  \n"]) {
      const results = checkTests(c, output);
      expect(results[0].ran).toBe(false);
      expect(results[0].passed).toBe(false);
    }
  });

  it("matches special characters literally (not as regex)", () => {
    const c = makeChallenge([
      { expectedOutput: "a.b*c[d]\\(x+)", description: "regex-like" },
    ]);
    const results = checkTests(c, "a.b*c[d]\\(x+)\n");
    expect(results[0].passed).toBe(true);
  });

  it("finds expected line in very long output (>10K characters)", () => {
    const c = makeChallenge([
      { expectedOutput: "needle", description: "buried line" },
    ]);
    const lineCount = 1200;
    const lines = Array.from({ length: lineCount }, (_, i) => `line-${i}`);
    lines.splice(Math.floor(lineCount / 2), 0, "needle");
    const output = lines.join("\n");
    expect(output.length).toBeGreaterThan(10_000);

    const results = checkTests(c, output);
    expect(results[0].passed).toBe(true);
    expect(results[0].ran).toBe(true);
  });

  it("passes vacuously when expected output is empty", () => {
    const c = makeChallenge([
      { expectedOutput: "", description: "no lines required" },
    ]);
    const results = checkTests(c, "anything\n");
    expect(results[0].ran).toBe(true);
    expect(results[0].passed).toBe(true);
  });

  it("matches lines with trailing whitespace in output", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "trim output line" },
    ]);
    const results = checkTests(c, "hello   \n");
    expect(results[0].passed).toBe(true);
  });
});
