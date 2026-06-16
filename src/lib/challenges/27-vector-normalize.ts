import type { Challenge } from "./index";

export const challenge27: Challenge = {
  id: "c27",
  title: "Vector Normalize",
  difficulty: "hard",
  description: `Normalize a vector by dividing each element by the sum of all elements.

Given \`v = [2, 4, 6, 8]\`, the sum is 20. Each element becomes \`v[i] / sum\`.

Expected output:
\`\`\`
norm[0] = 0.100000
norm[1] = 0.200000
norm[2] = 0.300000
norm[3] = 0.400000
\`\`\`

This requires two passes: first compute the sum (sequential), then normalize (parallel).`,
  starterCode: `__co__ void normalize() {
  int N = 4;
  global float v[4];
  global float norm[4];

  // Initialize: v = [2, 4, 6, 8]
  parallel {i} by [4] {
    v[i] = (float)((i + 1) * 2);
  }

  // Step 1: Compute sum (sequential)
  float total = 0.0f;
  foreach i in [0:4] {
    // TODO: accumulate total
  }

  // Step 2: Normalize (parallel)
  parallel {i} by [4] {
    // TODO: norm[i] = v[i] / total
  }

  foreach i in [0:4] {
    println("norm[" + i + "] =", norm[i]);
  }
}
`,
  tests: [
    { expectedOutput: "norm[0] = 0.1", description: "norm[0] = 2/20 = 0.1" },
    { expectedOutput: "norm[3] = 0.4", description: "norm[3] = 8/20 = 0.4" },
  ],
  hint: "First pass: foreach i in [0:4] { total = total + v[i]; }. Second pass: parallel {i} by [4] { norm[i] = v[i] / total; }.",
};
