import {
  buildDownloadFilename,
  extractCoFunctionName,
  isAllowedOpenExtension,
  downloadCoSource,
  printCode,
  CROQTILE_MIME,
  MAX_OPEN_FILE_BYTES,
} from "@/lib/fileIO";

describe("fileIO", () => {
  describe("extractCoFunctionName", () => {
    it("extracts function name from __co__ definition", () => {
      expect(extractCoFunctionName('__co__ void hello() {\n  println("hi");\n}')).toBe("hello");
    });

    it("returns null when no __co__ function is found", () => {
      expect(extractCoFunctionName("int main() {}")).toBeNull();
    });

    it("extracts name with different return types", () => {
      expect(extractCoFunctionName("__co__ int compute(int x)")).toBe("compute");
      expect(extractCoFunctionName("__co__ float4 transform(vec3 v)")).toBe("transform");
    });

    it("returns null for empty string", () => {
      expect(extractCoFunctionName("")).toBeNull();
    });

    it("extracts the first match when multiple __co__ functions exist", () => {
      const code = "__co__ void first() {}\n__co__ void second() {}";
      expect(extractCoFunctionName(code)).toBe("first");
    });
  });

  describe("buildDownloadFilename", () => {
    const fixedDate = new Date("2026-06-16T12:34:56.789Z");

    it("includes function name and timestamp", () => {
      expect(buildDownloadFilename("__co__ void matmul() {}", fixedDate)).toBe(
        "matmul-2026-06-16T12-34-56.co",
      );
    });

    it("falls back to croqtile prefix without __co__ function", () => {
      expect(buildDownloadFilename("plain text", fixedDate)).toBe(
        "croqtile-2026-06-16T12-34-56.co",
      );
    });

    it("uses current date when no date argument provided", () => {
      const filename = buildDownloadFilename("__co__ void test() {}");
      expect(filename).toMatch(/^test-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.co$/);
    });

    it("handles empty code string", () => {
      expect(buildDownloadFilename("", fixedDate)).toBe(
        "croqtile-2026-06-16T12-34-56.co",
      );
    });
  });

  describe("isAllowedOpenExtension", () => {
    it("accepts .co and .txt files", () => {
      expect(isAllowedOpenExtension("kernel.co")).toBe(true);
      expect(isAllowedOpenExtension("notes.TXT")).toBe(true);
    });

    it("rejects other extensions", () => {
      expect(isAllowedOpenExtension("kernel.cpp")).toBe(false);
    });

    it("is case-insensitive", () => {
      expect(isAllowedOpenExtension("KERNEL.CO")).toBe(true);
      expect(isAllowedOpenExtension("file.Txt")).toBe(true);
    });

    it("rejects files with no extension", () => {
      expect(isAllowedOpenExtension("Makefile")).toBe(false);
    });

    it("checks the final extension only", () => {
      expect(isAllowedOpenExtension("archive.tar.co")).toBe(true);
      expect(isAllowedOpenExtension("file.co.bak")).toBe(false);
    });
  });

  describe("downloadCoSource", () => {
    let mockClick: jest.Mock;
    let mockRemove: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;

    beforeEach(() => {
      mockClick = jest.fn();
      mockRemove = jest.fn();
      mockRevokeObjectURL = jest.fn();

      jest.spyOn(document, "createElement").mockReturnValue({
        click: mockClick,
        remove: mockRemove,
        set href(_: string) {},
        set download(_: string) {},
      } as unknown as HTMLAnchorElement);
      jest.spyOn(document.body, "appendChild").mockImplementation((n) => n);
      URL.createObjectURL = jest.fn(() => "blob:mock-url");
      URL.revokeObjectURL = mockRevokeObjectURL;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("creates a download link, clicks it, and cleans up", () => {
      jest.useFakeTimers();
      downloadCoSource("__co__ void test() {}");

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(document.body.appendChild).toHaveBeenCalledTimes(1);
      expect(mockClick).toHaveBeenCalledTimes(1);
      expect(mockRemove).toHaveBeenCalledTimes(1);

      jest.runAllTimers();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
      jest.useRealTimers();
    });
  });

  describe("printCode", () => {
    it("calls window.print", () => {
      const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
      printCode();
      expect(printSpy).toHaveBeenCalledTimes(1);
      printSpy.mockRestore();
    });
  });

  describe("constants", () => {
    it("exports CROQTILE_MIME as text/plain", () => {
      expect(CROQTILE_MIME).toBe("text/plain;charset=utf-8");
    });

    it("exports MAX_OPEN_FILE_BYTES as 1MB", () => {
      expect(MAX_OPEN_FILE_BYTES).toBe(1024 * 1024);
    });
  });
});
