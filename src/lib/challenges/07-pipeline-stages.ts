import type { Challenge } from "./index";

export const challenge07: Challenge = {
  id: "c07",
  title: "Two-Stage Pipeline",
  difficulty: "hard",
  description: `Implement a two-stage pipeline where:

Stage 1: Read 4 values from global memory into shared memory using DMA
Stage 2: Double each value in shared memory and write back to global output

Given input = [5, 10, 15, 20], expected output:
\`\`\`
out[0] = 10
out[1] = 20
out[2] = 30
out[3] = 40
\`\`\`

This simulates a basic load → compute → store pipeline.`,
  starterCode: `__co__ void pipeline_double() {
  global float input[4];
  global float output[4];
  shared float buf[4];

  // Initialize input = [5, 10, 15, 20]
  parallel {i} by [4] {
    input[i] = (float)((i + 1) * 5);
  }

  // Stage 1: DMA input -> buf

  // Stage 2: Double buf values into output

  parallel {i} by [4] {
    println("out[", i, "] =", output[i]);
  }
}
`,
  tests: [
    {
      expectedOutput: "out[0] = 10\nout[1] = 20\nout[2] = 30\nout[3] = 40",
      description: "Should double each value through the pipeline",
    },
  ],
  hint: "Stage 1 is a DMA copy from input to buf. Stage 2 multiplies each buf element by 2 and stores it in output.",
};
