import { decodeCode, encodeCode } from "../lib/urlCodec";

describe("urlCodec", () => {
  it("round-trips code through encode/decode", () => {
    const code = `__co__ void hello() { println("hi"); }`;
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("handles empty code", () => {
    expect(encodeCode("")).toBe("");
    expect(decodeCode("")).toBe("");
  });

  it("handles special characters and newlines", () => {
    const code = `__co__ void test() {\n  float x = 3.14f;\n  println("x = ", x);\n}`;
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("handles unicode", () => {
    const code = `// 你好世界\n__co__ void hello() {}`;
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("handles very long code", () => {
    const code = "x".repeat(10000);
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("produces shorter URLs than encodeURIComponent for typical code", () => {
    const code = `__co__ void hello() {\n  println("hi");\n}`;
    expect(encodeCode(code).length).toBeLessThan(encodeURIComponent(code).length);
  });

  it("uses a b64: prefix for encoded format", () => {
    const encoded = encodeCode("__co__ void x() {}");
    expect(encoded.startsWith("b64:")).toBe(true);
  });

  it("decodes legacy encodeURIComponent hashes", () => {
    const code = `__co__ void legacy() { println("old link"); }`;
    const legacy = encodeURIComponent(code);
    expect(decodeCode(legacy)).toBe(code);
  });

  it("prefers b64 format when prefix is present", () => {
    const code = "__co__ void newFormat() {}";
    expect(decodeCode(encodeCode(code))).toBe(code);
  });

  it("returns the hash when legacy decode fails", () => {
    expect(decodeCode("%E0%A4%A")).toBe("%E0%A4%A");
  });

  it("falls back to legacy decode when b64 content is corrupted", () => {
    const corrupted = "b64:!!!invalid!!!";
    expect(decodeCode(corrupted)).toBe(corrupted);
  });

  it("handles code with null bytes", () => {
    const code = "hello\x00world";
    expect(decodeCode(encodeCode(code))).toBe(code);
  });
});
