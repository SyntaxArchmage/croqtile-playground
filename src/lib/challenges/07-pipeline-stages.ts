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

  // Stage 1: DMA input -> buf

  // Stage 2: Double buf values into output

  // Print output
}
`,
  tests: [
    {
      expectedOutput: "out[0] = 10\nout[1] = 20\nout[2] = 30\nout[3] = 40",
      description: "Should double each value through the pipeline",
    },
  ],
  hint: "DMA input[0:4] to buf[0:4], then parallel {i} by [4] { output[i] = buf[i] * 2.0f; }",
};
