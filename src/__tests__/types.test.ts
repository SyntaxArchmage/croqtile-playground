import type { PanelMode } from "../lib/types";

describe("PanelMode type", () => {
  it("accepts valid panel modes", () => {
    const modes: PanelMode[] = ["closed", "tutorial", "challenge"];
    expect(modes).toHaveLength(3);
    expect(modes).toContain("closed");
    expect(modes).toContain("tutorial");
    expect(modes).toContain("challenge");
  });
});
