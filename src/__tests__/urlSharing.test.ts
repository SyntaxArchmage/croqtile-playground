describe("URL sharing logic", () => {
  it("encodes code to URL hash", () => {
    const code = `__co__ void hello() { println("hi"); }`;
    const encoded = encodeURIComponent(code);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(code);
  });

  it("handles empty code", () => {
    const encoded = encodeURIComponent("");
    expect(encoded).toBe("");
  });

  it("handles special characters", () => {
    const code = `__co__ void test() {\n  float x = 3.14f;\n  println("x = ", x);\n}`;
    const encoded = encodeURIComponent(code);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(code);
  });

  it("handles unicode", () => {
    const code = `// 你好世界\n__co__ void hello() {}`;
    const encoded = encodeURIComponent(code);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(code);
  });

  it("handles very long code", () => {
    const code = "x".repeat(10000);
    const encoded = encodeURIComponent(code);
    const decoded = decodeURIComponent(encoded);
    expect(decoded).toBe(code);
  });
});
