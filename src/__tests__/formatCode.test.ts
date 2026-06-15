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

  it("ignores braces inside strings", () => {
    const input = `__co__ void hello() {
println("{not a block}");
println("done");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void hello() {
  println("{not a block}");
  println("done");
}`);
  });

  it("handles } else { pattern correctly", () => {
    const input = `if (x) {
a();
} else {
b();
}`;
    expect(formatChoreoCode(input)).toBe(`if (x) {
  a();
} else {
  b();
}`);
  });

  it("ignores braces in line comments", () => {
    const input = `__co__ void f() {
// { not a block }
println("ok");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  // { not a block }
  println("ok");
}`);
  });

  it("handles escaped quotes in strings", () => {
    const input = `__co__ void f() {
println("he said \\"hi\\"");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  println("he said \\"hi\\"");
}`);
  });

  it("counts braces after division operator when comment follows", () => {
    const input = `__co__ void f() {
int x = a / b; // division {
println(x);
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  int x = a / b; // division {
  println(x);
}`);
  });

  it("counts braces between division and line comment", () => {
    const input = `if (a / b) { // comment
x();
}`;
    expect(formatChoreoCode(input)).toBe(`if (a / b) { // comment
  x();
}`);
  });

  it("handles single char strings containing backslash", () => {
    const input = `__co__ void f() {
char c = '\\\\';
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  char c = '\\\\';
}`);
  });
});
