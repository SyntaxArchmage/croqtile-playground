/**
 * @jest-environment node
 */

import {
  loadProgress,
  saveProgress,
  resetProgress,
  saveLastSource,
  loadLastSource,
} from "@/lib/progress";

describe("progress SSR / no-window guards", () => {
  it("loadProgress returns defaults when window is undefined", () => {
    expect(loadProgress()).toEqual({
      tutorialSteps: {},
      challengesPassed: [],
      challengeProgress: {},
    });
  });

  it("saveProgress is a no-op when window is undefined", () => {
    expect(() =>
      saveProgress({ tutorialSteps: {}, challengesPassed: [], challengeProgress: {} }),
    ).not.toThrow();
  });

  it("resetProgress, saveLastSource, and loadLastSource handle missing window", () => {
    expect(() => resetProgress()).not.toThrow();
    expect(() => saveLastSource("code")).not.toThrow();
    expect(loadLastSource()).toBeNull();
  });
});
