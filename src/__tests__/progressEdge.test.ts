import { loadProgress, isChallengePassed, markChallengePassed, getChallengeProgress, recordChallengeAttempt } from "@/lib/progress";

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

  it("handles missing challengeProgress gracefully", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tutorialSteps: {},
      challengesPassed: [],
    }));
    const p = loadProgress();
    expect(p.challengeProgress).toEqual({});
  });

  it("handles corrupted challengeProgress gracefully", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tutorialSteps: {},
      challengesPassed: [],
      challengeProgress: "bad",
    }));
    const p = loadProgress();
    expect(p.challengeProgress).toEqual({});
  });

  it("normalizes invalid challengeProgress entry fields on load", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      challengeProgress: { c1: { status: "attempted", attempts: "3" } },
    }));
    recordChallengeAttempt("c1");
    expect(getChallengeProgress("c1").attempts).toBe(1);
  });
});

describe("challenge progress tracking", () => {
  it("records attempts incrementally", () => {
    recordChallengeAttempt("c01");
    expect(getChallengeProgress("c01").attempts).toBe(1);
    expect(getChallengeProgress("c01").status).toBe("attempted");
    recordChallengeAttempt("c01");
    expect(getChallengeProgress("c01").attempts).toBe(2);
  });

  it("marks challenge passed with best code", () => {
    recordChallengeAttempt("c02");
    markChallengePassed("c02", "my solution");
    const cp = getChallengeProgress("c02");
    expect(cp.status).toBe("passed");
    expect(cp.bestCode).toBe("my solution");
    expect(cp.attempts).toBe(1);
  });

  it("returns default for unknown challenge", () => {
    const cp = getChallengeProgress("unknown");
    expect(cp.status).toBe("not_started");
    expect(cp.attempts).toBe(0);
    expect(cp.bestCode).toBeUndefined();
  });
});
