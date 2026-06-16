import type { Challenge } from "./index";

export const challenge174: Challenge = {
  id: "c174",
  title: "Parallel Threshold",
  difficulty: "easy",
  description: `Zero out elements **below** a threshold, keeping others unchanged, using \`parallel\`.

Given threshold = 50 and data = [30, 55, 70, 20, 60, 45, 80, 10]:

Expected output:
\`\`\`
result[0] = 0
result[1] = 55
result[2] = 70
result[3] = 0
result[4] = 60
result[5] = 0
result[6] = 80
result[7] = 0
\`\`\`

Use \`parallel {i} by [8]\`: if \`data[i] < threshold\` then \`result[i] = 0\`, else \`result[i] = data[i]\`.`,
  starterCode: `__co__ void parallel_threshold_zero() {
  global int data[8];
  global int result[8];
  int threshold = 50;

  parallel {i} by [1] {
    data[0] = 30; data[1] = 55; data[2] = 70; data[3] = 20;
    data[4] = 60; data[5] = 45; data[6] = 80; data[7] = 10;
  }

  // TODO: result[i] = 0 if data[i] < threshold, else data[i]

  parallel {i} by [8] {
    println("result[", i, "] =", result[i]);
  }
}
`,
  tests: [
    { expectedOutput: "result[0] = 0", description: "30 is below 50 → zeroed" },
    { expectedOutput: "result[1] = 55", description: "55 is at or above 50 → kept" },
    { expectedOutput: "result[5] = 0", description: "45 is below 50 → zeroed" },
    { expectedOutput: "result[6] = 80", description: "80 is above 50 → kept" },
    {
      expectedOutput: "result[0] = 0\nresult[1] = 55\nresult[2] = 70\nresult[3] = 0\nresult[4] = 60\nresult[5] = 0\nresult[6] = 80\nresult[7] = 0",
      description: "All elements thresholded correctly",
    },
  ],
  hint: "Inside parallel {i} by [8]: if (data[i] < threshold) result[i] = 0; else result[i] = data[i].",
};
