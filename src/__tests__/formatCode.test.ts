import { formatChoreoCode } from "../lib/formatCode";

describe("formatChoreoCode", () => {
  it("indents lines inside braces by 2 spaces per level", () => {
    const input = `__co__ void hello() {
println("hi");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void hello() {
  println("hi");
}`);
  });

  it("de-indents lines containing closing braces", () => {
    const input = `__co__ void hello() {
  println("hi");
  }`;
    expect(formatChoreoCode(input)).toBe(`__co__ void hello() {
  println("hi");
}`);
  });

  it("handles nested blocks", () => {
    const input = `__co__ void outer() {
if (true) {
println(i);
}
}`;
    const expected = `__co__ void outer() {
  if (true) {
    println(i);
  }
}`;
    expect(formatChoreoCode(input)).toBe(expected);
  });

  it("preserves empty lines", () => {
    const input = `a {

b
}`;
    expect(formatChoreoCode(input)).toBe(`a {

  b
}`);
  });

  it("strips existing indentation before reformatting", () => {
    const input = `    __co__ void hello() {
        println("hi");
    }`;
    expect(formatChoreoCode(input)).toBe(`__co__ void hello() {
  println("hi");
}`);
  });
});
