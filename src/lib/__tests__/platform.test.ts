import { detectIsMac, formatShortcut } from "../platform";

describe("platform", () => {
  describe("detectIsMac", () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
    });

    it("returns true for Mac platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "MacIntel", userAgent: "" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns true for iPhone user agent", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns false for Linux platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "Linux x86_64", userAgent: "Mozilla/5.0 (X11; Linux x86_64)" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(false);
    });
  });

  describe("formatShortcut", () => {
    it("leaves shortcuts unchanged on non-Mac", () => {
      expect(formatShortcut("Ctrl+Shift+Enter", false)).toBe("Ctrl+Shift+Enter");
      expect(formatShortcut("Esc", false)).toBe("Esc");
    });

    it("uses Mac modifier symbols on Mac", () => {
      expect(formatShortcut("Ctrl+Enter", true)).toBe("⌘Enter");
      expect(formatShortcut("Ctrl+Shift+Enter", true)).toBe("⌘⇧Enter");
      expect(formatShortcut("Ctrl+Alt+D", true)).toBe("⌘⌥D");
    });

    it("leaves non-modifier keys unchanged on Mac", () => {
      expect(formatShortcut("?", true)).toBe("?");
      expect(formatShortcut("Esc", true)).toBe("Esc");
    });
  });
});
