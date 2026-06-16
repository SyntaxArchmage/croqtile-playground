/**
 * @jest-environment node
 */

import { EXAMPLES } from "@/lib/examples";
import {
  readInitialSource,
  readInitialPanelMode,
  getDeepLinkId,
} from "@/lib/playgroundInit";

const mockLoadLastSource = jest.fn(() => null);
jest.mock("@/lib/progress", () => ({
  loadLastSource: (...args: unknown[]) => mockLoadLastSource(...args),
}));

describe("playgroundInit", () => {
  beforeEach(() => {
    mockLoadLastSource.mockReturnValue(null);
  });

  describe("readInitialSource", () => {
    it("returns default example when window is undefined", () => {
      expect(readInitialSource()).toBe(EXAMPLES[0].code);
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
