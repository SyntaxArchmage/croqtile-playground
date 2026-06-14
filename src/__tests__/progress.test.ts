import {
  loadProgress,
  saveProgress,
  markTutorialStep,
  markChallengePassed,
  getTutorialProgress,
  isChallengePassed,
} from "@/lib/progress";

const STORAGE_KEY = "croqtile-playground-progress";

beforeEach(() => {
  localStorage.clear();
});

describe("progress", () => {
  it("returns default when nothing stored", () => {
    const p = loadProgress();
    expect(p.tutorialSteps).toEqual({});
    expect(p.challengesPassed).toEqual([]);
  });

  it("saves and loads progress", () => {
    saveProgress({ tutorialSteps: { ch01: 2 }, challengesPassed: ["c1"] });
    const p = loadProgress();
    expect(p.tutorialSteps.ch01).toBe(2);
    expect(p.challengesPassed).toContain("c1");
  });

  it("marks tutorial step (only advances)", () => {
    markTutorialStep("ch01", 1);
    expect(getTutorialProgress("ch01")).toBe(1);
    markTutorialStep("ch01", 3);
    expect(getTutorialProgress("ch01")).toBe(3);
    markTutorialStep("ch01", 2);
    expect(getTutorialProgress("ch01")).toBe(3);
  });

  it("marks challenge passed (idempotent)", () => {
    expect(isChallengePassed("c1")).toBe(false);
    markChallengePassed("c1");
    expect(isChallengePassed("c1")).toBe(true);
    markChallengePassed("c1");
    const p = loadProgress();
    expect(p.challengesPassed.filter((x) => x === "c1").length).toBe(1);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not json");
    const p = loadProgress();
    expect(p.tutorialSteps).toEqual({});
  });

  it("getTutorialProgress returns -1 for unknown tutorial", () => {
    expect(getTutorialProgress("unknown")).toBe(-1);
  });
});
