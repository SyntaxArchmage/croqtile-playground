/**
 * @jest-environment node
 */

import { loadSettings, saveSettings } from "@/lib/settings";

describe("settings SSR / no-window guards", () => {
  it("loadSettings returns defaults when window is undefined", () => {
    expect(loadSettings()).toEqual({
      fontSize: 14,
      wordWrap: true,
      lastTarget: "cc",
      theme: "dark",
    });
  });

  it("saveSettings is a no-op when window is undefined", () => {
    expect(() =>
      saveSettings({ fontSize: 16, wordWrap: false, lastTarget: "cute", theme: "light" }),
    ).not.toThrow();
  });
});
