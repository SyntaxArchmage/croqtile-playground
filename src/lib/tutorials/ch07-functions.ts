import type { Tutorial } from "./index";

export const ch07: Tutorial = {
  id: "ch07",
  title: "Functions & Modularity",
  description: "Write reusable functions in Croqtile and call them from parallel blocks.",
  steps: [
    {
      title: "Defining helper functions",
      content: `You can define regular C-style functions alongside your \`__co__\` entry point. These can be called from inside parallel blocks.

Functions declared at the top level are available to all Choreo kernels in the same file.`,
      code: `float square(float x) {
  return x * x;
}

__co__ void use_helper() {
  parallel {i} by [8] {
    float val = square((float)i);
    println("square(", i, ") =", val);
  }
}
`,
    },
    {
      title: "Functions with multiple parameters",
      content: `Functions can take multiple parameters just like in C:

\`\`\`croqtile
float add3(float a, float b, float c) {
  return a + b + c;
}

__co__ void multi_param() {
  println("add3(1,2,3) =", add3(1.0f, 2.0f, 3.0f));
}
\`\`\``,
      code: `float clamp(float val, float lo, float hi) {
  if (val < lo) return lo;
  if (val > hi) return hi;
  return val;
}

__co__ void clamp_demo() {
  parallel {i} by [6] {
    float raw = (float)(i * 3 - 5);
    float clamped = clamp(raw, 0.0f, 10.0f);
    println("clamp(", raw, ") =", clamped);
  }
}
`,
    },
    {
      title: "Composing functions",
      content: `Functions can call other functions, enabling clean composition:`,
      code: `float square(float x) { return x * x; }
float dist(float x, float y) {
  return square(x) + square(y);
}

__co__ void composition() {
  parallel {i, j} by [3, 3] {
    float d = dist((float)i, (float)j);
    println("dist(", i, ",", j, ") =", d);
  }
}
`,
    },
  ],
};
