/**
 * @jest-environment node
 */

import { loadSettings, saveSettings } from "@/lib/settings";

describe("settings SSR / no-window guards", () => {
  it("loadSettings returns defaults when window is undefined", () => {
    expect(loadSettings()).toEqual({
      fontSize: 14,
      wordWrap: false,
      minimap: false,
      tabSize: 2,
      lastTarget: "cc",
      theme: "dark",
      outputLineNumbers: false,
    });
  });

  it("saveSettings is a no-op when window is undefined", () => {
    expect(() =>
      saveSettings({ fontSize: 16, wordWrap: false, tabSize: 2, lastTarget: "cute", theme: "light", outputLineNumbers: false }),
    ).not.toThrow();
  });
});
