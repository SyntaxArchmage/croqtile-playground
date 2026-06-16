/**
 * @jest-environment node
 */
import { importProgress, validateProgressExport, PROGRESS_EXPORT_VERSION } from "@/lib/progressExport";

describe("progressExport SSR", () => {
  const payload = {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    progress: { tutorialSteps: {}, challengesPassed: [], challengeProgress: {} },
    settings: { fontSize: 14, fontFamily: "monospace", wordWrap: false, minimap: false, tabSize: 2, lastTarget: "cute", lineNumbers: true, showOutputLineNumbers: false },
    lastSource: null,
  };

  it("validateProgressExport returns null on server", () => {
    expect(validateProgressExport(payload)).toBeNull();
  });

  it("importProgress returns browser-only error on server", () => {
    const result = importProgress(payload);
    expect(result).toEqual({ ok: false, error: "Import is only available in the browser." });
  });
});
