import { loadSettings, saveSettings } from "@/lib/settings";

const STORAGE_KEY = "croqtile-playground-settings";

beforeEach(() => {
  localStorage.clear();
});

describe("settings", () => {
  it("returns defaults when nothing stored", () => {
    const s = loadSettings();
    expect(s.fontSize).toBe(14);
    expect(s.wordWrap).toBe(true);
    expect(s.lastTarget).toBe("cc");
    expect(s.theme).toBe("dark");
  });

  it("saves and loads settings", () => {
    saveSettings({ fontSize: 18, wordWrap: false, lastTarget: "cute", theme: "light" });
    const s = loadSettings();
    expect(s.fontSize).toBe(18);
    expect(s.wordWrap).toBe(false);
    expect(s.lastTarget).toBe("cute");
    expect(s.theme).toBe("light");
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
    expect(s.wordWrap).toBe(true);
    expect(s.theme).toBe("dark");
  });

  it("preserves valid partial settings", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 16 }));
    const s = loadSettings();
    expect(s.fontSize).toBe(16);
    expect(s.wordWrap).toBe(true);
    expect(s.lastTarget).toBe("cc");
    expect(s.theme).toBe("dark");
  });

  it("rejects invalid lastTarget values", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 14, wordWrap: true, lastTarget: "invalid" }));
    expect(loadSettings().lastTarget).toBe("cc");
  });

  it("persists lastTarget across save/load", () => {
    saveSettings({ fontSize: 14, wordWrap: true, lastTarget: "cute", theme: "dark" });
    expect(loadSettings().lastTarget).toBe("cute");
  });

  describe("persistence and validation edge cases", () => {
    it("saveSettings persists changes that loadSettings reads back from localStorage", () => {
      saveSettings({ fontSize: 20, wordWrap: false, lastTarget: "cute", theme: "light" });
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBe(JSON.stringify({ fontSize: 20, wordWrap: false, lastTarget: "cute", theme: "light" }));
      expect(loadSettings()).toEqual({ fontSize: 20, wordWrap: false, lastTarget: "cute", theme: "light" });
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
      expect(loadSettings().wordWrap).toBe(true);
    });

    it("saveSettings catches when localStorage.setItem throws", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });
      expect(() => saveSettings({ fontSize: 14, wordWrap: true, lastTarget: "cc", theme: "dark" })).not.toThrow();
      (Storage.prototype.setItem as jest.Mock).mockRestore();
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
});
