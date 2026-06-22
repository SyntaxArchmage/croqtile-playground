/**
 * @jest-environment node
 */

import { loadSettings, saveSettings } from "@/lib/settings";

describe("settings SSR / no-window guards", () => {
  it("loadSettings returns defaults when window is undefined", () => {
    expect(loadSettings()).toEqual({
      fontSize: 14,
      fontFamily: "JetBrains Mono, monospace",
      wordWrap: false,
      minimap: false,
      tabSize: 2,
      lastTarget: "cc",
      theme: "dark",
      outputLineNumbers: false,
      compilerFlags: {
        emitSource: true,
        dumpAst: false,
        noPreprocess: false,
        dropComments: false,
        noCodegen: false,
        semanticOnly: false,
        customFlags: "",
      },
    });
  });

  it("saveSettings is a no-op when window is undefined", () => {
    expect(() =>
      saveSettings({ fontSize: 16, fontFamily: "monospace", wordWrap: false, minimap: false, tabSize: 2, lastTarget: "cute", theme: "light", outputLineNumbers: false, compilerFlags: { emitSource: true, dumpAst: false, noPreprocess: false, dropComments: false, noCodegen: false, semanticOnly: false, customFlags: "" } }),
    ).not.toThrow();
  });
});
