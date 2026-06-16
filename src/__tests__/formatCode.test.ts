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

  it("ignores braces inside block comments", () => {
    const input = `__co__ void f() {
/* { block comment } */
println("ok");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  /* { block comment } */
  println("ok");
}`);
  });

  it("ignores braces inside multi-line block comments", () => {
    const input = `__co__ void f() {
/*
{ inside multi-line
} comment
*/
println("ok");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  /*
  { inside multi-line
  } comment
  */
  println("ok");
}`);
  });

  it("ignores braces inside char literals", () => {
    const input = `__co__ void f() {
char c = '{';
println("ok");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  char c = '{';
  println("ok");
}`);
  });

  it("formats deeply nested parallel and foreach blocks", () => {
    const input = `__co__ void deep() {
parallel {i} by [4] {
if (i > 0) {
foreach k in [0:8] {
println(k);
}
}
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void deep() {
  parallel {i} by [4] {
    if (i > 0) {
      foreach k in [0:8] {
        println(k);
      }
    }
  }
}`);
  });

  it("formats 2D parallel {i,j} by [M,N] syntax", () => {
    const input = `__co__ void grid() {
parallel {i, j} by [4, 4] {
println(i, j);
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void grid() {
  parallel {i, j} by [4, 4] {
    println(i, j);
  }
}`);
  });

  it("formats multiple consecutive blocks", () => {
    const input = `__co__ void f() {
parallel {i} by [8] {
a[i] = 0;
}
parallel {i} by [8] {
b[i] = a[i];
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  parallel {i} by [8] {
    a[i] = 0;
  }
  parallel {i} by [8] {
    b[i] = a[i];
  }
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

  it("handles else on its own line after closing brace", () => {
    const input = `__co__ void f() {
if (x > 0) {
a();
} else {
b();
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  if (x > 0) {
    a();
  } else {
    b();
  }
}`);
  });

  it("handles block comment spanning multiple lines mid-code", () => {
    const input = `__co__ void f() {
/* start
middle
end */
println("after");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  /* start
  middle
  end */
  println("after");
}`);
  });

  it("handles opening brace on its own line", () => {
    const input = `__co__ void f()
{
println("hi");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f()
{
  println("hi");
}`);
  });

  it("handles braces inside strings", () => {
    const input = `__co__ void f() {
println("{ not a block }");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  println("{ not a block }");
}`);
  });

  it("handles completely flat code", () => {
    const input = `int x = 0;
println(x);`;
    expect(formatChoreoCode(input)).toBe(`int x = 0;
println(x);`);
  });

  it("handles else if chains inside parallel blocks", () => {
    const input = `__co__ void f() {
parallel {i} by [6] {
if (labels[i] == 'A') {
println("A");
} else if (labels[i] == 'B') {
println("B");
} else {
println("C");
}
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  parallel {i} by [6] {
    if (labels[i] == 'A') {
      println("A");
    } else if (labels[i] == 'B') {
      println("B");
    } else {
      println("C");
    }
  }
}`);
  });

  it("formats pipeline stage exec nesting", () => {
    const input = `__co__ void f() {
pipeline {
stage {
exec {
println(1);
}
}
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  pipeline {
    stage {
      exec {
        println(1);
      }
    }
  }
}`);
  });

  it("handles code after block comment on the same line", () => {
    const input = `__co__ void f() {
/* end */ if (x) {
y();
}
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  /* end */ if (x) {
    y();
  }
}`);
  });

  it("ignores fake block comments inside strings", () => {
    const input = `__co__ void f() {
println("/* not a comment */ {");
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  println("/* not a comment */ {");
}`);
  });

  it("ignores block-comment-like text in line comments", () => {
    const input = `__co__ void f() {
// /* not a block comment { }
x();
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  // /* not a block comment { }
  x();
}`);
  });

  it("splits multiple closing braces on the same line", () => {
    const input = `a {
b {
} }`;
    expect(formatChoreoCode(input)).toBe(`a {
  b {
  }
}`);
  });

  it("splits three closing braces on the same line", () => {
    const input = `a {
b {
c {
} } }`;
    expect(formatChoreoCode(input)).toBe(`a {
  b {
    c {
    }
  }
}`);
  });

  it("does not split } else { onto separate lines", () => {
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

  it("formats inline foreach with braces on one line", () => {
    const input = `__co__ void f() {
foreach i in [0:8] { total = total + data[i]; }
}`;
    expect(formatChoreoCode(input)).toBe(`__co__ void f() {
  foreach i in [0:8] { total = total + data[i]; }
}`);
  });
});
