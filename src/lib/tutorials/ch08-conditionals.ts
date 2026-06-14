import type { Tutorial } from "./index";

export const ch08: Tutorial = {
  id: "ch08",
  title: "Conditionals & Control Flow",
  description: "Use if/else and conditional logic inside parallel blocks.",
  steps: [
    {
      title: "If/else in parallel",
      content: `Each parallel thread can execute different code paths based on conditions. This is analogous to GPU thread divergence.

In real GPU execution, divergent branches reduce performance. In Croqtile's mock interpreter, they work correctly but are a good pattern to understand.`,
      code: `__co__ void branch_demo() {
  parallel {i} by [8] {
    if (i % 2 == 0) {
      println(i, "is even");
    } else {
      println(i, "is odd");
    }
  }
}
`,
    },
    {
      title: "Conditional data processing",
      content: `A common pattern: filter or transform data based on conditions within parallel blocks.

\`\`\`croqtile
__co__ void threshold() {
  global float data[6];
  parallel {i} by [6] { data[i] = (float)(i * 5); }
  parallel {i} by [6] {
    if (data[i] > 15.0f) {
      println(i, ": above threshold");
    }
  }
}
\`\`\``,
      code: `__co__ void classify() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)((i * 7 + 3) % 20);
  }

  parallel {i} by [8] {
    if (data[i] < 5.0f) {
      println("data[", i, "] =", data[i], "-> LOW");
    } else if (data[i] < 15.0f) {
      println("data[", i, "] =", data[i], "-> MID");
    } else {
      println("data[", i, "] =", data[i], "-> HIGH");
    }
  }
}
`,
    },
    {
      title: "Guard patterns",
      content: `Use early returns or guards to handle boundary conditions cleanly:`,
      code: `__co__ void guard_pattern() {
  global float data[10];

  parallel {i} by [10] {
    data[i] = (float)i;
  }

  // Only process elements 2..7
  parallel {i} by [10] {
    if (i < 2) { println(i, ": skip (too low)"); }
    else if (i > 7) { println(i, ": skip (too high)"); }
    else {
      float val = data[i] * 2.0f;
      println("processed[", i, "] =", val);
    }
  }
}
`,
    },
  ],
};
