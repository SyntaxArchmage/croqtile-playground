import type { Challenge } from "./index";

export const challenge153: Challenge = {
  id: "c153",
  title: "Parallel Sigmoid",
  difficulty: "medium",
  description: `Compute an **approximate sigmoid** for each element using \`parallel\`.

Given \`data = [-2.0, -1.0, 0.0, 1.0, 2.0]\`, use the linear approximation (valid for small |x|):

\`\`\`
sigmoid(x) ≈ 0.5 + 0.25 * x
\`\`\`

| x   | approx |
|-----|--------|
| -2  | 0.0    |
| -1  | 0.25   |
| 0   | 0.5    |
| 1   | 0.75   |
| 2   | 1.0    |

Expected output:
\`\`\`
sig[0] = 0
sig[1] = 0.25
sig[2] = 0.5
sig[3] = 0.75
sig[4] = 1
\`\`\`

Use \`parallel {i} by [5]\` — each thread applies the formula independently.`,
  starterCode: `__co__ void parallel_sigmoid() {
  global float data[5];
  global float sig[5];

  parallel {i} by [1] {
    data[0] = -2.0f; data[1] = -1.0f; data[2] = 0.0f;
    data[3] = 1.0f; data[4] = 2.0f;
  }

  // TODO: sig[i] = 0.5f + 0.25f * data[i] in parallel {i} by [5]

  parallel {i} by [5] {
    println("sig[", i, "] =", sig[i]);
  }
}
`,
  tests: [
    { expectedOutput: "sig[0] = 0", description: "sigmoid(-2) ≈ 0.0" },
    { expectedOutput: "sig[1] = 0.25", description: "sigmoid(-1) ≈ 0.25" },
    { expectedOutput: "sig[2] = 0.5", description: "sigmoid(0) = 0.5" },
    { expectedOutput: "sig[3] = 0.75", description: "sigmoid(1) ≈ 0.75" },
    { expectedOutput: "sig[4] = 1", description: "sigmoid(2) ≈ 1.0" },
    {
      expectedOutput: "sig[0] = 0\nsig[1] = 0.25\nsig[2] = 0.5\nsig[3] = 0.75\nsig[4] = 1",
      description: "Full approximate sigmoid output",
    },
  ],
  hint: "parallel {i} by [5] { sig[i] = 0.5f + 0.25f * data[i]; } — one thread per element.",
};
