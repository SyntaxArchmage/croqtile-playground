import { CHALLENGES, ALL_TAGS, getChallengeTags, type ChallengeTag } from "@/lib/challenges";

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

  it("challenge IDs follow c## pattern", () => {
    for (const c of CHALLENGES) {
      expect(c.id).toMatch(/^c\d{2,3}$/);
    }
  });

  it("challenge IDs are sequential starting from c01", () => {
    CHALLENGES.forEach((c, i) => {
      const expected = `c${String(i + 1).padStart(2, "0")}`;
      expect(c.id).toBe(expected);
    });
  });

  it("has all three difficulty levels", () => {
    const difficulties = new Set(CHALLENGES.map((c) => c.difficulty));
    expect(difficulties).toContain("easy");
    expect(difficulties).toContain("medium");
    expect(difficulties).toContain("hard");
  });

  it("every challenge has a hint", () => {
    for (const c of CHALLENGES) {
      expect(c.hint).toBeDefined();
      expect(c.hint!.trim().length).toBeGreaterThan(0);
    }
  });

  it("every challenge gets at least one inferred tag", () => {
    for (const c of CHALLENGES) {
      const tags = getChallengeTags(c);
      expect(tags.length).toBeGreaterThan(0);
    }
  });

  it("all inferred tags are valid ChallengeTag values", () => {
    for (const c of CHALLENGES) {
      const tags = getChallengeTags(c);
      for (const tag of tags) {
        expect(ALL_TAGS).toContain(tag);
      }
    }
  });

  it("ALL_TAGS contains exactly 10 tag categories", () => {
    expect(ALL_TAGS).toHaveLength(10);
    expect(new Set(ALL_TAGS).size).toBe(10);
  });

  it("each tag is assigned to at least one challenge", () => {
    const tagCounts: Record<string, number> = {};
    for (const tag of ALL_TAGS) tagCounts[tag] = 0;
    for (const c of CHALLENGES) {
      for (const tag of getChallengeTags(c)) {
        tagCounts[tag]++;
      }
    }
    for (const tag of ALL_TAGS) {
      expect(tagCounts[tag]).toBeGreaterThan(0);
    }
  });

  it("known challenges get expected tags", () => {
    const c02 = CHALLENGES.find((c) => c.id === "c02")!;
    expect(getChallengeTags(c02)).toContain("parallel");

    const c03 = CHALLENGES.find((c) => c.id === "c03")!;
    expect(getChallengeTags(c03)).toContain("dma");

    const c06 = CHALLENGES.find((c) => c.id === "c06")!;
    expect(getChallengeTags(c06)).toContain("matrix");

    const c07 = CHALLENGES.find((c) => c.id === "c07")!;
    expect(getChallengeTags(c07)).toContain("pipeline");
  });

  it("tag inference is deterministic", () => {
    for (const c of CHALLENGES) {
      const tags1 = getChallengeTags(c);
      const tags2 = getChallengeTags(c);
      expect(tags1).toEqual(tags2);
    }
  });
});
