import type { Tutorial } from "./index";

export const ch09: Tutorial = {
  id: "ch09",
  title: "Common GPU Patterns",
  description: "Master essential GPU computing patterns: map, reduce, scatter, gather.",
  steps: [
    {
      title: "Map pattern",
      content: `The simplest GPU pattern: apply a function to every element independently.

Map is embarrassingly parallel — each thread works on its own element with no dependencies.

\`\`\`croqtile
__co__ void map_example() {
  global float input[8];
  global float output[8];
  parallel {i} by [8] { input[i] = (float)i; }
  parallel {i} by [8] {
    output[i] = input[i] * input[i] + 1.0f;
  }
  parallel {i} by [8] { println("out[", i, "] =", output[i]); }
}
\`\`\``,
      code: `__co__ void map_abs() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i - 4);
  }

  parallel {i} by [8] {
    if (data[i] < 0.0f) {
      data[i] = -data[i];
    }
  }

  parallel {i} by [8] {
    println("abs[", i, "] =", data[i]);
  }
}
`,
    },
    {
      title: "Reduce pattern",
      content: `Reduce combines all elements into a single value. On GPUs, this typically uses a tree-based approach for parallelism.

In the mock interpreter, a sequential \`foreach\` reduction is the simplest correct approach:`,
      code: `__co__ void reduce_sum() {
  global float data[8];

  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;
  foreach i in [0:8] {
    total = total + data[i];
  }

  println("sum =", total);
  println("mean =", total / 8.0f);
}
`,
    },
    {
      title: "Stencil pattern",
      content: `A stencil reads neighboring elements to compute each output. This is common in image processing and simulations.

Each element depends on its neighbors, requiring careful boundary handling:`,
      code: `__co__ void stencil_1d() {
  global float input[8];
  global float output[8];

  parallel {i} by [8] {
    input[i] = (float)(i * 10);
  }

  // 3-point average stencil (skip boundaries)
  parallel {i} by [8] {
    if (i == 0 || i == 7) {
      output[i] = input[i];
    } else {
      output[i] = (input[i-1] + input[i] + input[i+1]) / 3.0f;
    }
  }

  parallel {i} by [8] {
    println("smoothed[", i, "] =", output[i]);
  }
}
`,
    },
  ],
};
