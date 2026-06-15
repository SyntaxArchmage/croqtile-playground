import { checkTests } from "@/lib/checkTests";
import type { Challenge } from "@/lib/challenges";

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

describe("checkTests order sensitivity", () => {
  it("passes when output lines appear in correct order", () => {
    const c = makeChallenge([
      { expectedOutput: "a\nb\nc", description: "ordered" },
    ]);
    const results = checkTests(c, "a\nb\nc\n");
    expect(results[0].passed).toBe(true);
  });

  it("fails when output lines appear in wrong order", () => {
    const c = makeChallenge([
      { expectedOutput: "a\nb\nc", description: "ordered" },
    ]);
    const results = checkTests(c, "c\nb\na\n");
    expect(results[0].passed).toBe(false);
  });

  it("passes when expected lines are interspersed with extra output", () => {
    const c = makeChallenge([
      { expectedOutput: "start\nend", description: "interspersed" },
    ]);
    const results = checkTests(c, "start\nmiddle\nend\n");
    expect(results[0].passed).toBe(true);
  });

  it("fails when a repeated expected line only appears once", () => {
    const c = makeChallenge([
      { expectedOutput: "x\nx", description: "twice" },
    ]);
    const results = checkTests(c, "x\n");
    expect(results[0].passed).toBe(false);
  });

  it("handles multiple test cases independently", () => {
    const c = makeChallenge([
      { expectedOutput: "1\n2", description: "first" },
      { expectedOutput: "3\n4", description: "second" },
    ]);
    const results = checkTests(c, "1\n2\n3\n4\n");
    expect(results[0].passed).toBe(true);
    expect(results[1].passed).toBe(true);
  });
});
