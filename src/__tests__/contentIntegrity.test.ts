import { TUTORIALS } from "../lib/tutorials";
import { CHALLENGES } from "../lib/challenges";
import { EXAMPLES } from "../lib/examples";
import { parseContent } from "../lib/parseContent";
import { formatChoreoCode } from "../lib/formatCode";

describe("Content integrity", () => {
  it("has 200 challenges and 50 tutorials", () => {
    expect(CHALLENGES.length).toBe(200);
    expect(TUTORIALS.length).toBe(50);
  });

  it("all tutorials have at least 2 steps", () => {
    for (const t of TUTORIALS) {
      expect(t.steps.length).toBeGreaterThanOrEqual(2);
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

  it("no duplicate IDs across challenges and tutorials", () => {
    const ids = [...CHALLENGES.map((c) => c.id), ...TUTORIALS.map((t) => t.id)];
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

  it("all challenge test cases have non-empty expected output", () => {
    for (const c of CHALLENGES) {
      for (const t of c.tests) {
        expect(t.expectedOutput.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("all challenges have non-empty title and description", () => {
    for (const c of CHALLENGES) {
      expect(c.title.trim().length).toBeGreaterThan(0);
      expect(c.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("all tutorials have non-empty title and description", () => {
    for (const t of TUTORIALS) {
      expect(t.title.trim().length).toBeGreaterThan(0);
      expect(t.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("all examples have non-empty name, description, and code", () => {
    for (const ex of EXAMPLES) {
      expect(ex.name.trim().length).toBeGreaterThan(0);
      expect(ex.description.trim().length).toBeGreaterThan(0);
      expect(ex.code.trim().length).toBeGreaterThan(0);
    }
  });

  it("all challenge starter codes contain __co__ entry point", () => {
    for (const c of CHALLENGES) {
      expect(c.starterCode).toContain("__co__");
    }
  });

  it("challenge IDs follow naming convention", () => {
    for (const c of CHALLENGES) {
      expect(c.id).toMatch(/^c\d{2,3}$/);
    }
  });

  it("tutorial IDs follow naming convention", () => {
    for (const t of TUTORIALS) {
      expect(t.id).toMatch(/^ch\d{2}$/);
    }
  });

  it("example code formatting is idempotent", () => {
    for (const ex of EXAMPLES) {
      const formatted = formatChoreoCode(ex.code);
      const reformatted = formatChoreoCode(formatted);
      expect(reformatted).toBe(formatted);
    }
  });

  it("challenge starter code formatting is idempotent", () => {
    for (const c of CHALLENGES) {
      const formatted = formatChoreoCode(c.starterCode);
      const reformatted = formatChoreoCode(formatted);
      expect(reformatted).toBe(formatted);
    }
  });

  it("tutorial step code formatting is idempotent", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        const formatted = formatChoreoCode(step.code);
        const reformatted = formatChoreoCode(formatted);
        expect(reformatted).toBe(formatted);
      }
    }
  });

  it("all challenges have non-empty hints", () => {
    for (const c of CHALLENGES) {
      expect(c.hint.trim().length).toBeGreaterThan(0);
    }
  });

  it("all example IDs use only lowercase alphanumeric and hyphens", () => {
    for (const ex of EXAMPLES) {
      expect(ex.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("all challenge test descriptions are non-empty", () => {
    for (const c of CHALLENGES) {
      for (const t of c.tests) {
        expect(t.description.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("tutorial step titles are non-empty", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        expect(step.title.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("no duplicate tutorial step titles within a tutorial", () => {
    for (const t of TUTORIALS) {
      const titles = t.steps.map((s) => s.title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it("challenges have balanced difficulty distribution", () => {
    const easy = CHALLENGES.filter((c) => c.difficulty === "easy").length;
    const medium = CHALLENGES.filter((c) => c.difficulty === "medium").length;
    const hard = CHALLENGES.filter((c) => c.difficulty === "hard").length;
    expect(easy).toBeGreaterThan(0);
    expect(medium).toBeGreaterThan(0);
    expect(hard).toBeGreaterThan(0);
    expect(easy + medium + hard).toBe(CHALLENGES.length);
  });

  it("all challenge expectedOutput strings are non-empty", () => {
    for (const c of CHALLENGES) {
      for (const t of c.tests) {
        expect(t.expectedOutput.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("all example IDs are unique", () => {
    const ids = EXAMPLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("challenge IDs are sorted numerically", () => {
    const ids = CHALLENGES.map((c) => parseInt(c.id.replace("c", ""), 10));
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i]).toBeGreaterThan(ids[i - 1]);
    }
  });
});
