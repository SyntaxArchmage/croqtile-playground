import { TUTORIALS } from "../lib/tutorials";
import { CHALLENGES } from "../lib/challenges";
import { EXAMPLES } from "../lib/examples";
import { parseContent } from "../lib/parseContent";

describe("Content integrity", () => {
  it("all tutorials have at least one step", () => {
    for (const t of TUTORIALS) {
      expect(t.steps.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("all tutorials have unique IDs", () => {
    const ids = TUTORIALS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all challenges have unique IDs", () => {
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all examples have unique IDs", () => {
    const ids = EXAMPLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all tutorial steps have non-empty code", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        expect(step.code.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("all tutorial steps have non-empty content", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        expect(step.content.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("all challenge starter codes contain guidance comments", () => {
    for (const c of CHALLENGES) {
      if (c.difficulty !== "easy") {
        const hasGuidance = c.starterCode.includes("TODO") || c.starterCode.includes("//");
        expect(hasGuidance).toBe(true);
      }
    }
  });

  it("all challenges have at least 1 test case", () => {
    for (const c of CHALLENGES) {
      expect(c.tests.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("example codes all compile (contain __co__)", () => {
    for (const ex of EXAMPLES) {
      expect(ex.code).toContain("__co__");
    }
  });

  it("tutorial Try-it blocks parse correctly", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        const parts = parseContent(step.content);
        for (const part of parts) {
          expect(part.content.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("difficulty distribution is reasonable", () => {
    const easy = CHALLENGES.filter((c) => c.difficulty === "easy").length;
    const medium = CHALLENGES.filter((c) => c.difficulty === "medium").length;
    const hard = CHALLENGES.filter((c) => c.difficulty === "hard").length;
    expect(easy).toBeGreaterThanOrEqual(2);
    expect(medium).toBeGreaterThanOrEqual(4);
    expect(hard).toBeGreaterThanOrEqual(2);
  });
});
