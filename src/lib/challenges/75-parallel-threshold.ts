import type { Challenge } from "./index";

export const challenge75: Challenge = {
  id: "c75",
  title: "Parallel Threshold",
  difficulty: "easy",
  description: `Binarize an array: set elements **above** a threshold to 1, all others to 0.

Given threshold = 50 and data = [30, 55, 70, 20, 60, 45, 80, 10]:

Expected output:
\`\`\`
result[0] = 0
result[1] = 1
result[2] = 1
result[3] = 0
result[4] = 1
result[5] = 0
result[6] = 1
result[7] = 0
\`\`\`

Use \`parallel {i} by [8]\` with an if/else comparing \`data[i]\` to the threshold.`,
  starterCode: `__co__ void parallel_threshold() {
  global int data[8];
  global int result[8];
  int threshold = 50;

  parallel {i} by [1] {
    data[0] = 30; data[1] = 55; data[2] = 70; data[3] = 20;
    data[4] = 60; data[5] = 45; data[6] = 80; data[7] = 10;
  }

  // TODO: result[i] = 1 if data[i] > threshold, else 0

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 0", description: "30 is not above 50" },
    { expectedOutput: "result[1] = 1", description: "55 is above 50" },
    { expectedOutput: "result[5] = 0", description: "45 is not above 50" },
    { expectedOutput: "result[6] = 1", description: "80 is above 50" },
    {
      expectedOutput: "result[0] = 0\nresult[1] = 1\nresult[2] = 1\nresult[3] = 0\nresult[4] = 1\nresult[5] = 0\nresult[6] = 1\nresult[7] = 0",
      description: "All elements binarized correctly",
    },
  ],
  hint: "Inside parallel {i} by [8]: if (data[i] > threshold) result[i] = 1; else result[i] = 0.",
};
