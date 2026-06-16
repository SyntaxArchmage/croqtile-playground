import { EXAMPLES } from "@/lib/examples";
import { formatChoreoCode } from "@/lib/formatCode";

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

  it("every example can be formatted without error", () => {
    for (const ex of EXAMPLES) {
      expect(() => formatChoreoCode(ex.code)).not.toThrow();
      expect(formatChoreoCode(ex.code).length).toBeGreaterThan(0);
    }
  });

  it("ids use only lowercase alphanumeric and hyphens", () => {
    for (const ex of EXAMPLES) {
      expect(ex.id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
