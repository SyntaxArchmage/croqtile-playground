import { EXAMPLES } from "@/lib/examples";
import {
  readInitialSource,
  readInitialPanelMode,
  getDeepLinkId,
} from "@/lib/playgroundInit";

const mockLoadSavedSource = jest.fn(() => null);
jest.mock("@/lib/sourceStorage", () => ({
  loadSavedSource: (...args: unknown[]) => mockLoadSavedSource(...args),
}));

describe("playgroundInit (browser)", () => {
  beforeEach(() => {
    mockLoadSavedSource.mockReturnValue(null);
    window.history.pushState({}, "", "/");
  });

  describe("readInitialSource", () => {
    it("returns decoded hash when present", () => {
      const code = '__co__ void fromHash() { println("hash"); }';
      window.history.pushState({}, "", `/#${encodeURIComponent(code)}`);
      expect(readInitialSource()).toBe(code);
    });

    it("returns example code when ?example= matches a slug", () => {
      window.history.pushState({}, "", "/?example=parallel");
      expect(readInitialSource()).toBe(EXAMPLES[1].code);
    });

    it("returns example code when ?example= matches slugified name", () => {
      window.history.pushState({}, "", "/?example=hello-world");
      expect(readInitialSource()).toBe(EXAMPLES[0].code);
    });

    it("falls through to saved source when ?example= is unknown", () => {
      mockLoadSavedSource.mockReturnValue("__co__ void saved() {}");
      window.history.pushState({}, "", "/?example=unknown-slug");
      expect(readInitialSource()).toBe("__co__ void saved() {}");
    });

    it("returns empty saved source instead of default example", () => {
      mockLoadSavedSource.mockReturnValue("");
      expect(readInitialSource()).toBe("");
    });

    it("prefers hash over ?example= param", () => {
      const code = "__co__ void fromHash() {}";
      window.history.pushState({}, "", `/?example=parallel#${encodeURIComponent(code)}`);
      expect(readInitialSource()).toBe(code);
    });

    it("returns saved source when no hash or example param", () => {
      mockLoadSavedSource.mockReturnValue("__co__ void saved() {}");
      expect(readInitialSource()).toBe("__co__ void saved() {}");
    });
  });

  describe("readInitialPanelMode", () => {
    it("returns tutorial when ?tutorial= is present", () => {
      window.history.pushState({}, "", "/?tutorial=ch01");
      expect(readInitialPanelMode()).toBe("tutorial");
    });

    it("returns challenge when ?challenge= is present", () => {
      window.history.pushState({}, "", "/?challenge=c01");
      expect(readInitialPanelMode()).toBe("challenge");
    });

    it("returns closed when no panel params are present", () => {
      expect(readInitialPanelMode()).toBe("closed");
    });
  });

  describe("getDeepLinkId", () => {
    it("returns tutorial id from search params", () => {
      window.history.pushState({}, "", "/?tutorial=ch01");
      expect(getDeepLinkId("tutorial")).toBe("ch01");
    });

    it("returns challenge id from search params", () => {
      window.history.pushState({}, "", "/?challenge=c01");
      expect(getDeepLinkId("challenge")).toBe("c01");
    });

    it("returns null when the requested panel param is missing", () => {
      window.history.pushState({}, "", "/?tutorial=ch01");
      expect(getDeepLinkId("challenge")).toBeNull();
    });

    it("returns null when panel mode is closed even if challenge param exists", () => {
      window.history.pushState({}, "", "/?challenge=c01");
      expect(getDeepLinkId("closed")).toBeNull();
    });
  });
});
