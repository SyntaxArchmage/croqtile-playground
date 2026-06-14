import { TUTORIALS } from "../lib/tutorials";
import { CHALLENGES } from "../lib/challenges";

describe("Deep linking data availability", () => {
  it("all tutorials have unique IDs", () => {
    const ids = TUTORIALS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all challenges have unique IDs", () => {
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tutorial IDs are URL-safe", () => {
    for (const t of TUTORIALS) {
      expect(t.id).toMatch(/^[a-zA-Z0-9_-]+$/);
    }
  });

  it("challenge IDs are URL-safe", () => {
    for (const c of CHALLENGES) {
      expect(c.id).toMatch(/^[a-zA-Z0-9_-]+$/);
    }
  });

  it("tutorials can be found by ID (simulating deep link lookup)", () => {
    const target = TUTORIALS.find((t) => t.id === "ch01");
    expect(target).toBeDefined();
    expect(target!.title).toBe("Hello Croqtile");
  });

  it("challenges can be found by ID (simulating deep link lookup)", () => {
    const target = CHALLENGES.find((c) => c.id === "c01");
    expect(target).toBeDefined();
    expect(target!.title).toBe("Hello Threads");
  });
});
