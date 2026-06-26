import { loadSettings, saveSettings, buildFlagString, DEFAULT_COMPILER_FLAGS, type CompilerFlags } from "@/lib/settings";

const STORAGE_KEY = "croqtile-playground-settings";

beforeEach(() => {
  localStorage.clear();
});

describe("settings", () => {
  it("returns defaults when nothing stored", () => {
    const s = loadSettings();
    expect(s.fontSize).toBe(14);
    expect(s.fontFamily).toBe("JetBrains Mono, monospace");
    expect(s.wordWrap).toBe(false);
    expect(s.minimap).toBe(false);
    expect(s.tabSize).toBe(2);
    expect(s.lastTarget).toBe("cc");
    expect(s.theme).toBe("dark");
    expect(s.outputLineNumbers).toBe(false);
  });

  it("saves and loads settings", () => {
    saveSettings({ fontSize: 18, fontFamily: "Fira Code, monospace", wordWrap: false, minimap: true, tabSize: 4, lastTarget: "cute", theme: "light", outputLineNumbers: true });
    const s = loadSettings();
    expect(s.fontSize).toBe(18);
    expect(s.fontFamily).toBe("Fira Code, monospace");
    expect(s.wordWrap).toBe(false);
    expect(s.minimap).toBe(true);
    expect(s.tabSize).toBe(4);
    expect(s.lastTarget).toBe("cute");
    expect(s.theme).toBe("light");
    expect(s.outputLineNumbers).toBe(true);
  });

  it("clamps tabSize to valid range", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabSize: 1, wordWrap: true }));
    expect(loadSettings().tabSize).toBe(2);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tabSize: 10, wordWrap: true }));
    expect(loadSettings().tabSize).toBe(2);
  });

  it("clamps fontSize to valid range", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 8, wordWrap: true }));
    expect(loadSettings().fontSize).toBe(14);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 30, wordWrap: true }));
    expect(loadSettings().fontSize).toBe(14);
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY, "not json");
    const s = loadSettings();
    expect(s.fontSize).toBe(14);
    expect(s.wordWrap).toBe(false);
    expect(s.minimap).toBe(false);
    expect(s.theme).toBe("dark");
  });

  it("preserves valid partial settings", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 16 }));
    const s = loadSettings();
    expect(s.fontSize).toBe(16);
    expect(s.wordWrap).toBe(false);
    expect(s.minimap).toBe(false);
    expect(s.tabSize).toBe(2);
    expect(s.lastTarget).toBe("cc");
    expect(s.theme).toBe("dark");
  });

  it("rejects invalid lastTarget values", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, wordWrap: true, lastTarget: "invalid" }));
    expect(loadSettings().lastTarget).toBe("cc");
  });

  it("persists lastTarget across save/load", () => {
    saveSettings({ fontSize: 14, wordWrap: true, tabSize: 2, lastTarget: "cute", theme: "dark", outputLineNumbers: false });
    expect(loadSettings().lastTarget).toBe("cute");
  });

  describe("persistence and validation edge cases", () => {
    it("saveSettings persists changes that loadSettings reads back from localStorage", () => {
      const defaultFlags = { emitSource: true, dumpAst: false, noPreprocess: false, dropComments: false, noCodegen: false, semanticOnly: false, architecture: "", customFlags: "" };
      const s = { fontSize: 20, fontFamily: "JetBrains Mono, monospace", wordWrap: false, minimap: false, tabSize: 2, lastTarget: "cute" as const, theme: "light" as const, outputLineNumbers: false, compilerFlags: defaultFlags, hasSeenWelcome: false };
      saveSettings(s);
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBe(JSON.stringify(s));
      expect(loadSettings()).toEqual(s);
    });

    it("invalid lastTarget in localStorage defaults to cc", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, wordWrap: true, lastTarget: "cuda" }));
      expect(loadSettings().lastTarget).toBe("cc");

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, wordWrap: true, lastTarget: null }));
      expect(loadSettings().lastTarget).toBe("cc");
    });

    it("handles non-number fontSize gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: "sixteen", wordWrap: true }));
      expect(loadSettings().fontSize).toBe(14);
    });

    it("handles non-boolean wordWrap gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, wordWrap: "yes" }));
      expect(loadSettings().wordWrap).toBe(false);
    });

    it("handles non-boolean minimap gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, minimap: "yes" }));
      expect(loadSettings().minimap).toBe(false);
    });

    it("handles non-boolean outputLineNumbers gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, outputLineNumbers: "yes" }));
      expect(loadSettings().outputLineNumbers).toBe(false);
    });

    it("saveSettings catches when localStorage.setItem throws", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });
      expect(() => saveSettings({ fontSize: 14, wordWrap: true, tabSize: 2, lastTarget: "cc", theme: "dark", outputLineNumbers: false })).not.toThrow();
      (Storage.prototype.setItem as jest.Mock).mockRestore();
    });

    it("handles invalid fontFamily gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, fontFamily: "Comic Sans", wordWrap: true }));
      expect(loadSettings().fontFamily).toBe("JetBrains Mono, monospace");
    });

    it("handles invalid theme gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, wordWrap: true, theme: "auto" }));
      expect(loadSettings().theme).toBe("dark");
    });

    it("very large fontSize values are clamped to default on load", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 999, wordWrap: true }));
      expect(loadSettings().fontSize).toBe(14);

      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 1e6, wordWrap: true }));
      expect(loadSettings().fontSize).toBe(14);
    });
  });

  describe("compilerFlags", () => {
    it("returns default compilerFlags when nothing stored", () => {
      expect(loadSettings().compilerFlags).toEqual(DEFAULT_COMPILER_FLAGS);
    });

    it("returns default compilerFlags when stored settings lack them", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 16 }));
      expect(loadSettings().compilerFlags).toEqual(DEFAULT_COMPILER_FLAGS);
    });

    it("persists and loads compilerFlags", () => {
      const flags: CompilerFlags = {
        emitSource: false,
        dumpAst: true,
        noPreprocess: true,
        dropComments: true,
        noCodegen: true,
        semanticOnly: false,
        architecture: "sm_90",
        customFlags: "-O2 --verbose",
      };
      const s = { ...loadSettings(), compilerFlags: flags };
      saveSettings(s);
      expect(loadSettings().compilerFlags).toEqual(flags);
    });

    it("handles invalid compilerFlags (non-object) gracefully", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ compilerFlags: "invalid" }));
      expect(loadSettings().compilerFlags).toEqual(DEFAULT_COMPILER_FLAGS);
    });

    it("handles partial compilerFlags — fills missing with defaults", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ compilerFlags: { dumpAst: true } }));
      const flags = loadSettings().compilerFlags;
      expect(flags.dumpAst).toBe(true);
      expect(flags.emitSource).toBe(DEFAULT_COMPILER_FLAGS.emitSource);
      expect(flags.noPreprocess).toBe(DEFAULT_COMPILER_FLAGS.noPreprocess);
      expect(flags.customFlags).toBe("");
    });

    it("handles non-boolean flag values as defaults", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ compilerFlags: { emitSource: "yes", dumpAst: 42 } }));
      const flags = loadSettings().compilerFlags;
      expect(flags.emitSource).toBe(DEFAULT_COMPILER_FLAGS.emitSource);
      expect(flags.dumpAst).toBe(DEFAULT_COMPILER_FLAGS.dumpAst);
    });

    it("handles non-string customFlags as default", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ compilerFlags: { customFlags: 123 } }));
      expect(loadSettings().compilerFlags.customFlags).toBe("");
    });
  });

  describe("buildFlagString", () => {
    it("returns empty string for default flags (emitSource only)", () => {
      expect(buildFlagString(DEFAULT_COMPILER_FLAGS)).toBe("");
    });

    it("includes -e when dumpAst is true", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, dumpAst: true })).toBe("-e");
    });

    it("includes -np when noPreprocess is true", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, noPreprocess: true })).toBe("-np");
    });

    it("includes -dc when dropComments is true", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, dropComments: true })).toBe("-dc");
    });

    it("includes -s when noCodegen is true", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, noCodegen: true })).toBe("-s");
    });

    it("includes -s when semanticOnly is true", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, semanticOnly: true })).toBe("-s");
    });

    it("combines multiple flags", () => {
      const flags: CompilerFlags = {
        emitSource: true,
        dumpAst: true,
        noPreprocess: true,
        dropComments: false,
        noCodegen: false,
        semanticOnly: false,
        architecture: "",
        customFlags: "",
      };
      expect(buildFlagString(flags)).toBe("-e -np");
    });

    it("appends customFlags to built flags", () => {
      const flags: CompilerFlags = {
        emitSource: true,
        dumpAst: true,
        noPreprocess: false,
        dropComments: false,
        noCodegen: false,
        semanticOnly: false,
        architecture: "",
        customFlags: "-O2 --verbose",
      };
      expect(buildFlagString(flags)).toBe("-e -O2 --verbose");
    });

    it("includes -arch when architecture is set", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, architecture: "sm_90" })).toBe("-arch=sm_90");
    });

    it("uses target default arch when architecture is empty and target provided", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS }, "cute")).toBe("-arch=sm_86");
    });

    it("does not add -arch when no architecture and no target", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS })).toBe("");
    });

    it("trims whitespace from customFlags", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, customFlags: "  -O2  " })).toBe("-O2");
    });

    it("handles customFlags with only whitespace as empty", () => {
      expect(buildFlagString({ ...DEFAULT_COMPILER_FLAGS, customFlags: "   " })).toBe("");
    });
  });
});
