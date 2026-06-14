import { CHALLENGES } from "@/lib/challenges";

describe("CHALLENGES", () => {
  it("has at least one challenge", () => {
    expect(CHALLENGES.length).toBeGreaterThan(0);
  });

  it("every challenge has unique id", () => {
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every challenge has non-empty starter code", () => {
    for (const c of CHALLENGES) {
      expect(c.starterCode.trim().length).toBeGreaterThan(0);
    }
  });

  it("every challenge has at least one test", () => {
    for (const c of CHALLENGES) {
      expect(c.tests.length).toBeGreaterThan(0);
    }
  });

  it("every test has description and expectedOutput", () => {
    for (const c of CHALLENGES) {
      for (const t of c.tests) {
        expect(t.description.trim().length).toBeGreaterThan(0);
        expect(t.expectedOutput.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("difficulty is valid", () => {
    for (const c of CHALLENGES) {
      expect(["easy", "medium", "hard"]).toContain(c.difficulty);
    }
  });
});
