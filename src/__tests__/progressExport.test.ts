import {
  buildProgressExport,
  buildProgressExportFilename,
  validateProgressExport,
  importProgress,
  exportProgress,
  PROGRESS_EXPORT_VERSION,
} from "@/lib/progressExport";
import { loadProgress, saveProgress, loadLastSource, saveLastSource } from "@/lib/progress";
import { loadSettings, saveSettings } from "@/lib/settings";

beforeEach(() => {
  localStorage.clear();
});

describe("progressExport", () => {
  describe("buildProgressExport", () => {
    it("includes progress, settings, and last source", () => {
      saveProgress({
        tutorialSteps: { ch01: 2 },
        challengesPassed: ["c1"],
        challengeProgress: { c1: { status: "passed", attempts: 1 } },
      });
      saveSettings({
        fontSize: 16,
        fontFamily: "Fira Code, monospace",
        wordWrap: true,
        minimap: true,
        tabSize: 4,
        lastTarget: "cute",
        theme: "light",
        outputLineNumbers: true,
      });
      saveLastSource("__co__ void hello() {}");

      const payload = buildProgressExport();
      expect(payload.version).toBe(PROGRESS_EXPORT_VERSION);
      expect(payload.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(payload.progress.tutorialSteps.ch01).toBe(2);
      expect(payload.progress.challengesPassed).toContain("c1");
      expect(payload.settings.fontSize).toBe(16);
      expect(payload.settings.theme).toBe("light");
      expect(payload.lastSource).toBe("__co__ void hello() {}");
    });
  });

  describe("buildProgressExportFilename", () => {
    it("includes timestamp in filename", () => {
      const fixedDate = new Date("2026-06-16T12:34:56.789Z");
      expect(buildProgressExportFilename(fixedDate)).toBe(
        "croqtile-progress-2026-06-16T12-34-56.json",
      );
    });
  });

  describe("validateProgressExport", () => {
    it("accepts a valid export payload", () => {
      const payload = buildProgressExport();
      expect(validateProgressExport(payload)).toEqual(payload);
    });

    it("rejects wrong version", () => {
      const payload = { ...buildProgressExport(), version: 99 };
      expect(validateProgressExport(payload)).toBeNull();
    });

    it("rejects non-object input", () => {
      expect(validateProgressExport(null)).toBeNull();
      expect(validateProgressExport("string")).toBeNull();
    });

    it("rejects missing exportedAt", () => {
      const payload = { ...buildProgressExport(), exportedAt: "" };
      expect(validateProgressExport(payload)).toBeNull();
    });

    it("rejects null progress", () => {
      const payload = { ...buildProgressExport(), progress: null };
      expect(validateProgressExport(payload)).toBeNull();
    });

    it("rejects null settings", () => {
      const payload = { ...buildProgressExport(), settings: null };
      expect(validateProgressExport(payload)).toBeNull();
    });

    it("rejects invalid lastSource type", () => {
      const payload = { ...buildProgressExport(), lastSource: 42 };
      expect(validateProgressExport(payload)).toBeNull();
    });

    it("normalizes invalid progress fields", () => {
      const payload = {
        version: PROGRESS_EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        progress: {
          tutorialSteps: "bad",
          challengesPassed: "bad",
          challengeProgress: null,
        },
        settings: buildProgressExport().settings,
        lastSource: null,
      };
      const validated = validateProgressExport(payload);
      expect(validated).not.toBeNull();
      expect(validated!.progress.tutorialSteps).toEqual({});
      expect(validated!.progress.challengesPassed).toEqual([]);
    });

    it("restores previous localStorage values after validation", () => {
      localStorage.setItem("croqtile-playground-progress", JSON.stringify({ tutorialSteps: { ch99: 9 } }));
      localStorage.setItem("croqtile-playground-settings", JSON.stringify({ fontSize: 22 }));

      const payload = buildProgressExport();
      validateProgressExport(payload);

      const restoredProgress = JSON.parse(localStorage.getItem("croqtile-playground-progress")!);
      expect(restoredProgress.tutorialSteps.ch99).toBe(9);
      const restoredSettings = JSON.parse(localStorage.getItem("croqtile-playground-settings")!);
      expect(restoredSettings.fontSize).toBe(22);
    });

    it("cleans up transient keys when validating against empty localStorage", () => {
      localStorage.clear();
      const payload = buildProgressExport();
      const validated = validateProgressExport(payload);
      expect(validated).not.toBeNull();
      expect(localStorage.getItem("croqtile-playground-progress")).toBeNull();
      expect(localStorage.getItem("croqtile-playground-settings")).toBeNull();
    });

    it("normalizes invalid settings fields", () => {
      const payload = {
        version: PROGRESS_EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        progress: buildProgressExport().progress,
        settings: { fontSize: 999, theme: "auto", lastTarget: "invalid" },
        lastSource: null,
      };
      const validated = validateProgressExport(payload);
      expect(validated).not.toBeNull();
      expect(validated!.settings.fontSize).toBe(14);
      expect(validated!.settings.theme).toBe("dark");
      expect(validated!.settings.lastTarget).toBe("cc");
    });
  });

  describe("importProgress", () => {
    it("restores progress and settings from export", () => {
      const payload = {
        version: PROGRESS_EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        progress: {
          tutorialSteps: { ch02: 5 },
          challengesPassed: ["c2"],
          challengeProgress: { c2: { status: "passed", attempts: 3, bestCode: "solution" } },
        },
        settings: {
          fontSize: 18,
          fontFamily: "Source Code Pro, monospace",
          wordWrap: false,
          minimap: false,
          tabSize: 2,
          lastTarget: "cute",
          theme: "light",
          outputLineNumbers: false,
        },
        lastSource: "__co__ void imported() {}",
      };

      const result = importProgress(payload);
      expect(result).toEqual({ ok: true });

      expect(loadProgress().tutorialSteps.ch02).toBe(5);
      expect(loadProgress().challengesPassed).toContain("c2");
      expect(getChallengeProgressSafe("c2").bestCode).toBe("solution");
      expect(loadSettings().fontSize).toBe(18);
      expect(loadSettings().lastTarget).toBe("cute");
      expect(loadLastSource()).toBe("__co__ void imported() {}");
    });

    it("clears last source when export has null", () => {
      saveLastSource("old code");
      const payload = { ...buildProgressExport(), lastSource: null };
      expect(importProgress(payload)).toEqual({ ok: true });
      expect(loadLastSource()).toBeNull();
    });

    it("returns error for invalid payload", () => {
      expect(importProgress({ version: 2 })).toEqual({
        ok: false,
        error: "Invalid progress export file.",
      });
    });

    it("returns error when save throws", () => {
      const payload = buildProgressExport();
      const origSetItem = Storage.prototype.setItem;
      let callCount = 0;
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key: string, value: string) {
        callCount++;
        // normalizeViaStorage uses 2 setItem calls during validation; throw on 3rd to hit the import catch
        if (callCount > 2) throw new Error("QuotaExceeded");
        return origSetItem.call(this, key, value);
      });
      const result = importProgress(payload);
      jest.restoreAllMocks();
      expect(result).toEqual({ ok: false, error: "Failed to save imported progress." });
    });

    it("round-trips export then import", () => {
      saveProgress({
        tutorialSteps: { ch01: 1 },
        challengesPassed: [],
        challengeProgress: {},
      });
      saveSettings({
        fontSize: 20,
        fontFamily: "JetBrains Mono, monospace",
        wordWrap: true,
        minimap: false,
        tabSize: 2,
        lastTarget: "cc",
        theme: "dark",
        outputLineNumbers: true,
      });

      const exported = buildProgressExport();
      localStorage.clear();

      expect(importProgress(exported)).toEqual({ ok: true });
      expect(loadProgress().tutorialSteps.ch01).toBe(1);
      expect(loadSettings().fontSize).toBe(20);
      expect(loadSettings().outputLineNumbers).toBe(true);
    });
  });

  describe("exportProgress", () => {
    let mockClick: jest.Mock;
    let mockRemove: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;
    let capturedBlob: Blob | null;

    beforeEach(() => {
      mockClick = jest.fn();
      mockRemove = jest.fn();
      mockRevokeObjectURL = jest.fn();
      capturedBlob = null;

      jest.spyOn(document, "createElement").mockReturnValue({
        click: mockClick,
        remove: mockRemove,
        set href(_: string) {},
        set download(_: string) {},
      } as unknown as HTMLAnchorElement);
      jest.spyOn(document.body, "appendChild").mockImplementation((n) => n);
      URL.createObjectURL = jest.fn((blob) => {
        capturedBlob = blob as Blob;
        return "blob:mock-url";
      });
      URL.revokeObjectURL = mockRevokeObjectURL;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("downloads JSON with current progress data", () => {
      saveProgress({
        tutorialSteps: { ch01: 0 },
        challengesPassed: [],
        challengeProgress: {},
      });

      jest.useFakeTimers();
      exportProgress();

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(capturedBlob).not.toBeNull();
      expect(mockClick).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledTimes(1);

      jest.runAllTimers();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
      jest.useRealTimers();
    });
  });
});

function getChallengeProgressSafe(challengeId: string) {
  return loadProgress().challengeProgress[challengeId] ?? { status: "not_started" as const, attempts: 0 };
}
