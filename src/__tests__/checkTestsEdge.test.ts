import { checkTests } from "@/lib/checkTests";
import type { Challenge } from "@/lib/challenges";

function makeChallenge(tests: { expectedOutput: string; description: string }[]): Challenge {
  return {
    id: "edge",
    title: "Edge",
    difficulty: "easy",
    description: "",
    starterCode: "",
    tests,
  };
}

describe("checkTests edge cases", () => {
  it("handles output with trailing whitespace", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "trim" },
    ]);
    const results = checkTests(c, "  hello  \n");
    expect(results[0].passed).toBe(true);
  });

  it("handles empty expected output (vacuous pass when output exists)", () => {
    const c = makeChallenge([
      { expectedOutput: "", description: "empty" },
    ]);
    const results = checkTests(c, "anything\n");
    expect(results[0].ran).toBe(true);
    expect(results[0].passed).toBe(true);
  });

  it("handles output with only whitespace as not run", () => {
    const c = makeChallenge([
      { expectedOutput: "hello", description: "ws" },
    ]);
    const results = checkTests(c, "   \n  \n");
    expect(results[0].ran).toBe(false);
    expect(results[0].passed).toBe(false);
  });

  it("handles many tests against long output", () => {
    const tests = Array.from({ length: 10 }, (_, i) => ({
      expectedOutput: `line${i}`,
      description: `test ${i}`,
    }));
    const c = makeChallenge(tests);
    const output = Array.from({ length: 10 }, (_, i) => `line${i}`).join("\n");
    const results = checkTests(c, output);
    results.forEach((r) => expect(r.passed).toBe(true));
  });

  it("is case-sensitive", () => {
    const c = makeChallenge([
      { expectedOutput: "Hello", description: "case" },
    ]);
    const results = checkTests(c, "hello\n");
    expect(results[0].passed).toBe(false);
  });
});
