import type { Challenge } from "./index";

export const challenge23: Challenge = {
  id: "c23",
  title: "Pipeline Sum",
  difficulty: "hard",
  description: `Compute the sum of an array using a two-stage pipeline.

Stage 1: Load data from global memory into shared memory using DMA
Stage 2: Accumulate the sum from shared memory

Given input = [1, 2, 3, 4, 5, 6, 7, 8], expected output:
\`\`\`
sum = 36
\`\`\`

Use a \`pipeline\` block with separate \`stage\` sections for load and reduce.`,
  starterCode: `__co__ void pipeline_sum() {
  global float data[8];
  shared float buf[8];

  // Initialize data = [1, 2, 3, 4, 5, 6, 7, 8]
  parallel {i} by [8] {
    data[i] = (float)(i + 1);
  }

  float total = 0.0f;

  pipeline {
    stage {
      // Stage 1: DMA data -> buf
    }
    stage {
      // Stage 2: accumulate sum from buf into total
    }
  }

  println("sum =", total);
}
`,
  tests: [
    {
      expectedOutput: "sum = 36",
      description: "Should sum all 8 elements through the pipeline",
    },
  ],
  hint: "Stage 1 is dma(data[0:8], buf[0:8]). Stage 2 uses foreach i in [0:8] { total = total + buf[i]; }.",
};
