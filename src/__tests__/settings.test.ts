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
  });

  it("saves and loads settings", () => {
    saveSettings({ fontSize: 18, wordWrap: false });
    const s = loadSettings();
    expect(s.fontSize).toBe(18);
    expect(s.wordWrap).toBe(false);
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
  });

  it("preserves valid partial settings", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize: 16 }));
    const s = loadSettings();
    expect(s.fontSize).toBe(16);
    expect(s.wordWrap).toBe(true);
  });
});
