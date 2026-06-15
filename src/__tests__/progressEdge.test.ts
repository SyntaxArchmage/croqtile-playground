import { loadProgress, isChallengePassed, markChallengePassed } from "@/lib/progress";

const STORAGE_KEY = "croqtile-playground-progress";

beforeEach(() => {
  localStorage.clear();
});

describe("progress edge cases", () => {
  it("handles challengesPassed being a non-array in storage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tutorialSteps: {},
      challengesPassed: "not-an-array",
    }));
    const p = loadProgress();
    expect(Array.isArray(p.challengesPassed)).toBe(true);
    expect(p.challengesPassed).toEqual([]);
  });

  it("handles tutorialSteps being null in storage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tutorialSteps: null,
      challengesPassed: ["c01"],
    }));
    const p = loadProgress();
    expect(p.tutorialSteps).toEqual({});
    expect(p.challengesPassed).toEqual(["c01"]);
  });

  it("handles empty JSON object in storage", () => {
    localStorage.setItem(STORAGE_KEY, "{}");
    const p = loadProgress();
    expect(p.tutorialSteps).toEqual({});
    expect(p.challengesPassed).toEqual([]);
  });

  it("markChallengePassed works after corrupted storage recovery", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      challengesPassed: 42,
    }));
    expect(isChallengePassed("c01")).toBe(false);
    markChallengePassed("c01");
    expect(isChallengePassed("c01")).toBe(true);
  });
});
