import {
  buildDownloadFilename,
  extractCoFunctionName,
  isAllowedOpenExtension,
} from "@/lib/fileIO";

describe("fileIO", () => {
  describe("extractCoFunctionName", () => {
    it("extracts function name from __co__ definition", () => {
      expect(extractCoFunctionName('__co__ void hello() {\n  println("hi");\n}')).toBe("hello");
    });

    it("returns null when no __co__ function is found", () => {
      expect(extractCoFunctionName("int main() {}")).toBeNull();
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
  });

  describe("isAllowedOpenExtension", () => {
    it("accepts .co and .txt files", () => {
      expect(isAllowedOpenExtension("kernel.co")).toBe(true);
      expect(isAllowedOpenExtension("notes.TXT")).toBe(true);
    });

    it("rejects other extensions", () => {
      expect(isAllowedOpenExtension("kernel.cpp")).toBe(false);
    });
  });
});
