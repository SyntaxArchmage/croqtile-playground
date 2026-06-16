import type { Challenge } from "./index";

export const challenge53: Challenge = {
  id: "c53",
  title: "Batch Normalize",
  difficulty: "hard",
  description: `Center an array by subtracting its mean from each element.

Given \`data = [2, 4, 6, 8]\`, the mean is 5.0. Each element becomes \`data[i] - mean\`.

Expected output:
\`\`\`
norm[0] = -3.000000
norm[1] = -1.000000
norm[2] = 1.000000
norm[3] = 3.000000
\`\`\`

This requires two passes: first compute the mean with \`foreach\`, then subtract in \`parallel\`.`,
  starterCode: `__co__ void batch_normalize() {
  int N = 4;
  global float data[4];
  global float norm[4];

  parallel {i} by [4] {
    data[i] = (float)((i + 1) * 2);
  }

  // Step 1: Compute mean (sequential)
  float total = 0.0f;
  foreach i in [0:4] {
    // TODO: accumulate total
  }
  float mean = total / (float)N;

  // Step 2: Subtract mean (parallel)
  parallel {i} by [4] {
    // TODO: norm[i] = data[i] - mean
  }

  foreach i in [0:4] {
    println("norm[" + i + "] =", norm[i]);
  }
}
`,
  tests: [
    { expectedOutput: "norm[0] = -3", description: "norm[0] = 2 - 5 = -3" },
    { expectedOutput: "norm[1] = -1", description: "norm[1] = 4 - 5 = -1" },
    { expectedOutput: "norm[2] = 1", description: "norm[2] = 6 - 5 = 1" },
    { expectedOutput: "norm[3] = 3", description: "norm[3] = 8 - 5 = 3" },
  ],
  hint: "First pass: foreach i in [0:4] { total = total + data[i]; }. Compute mean = total / 4. Second pass: parallel {i} by [4] { norm[i] = data[i] - mean; }.",
};
