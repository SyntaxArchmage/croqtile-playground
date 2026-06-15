import {
  loadProgress,
  saveProgress,
  markTutorialStep,
  markChallengePassed,
  getTutorialProgress,
  isChallengePassed,
  saveLastSource,
  loadLastSource,
  resetProgress,
  recordChallengeAttempt,
  getChallengeProgress,
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

  it("returns null from loadLastSource when localStorage throws", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage error");
    });
    expect(loadLastSource()).toBeNull();
    (Storage.prototype.getItem as jest.Mock).mockRestore();
  });

  it("saves and loads last source", () => {
    expect(loadLastSource()).toBeNull();
    saveLastSource("__co__ void hello() {}");
    expect(loadLastSource()).toBe("__co__ void hello() {}");
  });

  it("resetProgress clears everything including last source", () => {
    saveProgress({ tutorialSteps: { ch01: 2 }, challengesPassed: ["c1"], challengeProgress: {} });
    saveLastSource("some code");
    resetProgress();
    expect(loadProgress().tutorialSteps).toEqual({});
    expect(loadProgress().challengesPassed).toEqual([]);
    expect(loadLastSource()).toBeNull();
  });

  it("recordChallengeAttempt increments attempts and sets status", () => {
    expect(getChallengeProgress("c1")).toEqual({ status: "not_started", attempts: 0 });
    recordChallengeAttempt("c1");
    expect(getChallengeProgress("c1")).toEqual({ status: "attempted", attempts: 1 });
    recordChallengeAttempt("c1");
    expect(getChallengeProgress("c1")).toEqual({ status: "attempted", attempts: 2 });
  });

  it("markChallengePassed stores best code", () => {
    recordChallengeAttempt("c1");
    markChallengePassed("c1", "my solution");
    const cp = getChallengeProgress("c1");
    expect(cp.status).toBe("passed");
    expect(cp.bestCode).toBe("my solution");
    expect(cp.attempts).toBe(1);
  });

  it("handles partial progress data from localStorage", () => {
    localStorage.setItem("croqtile-playground-progress", JSON.stringify({
      tutorialSteps: { ch01: 1 },
    }));
    const p = loadProgress();
    expect(p.tutorialSteps).toEqual({ ch01: 1 });
    expect(p.challengesPassed).toEqual([]);
    expect(p.challengeProgress).toEqual({});
  });

  it("handles invalid types for progress fields", () => {
    localStorage.setItem("croqtile-playground-progress", JSON.stringify({
      tutorialSteps: "not-an-object",
      challengesPassed: "not-an-array",
      challengeProgress: null,
    }));
    const p = loadProgress();
    expect(p.tutorialSteps).toEqual({});
    expect(p.challengesPassed).toEqual([]);
    expect(p.challengeProgress).toEqual({});
  });

  describe("challenge attempt and pass edge cases", () => {
    it("recordChallengeAttempt increments attempt count across many calls and persists", () => {
      for (let i = 1; i <= 5; i++) {
        recordChallengeAttempt("c-multi");
        expect(getChallengeProgress("c-multi").attempts).toBe(i);
        expect(getChallengeProgress("c-multi").status).toBe("attempted");
      }
      const reloaded = loadProgress().challengeProgress["c-multi"];
      expect(reloaded?.attempts).toBe(5);
      expect(reloaded?.status).toBe("attempted");
    });

    it("markChallengePassed saves bestCode when provided and keeps it on later passes", () => {
      markChallengePassed("c-code", "first solution");
      expect(getChallengeProgress("c-code").bestCode).toBe("first solution");

      markChallengePassed("c-code");
      expect(getChallengeProgress("c-code").bestCode).toBe("first solution");
    });

    it("getChallengeProgress returns passed status after markChallengePassed", () => {
      expect(getChallengeProgress("c-pass").status).toBe("not_started");
      markChallengePassed("c-pass", "final code");

      const cp = getChallengeProgress("c-pass");
      expect(cp.status).toBe("passed");
      expect(cp.bestCode).toBe("final code");
      expect(isChallengePassed("c-pass")).toBe(true);
    });

    it("recordChallengeAttempt after passing increments attempts without downgrading status", () => {
      markChallengePassed("c-done", "done");
      recordChallengeAttempt("c-done");
      recordChallengeAttempt("c-done");

      const cp = getChallengeProgress("c-done");
      expect(cp.status).toBe("passed");
      expect(cp.attempts).toBe(2);
      expect(cp.bestCode).toBe("done");
    });
  });
});
