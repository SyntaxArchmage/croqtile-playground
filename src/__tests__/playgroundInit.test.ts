/**
 * @jest-environment node
 */

import { EXAMPLES } from "@/lib/examples";
import {
  readInitialSource,
  readInitialPanelMode,
  getDeepLinkId,
  findExampleBySlug,
} from "@/lib/playgroundInit";

const mockLoadSavedSource = jest.fn(() => null);
jest.mock("@/lib/sourceStorage", () => ({
  loadSavedSource: (...args: unknown[]) => mockLoadSavedSource(...args),
}));

describe("playgroundInit", () => {
  beforeEach(() => {
    mockLoadSavedSource.mockReturnValue(null);
  });

  describe("readInitialSource", () => {
    it("returns default example when window is undefined", () => {
      expect(readInitialSource()).toBe(EXAMPLES[0].code);
    });
  });

  describe("findExampleBySlug", () => {
    it("finds example by slugified name", () => {
      expect(findExampleBySlug("hello-world")?.id).toBe("hello");
    });

    it("finds example by id", () => {
      expect(findExampleBySlug("parallel")?.id).toBe("parallel");
    });

    it("returns undefined for unknown slug", () => {
      expect(findExampleBySlug("not-an-example")).toBeUndefined();
    });
  });

  describe("readInitialPanelMode", () => {
    it("returns closed when window is undefined", () => {
      expect(readInitialPanelMode()).toBe("closed");
    });
  });

  describe("getDeepLinkId", () => {
    it("returns null when window is undefined", () => {
      expect(getDeepLinkId("tutorial")).toBeNull();
    });
  });
});
