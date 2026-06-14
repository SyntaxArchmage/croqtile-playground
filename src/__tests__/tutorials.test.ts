import { TUTORIALS } from "@/lib/tutorials";

describe("TUTORIALS", () => {
  it("has at least one tutorial", () => {
    expect(TUTORIALS.length).toBeGreaterThan(0);
  });

  it("every tutorial has unique id", () => {
    const ids = TUTORIALS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every tutorial has at least one step", () => {
    for (const t of TUTORIALS) {
      expect(t.steps.length).toBeGreaterThan(0);
    }
  });

  it("every step has title, content, and code", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.content.trim().length).toBeGreaterThan(0);
        expect(step.code.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every step code contains __co__ kernel definition", () => {
    for (const t of TUTORIALS) {
      for (const step of t.steps) {
        expect(step.code).toContain("__co__");
      }
    }
  });
});
