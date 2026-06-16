import { EXAMPLES } from "@/lib/examples";

describe("EXAMPLES", () => {
  it("has at least one example", () => {
    expect(EXAMPLES.length).toBeGreaterThan(0);
  });

  it("every example has unique id", () => {
    const ids = EXAMPLES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every example has non-empty code", () => {
    for (const ex of EXAMPLES) {
      expect(ex.code.trim().length).toBeGreaterThan(0);
    }
  });

  it("every example has a name", () => {
    for (const ex of EXAMPLES) {
      expect(ex.name.trim().length).toBeGreaterThan(0);
    }
  });

  it("every example has a description", () => {
    for (const ex of EXAMPLES) {
      expect(ex.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("every example contains __co__ kernel definition", () => {
    for (const ex of EXAMPLES) {
      expect(ex.code).toContain("__co__");
    }
  });
});
