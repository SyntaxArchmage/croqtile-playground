import React from "react";
import { detectIsMac, formatShortcut, useIsMac } from "@/lib/platform";
import { renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";

function MacBadge() {
  const isMac = useIsMac();
  return React.createElement("span", null, isMac ? "mac" : "pc");
}

describe("platform", () => {
  describe("detectIsMac", () => {
    const origNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, "navigator", { value: origNavigator, configurable: true });
    });

    it("returns false when navigator is undefined", () => {
      Object.defineProperty(global, "navigator", { value: undefined, configurable: true });
      expect(detectIsMac()).toBe(false);
    });

    it("returns true for Mac platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "MacIntel", userAgent: "" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns true for iPad platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "iPad", userAgent: "" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns true for iPhone platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "iPhone", userAgent: "" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns true for iPod platform", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "iPod", userAgent: "" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns true for Mac OS X in userAgent", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "Linux", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(true);
    });

    it("returns false for Linux", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "Linux x86_64", userAgent: "Mozilla/5.0 (X11; Linux x86_64)" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(false);
    });

    it("returns false for Windows", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: "Win32", userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
        configurable: true,
      });
      expect(detectIsMac()).toBe(false);
    });

    it("handles undefined platform and userAgent gracefully", () => {
      Object.defineProperty(global, "navigator", {
        value: { platform: undefined, userAgent: undefined },
        configurable: true,
      });
      expect(detectIsMac()).toBe(false);
    });
  });

  describe("useIsMac", () => {
    it("returns a boolean based on the current platform", () => {
      const { result } = renderHook(() => useIsMac());
      expect(typeof result.current).toBe("boolean");
    });

    it("returns consistent value across mount/unmount", () => {
      const { result, rerender, unmount } = renderHook(() => useIsMac());
      const first = result.current;
      rerender();
      expect(result.current).toBe(first);
      unmount();
    });

    it("uses server snapshot false during SSR rendering", () => {
      expect(renderToString(React.createElement(MacBadge))).toContain("pc");
    });
  });

  describe("formatShortcut", () => {
    it("returns shortcut unchanged on non-Mac", () => {
      expect(formatShortcut("Ctrl+S", false)).toBe("Ctrl+S");
    });

    it("replaces Ctrl with ⌘ on Mac", () => {
      expect(formatShortcut("Ctrl+S", true)).toBe("⌘S");
    });

    it("replaces Shift with ⇧ on Mac", () => {
      expect(formatShortcut("Shift+P", true)).toBe("⇧P");
    });

    it("replaces Alt with ⌥ on Mac", () => {
      expect(formatShortcut("Alt+F", true)).toBe("⌥F");
    });

    it("replaces multiple modifiers on Mac", () => {
      expect(formatShortcut("Ctrl+Shift+P", true)).toBe("⌘⇧P");
    });

    it("handles shortcut with no modifiers", () => {
      expect(formatShortcut("Enter", true)).toBe("Enter");
      expect(formatShortcut("Enter", false)).toBe("Enter");
    });
  });
});
