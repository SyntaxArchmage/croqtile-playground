import type { Tutorial } from "./index";

export const ch11: Tutorial = {
  id: "ch11",
  title: "Data Types & Casting",
  description: "Understand Croqtile's numeric types, casting between them, and precision considerations.",
  steps: [
    {
      title: "Numeric types",
      content: `Croqtile supports several numeric types commonly found in GPU programming:

- \`int\` — 32-bit signed integer
- \`float\` — 32-bit floating point (most common for GPU work)
- \`f32\` / \`f64\` — explicit-width floats

Integer literals like \`42\` are \`int\` by default. Float literals need a decimal point or suffix: \`3.14f\` or \`(float)3\`.

\`\`\`croqtile
__co__ void types_demo() {
  int a = 42;
  float b = 3.14f;
  println("int a =", a);
  println("float b =", b);
}
\`\`\`

Try running the example to see how different types print:`,
      code: `__co__ void types_demo() {
  global int integers[4];
  global float floats[4];

  parallel {i} by [4] {
    integers[i] = i * 10 + 5;
    floats[i] = (float)(i * 10 + 5);
  }

  parallel {i} by [4] {
    println("int[", i, "] =", integers[i]);
  }
  parallel {i} by [4] {
    println("float[", i, "] =", floats[i]);
  }
}
`
    },
    {
      title: "Type casting",
      content: `Converting between types requires explicit casting with the \`(type)\` syntax:

\`\`\`croqtile
float x = (float)42;    // int → float
int y = (int)3.14f;     // float → int (truncates)
\`\`\`

Casting is essential when mixing types in expressions. Without it, integer division truncates:
- \`7 / 2\` = \`3\` (integer division)
- \`(float)7 / 2.0f\` = \`3.5\` (float division)

GPU programming often involves converting between integer indices and float values for computation:`,
      code: `__co__ void casting_demo() {
  global float data[8];

  parallel {i} by [8] {
    float fi = (float)i;
    data[i] = fi * fi / 2.0f;
  }

  parallel {i} by [8] {
    println("data[", i, "] = i^2/2 =", data[i]);
  }
}
`
    },
    {
      title: "Precision in reductions",
      content: `When accumulating many small values, floating-point precision matters. Each addition can introduce a tiny rounding error.

For most playground exercises this doesn't matter, but in real GPU code:
1. Use \`float\` for most work (fast on GPUs)
2. Accumulate in \`f64\` (double) when precision matters
3. Consider the order of operations — adding smallest values first reduces error

This example shows a simple case where we compute a sum two ways and compare:`,
      code: `__co__ void precision_demo() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float sum_forward = 0.0f;
  foreach i in [0:8] {
    sum_forward = sum_forward + data[i];
  }

  float sum_reverse = 0.0f;
  foreach i in [0:8] {
    sum_reverse = sum_reverse + data[7 - i];
  }

  println("sum (forward) =", sum_forward);
  println("sum (reverse) =", sum_reverse);
  println("expected = 36");
}
`
    }
  ]
};
